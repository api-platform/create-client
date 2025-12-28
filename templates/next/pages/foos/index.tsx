import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";

import { PageList, get{{{ucf}}}s, get{{{ucf}}}sPath } from "../../components/{{{lc}}}/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({queryKey: [get{{{ucf}}}sPath()], queryFn: get{{{ucf}}}s()});

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
