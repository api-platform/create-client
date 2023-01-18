import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/{{{lc}}}/Show";
import { PagedCollection } from "../../../types/collection";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const get{{{ucf}}} = async (id: string|string[]|undefined) => id ? await fetch<{{{ucf}}}>(`/{{{name}}}/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: {{lc}}, hubURL, text } = { hubURL: null, text: '' } } =
    useQuery<FetchResponse<{{{ucf}}}> | undefined>(['{{{lc}}}', id], () => get{{{ucf}}}(id));
  const {{{lc}}}Data = useMercure({{lc}}, hubURL);

  if (!{{{lc}}}Data) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show {{{ucf}}} ${ {{~lc}}Data['@id'] }`}</title>
        </Head>
      </div>
      <Show {{{lc}}}={ {{{lc}}}Data } text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params: { id } = {} }) => {
  if (!id) throw new Error('id not in query param');
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["{{{lc}}}", id], () => get{{{ucf}}}(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<{{{ucf}}}>>("/{{{name}}}");
  const paths = await getItemPaths(response, "{{{name}}}", '/{{{lc}}}s/[id]');

  return {
    paths,
    fallback: true,
  };
}

export default Page;
