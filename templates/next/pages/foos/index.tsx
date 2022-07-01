import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { List } from "../../components/{{{lc}}}/List";
import { PagedCollection } from "../../types/collection";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";
import { fetch } from "../../utils/dataAccess";
import Pagination from "../../components/common/Pagination";
import { useMercure } from "../../utils/mercure";

interface Props {
  collection: PagedCollection<{{{ucf}}}>;
  hubURL: string | null;
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
      <List {{{name}}}={collection["{{{hydraPrefix}}}member"]} />
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
