import { HttpResponse } from "msw";

import books from "../fixtures/get-books.json";
import reviews from "../fixtures/get-reviews.json";

const resources: { books: Books; reviews: Reviews } = {
  books,
  reviews,
};

export type Books = typeof books;
export type Book = Books["hydra:member"][number] & { "@context"?: string };
export type ItemIdParam = { itemId: string };

export type Reviews = typeof reviews;
export type Review = Reviews["hydra:member"][number] & { "@context"?: string };
export type Resources = Books | Reviews;
export type Item = Book | Review;

export const getNotFoundResponse = () =>
  new HttpResponse(
    JSON.stringify({
      "@id": "/errors/404",
      "@type": "hydra:Error",
      title: "An error occurred",
      detail: "Not Found",
      status: 404,
      type: "/errors/404",
      "hydra:title": "An error occurred",
      "hydra:description": "Not Found",
    }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/problem+json;",
      },
    }
  );

export const upperFirst = <S extends string>(str: S): Capitalize<S> => {
  return (str ? str[0].toUpperCase() + str.slice(1) : "") as Capitalize<S>;
};

export const getId = <T extends CollectionResponse>(
  params: ItemIdParam,
  list: T
) => `${list["@id"]}/${params.itemId}`;

interface CollectionResponse {
  "@context": string;
  "@id": string;
  // "@type": string;
  "hydra:member": { "@id": string; [key: string]: unknown }[];
  // "hydra:totalItems": number;
  // "hydra:view"?: {
  //   "@id": string;
  //   "@type": string;
  //   "hydra:first": string;
  //   "hydra:last": string;
  //   "hydra:next": string | null;
  // };
  // "hydra:search": {
  //   "@type": string;
  //   "hydra:template": string;
  //   "hydra:variableRepresentation": string;
  //   "hydra:mapping": {
  //     "@type": string;
  //     variable: string;
  //     property: string;
  //     required: boolean;
  //   }[];
  // };
}

export const findById = <T extends CollectionResponse>(
  list: T,
  id: string
): T["hydra:member"][number] | undefined => {
  return list["hydra:member"].find((item) => item["@id"] === id);
};

export const findIndexById = (list: CollectionResponse, id: string): number => {
  return list["hydra:member"].findIndex((item) => item["@id"] === id);
};

export const deleteById = <T extends CollectionResponse>(
  list: T,
  id: string
): T => {
  const index = findIndexById(list, id);
  list["hydra:member"].splice(index, 1);
  return list;
};

export const withContext = <
  T extends CollectionResponse["hydra:member"][number],
>(
  item: T,
  name: string
): T & { "@context": string } => ({
  ...item,
  "@context": `/contexts/${upperFirst(name)}`,
});

export const updateById = <
  U extends CollectionResponse["hydra:member"][number],
>(
  list: CollectionResponse,
  id: string,
  data: U,
  name: string
): U => {
  const index = findIndexById(list, id);
  list["hydra:member"][index] = data;
  const dataWithContext = withContext(data, name);
  return dataWithContext;
};

export const getResourceName = (request: Request, params?: ItemIdParam) => {
  const url = new URL(request.url);
  const pathIndex = params?.itemId ? 2 : -1;
  const resourceName = url.pathname.split("/").at(pathIndex)?.split("?")[0];

  return resourceName;
};

export const getResource = (request: Request, params?: ItemIdParam) => {
  const resourceName = getResourceName(request, params);
  return {
    resource: resources[resourceName as keyof typeof resources],
    name: resourceName,
  };
};

export const limit = <T extends CollectionResponse>(
  resource: T,
  limit: number = 10
): T => {
  return {
    ...resource,
    "hydra:member": resource["hydra:member"].slice(0, limit),
  };
};
