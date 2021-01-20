import { FunctionComponent, useState } from "react";
import { Formik } from "formik";
import { {{{ucf}}} } from '../../types/{{{ucf}}}';
import Link from "next/link";

interface Props {
  {{{lc}}}?: {{{ucf}}};
}

export const Form: FunctionComponent<Props> = ({ {{{lc}}} }) => {
	const [error, setError] = useState(null);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this item?")) {
			try {
				fetch({ {{{lc}}}['@id'] }, { method: "DELETE" });
			} catch (error) {
				setError("Error when deleting the resource.");
				console.error(error);
			}
		}
	};

	return (
		<div>
			{ {{{lc}}} ? <h1>Edit {{{lc}}}['@id']</h1> : <h1>Create</h1>}
			<Formik
				initialValues={ {{{lc}}} ?? new{{{lc}}}() }
				validate={(values) => {
					const errors = {};
					//set your validation logic here
          return errors;
				}}
				onSubmit={(values, { setSubmitting, setStatus }) => {
          const isCreation = !{{{lc}}}["@id"];
            try {
              fetch(isCreation ? "/{{{name}}}" : {{{lc}}}["@id"],
            {
            method: isCreation ? "POST" : "PATCH",
            body: JSON.stringify(values),
            }
           );
              setStatus({
              isValid: true,
              msg: `Element ${isCreation ? 'created': 'updated'}.`,
            });
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
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<form onSubmit={handleSubmit}>
{{#each fields}}
						<div className='form-group'>
							<label>{{name}}</label>
							<input
								className='form-control'
								type='text'
								name='isbn'
								onChange={handleChange}
								onBlur={handleBlur}
								value={ values.{{name}} }
								required
							/>
						</div>
						{/* {errors.{{name}} && touched.{{name}} && errors.{{name}} */}
{{/each}}
						{status && status.msg && (
							<div
								className={`alert ${
									status.isValid ? "alert-success" : "alert-danger"
								}`}
								role='alert'
							>
								{status.msg}
							</div>
						)}

						{error && (
							<div className='alert alert-danger' role='alert'>
								{error}
							</div>
						)}

						<button
							type='submit'
							className='btn btn-success'
							disabled={isSubmitting}
						>
							Submit
						</button>
					</form>
				)}
			</Formik>
			<Link href="/{{{name}}}">
				<a className='btn btn-primary'>Back to list</a>
			</Link>
			{ {{{lc}}} && (
				<button className='btn btn-danger' onClick={handleDelete}>
					<a>Delete</a>
				</button>
			)}
		</div>
	);
};
