import { Page, expect, oneTableBlockWithAddNewAndViewAndEditAndRelationFields, test } from '@nocobase/test/client';
import { commonTesting, testDefaultValue, testPattern } from '../commonTesting';

const gotoPage = async (mockPage, mockRecords) => {
  const nocoPage = await mockPage(oneTableBlockWithAddNewAndViewAndEditAndRelationFields).waitForInit();
  await mockRecords('users', 3);
  await nocoPage.goto();
};

const openDialog = async (page: Page) => {
  await page.getByRole('button', { name: 'Add new' }).click();
};

const showMenu = async (page: Page, fieldName: string) => {
  await page.getByLabel(`block-item-CollectionField-general-form-general.${fieldName}-${fieldName}`).hover();
  await page
    .getByLabel(`designer-schema-settings-CollectionField-FormItem.Designer-general-general.${fieldName}`)
    .hover();
};

const openDialogAndShowMenu = async ({
  page,
  mockPage,
  mockRecords,
  fieldName,
}: {
  page: Page;
  mockPage;
  mockRecord;
  mockRecords;
  fieldName: string;
}) => {
  await gotoPage(mockPage, mockRecords);
  await openDialog(page);
  await showMenu(page, fieldName);
};

test.describe('many to many', () => {
  commonTesting({ openDialogAndShowMenu, fieldName: 'manyToMany', fieldType: 'relation', mode: 'options' });

  test('set default value', async ({ page, mockPage, mockRecords }) => {
    await testDefaultValue({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      closeDialog: () => page.getByLabel('drawer-Action.Container-general-Add record-mask').click(),
      showMenu: () => showMenu(page, 'manyToMany'),
      supportVariables: ['Constant', 'Current user', 'Date variables', 'Current form'],
      inputConstantValue: async () => {
        await page.getByLabel('block-item-VariableInput-').getByTestId('select-object-multiple').click();
        await page.getByRole('option', { name: '1', exact: true }).click();
        await page.getByRole('option', { name: '2', exact: true }).click();
        await page.getByRole('option', { name: '3', exact: true }).click();
      },
      expectConstantValue: async () => {
        await expect(
          page.getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany'),
        ).toHaveText(`manyToMany:123`);
      },
    });
  });

  test('pattern', async ({ page, mockPage, mockRecords }) => {
    await testPattern({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      showMenu: () => showMenu(page, 'manyToMany'),
      expectEditable: async () => {
        await page
          .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
          .getByTestId('select-object-multiple')
          .click();
        await page.getByRole('option', { name: '1', exact: true }).click();
        await page.getByRole('option', { name: '2', exact: true }).click();
        await page.getByRole('option', { name: '3', exact: true }).click();
      },
      expectReadonly: async () => {
        await expect(
          page
            .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
            .getByTestId('select-object-multiple'),
        ).toHaveClass(/ant-select-disabled/);
        // 在这里等待一下，防止因闪烁导致下面的断言失败
        await page.waitForTimeout(100);
      },
      expectEasyReading: async () => {
        await expect(
          page.getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany'),
        ).toHaveText(`manyToMany:1,2,3`);
      },
    });
  });

  test('Set the data scope', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await page.getByText('Add condition', { exact: true }).click();
    await page.getByTestId('select-filter-field').click();
    await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('3');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 再次打开弹窗，设置的值应该还在
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await expect(page.getByTestId('select-filter-field')).toHaveText('ID');
    await expect(page.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 数据应该被过滤了
    await page
      .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
      .getByTestId('select-object-multiple')
      .click();
    await expect(page.getByRole('option', { name: '3', exact: true })).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(1);
  });

  test('set default sorting rules', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Set default sorting rules' }).click();

    // 配置
    await page.getByRole('button', { name: 'Add sort field' }).click();
    await page.getByTestId('select-single').getByLabel('Search').click();
    await page.getByRole('option', { name: 'ID' }).click();
    await page.getByText('DESC', { exact: true }).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 再次打开弹窗，设置的值应该还在
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Set default sorting rules' }).click();
    await expect(page.getByRole('dialog').getByTestId('select-single')).toHaveText('ID');
  });

  test('field component', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Field component' }).click();

    // 断言支持的选项
    await expect(page.getByRole('option', { name: 'Select', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Record picker', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-table', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form(Popover)', exact: true })).toBeVisible();

    // 选择 Record picker
    await page.getByRole('option', { name: 'Record picker', exact: true }).click();
    await expect(
      page
        .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
        .getByTestId('select-data-picker'),
    ).toBeVisible();

    // 选择 Sub-table
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Field component' }).click();
    await page.getByRole('option', { name: 'Sub-table', exact: true }).click();
    await expect(
      page
        .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
        .getByLabel('schema-initializer-AssociationField.SubTable-TableColumnInitializers-users'),
    ).toBeVisible();

    // 选择 Sub-form
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Field component' }).click();
    await page.getByRole('option', { name: 'Sub-form', exact: true }).click();
    await expect(
      page
        .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
        .getByLabel('schema-initializer-Grid-FormItemInitializers-users'),
    ).toBeVisible();

    // 选择 Sub-form(Popover)
    await showMenu(page, 'manyToMany');
    await page.getByRole('menuitem', { name: 'Field component' }).click();
    await page.getByRole('option', { name: 'Sub-form(Popover)', exact: true }).click();
    await page
      .getByLabel('block-item-CollectionField-general-form-general.manyToMany-manyToMany')
      .getByRole('img', { name: 'edit' })
      .click();
    await expect(page.getByTestId('popover-CollectionField-general')).toBeVisible();
  });
});

test.describe('many to one', () => {
  commonTesting({ openDialogAndShowMenu, fieldName: 'manyToOne', fieldType: 'relation', mode: 'options' });

  test('set default value', async ({ page, mockPage, mockRecords }) => {
    await testDefaultValue({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      closeDialog: () => page.getByLabel('drawer-Action.Container-general-Add record-mask').click(),
      showMenu: () => showMenu(page, 'manyToOne'),
      supportVariables: ['Constant', 'Current user', 'Date variables', 'Current form'],
      inputConstantValue: async () => {
        await page
          .getByLabel('block-item-VariableInput-')
          .getByTestId(/select-object/)
          .click();
        await page.getByRole('option', { name: '1', exact: true }).click();
        await page
          .getByLabel('block-item-VariableInput-')
          .getByTestId(/select-object/)
          .click();
        await page.getByRole('option', { name: '2', exact: true }).click();
        await page
          .getByLabel('block-item-VariableInput-')
          .getByTestId(/select-object/)
          .click();
        await page.getByRole('option', { name: '3', exact: true }).click();
      },
      expectConstantValue: async () => {
        await expect(
          page
            .getByLabel('block-item-CollectionField-general-form-general.manyToOne-manyToOne')
            .getByTestId(/select-object/),
        ).toHaveText(`3`);
      },
    });
  });

  test('pattern', async ({ page, mockPage, mockRecords }) => {
    await testPattern({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      showMenu: () => showMenu(page, 'manyToOne'),
      expectEditable: async () => {
        await page
          .getByLabel('block-item-CollectionField-general-form-general.manyToOne-manyToOne')
          .getByTestId(/select-object/)
          .click();
        await page.getByRole('option', { name: '1', exact: true }).click();
      },
      expectReadonly: async () => {
        await expect(
          page
            .getByLabel('block-item-CollectionField-general-form-general.manyToOne-manyToOne')
            .getByTestId(/select-object/),
        ).toHaveClass(/ant-select-disabled/);
        // 在这里等待一下，防止因闪烁导致下面的断言失败
        await page.waitForTimeout(100);
      },
      expectEasyReading: async () => {
        await expect(page.getByLabel('block-item-CollectionField-general-form-general.manyToOne-manyToOne')).toHaveText(
          `manyToOne:1`,
        );
      },
    });
  });

  test('Set the data scope', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'manyToOne');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await page.getByText('Add condition', { exact: true }).click();
    await page.getByTestId('select-filter-field').click();
    await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('3');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 再次打开弹窗，设置的值应该还在
    await showMenu(page, 'manyToOne');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await expect(page.getByTestId('select-filter-field')).toHaveText('ID');
    await expect(page.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 数据应该被过滤了
    await page
      .getByLabel('block-item-CollectionField-general-form-general.manyToOne-manyToOne')
      .getByLabel('Search')
      .click();
    await expect(page.getByRole('option', { name: '3', exact: true })).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(1);
  });

  test('field component', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'manyToOne');
    await page.getByRole('menuitem', { name: 'Field component' }).click();

    // 断言支持的选项
    await expect(page.getByRole('option', { name: 'Select', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Record picker', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form(Popover)', exact: true })).toBeVisible();
  });
});

