import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Show } from "../../../components/{{{lc}}}/Show";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch } from "../../../utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import { useMercure } from "../../../utils/mercure";

interface Props {
  {{{lc}}}: {{{ucf}}};
  hubURL: string;
};

const Page: NextComponentType<NextPageContext, Props, Props> = (props) => {
  const {{{lc}}} = useMercure(props.{{{lc}}}, props.hubURL);

  if (!{{{lc}}}) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show {{{ucf}}} ${ {{~lc}}['@id'] }`}</title>
        </Head>
      </div>
      <Show {{{lc}}}={ {{{lc}}} } />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`/{{{name}}}/${params.id}`);

  return {
    props: {
      {{{lc}}}: response.data,
      hubURL: response.hubURL,
    },
    revalidate: 1,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch("/{{{name}}}");

    return {
      paths: response.data["{{{hydraPrefix}}}member"].map(({{{lc}}}) => {{~lc}}['@id']),
      fallback: true,
    };
  } catch (e) {
    console.error(e);
  }

  return {
    paths: [],
    fallback: true,
  };
}

export default Page;
