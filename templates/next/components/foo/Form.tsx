import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { fetch } from "../../utils/dataAccess";
import { {{{ucf}}} } from '../../types/{{{ucf}}}';

interface Props {
  {{{lc}}}?: {{{ucf}}};
}

export const Form: FunctionComponent<Props> = ({ {{{lc}}} }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch({{{lc}}}['@id'], { method: "DELETE" });
      router.push("/{{{name}}}");
    } catch (error) {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    }
	};

  const renderForm

	return (
		<div>
      <h1>{ {{{lc}}} ? `Edit {{{ucf}}} ${ {{~lc}}['@id']}` : `Create {{{ucf}}}` }</h1>
      <Formik
        initialValues={ {{~lc}} ? {...{{lc~}} } : new {{{ucf}}}()}
        validate={(values) => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
            try {
              await fetch(isCreation ? "/{{{name}}}" : values["@id"], {
                method: isCreation ? "POST" : "PUT",
                body: JSON.stringify(values),
              });
              setStatus({
                isValid: true,
                msg: `Element ${isCreation ? 'created': 'updated'}.`,
              });
              router.push("/{{{name}}}");
          } catch (error) {
            setStatus({
              isValid: false,
              msg: `${error.defaultErrorMsg}`,
            });
            setErrors(error.fields);
          }
          setSubmitting(false);
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          let inputClassName = 'form-control';
          const isInvalid = touched[name] && !!errors[name];
          if (isInvalid) {
            validationClassNames += ' is-invalid';
          }

          if (touched[name] && !errors[name]) {
            validationClassNames += ' is-valid';
          }

          return (
            <form onSubmit={handleSubmit}>
            {{#each formFields}}
              <div className="form-group">
                <label className="form-control-label" htmlFor="{{lc}}_{{name}}">{{name}}</label>
                <input
                  name="{{name}}"
                  id="{{lc}}_{{name}}"
                  value={ values.{{name}} ?? "" }
                  type="{{type}}"
                  {{#if step}}step="{{{step}}}"{{/if}}
                  placeholder="{{{description}}}"
                  {{#if required}}required={true}{{/if}}
                  className={inputClassName}
                  aria-invalid={isInvalid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="invalid-feedback"
                  component="div"
                  name="{{name}}"
                />
              </div>
              {{/each}}

              {status && status.msg && (
                <div
                  className={`alert ${
                    status.isValid ? "alert-success" : "alert-danger"
                  }`}
                  role="alert"
                >
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </form>
          );
        }}
      </Formik>
      <Link href="/{{{name}}}">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      { {{{lc}}} && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