test.describe('one to many', () => {
  commonTesting({ openDialogAndShowMenu, fieldName: 'oneToMany', fieldType: 'relation', mode: 'options' });

  test('set default value', async ({ page, mockPage, mockRecord, mockRecords }) => {
    await openDialogAndShowMenu({ page, mockPage, mockRecord, mockRecords, fieldName: 'oneToMany' });
    await expect(page.getByRole('menuitem', { name: 'Set default value' })).not.toBeVisible();
  });

  test('pattern', async ({ page, mockPage, mockRecords }) => {
    await testPattern({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      showMenu: () => showMenu(page, 'oneToMany'),
      expectEditable: async () => {
        await page
          .getByLabel('block-item-CollectionField-general-form-general.oneToMany-oneToMany')
          .getByTestId('select-object-multiple')
          .click();
        await page.getByRole('option', { name: '1', exact: true }).click();
        await page.getByRole('option', { name: '2', exact: true }).click();
        await page.getByRole('option', { name: '3', exact: true }).click();
      },
      expectReadonly: async () => {
        await expect(
          page
            .getByLabel('block-item-CollectionField-general-form-general.oneToMany-oneToMany')
            .getByTestId('select-object-multiple'),
        ).toHaveClass(/ant-select-disabled/);
        // 在这里等待一下，防止因闪烁导致下面的断言失败
        await page.waitForTimeout(100);
      },
      expectEasyReading: async () => {
        await expect(page.getByLabel('block-item-CollectionField-general-form-general.oneToMany-oneToMany')).toHaveText(
          `oneToMany:1,2,3`,
        );
      },
    });
  });

  test('Set the data scope', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'oneToMany');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await page.getByText('Add condition', { exact: true }).click();
    await page.getByTestId('select-filter-field').click();
    await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('3');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 再次打开弹窗，设置的值应该还在
    await showMenu(page, 'oneToMany');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await expect(page.getByTestId('select-filter-field')).toHaveText('ID');
    await expect(page.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 数据应该被过滤了
    await page
      .getByLabel('block-item-CollectionField-general-form-general.oneToMany-oneToMany')
      .getByTestId('select-object-multiple')
      .click();
    // 默认只显示 id 为 1 的数据，因为设置了只过滤 id 为 3 的数据，所以这里的下拉列表应该为空
    await expect(page.getByRole('option')).toHaveCount(0);
  });

  test('field component', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'oneToMany');
    await page.getByRole('menuitem', { name: 'Field component' }).click();

    // 断言支持的选项
    await expect(page.getByRole('option', { name: 'Select', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Record picker', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-table', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form(Popover)', exact: true })).toBeVisible();
  });
});

