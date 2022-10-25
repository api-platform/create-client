import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

{{#if hasRelations}}import ReferenceLinks from "../common/ReferenceLinks";{{/if}}
import { fetch, getPath } from "../../utils/dataAccess";
import { {{{ucf}}} } from "../../types/{{{ucf}}}";

interface Props {
  {{{lc}}}: {{{ucf}}};
  text: string;
}

export const Show: FunctionComponent<Props> = ({ {{{lc}}}, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!{{lc}}["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch({{{lc}}}["@id"], { method: "DELETE" });
      router.push("/{{{lc}}}s");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <Head>
        <title>{`Show {{{ucf}}} ${ {{~lc}}['@id']}`}</title>
        <script type="application/ld+json" dangerouslySetInnerHTML={ { __html: text } } />
      </Head>
       <Link href="/{{{lc}}}s">
        <a className="text-sm text-cyan-500 font-bold hover:text-cyan-700">
          {`< Back to list`}
        </a>
      </Link>
      <h1 className="text-3xl mb-2">{`Show {{{ucf}}} ${ {{~lc}}['@id']}`}</h1>
     <table cellPadding={10} className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3">
        <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
        </thead>
         <tbody className="text-sm divide-y divide-gray-200">
        {{#each fields}}
          <tr>
            <th scope="row">{{name}}</th>
            <td>
              {{#if isReferences}}
                <ReferenceLinks items={ {{{../lc}}}['{{{name}}}'].map((ref: any) => ({ href: getPath(ref, '/{{{lowercase reference.title}}}s/[id]'), name: ref })) } />
              {{else if reference}}
                <ReferenceLinks items={ { href: getPath({{{../lc}}}['{{{name}}}'], '/{{{lowercase reference.title}}}s/[id]'), name: {{{../lc}}}['{{{name}}}'] } } />
              {{else if isEmbeddeds}}
                <ReferenceLinks items={ {{{../lc}}}['{{{name}}}'].map((emb: any) => ({ href: getPath(emb['@id'], '/{{{lowercase embedded.title}}}s/[id]'), name: emb['@id'] })) } />
              {{else if embedded}}
                <ReferenceLinks items={ { href: getPath({{{../lc}}}['{{{name}}}']['@id'], '/{{{lowercase embedded.title}}}s/[id]'), name: {{{../lc}}}['{{{name}}}']['@id'] } } />
              {{else if (compare type "==" "Date") }}
                { {{{../lc}}}['{{{name}}}']?.toLocaleString() }
              {{else}}
                { {{{../lc}}}['{{{name}}}'] }
              {{/if}}
            </td>
          </tr>
        {{/each}}
        </tbody>
      </table>
      {error && (
        <div className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100" role="alert">
          {error}
        </div>
      )}
       <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link href={getPath({{{lc}}}["@id"], '/{{{lc}}}s/[id]/edit')}>
          <a className="inline-block mt-2 border-2 border-cyan-500 bg-cyan-500 hover:border-cyan-700 hover:bg-cyan-700 text-xs text-white font-bold py-2 px-4 rounded">
            Edit
          </a>
        </Link>
        <button
          className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-xs text-red-400 font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
       </div>
    </div>
  );
};
