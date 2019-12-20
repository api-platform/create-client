import { Link, Navigate } from "react-router-dom";
import { useCreate } from "../../hooks";
import Form from "./Form";
import { TError } from "../../utils/types";
import TResource from "./type";

interface CreateProps {
  created: TResource | null;
  create: (item: Partial<TResource>) => any;
  error: TError;
  reset: () => void;
  loading: boolean;
}

const CreateView = ({create, created, error, reset, loading}: CreateProps) => {
  if (created) {
    return (
      <Navigate
        to={`/{{lc}}s/edit/${encodeURIComponent(created["@id"])}`}
        replace
      />
    );
  }

  return (
    <div>
      <h1>Create {{{title}}}</h1>

      {loading && (
        <div className="alert alert-info" role="status">
            Loading...
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          <span className="fa fa-exclamation-triangle" aria-hidden="true"/>{" "}
          {error.message}
        </div>
      )}

      <Form onSubmit={create} error={error} reset={reset}/>
      <Link to="/{{lc}}s/" className="btn btn-primary">
          Back to list
      </Link>
    </div>
  );
}

const Create = () => {
  const {created, loading, error, reset, create} = useCreate<TResource>({"@id": "{{{name}}}"});

  return (
    <CreateView
      created={created}
      loading={loading}
      error={error}
      reset={reset}
      create={create}
    />
  );
}

export default Create;
