import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Show } from "../../../components/{{{lc}}}/Show";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch } from "../../../utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import { useMercure } from "../../../utils/mercure";

interface Props {
  {{{lc}}}: {{{ucf}}};
  hubURL: null | string;
};

const Page: NextComponentType<NextPageContext, Props, Props> = (props) => {
  const {{{lc}}} = props.hubURL === null ? props.{{{lc}}} : useMercure(props.{{{lc}}}, props.hubURL);

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
  const paths = response.data["{{{hydraPrefix}}}member"].map(({{{lc}}}) => `${ {{~lc}}['@id'] }`);

  if (view) {
    try {
      const {
        '{{{hydraPrefix}}}last': last
      } = view;
      for (let page = 2; page <= parseInt(last.replace(/^\/{{{name}}}\?page=(\d+)/, '$1')); page++) {
        paths.concat(
          await fetch(`/{{{name}}}?page=${page}`).data["{{{hydraPrefix}}}member"].map(({{{lc}}}) => `${ {{~lc}}['@id'] }`)
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