test.describe('one to one (belongs to)', () => {
  commonTesting({ openDialogAndShowMenu, fieldName: 'oneToOneBelongsTo', fieldType: 'relation', mode: 'options' });

  test('set default value', async ({ page, mockPage, mockRecord, mockRecords }) => {
    await openDialogAndShowMenu({ page, mockPage, mockRecord, mockRecords, fieldName: 'oneToOneBelongsTo' });
    await expect(page.getByRole('menuitem', { name: 'Set default value' })).not.toBeVisible();
  });

  test('pattern', async ({ page, mockPage, mockRecords }) => {
    await testPattern({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      showMenu: () => showMenu(page, 'oneToOneBelongsTo'),
      expectEditable: async () => {
        await page
          .getByLabel('block-item-CollectionField-general-form-general.oneToOneBelongsTo-oneToOneBelongsTo')
          .getByTestId(/select-object/)
          .click();
        await page.getByRole('option', { name: '1', exact: true }).click();
      },
      expectReadonly: async () => {
        await expect(
          page
            .getByLabel('block-item-CollectionField-general-form-general.oneToOneBelongsTo-oneToOneBelongsTo')
            .getByTestId(/select-object/),
        ).toHaveClass(/ant-select-disabled/);
        // 在这里等待一下，防止因闪烁导致下面的断言失败
        await page.waitForTimeout(100);
      },
      expectEasyReading: async () => {
        await expect(
          page.getByLabel('block-item-CollectionField-general-form-general.oneToOneBelongsTo-oneToOneBelongsTo'),
        ).toHaveText(`oneToOneBelongsTo:1`);
      },
    });
  });

  test('Set the data scope', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'oneToOneBelongsTo');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await page.getByText('Add condition', { exact: true }).click();
    await page.getByTestId('select-filter-field').click();
    await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('3');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 再次打开弹窗，设置的值应该还在
    await showMenu(page, 'oneToOneBelongsTo');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await expect(page.getByTestId('select-filter-field')).toHaveText('ID');
    await expect(page.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 数据应该被过滤了
    await page
      .getByLabel('block-item-CollectionField-general-form-general.oneToOneBelongsTo-oneToOneBelongsTo')
      .getByLabel('Search')
      .click();
    await expect(page.getByRole('option', { name: '3', exact: true })).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(1);
  });

  test('field component', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'oneToOneBelongsTo');
    await page.getByRole('menuitem', { name: 'Field component' }).click();

    // 断言支持的选项
    await expect(page.getByRole('option', { name: 'Select', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Record picker', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form(Popover)', exact: true })).toBeVisible();
  });
});

