import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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
    if (this.props.created) return <Redirect to={`edit/${encodeURIComponent(this.props.created['@id'])}`}/>;

    return <div>
      <h1>New {{{ title }}}</h1>

      {this.props.loading && <div className="alert alert-info" role="status">Loading...</div>}
      {this.props.error && <div className="alert alert-danger" role="alert"><span className="fa fa-exclamation-triangle" aria-hidden="true"></span> {this.props.error}</div>}

      <Form onSubmit={this.props.create} values={this.props.item}/>
      <Link to="." className="btn btn-primary">Back to list</Link>
    </div>;
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
