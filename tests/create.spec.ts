import { test as baseTest, expect } from '@playwright/test';
import { locatorFixtures as fixtures } from '@playwright-testing-library/test/fixture.js';
import type { LocatorFixtures as TestingLibraryFixtures } from '@playwright-testing-library/test/fixture.js';

const test = baseTest.extend<TestingLibraryFixtures>(fixtures)

test('resource create', async ({ page, queries: { getByLabelText, getByRole, getByText } }) => {
  await page.goto('http://localhost:3000/books/create');

  await expect(getByRole('heading', { level: 1 })).toHaveText(/^Create Book/);

  await expect(getByLabelText('isbn')).toBeEditable();
  await expect(getByLabelText('description')).toBeEditable();
  await expect(getByText('reviews')).toBeVisible();

  await expect(getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(getByRole('link', { name: 'Back to list' })).toBeVisible();
});
