import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Form } from "../../{{{pathNesting}}}components/{{{lc}}}/Form";
import { {{{camelNameUcf}}} } from "../../{{{pathNesting}}}types/{{{camelNameUcf}}}";
import { fetch } from "../../{{{pathNesting}}}utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";

interface Props {
  {{{camelName}}}: {{{camelNameUcf}}};
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{camelName}}} }) => {
  if (!{{{camelName}}}) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{ {{{camelName}}} && `Edit {{{ucf}}} ${ {{~camelName}}['@id'] }` }</title>
        </Head>
      </div>
      <Form {{{camelName}}}={ {{{camelName}}} } />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      {{{camelName}}}: await fetch(`/{{{name}}}/${params.id}`),
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch("/{{{name}}}");

    const view = response.data['{{{hydraPrefix}}}view'];
    const paths = response.data["{{{hydraPrefix}}}member"].map(({{{camelName}}}) => `${ {{~camelName}}['@id'] }/edit`);

    if (view) {
      try {
        const {
          '{{{hydraPrefix}}}last': last
        } = view;
        for (let page = 2; page <= parseInt(last.replace(/^\/{{replace name "/" "\/"}}\?page=(\d+)/, '$1')); page++) {
          paths.concat(
            await fetch(`/{{{name}}}?page=${page}`).data["{{{hydraPrefix}}}member"].map(({{{camelName}}}) => `${ {{~camelName}}['@id'] }/edit`)
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
