import type { Route } from "@playwright/test";
import book from "./fixtures/get-book.json" assert { type: "json" };
import books from "./fixtures/get-books.json" assert { type: "json" };

type Option = Parameters<Route["fulfill"]>[0];

interface Options {
  [url: string]: {
    [method: string]: Option;
  };
}

const commonOptions = {
  contentType: "application/ld+json",
  headers: {
    Link: '<https://demo.api-platform.com/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
  },
};

export const options: Options = {
  "/admin/books": {
    POST: {
      status: 201,
      json: book,
    },
    GET: {
      status: 200,
      json: books,
    },
  },
  "/admin/books/1eeefbac-d477-6eae-863f-216de4cbc8f4": {
    GET: {
      status: 200,
      json: book,
    },
    PUT: {
      status: 200,
      json: { ...book, rating: 3 },
    },
  },
};

const getPathname = (route: Route) => {
  return new URL(route.request().url()).pathname;
};

export const getOption = (route: Route) => ({
  ...commonOptions,
  ...options[getPathname(route)][route.request().method()],
});
