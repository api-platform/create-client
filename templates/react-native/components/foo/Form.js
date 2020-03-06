import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';


class Form extends Component {

  renderField(data) {
    
    data.input.value = data.input.value.toString();
    
    let keyboard = data.type === "number" ? keyboard = "numeric" : keyboard = "default"
    
    return (
      <View>
        <Input
      labelStyle={ {color: 'gray', flex:1} }
      {...data.input}
      required={data.required}
      placeholder={data.placeholder}
      id={`{{{lc}}}_${data.input.name}`}
      label={data.input.name}
      multiline={true}
      errorMessage={data.meta.error}
      keyboardType={keyboard}
        />

      </View>
    );
  }

  intParser = (value) => value ? parseInt(value, 10) : '';

  render() {
    const {handleSubmit, mySubmit} = this.props;

    return (
      <View style={ {backgroundColor: 'white', paddingBottom: 20} }>
{{#each formFields}}
        <Field component={this.renderField} name="{{{name}}}" type="{{{type}}}"
          placeholder="{{{description}}}"{{#if required}} required={true}{{/if}} value="" parse={this.intParser}/>
{{/each}}
        <Button buttonStyle={styles.button}
          title='SAVE'
          onPress={handleSubmit(mySubmit)}
        />
      </View>
    );
  }
}

const styles = {
  button: {
    flex: 1,
    backgroundColor: '#3faab4',
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'transparent',
    width: 300,
    height: 50,
    margin: 20,
  },
  placeholderStyle:{
    paddingRight:10
  }
};

export default reduxForm(
    {
      form: '{{{lc}}}',
      enableReinitialize: true, keepDirtyOnReinitialize: true,
    })(
    Form);
