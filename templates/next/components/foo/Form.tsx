import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Formik } from "formik";
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
      setError("Error when deleting the resource.");
      console.error(error);
    }
	};

	return (
		<div>
			{ {{{lc}}} ? <h1>Edit {{{ucf}}} { {{{lc}}}['@id'] }</h1> : <h1>Create {{{ucf}}}</h1>}
			<Formik
				initialValues={ {{~lc}} ? {...{{lc~}} } : new {{{ucf}}}()}
				validate={(values) => {
					const errors = {};
					// add your validation logic here
          return errors;
				}}
				onSubmit={async (values, { setSubmitting, setStatus }) => {
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
              msg: `Error when ${isCreation ? 'creating': 'updating'} the resource.`,
            });
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
				}) => (
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
                className={`form-control${errors.{{name}} && touched.{{name}} ? ' is-invalid' : ''}`}
                aria-invalid={errors.{{name}} && touched.{{name~}} }
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</div>
						{ errors.{{name}} && touched.{{name}} && <div className="invalid-feedback">{ errors.{{name}} }</div> }
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

						{error && (
							<div className="alert alert-danger" role="alert">
								{error}
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
