import { Link, useParams } from "react-router-dom";
import Links from "../Links";
import Pagination from "../Pagination";
import { useRetrieve } from "../../hooks";
import { PagedCollection } from "../../interfaces/Collection";
import TResource from "./type";
import { TError } from "../../utils/types";

interface ListProps {
  retrieved: PagedCollection<TResource> | null;
  loading: boolean;
  error: TError;
}

const ListView = ({error, loading, retrieved}: ListProps) => {
  const items = (retrieved && retrieved["hydra:member"]) || [];

  return (
    <div>
      <h1>{{{title}}} List</h1>

      {loading && (
        <div className="alert alert-info">Loading...</div>
      )}
      {error && (
        <div className="alert alert-danger">{error.message}</div>
      )}

      <p>
        <Link to="create" className="btn btn-primary">
          Create
        </Link>
      </p>

      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>id</th>
            {{#each fields}}
              <th>{{name}}</th>
            {{/each}}
            <th colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item["@id"]}>
              <th scope="row">
                <Links items={ { href: `show/${encodeURIComponent(item["@id"])}`, name: item["@id"] } } />
              </th>
              {{#each fields}}
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
                    {item['{{{name}}}']}
                  {{/if}}
                </td>
              {{/each}}
              <td>
                <Link to={`/{{lc}}s/show/${encodeURIComponent(item["@id"])}`}>
                  <span className="fa fa-search" aria-hidden="true" />
                  <span className="sr-only">Show</span>
                </Link>
              </td>
              <td>
                <Link to={`/{{lc}}s/edit/${encodeURIComponent(item["@id"])}`}>
                  <span className="fa fa-pencil" aria-hidden="true" />
                  <span className="sr-only">Edit</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination retrieved={retrieved}/>
    </div>
  );
}

const List = () => {
  const { page } = useParams<{ page?: string }>();
  const id = (page && decodeURIComponent(page)) || "{{{name}}}";

  const {retrieved, loading, error} = useRetrieve<PagedCollection<TResource>>(id);

  return (
    <ListView
      retrieved={retrieved}
      loading={loading}
      error={error}
    />
  );
}

export default List;
