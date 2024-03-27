import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, get{{{ucf}}}s, get{{{ucf}}}sPath } from "../../../components/{{{lc}}}/PageList";
import { PagedCollection } from "../../../types/collection";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetchApi, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({ params: { page } = {} }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(get{{{ucf}}}sPath(page), get{{{ucf}}}s(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetchApi<PagedCollection<{{{ucf}}}>>("/{{{name}}}");
  const paths = await getCollectionPaths(response, "{{{name}}}", "/{{{lc}}}s/page/[page]");

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
