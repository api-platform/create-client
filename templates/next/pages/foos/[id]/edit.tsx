import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Form } from "../../../components/{{{lc}}}/Form";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch } from "../../../utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";

interface Props {
  {{{snc}}}: {{{ucf}}};
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{snc}}} }) => {
  if (!{{{snc}}}) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{ {{{snc}}} && `Edit {{{ucf}}} ${ {{~snc}}['@id'] }` }</title>
        </Head>
      </div>
      <Form {{{snc}}}={ {{{snc}}} } />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      {{{snc}}}: await fetch(`/{{{name}}}/${params.id}`),
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
  const paths = response.data["{{{hydraPrefix}}}member"].map(({{{snc}}}) => `${ {{~snc}}['@id'] }/edit`);

  if (view) {
    try {
      const {
        '{{{hydraPrefix}}}last': last
      } = view;
      for (let page = 2; page <= parseInt(last.replace(/^\/{{{name}}}\?page=(\d+)/, '$1')); page++) {
        paths.concat(
          await fetch(`/{{{name}}}?page=${page}`).data["{{{hydraPrefix}}}member"].map(({{{snc}}}) => `${ {{~snc}}['@id'] }/edit`)
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
