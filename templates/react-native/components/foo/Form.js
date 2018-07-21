import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {View} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';

class Form extends Component {
  renderField(data) {
    const hasError = data.meta.touched && !!data.meta.error;
    data.input.value = data.input.value.toString();
    return (
      <View>
        <FormLabel>{data.input.name}</FormLabel>
        <FormInput {...data.input}  step={data.step} required={data.required} placeholder={data.placeholder}
                   id={`book_${data.input.name}`}
                   multiline={true}
                   keyboardType = 'numeric'
        />
        {hasError && <FormValidationMessage>{data.meta.error}</FormValidationMessage>}
      </View>
    );
  }

  render() {
    return <View>
      {{#each formFields}}
      <Field component={this.renderField} name="{{{ name }}}" type="{{{ type }}}" placeholder="{{{ description }}}" {{#if required}}required={true}{{/if}} />
      {{/each}}
    </View>;
  }
}

export default reduxForm({form: 'book', enableReinitialize: true, keepDirtyOnReinitialize: true})(Form);

