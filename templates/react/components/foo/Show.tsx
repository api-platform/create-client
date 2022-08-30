import { Link, Navigate, useParams } from "react-router-dom";
{{#if hasRelations}}import Links from "../Links";{{/if}}
import { useRetrieve, useDelete } from "../../hooks";
import TResource from "./type";
import { TError } from "../../utils/types";

interface ShowProps {
  retrieved: TResource | null;
  loading: boolean;
  error: TError;
  deleteError: TError;
  deleted: TResource | null;
  del: (item: TResource) => any;
}

const ShowView = ({del, deleteError, deleted, error, loading, retrieved: item}: ShowProps) => {
  if (deleted) {
    return <Navigate to="/{{lc}}s/" replace />;
  }

  const delWithConfirm = () => {
    if (item && window.confirm("Are you sure you want to delete this item?")) {
      del(item);
    }
  };

  return (
    <div>
      <h1>Show {{{ucf}}} {item && item["@id"]}</h1>

      {loading && (
        <div className="alert alert-info" role="status">
          Loading...
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          <span className="fa fa-exclamation-triangle" aria-hidden="true" />{" "}
          {error.message}
        </div>
      )}
      {deleteError && (
        <div className="alert alert-danger" role="alert">
          <span className="fa fa-exclamation-triangle" aria-hidden="true" />{" "}
          {deleteError.message}
        </div>
      )}

      {item && (
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
                  {{#if isReferences}}
                    <Links items={ item['{{{name}}}'].map((ref: any) => ({ href: `/{{{reference.name}}}/show/${encodeURIComponent(ref)}`, name: ref })) } />
                  {{else if reference}}
                    <Links items={ { href: `/{{{reference.name}}}/show/${encodeURIComponent(item["{{{name}}}"])}`, name: item["{{{name}}}"] } }/>
                  {{else if isEmbeddeds}}
                    <Links items={item["{{{name}}}"].map((emb: any) => ({ href: `/{{{embedded.name}}}/show/${encodeURIComponent(emb["@id"])}`, name: emb["@id"] }))}/>
                  {{else if embedded}}
                    <Links items={ { href: `/{{{embedded.name}}}/show/${encodeURIComponent(item["{{{name}}}"]["@id"])}`, name: item["{{{name}}}"]["@id"] } }/>
                  {{else}}
                    {item['{{{name}}}']}retrieved
                  {{/if}}
                </td>
              </tr>
            {{/each}}
          </tbody>
        </table>
      )}
      <Link to="/{{lc}}s/" className="btn btn-primary">
        Back to list
      </Link>
      {item && (
        <Link to={`/{{{lc}}}s/edit/${encodeURIComponent(item["@id"])}`}>
          <button className="btn btn-warning">Edit</button>
        </Link>
      )}
      <button onClick={delWithConfirm} className="btn btn-danger">
        Delete
      </button>
    </div>
  );
}

const Show = () => {
  const { id } = useParams<{ id: string }>();
  const {retrieved, loading, error} = useRetrieve<TResource>(decodeURIComponent(id || ""));
  const {deleted, error: deleteError, del} = useDelete<TResource>();

  return (
    <ShowView
      retrieved={retrieved}
      loading={loading}
      error={error}
      deleteError={deleteError}
      deleted={deleted}
      del={del}
    />
  );
}

export default Show;
