import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage{{#if hasManyRelations}}, Field, FieldArray{{/if}}, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { {{{ucf}}} } from '../../types/{{{ucf}}}';

interface Props {
  {{{lc}}}?: {{{ucf}}};
}

interface SaveParams {
  values: {{{ucf}}};
}

interface DeleteParams {
  id: string;
}

const save{{{ucf}}} = async ({ values }: SaveParams) =>
  await fetch<{{ucf}}>(!values["@id"] ? "/{{{name}}}" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const delete{{{ucf}}} = async (id: string) => await fetch<{{ucf}}>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ {{{lc}}} }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<FetchResponse<{{ucf}}> | undefined, Error|FetchError, SaveParams>((saveParams) => save{{{ucf}}}(saveParams));

  const deleteMutation = useMutation<FetchResponse<{{ucf}}> | undefined, Error|FetchError, DeleteParams>(({ id }) => delete{{{ucf}}}(id), {
    onSuccess: () => {
      router.push("/{{{lc}}}s");
    },
    onError: (error)=> {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    }
  });

	const handleDelete = () => {
    if (!{{lc}} || !{{lc}}["@id"]) return;
		if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: {{lc}}["@id"] });
	};

	return (
    <div>
      <h1>{ {{{lc}}} ? `Edit {{{ucf}}} ${ {{~lc}}['@id']}` : `Create {{{ucf}}}` }</h1>
      <Formik
        initialValues={
          {{lc}} ?
          {
            ...{{lc}},
            {{#each fields}}
              {{#if isEmbeddeds}}
                {{name}}: {{../lc}}["{{name}}"]?.map((emb: any) => emb['@id']) ?? [],
              {{else if embedded}}
                {{name}}: {{../lc}}["{{name}}"]?.['@id'] ?? "",
              {{/if}}
            {{/each}}
          } :
          new {{{ucf}}}()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/{{{name}}}");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: ()=> {
                setSubmitting(false);
              }
            }
          );
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
        }) => (
          <form onSubmit={handleSubmit}>
          {{#each formFields}}
            <div className="form-group">
              {{#if isRelations}}
                <div className="form-control-label">{{name}}</div>
                <FieldArray
                  name="{{name}}"
                  render={(arrayHelpers) => (
                    <div id="{{../lc}}_{{name}}">
                      {values.{{name}} && values.{{name}}.length > 0 ? (
                        values.{{name}}.map((item: any, index: number) => (
                          <div key={index}>
                            <Field name={`{{name}}.${index}`} />
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.insert(index, '')}
                            >
                              +
                            </button>
                          </div>
                        ))
                      ) : (
                        <button type="button" onClick={() => arrayHelpers.push('')}>
                          Add
                        </button>
                      )}
                    </div>
                  )}
                />
              {{else}}
                <label className="form-control-label" htmlFor="{{../lc}}_{{name}}">{{name}}</label>
                <input
                  name="{{name}}"
                  id="{{../lc}}_{{name}}"
                  {{#compare type "==" "dateTime" }}
                  value={values.{{name}}?.toLocaleString() ?? ""}
                  {{/compare}}
                  {{#compare type "!=" "dateTime" }}
                  value={values.{{name}} ?? ""}
                  {{/compare}}
                  type="{{type}}"
                  {{#if step}}step="{{{step}}}"{{/if}}
                  placeholder="{{{description}}}"
                  {{#if required}}required={true}{{/if}}
                  className={`form-control${errors.{{name}} && touched.{{name}} ? ' is-invalid' : ''}`}
                  aria-invalid={errors.{{name}} && touched.{{name~}} ? 'true' : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="invalid-feedback"
                  component="div"
                  name="{{name}}"
                />
              {{/if}}
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
        )}
      </Formik>
      <Link href="/{{{lc}}}s">
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
