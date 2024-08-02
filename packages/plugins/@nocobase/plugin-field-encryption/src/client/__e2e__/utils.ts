/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { CollectionSetting, PageConfig } from '@nocobase/test/e2e';

// 一个有 encryption 字段的表，关联到另一个表
export const collections: CollectionSetting[] = [
  {
    name: 'test1',
    title: 'Test1',
    fields: [
      {
        key: 'b9isvuaqvp4',
        name: 'id',
        type: 'bigInt',
        interface: 'integer',
        description: null,
        parentKey: null,
        reverseKey: null,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        uiSchema: {
          type: 'number',
          title: '{{t("ID")}}',
          'x-component': 'InputNumber',
          'x-read-pretty': true,
        },
      },
      {
        key: '11d585h6le3',
        name: 'test1_field1',
        type: 'encryption',
        interface: 'encryption',
        description: null,
        parentKey: null,
        reverseKey: null,
        hidden: false,
        iv: 'vgsb4nogiyd6uzey',
        uiSchema: {
          type: 'string',
          'x-component': 'Input',
          title: 'Encryption',
        },
      },
      {
        key: '3kizg5gceci',
        name: 'test1_field2',
        type: 'encryption',
        interface: 'encryption',
        description: null,
        parentKey: null,
        reverseKey: null,
        hidden: true,
        iv: 'vgsb4nogiyd6uzey',
        uiSchema: {
          type: 'string',
          'x-component': 'Input',
          title: 'Encryption-Hidden',
        },
      },
      {
        key: 'wyy34jpot3g',
        name: 'o2o',
        type: 'hasOne',
        interface: 'oho',
        description: null,
        parentKey: null,
        reverseKey: null,
        foreignKey: 'test2_id',
        onDelete: 'SET NULL',
        sourceKey: 'id',
        uiSchema: {
          'x-component': 'AssociationField',
          'x-component-props': {
            multiple: false,
          },
          title: 'One to One',
        },
        target: 'test2',
      },
    ],
  },
  {
    name: 'test2',
    title: 'Test2',
    fields: [
      {
        key: 'cnwzxumd2lr',
        name: 'id',
        type: 'bigInt',
        interface: 'integer',
        description: null,
        parentKey: null,
        reverseKey: null,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        uiSchema: {
          type: 'number',
          title: '{{t("ID")}}',
          'x-component': 'InputNumber',
          'x-read-pretty': true,
        },
        isForeignKey: true,
      },
      {
        key: 'h38i6gh8e5r',
        name: 'test2_field1',
        type: 'encryption',
        interface: 'encryption',
        description: null,
        parentKey: null,
        reverseKey: null,
        hidden: false,
        iv: 'vgsb4nogiyd6uzey',
        uiSchema: {
          type: 'string',
          'x-component': 'Input',
          title: 'test2-Encryption',
        },
      },
      {
        key: 'wu0qxfqi5v3',
        name: 'test2_id',
        type: 'bigInt',
        interface: 'integer',
        description: null,
        parentKey: null,
        reverseKey: null,
        isForeignKey: true,
        uiSchema: {
          type: 'number',
          title: 'test2_id',
          'x-component': 'InputNumber',
          'x-read-pretty': true,
        },
      },
    ],
  },
];

/**
 * 1. 一个 Table 区块
 * 2. 点击 Add new 有一个 Form 区块
 * 3. 点击 View 有一个 Details 区块
 * 4. 点击 Edit 有一个 Form 区块
 * 5. 所有字段都是 basic 字段
 */
