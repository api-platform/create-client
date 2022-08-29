import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/{{{lc}}}/List";
import { PagedCollection } from "../../types/collection";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const get{{{ucf}}}s = async () => await fetch<PagedCollection<{{{ucf}}}>>('/{{{name}}}');

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: {{lc}}s, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<{{{ucf}}}>> | undefined>('{{{name}}}', get{{{ucf}}}s);
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
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery('{{{name}}}', get{{{ucf}}}s);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Page;
