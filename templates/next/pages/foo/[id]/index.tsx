import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Show } from "../../{{{pathNesting}}}components/{{{path}}}/Show";
import { {{{camelNameUcf}}} } from "../../{{{pathNesting}}}types/{{{camelNameUcf}}}";
import { fetch } from "../../{{{pathNesting}}}utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import { useMercure } from "../../{{{pathNesting}}}utils/mercure";

interface Props {
  {{{camelName}}}: {{{camelNameUcf}}};
  hubURL: null | string;
  text: string;
};

const Page: NextComponentType<NextPageContext, Props, Props> = (props) => {
  const {{{camelName}}} = props.hubURL === null ? props.{{{camelName}}} : useMercure(props.{{{camelName}}}, props.hubURL);

  if (!{{{camelName}}}) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show {{{ucf}}} ${ {{~camelName}}['@id'] }`}</title>
        </Head>
      </div>
      <Show {{{camelName}}}={ {{{camelName}}} } text={ props.text } />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`/{{{name}}}/${params.id}`);

  return {
    props: {
      {{{camelName}}}: response.data,
      text: response.text,
      hubURL: response.hubURL,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch("/{{{name}}}");

    const view = response.data['{{{hydraPrefix}}}view'];
    const paths = response.data["{{{hydraPrefix}}}member"].map(({{{camelName}}}) => `${ {{~camelName}}['@id'] }`);

    if (view) {
      try {
        const {
          '{{{hydraPrefix}}}last': last
        } = view;
        for (let page = 2; page <= parseInt(last.replace(/^\/{{replace name "/" "\/"}}\?page=(\d+)/, '$1')); page++) {
          paths.concat(
            await fetch(`/{{{name}}}?page=${page}`).data["{{{hydraPrefix}}}member"].map(({{{camelName}}}) => `${ {{~camelName}}['@id'] }`)
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
  } catch (e) {
    console.error(e);

    return {
      paths: [],
      fallback: true,
    };
  }
}

export default Page;
