import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import { Show } from "../../../components/{{{lc}}}/Show";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

interface Props {
  {{{lc}}}: {{{ucf}}};
  hubURL: null | string;
  text: string;
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{lc}}}, hubURL, text }) => {
  const {{{lc}}}Data = useMercure({{{lc}}}, hubURL);

  if (!{{{lc}}}Data) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show {{{ucf}}} ${ {{~lc}}['@id'] }`}</title>
        </Head>
      </div>
      <Show {{{lc}}}={ {{{lc}}}Data } text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`/{{{name}}}/${params.id}`);

  return {
    props: {
      {{{lc}}}: response.data,
      text: response.text,
      hubURL: response.hubURL,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("/{{{name}}}");
  const paths = await getPaths(response, "{{{name}}}", false);

  return {
    paths,
    fallback: true,
  };
}

export default Page;
