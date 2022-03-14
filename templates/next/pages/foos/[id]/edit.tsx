import { GetStaticPaths, GetStaticProps, NextComponentType, NextPageContext } from "next";
import { Form } from "../../../components/{{{lc}}}/Form";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { fetch } from "../../../utils/dataAccess";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import { getPathsFromHydraResponse } from "../../../utils/helpers";

interface Props {
  {{{lc}}}: {{{ucf}}};
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ {{{lc}}} }) => {
  if (!{{{lc}}}) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{ {{{lc}}} && `Edit {{{ucf}}} ${ {{~lc}}['@id'] }` }</title>
        </Head>
      </div>
      <Form {{{lc}}}={ {{{lc}}} } />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`/{{{name}}}/${params.id}`);

  return {
    props: {
      {{{lc}}}: response.data,
    },
    revalidate: 1,
  };
}


export const getStaticPaths: GetStaticPaths = async() => {
  const response = await fetch("/{{{name}}}");
  const paths= await getPathsFromHydraResponse(response,true);
  return {
      paths,
      fallback:true
  }

}

export default Page;
