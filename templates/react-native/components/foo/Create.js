import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, loading, error } from '../../actions/{{{lc}}}/create';
import { Actions } from 'react-native-router-flux';
import { delayRefresh } from '../../utils/helpers';

class Create extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.reset();
  }

  onSubmit = values => {
    this.props.create(values);
    Actions.{{{lc}}}List();
    delayRefresh();
  };

  render() {

    if (this.props.created) return Actions.pop();

    const {viewStyle, textStyle} = styles;

    return (
        <View>
          <ScrollView keyboardShouldPersistTaps='always'>
            {this.props.error && <View style={viewStyle}><Text
                style={textStyle}>{this.props.error}</Text></View>}
            <Form mySubmit={values => this.onSubmit(values)}/>
          </ScrollView>
        </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    created: state.{{{lc}}}.create.created,
    error: state.{{{lc}}}.create.error,
    loading: state.{{{lc}}}.create.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    create: values => dispatch(create(values)),
    reset: () => {
      dispatch(loading(false));
      dispatch(error(null));
    },
  };
};

const styles = {
  viewStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
  textStyle: {
    color: 'red',
    textAlign: 'center',
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
