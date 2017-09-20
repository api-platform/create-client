import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {retrieve, reset} from '../../actions/{{{ lc }}}/show';
import { del, loading, error } from '../../actions/{{{ lc }}}/delete';

class Show extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    retrieved: PropTypes.object,
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleted: PropTypes.object,
    del: PropTypes.func.isRequired
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
        <Text>Show component {{lc}}</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.{{{lc}}}.show.error,
    loading: state.{{{lc}}}.show.loading,
    retrieved:state.{{{lc}}}.show.retrieved,
    deleteError: state.{{{ lc }}}.del.error,
    deleteLoading: state.{{{ lc }}}.del.loading,
    deleted: state.{{{ lc }}}.del.deleted,
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    retrieve: id => dispatch(retrieve(id)),
    del: item => dispatch(del(item)),
    reset: () => {
      dispatch(reset());
      dispatch(error(null));
      dispatch(loading(false));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
