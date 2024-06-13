import { expect, test } from "playwright-ssr";
import { getOption } from "./api";

test("resource show", async ({ page, webServer }) => {
  if (process.env.SSR) {
    await webServer.route("*/**/admin/books", async (route) => {
      await route.fulfill(getOption(route));
    });
  } else {
    await page.route("*/**/admin/books", async (route) => {
      await route.fulfill(getOption(route));
    });
  }
  await page.route("*/**/admin/books/*", async (route) => {
    await route.fulfill(getOption(route));
  });

  await page.goto("books");

  await expect(page.getByText("Loading...")).toBeHidden();

  await page
    .getByRole("row")
    .nth(1)
    .getByRole("link", { name: "Show" })
    .click();

  await expect(page.getByRole("heading")).toHaveText(/Show Book/i);

  await expect(page.getByText("Loading...")).toBeHidden();

  const cols = await page.getByRole("rowgroup").first();

  await expect(
    cols
      .getByRole("cell", { name: /Field/i })
      .or(page.getByRole("columnheader", { name: "Field" }))
  ).toBeVisible();
  await expect(
    cols
      .getByRole("cell", { name: /Value/i })
      .or(page.getByRole("columnheader", { name: "Value" }))
  ).toBeVisible();

  await expect(page.getByRole("rowheader", { name: "Book" })).toBeVisible();
  await expect(
    page.getByRole("cell", {
      name: "https://openlibrary.org/books/OL2055137M.json",
    })
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Back to list" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
});
