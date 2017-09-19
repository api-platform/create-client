import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Form from './Form';
import { success } from '../../actions/{{{ lc }}}/create';
import { retrieve, update, reset } from '../../actions/{{{ lc }}}/update';
import { del, loading, error } from '../../actions/{{{ lc }}}/delete';

class Update extends Component {
  static propTypes = {
    retrieveError: PropTypes.string,
    retrieveLoading: PropTypes.bool.isRequired,
    updateError: PropTypes.string,
    updateLoading: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    retrieved: PropTypes.object,
    updated: PropTypes.object,
    deleted: PropTypes.object,
    retrieve: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset();
  }

  // equivalent in RN
  // del = () => {
  //   if (window.confirm('Are you sure you want to delete this item?')) this.props.del(this.props.retrieved);
  // };

  render() {
    return (
      <ScrollView>
        <Text>Update component {{lc}}</Text>
      </ScrollView>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    retrieveError: state.{{{ lc }}}.update.retrieveError,
    retrieveLoading: state.{{{ lc }}}.update.retrieveLoading,
    updateError: state.{{{ lc }}}.update.updateError,
    updateLoading: state.{{{ lc }}}.update.updateLoading,
    deleteError: state.{{{ lc }}}.del.error,
    deleteLoading: state.{{{ lc }}}.del.loading,
    created: state.{{{ lc }}}.create.created,
    deleted: state.{{{ lc }}}.del.deleted,
    retrieved: state.{{{ lc }}}.update.retrieved,
    updated: state.{{{ lc }}}.update.updated,
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    retrieve: id => dispatch(retrieve(id)),
    update: (item, values) => dispatch(update(item, values)),
    del: item => dispatch(del(item)),
    reset: () => {
      dispatch(reset());
      dispatch(error(null));
      dispatch(loading(false));
      dispatch(success(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Update);
