import { expect, test } from "playwright-ssr";
import book from "./fixtures/get-book.json" assert { type: "json" };
import { getOption } from "./api";

test("resource edit", async ({ page, webServer }) => {
  if (process.env.SSR) {
    // Mock the server side API request
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
    .getByRole("link", { name: "Edit" })
    .click();

  await expect(page.getByRole("heading", { name: "Show Book" })).toBeHidden();
  await expect(page.getByText("Loading...")).toBeHidden();

  await expect(page.getByRole("heading", { name: "Edit Book" })).toBeVisible();

  await expect(page.getByLabel("book")).toHaveValue(book["book"]);
  await expect(page.getByLabel("condition")).toHaveValue(book["condition"]);
  await expect(page.getByLabel("title")).toHaveValue(book["title"]);
  await expect(page.getByLabel("author")).toHaveValue(book["author"]);
  await expect(page.getByLabel("rating")).toHaveValue(
    book["rating"].toString()
  );

  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to list" })).toBeVisible();

  await page.getByLabel("rating").fill("3");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Loading...")).toBeHidden();
  await expect(page.getByLabel("rating")).toHaveValue("3");
});
