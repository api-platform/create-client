import React, {Component} from 'react';
import {ScrollView, Text} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { list, reset, page } from '../../actions/{{{ lc }}}/list';
import { success } from '../../actions/{{{ lc }}}/delete';

class List extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    page: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.list();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    return (
      <ScrollView>
        <Text>List component {{lc}}</Text>
      </ScrollView>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    items: state.{{{ lc }}}.list.items,
    error: state.{{{ lc }}}.list.error,
    loading: state.{{{ lc }}}.list.loading,
    deletedItem: state.{{{ lc }}}.del.deleted,
    view: state.{{{ lc }}}.list.view,
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    list: () => dispatch(list()),
    page: (arg) => dispatch(page(arg)),
    reset: () => {
      dispatch(reset());
      dispatch(success(null));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
