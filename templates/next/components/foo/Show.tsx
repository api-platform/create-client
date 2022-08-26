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
    <div>
      <Head>
        <title>{`Show {{{ucf}}} ${ {{~lc}}['@id']}`}</title>
        <script type="application/ld+json" dangerouslySetInnerHTML={ { __html: text } } />
      </Head>
      <h1>{`Show {{{ucf}}} ${ {{~lc}}['@id']}`}</h1>
      <table className="table table-responsive table-striped table-hover">
        <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        {{#each fields}}
          <tr>
            <th scope="row">{{name}}</th>
            <td>
            {{#if reference}}
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
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Link href="/{{{lc}}}s">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath({{{lc}}}["@id"], '/{{{lc}}}s/[id]/edit')}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
