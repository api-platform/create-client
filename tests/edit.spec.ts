import { test as baseTest, expect } from "@playwright/test";
import { locatorFixtures as fixtures } from "@playwright-testing-library/test/fixture.js";
import type { LocatorFixtures as TestingLibraryFixtures } from "@playwright-testing-library/test/fixture.js";

const test = baseTest.extend<TestingLibraryFixtures>(fixtures);

test("resource edit", async ({
  page,
  within,
  queries: {
    getAllByRole,
    getByLabelText,
    getByRole,
    getByText,
    queryByRole,
    queryByText,
  },
}) => {
  await page.goto("http://localhost:3000/books/");

  await expect(queryByText("Loading...")).not.toBeVisible();

  await expect(
    queryByRole("heading", { level: 1, name: "Book List" })
  ).toBeVisible();

  const rows = getAllByRole("row");

  const { getAllByRole: getAllByRoleWithinRow } = within(rows.nth(3));

  const bookLink = getAllByRoleWithinRow("link", { name: "Edit" }).nth(0);
  bookLink.click();

  await expect(queryByText("Loading...")).not.toBeVisible();

  await expect(queryByRole("heading", { level: 1 })).toHaveText(
    /^\s*Edit Book/
  );

  await expect(queryByText("Loading...")).not.toBeVisible();

  await expect(getByLabelText("book")).toBeEditable();
  await expect(getByLabelText("condition")).toBeEditable();
  await expect(getByLabelText("title")).toBeEditable();
  await expect(getByLabelText("author")).toBeEditable();
  await expect(getByLabelText("rating")).toBeEditable();
  //await expect(getByText("reviews")).toBeVisible();

  await expect(getByRole("button", { name: "Submit" })).toBeVisible();
  await expect(getByRole("button", { name: "Delete" })).toBeVisible();
  await expect(getByRole("link", { name: /Back to list/ })).toBeVisible();
});
