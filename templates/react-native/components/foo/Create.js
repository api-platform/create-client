import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, loading, error } from '../../actions/{{{ lc }}}/create';

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

  render() {
    return (
      <ScrollView>
        <Text>Create component {{lc}}</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    created: state.{{{ lc }}}.create.created,
    error: state.{{{ lc }}}.create.error,
    loading: state.{{{ lc }}}.create.loading,
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: values => dispatch(create(values)),
    reset: () => {
      dispatch(loading(false));
      dispatch(error(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
