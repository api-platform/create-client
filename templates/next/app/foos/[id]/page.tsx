"use client";

import type { Metadata } from "next";
import { useQuery } from "react-query";

import { Show } from "../../../components/{{{lc}}}/Show";
import { {{{ucf}}} } from "../../../types/{{{ucf}}}";
import { customFetch, FetchResponse } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

export const metadata: Metadata = {
  title: "Show {{{ucf}}}",
};

const get{{{ucf}}} = async (id: string|string[]|undefined) => id ? await customFetch<{{{ucf}}}>(`/{{{name}}}/${id}`) : Promise.resolve(undefined);

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;


  const { data: { data: {{lc}}, hubURL } = { hubURL: null, text: '' } } =
    useQuery<FetchResponse<{{{ucf}}}> | undefined>(['{{{lc}}}', id], () => get{{{ucf}}}(id));
  const {{{lc}}}Data = useMercure({{lc}}, hubURL);

  if (!{{{lc}}}Data) {
    return null;
  }

  return (
    <div>
      <Show {{{lc}}}={ {{{lc}}}Data } />
    </div>
  );
};