test.describe('one to one (has one)', () => {
  commonTesting({ openDialogAndShowMenu, fieldName: 'oneToOneHasOne', fieldType: 'relation', mode: 'options' });

  test('set default value', async ({ page, mockPage, mockRecord, mockRecords }) => {
    await openDialogAndShowMenu({ page, mockPage, mockRecord, mockRecords, fieldName: 'oneToOneHasOne' });
    await expect(page.getByRole('menuitem', { name: 'Set default value' })).not.toBeVisible();
  });

  test('pattern', async ({ page, mockPage, mockRecords }) => {
    await testPattern({
      page,
      gotoPage: () => gotoPage(mockPage, mockRecords),
      openDialog: () => openDialog(page),
      showMenu: () => showMenu(page, 'oneToOneHasOne'),
      expectEditable: async () => {
        await page
          .getByLabel('block-item-CollectionField-general-form-general.oneToOneHasOne-oneToOneHasOne')
          .getByTestId(/select-object/)
          .click();
        await page.getByRole('option', { name: '1', exact: true }).click();
      },
      expectReadonly: async () => {
        await expect(
          page
            .getByLabel('block-item-CollectionField-general-form-general.oneToOneHasOne-oneToOneHasOne')
            .getByTestId(/select-object/),
        ).toHaveClass(/ant-select-disabled/);
        // 在这里等待一下，防止因闪烁导致下面的断言失败
        await page.waitForTimeout(100);
      },
      expectEasyReading: async () => {
        await expect(
          page.getByLabel('block-item-CollectionField-general-form-general.oneToOneHasOne-oneToOneHasOne'),
        ).toHaveText(`oneToOneHasOne:1`);
      },
    });
  });

  test('Set the data scope', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'oneToOneHasOne');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await page.getByText('Add condition', { exact: true }).click();
    await page.getByTestId('select-filter-field').click();
    await page.getByRole('menuitemcheckbox', { name: 'ID', exact: true }).click();
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('3');
    await page.getByRole('button', { name: 'OK', exact: true }).click();

    // 再次打开弹窗，设置的值应该还在
    await showMenu(page, 'oneToOneHasOne');
    await page.getByRole('menuitem', { name: 'Set the data scope' }).click();
    await expect(page.getByTestId('select-filter-field')).toHaveText('ID');
    await expect(page.getByRole('spinbutton')).toHaveValue('3');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // 数据应该被过滤了
    await page
      .getByLabel('block-item-CollectionField-general-form-general.oneToOneHasOne-oneToOneHasOne')
      .getByLabel('Search')
      .click();
    // 默认只显示 id 为 1 的数据，因为设置了只过滤 id 为 3 的数据，所以这里的下拉列表应该为空
    await expect(page.getByRole('option')).toHaveCount(0);
  });

  test('field component', async ({ page, mockPage, mockRecords }) => {
    await gotoPage(mockPage, mockRecords);
    await openDialog(page);
    await showMenu(page, 'oneToOneHasOne');
    await page.getByRole('menuitem', { name: 'Field component' }).click();

    // 断言支持的选项
    await expect(page.getByRole('option', { name: 'Select', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Record picker', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Sub-form(Popover)', exact: true })).toBeVisible();
  });
});
