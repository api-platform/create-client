import { expect, test } from "playwright-ssr";
import { getOption } from "./api";
import book from "./fixtures/get-book.json" assert { type: "json" };

test("resource create", async ({ page, webServer }) => {
  if (process.env.SSR) {
    await webServer.route("*/**/admin/books", async (route) => {
      await route.fulfill(getOption(route));
    });
  }

  await page.route("*/**/admin/books", async (route) => {
    await route.fulfill(getOption(route));
  });

  await page.goto("books/create");

  await expect(page.getByText("Loading...")).toBeHidden();

  await expect(page.getByRole("heading")).toHaveText(/Create Book/i);

  await expect(page.getByLabel("book")).toBeEditable();

  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to list/i })).toBeVisible();

  await page.getByRole("textbox", { name: "Book" }).fill(book["book"]);
  await page
    .getByRole("textbox", { name: "Condition" })
    .fill(book["condition"]);
  await page.getByLabel("Title").fill(book["title"]);
  await page.getByLabel("Author").fill(book["author"]);
  await page.getByLabel("Rating").fill(book["rating"].toString());
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Loading...")).toBeHidden();

  await expect(page.getByRole("heading")).toHaveText(/Book List/i);

  const firstItemRow = await page.getByRole("row").nth(1);
  await expect(
    firstItemRow.getByRole("cell", {
      name: "https://openlibrary.org/books/OL2055137M.json",
    })
  ).toBeVisible();
});
