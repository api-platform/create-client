import React, {Component} from 'react';
import {View,ScrollView} from 'react-native';
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
      <View style={ {flex: 1} }>
        <ScrollView>
          <Form onSubmit={this.props.create} values={this.props.item}/>
        </ScrollView>
      </View>
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
