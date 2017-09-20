import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class Form extends Component {
  renderField(data) {
    const hasError = data.meta.touched && !!data.meta.error;
    if (hasError) {
      data.input['aria-describedby'] = `{{{ lc }}}_${data.input.name}_helpBlock`;
      data.input['aria-invalid'] = true;
    }

    return <div className={`form-group${hasError ? ' has-error' : ''}`}>
      <label htmlFor={`{{{ lc }}}_${data.input.name}`} className="control-label">{data.input.name}</label>
      <input {...data.input} type={data.type} step={data.step} required={data.required} placeholder={data.placeholder} id={`{{{ lc }}}_${data.input.name}`} className="form-control"/>
      {hasError && <span className="help-block" id={`{{{ lc }}}_${data.input.name}_helpBlock`}>{data.meta.error}</span>}
    </div>;
  }

  render() {
    const { handleSubmit } = this.props;

    return <form onSubmit={handleSubmit}>
{{#each formFields}}
      <Field component={this.renderField} name="{{{ name }}}" type="{{{ type }}}"{{#if step}} step="{{{ step }}}"{{/if}} placeholder="{{{ description }}}" {{#if required}}required={true}{{/if}}/>
{{/each}}

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>;
  }
}

export default reduxForm({form: '{{{ lc }}}', enableReinitialize: true, keepDirtyOnReinitialize: true})(Form);
