import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Show } from "../../../components/{{{lc}}}/Show";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch } from "../../../utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import { useMercure } from "../../../utils/mercure";

interface Props {
  {{{snc}}}: {{{ucf}}};
  hubURL: null | string;
};

const Page: NextComponentType<NextPageContext, Props, Props> = (props) => {
  const {{{snc}}} = props.hubURL === null ? props.{{{snc}}} : useMercure(props.{{{snc}}}, props.hubURL);

  if (!{{{snc}}}) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show {{{ucf}}} ${ {{~snc}}['@id'] }`}</title>
        </Head>
      </div>
      <Show {{{snc}}}={ {{{snc}}} } text={ props.text } />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`/{{{name}}}/${params.id}`);

  return {
    props: {
      {{{snc}}}: response.data,
      text: response.text,
      hubURL: response.hubURL,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch("/{{{name}}}");
  } catch (e) {
    console.error(e);

    return {
      paths: [],
      fallback: true,
    };
  }

  const view = response.data['{{{hydraPrefix}}}view'];
  const paths = response.data["{{{hydraPrefix}}}member"].map(({{{snc}}}) => `${ {{~snc}}['@id'] }`);

  if (view) {
    try {
      const {
        '{{{hydraPrefix}}}last': last
      } = view;
      for (let page = 2; page <= parseInt(last.replace(/^\/{{{name}}}\?page=(\d+)/, '$1')); page++) {
        paths.concat(
          await fetch(`/{{{name}}}?page=${page}`).data["{{{hydraPrefix}}}member"].map(({{{snc}}}) => `${ {{~snc}}['@id'] }`)
      );
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    paths,
    fallback: true,
  };
}

export default Page;
