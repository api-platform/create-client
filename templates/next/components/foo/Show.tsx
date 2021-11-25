import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import { fetch } from "../{{{pathNesting}}}utils/dataAccess";
import ReferenceLinks from '{{{pathNesting}}}common/ReferenceLinks';
import { {{{camelNameUcf}}} } from '../{{{pathNesting}}}types/{{{camelNameUcf}}}';
import Head from 'next/head'

interface Props {
  {{{camelName}}}: {{{camelNameUcf}}};
  text: string;
}

export const Show: FunctionComponent<Props> = ({ {{{camelName}}}, text }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch({{{camelName}}}["@id"], { method: "DELETE" });
      router.push("/{{{name}}}");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
       <Head>
            <title>{`Show {{{ucf}}} ${ {{~camelName}}['@id']}`}</title>
            <script
                type="application/ld+json"
            >
              {text}
            </script>
          </Head>
      <h1>{`Show {{{ucf}}} ${ {{~camelName}}['@id']}`}</h1>
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
            <td>{{#if reference}}<ReferenceLinks items={ {{{../camelName}}}['{{{name}}}'] } type="{{{reference.title}}}" />{{else}}{ {{{../camelName}}}['{{{name}}}'] }{{/if}}</td>
          </tr>
        {{/each}}
        </tbody>
      </table>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Link href="/{{{name}}}">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link  href={`${ {{~camelName}}["@id"]}/edit`}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        <a>Delete</a>
      </button>
    </div>
  );
};
