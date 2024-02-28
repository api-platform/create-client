"use client";

import type { Metadata } from "next";
import { useQuery } from "react-query";

import { Form } from "../../../../components/{{{lc}}}/Form";
import { {{{ucf}}} } from "../../../../types/{{{ucf}}}";
import { customFetch, FetchResponse } from "../../../../utils/dataAccess";


const get{{{ucf}}} = async (id: string|string[]|undefined) => id ? await customFetch<{{{ucf}}}>(`/{{{name}}}/${id}`) : Promise.resolve(undefined);

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const { data: { data: {{lc}} } = {} } = useQuery<FetchResponse<{{{ucf}}}> | undefined>(['{{{lc}}}', id], () => get{{{ucf}}}(id));

  if (!{{{lc}}}) {
    return null;
  }

  return (
    <div>
      <title>{`Edit {{{ucf}}} ${ {{{lc}}}["@id"]}`}</title>
      <Form {{{lc}}}={ {{{lc}}} } />
    </div>
  );
};
