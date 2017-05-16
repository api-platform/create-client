import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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

  del = () => {
    if (confirm('Are you sure you want to delete this item?')) this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".."/>;

    const item = this.props.updated ? this.props.updated : this.props.retrieved;

    return <div>
      <h1>Edit {item && item['@id']}</h1>

      {this.props.created && <div className="alert alert-success" role="status">{this.props.created['@id']} created.</div>}
      {this.props.updated && <div className="alert alert-success" role="status">{this.props.updated['@id']} updated.</div>}
      {(this.props.retrieveLoading || this.props.updateLoading || this.props.deleteLoading) && <div className="alert alert-info" role="status">Loading...</div>}
      {this.props.retrieveError && <div className="alert alert-danger" role="alert"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.props.retrieveError}</div>}
      {this.props.updateError && <div className="alert alert-danger" role="alert"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.props.updateError}</div>}
      {this.props.deleteError && <div className="alert alert-danger" role="alert"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.props.deleteError}</div>}

      {item && <Form onSubmit={values => this.props.update(item, values)} initialValues={item}/>}
      <Link to=".." className="btn btn-default">Back to list</Link>
      <button onClick={this.del} className="btn btn-danger">Delete</button>
    </div>;
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
