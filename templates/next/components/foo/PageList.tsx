"use client";

import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";
import { customFetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const get{{{ucf}}}sPath = (page?: string | string[] | undefined) => `/{{{name}}}${typeof page === 'string' ? `?page=${page}` : ''}`;
export const get{{{ucf}}}s = (page?: string | string[] | undefined) => async () => await customFetch<PagedCollection<{{{ucf}}}>>(get{{{ucf}}}sPath(page));
const getPagePath = (path: string) => `/{{{lc}}}s/page/${parsePage("{{{name}}}", path)}`;

type Props = {
  params: { page: string };
};

export default function PageList({ params }: Props) {
  const { page } = params;
  const { data: { data: {{lc}}s, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<{{{ucf}}}>> | undefined>(get{{{ucf}}}sPath(page), get{{{ucf}}}s(page));
  const collection = useMercure({{lc}}s, hubURL);

  if (!collection || !collection["{{{hydraPrefix}}}member"]) return null;

  return (
    <div>
      <List {{{lc}}}s={collection["{{{hydraPrefix}}}member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
