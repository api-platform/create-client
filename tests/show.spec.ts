import { test as baseTest, expect } from '@playwright/test';
import { locatorFixtures as fixtures } from '@playwright-testing-library/test/fixture.js';
import type { LocatorFixtures as TestingLibraryFixtures } from '@playwright-testing-library/test/fixture.js';

const test = baseTest.extend<TestingLibraryFixtures>(fixtures)

test('resource show', async ({ page, within, queries: { getAllByRole, getByRole, queryByRole, queryByText } }) => {
  await page.goto('http://localhost:3000/books/');

  await expect(queryByText('Loading...')).not.toBeVisible();

  const listRows = getAllByRole('row');

  const { getAllByRole: getAllByRoleWithinListRow } = within(listRows.nth(3));

  const bookLink = getAllByRoleWithinListRow('link').nth(0);
  bookLink.click();

  await expect(queryByRole('heading', { level: 1 })).toHaveText(/^\s*Show Book/);

  await expect(queryByText('Loading...')).not.toBeVisible();

  const cols = getAllByRole('rowgroup').nth(0);
  const { getByRole: getByRoleWithinCols } = within(cols);

  await expect(getByRoleWithinCols('columnheader', { name: 'Field' })).toBeVisible();
  await expect(getByRoleWithinCols('columnheader', { name: 'Value' })).toBeVisible();

  const list = getAllByRole('rowgroup').nth(1);
  const { getAllByRole: getAllByRoleWithinList } = within(list);

  const rows = getAllByRoleWithinList('row');

  const { getByRole: getByRoleWithinRow } = within(rows.nth(0));

  await expect(getByRoleWithinRow('rowheader')).toHaveText('isbn');

  await expect(getByRole('link', { name: /Back to list/ })).toBeVisible();
  await expect(getByRole('link', { name: 'Edit' })).toBeVisible();
  await expect(getByRole('button', { name: 'Delete' })).toBeVisible();
});
