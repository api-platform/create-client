import { expect, test } from "playwright-ssr";
import { getOption } from "./api";

test("resource list", async ({ page, webServer }) => {
  if (process.env.SSR) {
    await webServer.route("*/**/admin/books", async (route) => {
      await route.fulfill(getOption(route));
    });
  } else {
    await page.route("*/**/admin/books", async (route) => {
      await route.fulfill(getOption(route));
    });
  }
  await page.goto("books");

  await expect(page.getByText("Loading...")).toBeHidden();

  await expect(page.getByRole("heading")).toHaveText("Book List");

  await expect(page.getByRole("link", { name: "Create" })).toBeVisible();

  const cols = await page.getByRole("rowgroup").first();

  await expect(cols.getByRole("cell", { name: "Id" })).toBeVisible();
  await expect(cols.getByRole("cell", { name: "Book" })).toBeVisible();
  await expect(cols.getByRole("cell", { name: "Condition" })).toBeVisible();
  await expect(cols.getByRole("cell", { name: "Title" })).toBeVisible();
  await expect(cols.getByRole("cell", { name: "Author" })).toBeVisible();
  await expect(cols.getByRole("cell", { name: "Rating" })).toBeVisible();

  await expect(page.getByText("Loading...")).toBeHidden();

  const firstItemRow = await page.getByRole("row").nth(1);

  await expect(firstItemRow.getByRole("link", { name: "Show" })).toBeVisible();
  await expect(firstItemRow.getByRole("link", { name: "Edit" })).toBeVisible();

  // await expect(getByLabelText(/^First/)).toBeVisible();
  // await expect(getByLabelText(/^Previous/)).toBeVisible();
  // await expect(getByLabelText(/^Next/)).toBeVisible();
  // await expect(getByLabelText(/^Last/)).toBeVisible();

  // @TODO Make sure data change when paginate
});
