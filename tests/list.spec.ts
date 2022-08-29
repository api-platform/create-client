import { test as baseTest, expect } from '@playwright/test';
import { locatorFixtures as fixtures, within } from '@playwright-testing-library/test/fixture.js';
import type { LocatorFixtures as TestingLibraryFixtures } from '@playwright-testing-library/test/fixture.js';

const test = baseTest.extend<TestingLibraryFixtures>(fixtures)

test('resource list', async ({ page, queries: { getAllByRole, getByLabelText, getByRole, queryByRole, queryByText } }) => {
  await page.goto('http://localhost:3000/books/');

  await expect(queryByText('Loading...')).not.toBeVisible();

  await expect(queryByRole('heading', { level: 1 })).toHaveText('Book List');

  await expect(getByRole('link', { name: 'Create' })).toBeVisible();

  const cols = getAllByRole('rowgroup').nth(0);
  const { getByRole: getByRoleWithinCols } = within(cols);

  await expect(getByRoleWithinCols('columnheader', { name: /^id/ })).toBeVisible();
  await expect(getByRoleWithinCols('columnheader', { name: /^isbn/ })).toBeVisible();
  await expect(getByRoleWithinCols('columnheader', { name: /^reviews/ })).toBeVisible();

  await expect(queryByText('Loading...')).not.toBeVisible();

  const list = getAllByRole('rowgroup').nth(1);
  const { getAllByRole: getAllByRoleWithinList } = within(list);

  const rows = getAllByRoleWithinList('row');

  await expect(rows).toHaveCount(30);

  const { getAllByRole: getAllByRoleWithinRow } = within(rows.nth(3));

  await expect(getAllByRoleWithinRow('link', { name: 'Show' })).toBeVisible();
  await expect(getAllByRoleWithinRow('link', { name: 'Edit' })).toBeVisible();

  await expect(getByLabelText(/^First/)).toBeVisible();
  await expect(getByLabelText(/^Previous/)).toBeVisible();
  await expect(getByLabelText(/^Next/)).toBeVisible();
  await expect(getByLabelText(/^Last/)).toBeVisible();

  // @TODO Make sure data change when paginate
});
