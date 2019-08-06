import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

function useRetrieve(id) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [retrieved, setRetrived] = useState();
 
  useEffect(() => {
    fetch(id)
    .then(response =>
      response
        .json()
        .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
    )
    .then(({ retrieved, hubURL }) => {
      retrieved = normalize(retrieved);

      setLoading(false);
      setRetrived(retrieved);

      // if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
    })
    .catch(e => {
      setLoading(false);
      setError(e.message);
    });

  }, [id])

  return [retrieved, error, loading];
}

const renderLinks = (type, items) => {
  if (Array.isArray(items)) {
    return items.map((item, i) => (
      <div key={i}>{renderLinks(type, item)}</div>
    ));
  }

  return (
    <Link to={`../../${type}/show/${encodeURIComponent(items)}`}>
      {items}
    </Link>
  );
};

function useDelete() {

  const [deleteError, setDeleteError] = useState();
  const [deleteLoading, setDeleteLoading] = useState();
  const [deleted, setDeleted] = useState();

  const deleteElement = (item) => {
    setDeleteLoading(true);
    fetch(item['@id'], { method: 'DELETE' })
      .then(() => {
        setDeleteLoading(false);
        setDeleted(item);
      })
      .catch(e => {
        setDeleteLoading(false);
        setDeleteError(e.message);
      });
    }
  
  return [deleteElement, deleted, deleteError, deleteLoading]
}



const Show = ({ match }) => {
  const [item, error, loading] = useRetrieve(match.params.id);
  const [deleteElement, deleted, deleteError, deleteLoading] = useDelete();

  const del = () => {
    if (window.confirm('Are you sure you want to delete this item?'))
      deleteElement(item);
  };

  return (
    deleted ? <Redirect to=".." /> : 
      <div>
        <h1>Show {item && item['@id']}</h1>

        {loading && (
          <div className="alert alert-info" role="status">
            Loading...
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {error}
          </div>
        )}
        {deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {deleteError}
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
                <td>{{#if reference}}{this.renderLinks('{{{reference.name}}}', item['{{{name}}}'])}{{else}}{item['{{{name}}}']}{{/if}}</td>
              </tr>
{{/each}}
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/{{{name}}}/edit/${encodeURIComponent(item['@id'])}`}>
            <button className="btn btn-warning">Edit</button>
          </Link>
        )}
        <button onClick={del} className="btn btn-danger">
          Delete
        </button>
      </div>
    )
}

export default Show;
