import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import { List } from "../../components/{{{lc}}}/List";
import { PagedCollection } from "../../types/Collection";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";
import { fetch } from "../../utils/dataAccess";
import Head from "next/head";
import Pagination from "../../components/common/Pagination";
import { useMercure } from "../../utils/mercure";

interface Props {
  collection: PagedCollection<{{{ucf}}}>;
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
      <List {{{snc}}}={collection["{{{hydraPrefix}}}member"]} />
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
