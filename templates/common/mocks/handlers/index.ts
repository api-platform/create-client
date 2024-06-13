import { passthrough, http } from "msw";
import { booksHandlers } from "./books";
import { reviewsHandlers } from "./reviews";

const pathsToPassThrough = [
  "favicon.ico",
  "src",
  "node_modules",
  "@id",
  "fonts.gstatic.com",
  "chrome-extension",
  "cdn.vuetifyjs.com",
].join("|");

export const handlers = [
  http.get(new RegExp(`(${pathsToPassThrough})`), passthrough),
  ...booksHandlers,
  ...reviewsHandlers,
];
