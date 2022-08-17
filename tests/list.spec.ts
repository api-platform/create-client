import { test as baseTest, expect } from '@playwright/test';
import { locatorFixtures as fixtures, within } from '@playwright-testing-library/test/fixture.js';
import type { LocatorFixtures as TestingLibraryFixtures } from '@playwright-testing-library/test/fixture.js';

const test = baseTest.extend<TestingLibraryFixtures>(fixtures)

test('resource list', async ({ page, queries: { getAllByRole, getByRole } }) => {
  await page.goto('http://localhost:3000/books');

  await expect(getByRole('heading', { level: 1 })).toHaveText('Book List');

  const cols = getAllByRole('rowgroup').nth(0);
  const { getByRole: getByRoleWithinCols } = within(cols);

  await expect(getByRoleWithinCols('columnheader', { name: 'id' })).toBeVisible();
  await expect(getByRoleWithinCols('columnheader', { name: 'isbn' })).toBeVisible();
  await expect(getByRoleWithinCols('columnheader', { name: 'reviews' })).toBeVisible();

  const list = getAllByRole('rowgroup').nth(1);
  const { getAllByRole: getAllByRoleWithinList } = within(list);

  const rows = getAllByRoleWithinList('row');

  await expect(rows).toHaveCount(30);

  const { getAllByRole: getAllByRoleWithinRow } = within(rows.nth(3));

  await expect(getAllByRoleWithinRow('link', { name: 'Show' })).toBeVisible();
  await expect(getAllByRoleWithinRow('link', { name: 'Edit' })).toBeVisible();

  const pagination = getByRole('navigation');
  const { getAllByRole: getAllByRoleWithinPagination } = within(pagination);

  await expect(getAllByRoleWithinPagination('link', { name: 'First' })).toBeVisible();
  await expect(getAllByRoleWithinPagination('link', { name: 'Previous' })).toBeVisible();
  await expect(getAllByRoleWithinPagination('link', { name: 'Next' })).toBeVisible();
  await expect(getAllByRoleWithinPagination('link', { name: 'Last' })).toBeVisible();

  // @TODO Make sure data change when paginate
});
