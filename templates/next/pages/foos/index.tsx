import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, get{{{ucf}}}s, get{{{ucf}}}sPath } from "../../components/{{{lc}}}/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(get{{{ucf}}}sPath(), get{{{ucf}}}s());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
