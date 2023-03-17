import Database, { IDatabaseOptions, Transactionable } from '@nocobase/database';
import Application, { AppManager, Plugin } from '@nocobase/server';
import lodash from 'lodash';
import * as path from 'path';
import { resolve } from 'path';
import { ApplicationModel } from './models/application';

export type AppDbCreator = (app: Application, transaction: Transactionable) => Promise<void>;
export type AppOptionsFactory = (appName: string, mainApp: Application) => any;

const defaultDbCreator = async (app: Application) => {
  const databaseOptions = app.options.database as any;
  const { host, port, username, password, dialect, database } = databaseOptions;

  if (dialect === 'mysql') {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host, port, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.close();
  }

  if (dialect === 'postgres') {
    const { Client } = require('pg');

    const client = new Client({
      host,
      port,
      user: username,
      password,
      database: 'postgres',
    });

    await client.connect();

    try {
      await client.query(`CREATE DATABASE "${database}"`);
    } catch (e) {}

    await client.end();
  }
};

const defaultAppOptionsFactory = (appName: string, mainApp: Application) => {
  const rawDatabaseOptions = PluginMultiAppManager.getDatabaseConfig(mainApp);

  if (rawDatabaseOptions.dialect === 'sqlite') {
    const mainAppStorage = rawDatabaseOptions.storage;
    if (mainAppStorage !== ':memory:') {
      const mainStorageDir = path.dirname(mainAppStorage);
      rawDatabaseOptions.storage = path.join(mainStorageDir, `${appName}.sqlite`);
    }
  } else {
    rawDatabaseOptions.database = appName;
  }

  return {
    database: {
      ...rawDatabaseOptions,
      tablePrefix: '',
    },
    plugins: ['nocobase'],
    resourcer: {
      prefix: '/api',
    },
  };
};

export class PluginMultiAppManager extends Plugin {
  appDbCreator: AppDbCreator = defaultDbCreator;
  appOptionsFactory: AppOptionsFactory = defaultAppOptionsFactory;

  // create random id
  id;

  setAppOptionsFactory(factory: AppOptionsFactory) {
    this.appOptionsFactory = factory;
  }

  setAppDbCreator(appDbCreator: AppDbCreator) {
    this.appDbCreator = appDbCreator;
  }

  static getDatabaseConfig(app: Application): IDatabaseOptions {
    const oldConfig =
      app.options.database instanceof Database
        ? (app.options.database as Database).options
        : (app.options.database as IDatabaseOptions);

    return lodash.cloneDeep(lodash.omit(oldConfig, ['migrator']));
  }

  afterAdd() {
    this.id = Math.random().toString(36).substr(2, 9);
    console.log(`afterAdd ${this.name} plugin init ${this.app.name}, id is ${this.id}`);
  }

  beforeLoad() {
    this.db.registerModels({
      ApplicationModel,
    });
  }

  async load() {
    this.app.appManager.setAppSelector(async (req) => {
      if (req.headers['x-app']) {
        return req.headers['x-app'];
      }
      if (req.headers['x-hostname']) {
        const appInstance = await this.db.getRepository('applications').findOne({
          filter: {
            cname: req.headers['x-hostname'],
          },
        });
        if (appInstance) {
          return appInstance.name;
        }
      }
      return null;
    });

    await this.db.import({
      directory: resolve(__dirname, 'collections'),
    });

    // after application created
    this.db.on('applications.afterCreateWithAssociations', async (model: ApplicationModel, options) => {
      const { transaction } = options;

      const subApp = model.registerToMainApp(this.app, {
        appOptionsFactory: this.appOptionsFactory,
      });

      // create database
      await this.appDbCreator(subApp, transaction);

      // reload subApp plugin
      await subApp.reload();

      // sync subApp collections
      await subApp.db.sync();

      // install subApp
      await subApp.install();

      await subApp.reload();
    });

    this.db.on('applications.afterDestroy', async (model: ApplicationModel) => {
      await this.app.appManager.removeApplication(model.get('name') as string);
    });

    // lazy load application
    // if application not in appManager, load it from database
    this.app.on('beforeGetApplication', async ({ appManager, name }: { appManager: AppManager; name: string }) => {
      if (appManager.applications.has(name)) {
        return;
      }

      const applicationRecord = (await this.app.db.getRepository('applications').findOne({
        filter: {
          name,
        },
      })) as ApplicationModel | null;

      if (!applicationRecord) {
        return;
      }

      console.log(
        `beforeGetApplication ${name}, this id is ${this.id}, application id is ${
          this.app.getPlugin<any>('multi-app-manager').id
        }`,
      );

      const subApp = await applicationRecord.registerToMainApp(this.app, {
        appOptionsFactory: this.appOptionsFactory,
      });

      // must skip load on upgrade
      await subApp.load();
    });

    this.app.resourcer.registerActionHandlers({
      'applications:listPinned': async (ctx, next) => {
        const items = await this.db.getRepository('applications').find({
          filter: {
            pinned: true,
          },
        });
        ctx.body = items;
      },
    });

    this.app.acl.allow('applications', 'listPinned', 'loggedIn');

    this.app.acl.registerSnippet({
      name: `
        pm.$;
        {
          this.name;
        }
      .
        applications`,
      actions: ['applications:*'],
    });
  }
}
