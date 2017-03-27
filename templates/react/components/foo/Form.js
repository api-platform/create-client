import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class Form extends Component {
  render() {
    const { handleSubmit } = this.props;

    return <form onSubmit={handleSubmit}>

{{#each formFields}}
        <div className="form-group">
          <label htmlFor="{{{ name }}}">{{{ name }}}</label>
          <Field name="{{{ name }}}" component="input" type="{{{ type }}}"{{#if step}} step="{{{ step }}}"{{/if}} className="form-control" placeholder="{{{ name }}}"{{#if required}} required={true}{{/if}}/>
          <span className="help-block">{{{ description }}}</span>
        </div>
{{/each}}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>;
  }
}

export default reduxForm({form: '{{{ lc }}}', enableReinitialize: true, keepDirtyOnReinitialize: true})(Form);
