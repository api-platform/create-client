import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";
import { fetchApi, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const get{{{ucf}}}sPath = (page?: string | string[] | undefined) => `/{{{name}}}${typeof page === 'string' ? `?page=${page}` : ''}`;
export const get{{{ucf}}}s = (page?: string | string[] | undefined) => async () => await fetchApi<PagedCollection<{{{ucf}}}>>(get{{{ucf}}}sPath(page));
const getPagePath = (path: string) => `/{{{lc}}}s/page/${parsePage("{{{name}}}", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const { query: { page } } = useRouter();
  const { data: { data: {{lc}}s, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<{{{ucf}}}>> | undefined>(get{{{ucf}}}sPath(page), get{{{ucf}}}s(page));
  const collection = useMercure({{lc}}s, hubURL);

  if (!collection || !collection["{{{hydraPrefix}}}member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>{{{ucf}}} List</title>
        </Head>
      </div>
      <List {{{lc}}}s={collection["{{{hydraPrefix}}}member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
