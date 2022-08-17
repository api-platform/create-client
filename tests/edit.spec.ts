import { test as baseTest, expect } from '@playwright/test';
import { locatorFixtures as fixtures, within } from '@playwright-testing-library/test/fixture.js';
import type { LocatorFixtures as TestingLibraryFixtures } from '@playwright-testing-library/test/fixture.js';

const test = baseTest.extend<TestingLibraryFixtures>(fixtures)

test('resource edit', async ({ page, queries: { getAllByRole, getByLabelText, getByRole } }) => {
  await page.goto('http://localhost:3000/books');

  const rows = getAllByRole('row');

  const { getAllByRole: getAllByRoleWithinRow } = within(rows.nth(3));

  const bookLink = getAllByRoleWithinRow('link').nth(0);
  bookLink.click();

  await expect(getByRole('heading', { level: 1 })).toHaveText(/^Show Book/);

  const editLink = getByRole('link', { name: 'Edit' });
  editLink.click();

  await expect(getByRole('heading', { level: 1 })).toHaveText(/^Edit Book/);

  await expect(getByLabelText('isbn')).toBeEditable();
  await expect(getByLabelText('description')).toBeEditable();
  await expect(getByLabelText('reviews')).toBeEditable();

  await expect(getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(getByRole('button', { name: 'Delete' })).toBeVisible();
  await expect(getByRole('link', { name: 'Back to list' })).toBeVisible();
});
