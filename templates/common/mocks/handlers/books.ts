import type { PathParams } from "msw";
import { http, HttpResponse } from "msw";
import books from "../fixtures/get-books.json";
import type { Book, Books } from "./utils";
import {
  deleteById,
  findById,
  getId,
  getNotFoundResponse,
  limit,
  updateById,
  upperFirst,
} from "./utils";

const BASE_URL = "https://demo.api-platform.com/admin/books";

type BaseURL = typeof BASE_URL;
type ItemIdParam = { itemId: string };

export const booksHandlers = [
  http.get<ItemIdParam, undefined>(`${BASE_URL}/:itemId`, ({ params }) => {
    const bookId = `${books["@id"]}/${params.itemId}`;
    const item = findById(books, bookId);

    if (!item) return getNotFoundResponse();

    return HttpResponse.json({
      "@context": `/contexts/${upperFirst("Book")}`,
      ...item,
    });
  }),

  http.delete<ItemIdParam, undefined, undefined, `${BaseURL}/:itemId`>(
    `${BASE_URL}/:itemId`,
    ({ params }) => {
      const bookId = getId(params, books);
      deleteById(books, bookId);
      return HttpResponse.json(undefined, { status: 204 });
    }
  ),

  http.put<ItemIdParam, Book, Book, `${BaseURL}/:itemId`>(
    `${BASE_URL}/:itemId`,
    async ({ request, params }) => {
      const bookId = `${books["@id"]}/${params.itemId}`;
      const requestBody = await request.json();

      const updatedBook = updateById(books, bookId, requestBody, "books");
      return HttpResponse.json(updatedBook);
    }
  ),

  http.get<PathParams, undefined, Books, BaseURL>(BASE_URL, () => {
    return HttpResponse.json(limit(books));
  }),
];