export const pageConfig: PageConfig = {
  collections,
  pageSchema: {
    _isJSONSchemaObject: true,
    version: '2.0',
    type: 'void',
    'x-component': 'Page',
    'x-app-version': '1.3.0-alpha',
    properties: {
      wszgecytthu: {
        _isJSONSchemaObject: true,
        version: '2.0',
        type: 'void',
        'x-component': 'Grid',
        'x-initializer': 'page:addBlock',
        'x-app-version': '1.3.0-alpha',
        properties: {
          qttozmb0xyf: {
            _isJSONSchemaObject: true,
            version: '2.0',
            type: 'void',
            'x-component': 'Grid.Row',
            'x-app-version': '1.3.0-alpha',
            properties: {
              mkmezj4gzfv: {
                _isJSONSchemaObject: true,
                version: '2.0',
                type: 'void',
                'x-component': 'Grid.Col',
                'x-app-version': '1.3.0-alpha',
                properties: {
                  zlytcfg76ij: {
                    _isJSONSchemaObject: true,
                    version: '2.0',
                    type: 'void',
                    'x-acl-action-props': {
                      skipScopeCheck: true,
                    },
                    'x-acl-action': 'test1:create',
                    'x-decorator': 'FormBlockProvider',
                    'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
                    'x-decorator-props': {
                      dataSource: 'main',
                      collection: 'test1',
                    },
                    'x-toolbar': 'BlockSchemaToolbar',
                    'x-settings': 'blockSettings:createForm',
                    'x-component': 'CardItem',
                    'x-app-version': '1.3.0-alpha',
                    properties: {
                      '0j1lemocgdl': {
                        _isJSONSchemaObject: true,
                        version: '2.0',
                        type: 'void',
                        'x-component': 'FormV2',
                        'x-use-component-props': 'useCreateFormBlockProps',
                        'x-app-version': '1.3.0-alpha',
                        properties: {
                          grid: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer': 'form:configureFields',
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              g54mjcp07nf: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-component': 'Grid.Row',
                                'x-app-version': '1.3.0-alpha',
                                properties: {
                                  cpk0urryf1h: {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    type: 'void',
                                    'x-component': 'Grid.Col',
                                    'x-app-version': '1.3.0-alpha',
                                    properties: {
                                      test1_field1: {
                                        _isJSONSchemaObject: true,
                                        version: '2.0',
                                        type: 'string',
                                        'x-toolbar': 'FormItemSchemaToolbar',
                                        'x-settings': 'fieldSettings:FormItem',
                                        'x-component': 'CollectionField',
                                        'x-decorator': 'FormItem',
                                        'x-collection-field': 'test1.test1_field1',
                                        'x-component-props': {},
                                        'x-app-version': '1.3.0-alpha',
                                        'x-uid': 'frdihyvkok3',
                                        'x-async': false,
                                        'x-index': 1,
                                      },
                                    },
                                    'x-uid': 'bz914bipw73',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': 'd91tmirgdts',
                                'x-async': false,
                                'x-index': 1,
                              },
                              b2mdevwpc5h: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-component': 'Grid.Row',
                                'x-app-version': '1.3.0-alpha',
                                properties: {
                                  k6y7dvelhyq: {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    type: 'void',
                                    'x-component': 'Grid.Col',
                                    'x-app-version': '1.3.0-alpha',
                                    properties: {
                                      test1_field2: {
                                        _isJSONSchemaObject: true,
                                        version: '2.0',
                                        type: 'string',
                                        'x-toolbar': 'FormItemSchemaToolbar',
                                        'x-settings': 'fieldSettings:FormItem',
                                        'x-component': 'CollectionField',
                                        'x-decorator': 'FormItem',
                                        'x-collection-field': 'test1.test1_field2',
                                        'x-component-props': {},
                                        'x-app-version': '1.3.0-alpha',
                                        'x-uid': 'lfuhcvap7rk',
                                        'x-async': false,
                                        'x-index': 1,
                                      },
                                    },
                                    'x-uid': 'r9zfpracuk0',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': '3oor4pbfg05',
                                'x-async': false,
                                'x-index': 2,
                              },
                              sc5p2n2umyg: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-component': 'Grid.Row',
                                'x-app-version': '1.3.0-alpha',
                                properties: {
                                  k9l7ojnhykm: {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    type: 'void',
                                    'x-component': 'Grid.Col',
                                    'x-app-version': '1.3.0-alpha',
                                    properties: {
                                      o2o: {
                                        _isJSONSchemaObject: true,
                                        version: '2.0',
                                        type: 'string',
                                        'x-toolbar': 'FormItemSchemaToolbar',
                                        'x-settings': 'fieldSettings:FormItem',
                                        'x-component': 'CollectionField',
                                        'x-decorator': 'FormItem',
                                        'x-collection-field': 'test1.o2o',
                                        'x-component-props': {
                                          fieldNames: {
                                            value: 'id',
                                            label: 'id',
                                          },
                                        },
                                        'x-app-version': '1.3.0-alpha',
                                        'x-uid': 'qt6w5enc77g',
                                        'x-async': false,
                                        'x-index': 1,
                                      },
                                    },
                                    'x-uid': 'gln5mkj7koa',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': 'raptweiglbc',
                                'x-async': false,
                                'x-index': 3,
                              },
                            },
                            'x-uid': '83hdbsr215s',
                            'x-async': false,
                            'x-index': 1,
                          },
                          '9mjewjq69v9': {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-initializer': 'createForm:configureActions',
                            'x-component': 'ActionBar',
                            'x-component-props': {
                              layout: 'one-column',
                            },
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              '3vfwghmvy4s': {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                title: '{{ t("Submit") }}',
                                'x-action': 'submit',
                                'x-component': 'Action',
                                'x-use-component-props': 'useCreateActionProps',
                                'x-toolbar': 'ActionSchemaToolbar',
                                'x-settings': 'actionSettings:createSubmit',
                                'x-component-props': {
                                  type: 'primary',
                                  htmlType: 'submit',
                                },
                                'x-action-settings': {
                                  triggerWorkflows: [],
                                },
                                type: 'void',
                                'x-app-version': '1.3.0-alpha',
                                'x-uid': 'jio97px04f2',
                                'x-async': false,
                                'x-index': 1,
                              },
                            },
                            'x-uid': '63eyupsa6hx',
                            'x-async': false,
                            'x-index': 2,
                          },
                        },
                        'x-uid': 'lajq33op3vp',
                        'x-async': false,
                        'x-index': 1,
                      },
                    },
                    'x-uid': '2gm9z8qq1ko',
                    'x-async': false,
                    'x-index': 1,
                  },
                },
                'x-uid': 'g2zkfs6wjq2',
                'x-async': false,
                'x-index': 1,
              },
            },
            'x-uid': 'hqjiafa7mwd',
            'x-async': false,
            'x-index': 1,
          },
          '15ocvyxylwv': {
            _isJSONSchemaObject: true,
            version: '2.0',
            type: 'void',
            'x-component': 'Grid.Row',
            'x-app-version': '1.3.0-alpha',
            properties: {
              jywhnul4kko: {
                _isJSONSchemaObject: true,
                version: '2.0',
                type: 'void',
                'x-component': 'Grid.Col',
                'x-app-version': '1.3.0-alpha',
                properties: {
                  n0c0yvxmf66: {
                    _isJSONSchemaObject: true,
                    version: '2.0',
                    type: 'void',
                    'x-acl-action-props': {
                      skipScopeCheck: true,
                    },
                    'x-acl-action': 'test2:create',
                    'x-decorator': 'FormBlockProvider',
                    'x-use-decorator-props': 'useCreateFormBlockDecoratorProps',
                    'x-decorator-props': {
                      dataSource: 'main',
                      collection: 'test2',
                    },
                    'x-toolbar': 'BlockSchemaToolbar',
                    'x-settings': 'blockSettings:createForm',
                    'x-component': 'CardItem',
                    'x-app-version': '1.3.0-alpha',
                    properties: {
                      '8fg61pzm6na': {
                        _isJSONSchemaObject: true,
                        version: '2.0',
                        type: 'void',
                        'x-component': 'FormV2',
                        'x-use-component-props': 'useCreateFormBlockProps',
                        'x-app-version': '1.3.0-alpha',
                        properties: {
                          grid: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer': 'form:configureFields',
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              ry3h9942g18: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-component': 'Grid.Row',
                                'x-app-version': '1.3.0-alpha',
                                properties: {
                                  '8bbuxcx9apn': {
                                    _isJSONSchemaObject: true,
                                    version: '2.0',
                                    type: 'void',
                                    'x-component': 'Grid.Col',
                                    'x-app-version': '1.3.0-alpha',
                                    properties: {
                                      test2_field1: {
                                        _isJSONSchemaObject: true,
                                        version: '2.0',
                                        type: 'string',
                                        'x-toolbar': 'FormItemSchemaToolbar',
                                        'x-settings': 'fieldSettings:FormItem',
                                        'x-component': 'CollectionField',
                                        'x-decorator': 'FormItem',
                                        'x-collection-field': 'test2.test2_field1',
                                        'x-component-props': {},
                                        'x-app-version': '1.3.0-alpha',
                                        'x-uid': 'd5b5o3d4iv3',
                                        'x-async': false,
                                        'x-index': 1,
                                      },
                                    },
                                    'x-uid': 'yorslntry0s',
                                    'x-async': false,
                                    'x-index': 1,
                                  },
                                },
                                'x-uid': 'il7bfx59rw6',
                                'x-async': false,
                                'x-index': 1,
                              },
                            },
                            'x-uid': '3ayv94h5igr',
                            'x-async': false,
                            'x-index': 1,
                          },
                          ckv1bijz81o: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-initializer': 'createForm:configureActions',
                            'x-component': 'ActionBar',
                            'x-component-props': {
                              layout: 'one-column',
                            },
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              '3p7tmkjsorl': {
                                'x-uid': 'ttvq0lju1sl',
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                title: 'Test2 Submit',
                                'x-action': 'submit',
                                'x-component': 'Action',
                                'x-use-component-props': 'useCreateActionProps',
                                'x-toolbar': 'ActionSchemaToolbar',
                                'x-settings': 'actionSettings:createSubmit',
                                'x-component-props': {
                                  type: 'primary',
                                  htmlType: 'submit',
                                  iconColor: '#1677FF',
                                  danger: false,
                                },
                                'x-action-settings': {
                                  triggerWorkflows: [],
                                },
                                type: 'void',
                                'x-app-version': '1.3.0-alpha',
                                'x-async': false,
                                'x-index': 1,
                              },
                            },
                            'x-uid': 'iy0nwpur436',
                            'x-async': false,
                            'x-index': 2,
                          },
                        },
                        'x-uid': 'k10lzitu6fs',
                        'x-async': false,
                        'x-index': 1,
                      },
                    },
                    'x-uid': 'p1zw4rmomo5',
                    'x-async': false,
                    'x-index': 1,
                  },
                },
                'x-uid': '2zv3ef9egl7',
                'x-async': false,
                'x-index': 1,
              },
            },
            'x-uid': '5hkfzlt5j9x',
            'x-async': false,
            'x-index': 2,
          },
          yr4aok12qns: {
            _isJSONSchemaObject: true,
            version: '2.0',
            type: 'void',
            'x-component': 'Grid.Row',
            'x-app-version': '1.3.0-alpha',
            properties: {
              urt8j7jz2nt: {
                _isJSONSchemaObject: true,
                version: '2.0',
                type: 'void',
                'x-component': 'Grid.Col',
                'x-app-version': '1.3.0-alpha',
                properties: {
                  feondsuh88y: {
                    _isJSONSchemaObject: true,
                    version: '2.0',
                    type: 'void',
                    'x-decorator': 'TableBlockProvider',
                    'x-acl-action': 'test1:list',
                    'x-use-decorator-props': 'useTableBlockDecoratorProps',
                    'x-decorator-props': {
                      collection: 'test1',
                      dataSource: 'main',
                      action: 'list',
                      params: {
                        pageSize: 20,
                      },
                      rowKey: 'id',
                      showIndex: true,
                      dragSort: false,
                    },
                    'x-toolbar': 'BlockSchemaToolbar',
                    'x-settings': 'blockSettings:table',
                    'x-component': 'CardItem',
                    'x-filter-targets': [],
                    'x-app-version': '1.3.0-alpha',
                    properties: {
                      actions: {
                        _isJSONSchemaObject: true,
                        version: '2.0',
                        type: 'void',
                        'x-initializer': 'table:configureActions',
                        'x-component': 'ActionBar',
                        'x-component-props': {
                          style: {
                            marginBottom: 'var(--nb-spacing)',
                          },
                        },
                        'x-app-version': '1.3.0-alpha',
                        properties: {
                          '49qgky8jt0e': {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            title: '{{ t("Filter") }}',
                            'x-action': 'filter',
                            'x-toolbar': 'ActionSchemaToolbar',
                            'x-settings': 'actionSettings:filter',
                            'x-component': 'Filter.Action',
                            'x-use-component-props': 'useFilterActionProps',
                            'x-component-props': {
                              icon: 'FilterOutlined',
                            },
                            'x-align': 'left',
                            'x-app-version': '1.3.0-alpha',
                            'x-uid': 'a3u9ea6fuxa',
                            'x-async': false,
                            'x-index': 1,
                          },
                        },
                        'x-uid': '5uzn7hm7hf1',
                        'x-async': false,
                        'x-index': 1,
                      },
                      ql07qyg0amg: {
                        _isJSONSchemaObject: true,
                        version: '2.0',
                        type: 'array',
                        'x-initializer': 'table:configureColumns',
                        'x-component': 'TableV2',
                        'x-use-component-props': 'useTableBlockProps',
                        'x-component-props': {
                          rowKey: 'id',
                          rowSelection: {
                            type: 'checkbox',
                          },
                        },
                        'x-app-version': '1.3.0-alpha',
                        properties: {
                          actions: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            title: '{{ t("Actions") }}',
                            'x-action-column': 'actions',
                            'x-decorator': 'TableV2.Column.ActionBar',
                            'x-component': 'TableV2.Column',
                            'x-toolbar': 'TableColumnSchemaToolbar',
                            'x-initializer': 'table:configureItemActions',
                            'x-settings': 'fieldSettings:TableColumn',
                            'x-toolbar-props': {
                              initializer: 'table:configureItemActions',
                            },
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              i4rqrt7v8kd: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                type: 'void',
                                'x-decorator': 'DndContext',
                                'x-component': 'Space',
                                'x-component-props': {
                                  split: '|',
                                },
                                'x-app-version': '1.3.0-alpha',
                                'x-uid': 'u2ltbdwu2i1',
                                'x-async': false,
                                'x-index': 1,
                              },
                            },
                            'x-uid': 'n7gb1fbc4pc',
                            'x-async': false,
                            'x-index': 1,
                          },
                          uxo35a21664: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-decorator': 'TableV2.Column.Decorator',
                            'x-toolbar': 'TableColumnSchemaToolbar',
                            'x-settings': 'fieldSettings:TableColumn',
                            'x-component': 'TableV2.Column',
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              test1_field1: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                'x-collection-field': 'test1.test1_field1',
                                'x-component': 'CollectionField',
                                'x-component-props': {},
                                'x-read-pretty': true,
                                'x-decorator': null,
                                'x-decorator-props': {
                                  labelStyle: {
                                    display: 'none',
                                  },
                                },
                                'x-app-version': '1.3.0-alpha',
                                'x-uid': 'c2ks9mj6cyp',
                                'x-async': false,
                                'x-index': 1,
                              },
                            },
                            'x-uid': 'rqikkpeyj0q',
                            'x-async': false,
                            'x-index': 2,
                          },
                          ph8jj5br15o: {
                            _isJSONSchemaObject: true,
                            version: '2.0',
                            type: 'void',
                            'x-decorator': 'TableV2.Column.Decorator',
                            'x-toolbar': 'TableColumnSchemaToolbar',
                            'x-settings': 'fieldSettings:TableColumn',
                            'x-component': 'TableV2.Column',
                            'x-app-version': '1.3.0-alpha',
                            properties: {
                              test1_field2: {
                                _isJSONSchemaObject: true,
                                version: '2.0',
                                'x-collection-field': 'test1.test1_field2',
                                'x-component': 'CollectionField',
                                'x-component-props': {},
                                'x-read-pretty': true,
                                'x-decorator': null,
                                'x-decorator-props': {
                                  labelStyle: {
                                    display: 'none',
                                  },
                                },
                                'x-app-version': '1.3.0-alpha',
                                'x-uid': 'jbjgn2awvy9',
                                'x-async': false,
                                'x-index': 1,
                              },
                            },
                            'x-uid': '4ne3adiekfa',
                            'x-async': false,
                            'x-index': 3,
                          },
                        },
                        'x-uid': 'ba6385zm0zr',
                        'x-async': false,
                        'x-index': 2,
                      },
                    },
                    'x-uid': 'v2a5hlvhzb3',
                    'x-async': false,
                    'x-index': 1,
                  },
                },
                'x-uid': 'lfwzsek50fh',
                'x-async': false,
                'x-index': 1,
              },
            },
            'x-uid': 'z1t81sf8trd',
            'x-async': false,
            'x-index': 3,
          },
        },
        'x-uid': 'b4w3rwpfczs',
        'x-async': false,
        'x-index': 1,
      },
    },
    'x-uid': '4l568jmmxin',
    'x-async': true,
    'x-index': 1,
  },
};
