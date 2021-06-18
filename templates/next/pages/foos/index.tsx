import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import { List } from "../../components/{{{lc}}}/List";
import { PagedCollection } from "../../types/Collection";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";
import { fetch } from "../../utils/dataAccess";
import Head from "next/head";
import Pagination from "../../components/common/Pagination";

interface Props {
  collection: PagedCollection<{{{ucf}}}>;
};

const Page: NextComponentType<NextPageContext, Props, Props> = ({ collection }) => (
  <div>
    <div>
      <Head>
        <title>{{{ucf}}} List</title>
      </Head>
    </div>
    <List {{{name}}}={collection['{{{hydraPrefix}}}member']} />
    <Pagination collection={collection} />
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const collection = await fetch('/{{{name}}}');

  return {collection};
};

export default Page;
