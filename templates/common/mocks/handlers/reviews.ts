import type { PathParams } from "msw";
import { http, HttpResponse } from "msw";
import reviews from "../fixtures/get-reviews.json";
import type { Review, Reviews } from "./utils";
import {
  deleteById,
  findById,
  getId,
  getNotFoundResponse,
  limit,
  updateById,
  upperFirst,
} from "./utils";

const BASE_URL = "https://demo.api-platform.com/admin/reviews";

type BaseURL = typeof BASE_URL;
type ItemIdParam = { itemId: string };

export const reviewsHandlers = [
  http.get<ItemIdParam, undefined>(`${BASE_URL}/:itemId`, ({ params }) => {
    const bookId = `${reviews["@id"]}/${params.itemId}`;
    const item = findById(reviews, bookId);

    if (!item) return getNotFoundResponse();

    return HttpResponse.json({
      "@context": `/contexts/${upperFirst("Review")}`,
      ...item,
    });
  }),

  http.delete<ItemIdParam, undefined, undefined, `${BaseURL}/:itemId`>(
    `${BASE_URL}/:itemId`,
    ({ params }) => {
      const bookId = getId(params, reviews);
      deleteById(reviews, bookId);
      return HttpResponse.json(undefined, { status: 204 });
    }
  ),

  http.put<ItemIdParam, Review, Review, `${BaseURL}/:itemId`>(
    `${BASE_URL}/:itemId`,
    async ({ request, params }) => {
      const bookId = `${reviews["@id"]}/${params.itemId}`;
      const requestBody = await request.json();

      const updatedReview = updateById(reviews, bookId, requestBody, "reviews");
      return HttpResponse.json(updatedReview);
    }
  ),

  http.get<PathParams, undefined, Reviews, BaseURL>(BASE_URL, () => {
    return HttpResponse.json(limit(reviews));
  }),
];
