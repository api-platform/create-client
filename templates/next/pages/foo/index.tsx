import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import { List } from "../{{{pathNesting}}}components/{{{path}}}/List";
import { PagedCollection } from "../{{{pathNesting}}}types/Collection";
import { {{{camelNameUcf}}} } from "../{{{pathNesting}}}types/{{{camelNameUcf}}}";
import { fetch } from "../{{{pathNesting}}}utils/dataAccess";
import Head from "next/head";
import Pagination from "../{{{pathNesting}}}components/common/Pagination";
import { useMercure } from "../{{{pathNesting}}}utils/mercure";

interface Props {
  collection: PagedCollection<{{{camelNameUcf}}}>;
  hubURL: string;
}

const Page: NextComponentType<NextPageContext, Props, Props> = (props) => {
  const collection = useMercure(props.collection, props.hubURL);

  return (
    <div>
      <div>
        <Head>
          <title>{{{ucf}}} List</title>
        </Head>
      </div>
      <List {{{camelName}}}={collection["{{{hydraPrefix}}}member"]} />
      <Pagination collection={collection} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('/{{{name}}}');

  return {
    props: {
      collection: response.data,
      hubURL: response.hubURL,
    },
  }
}

export default Page;
