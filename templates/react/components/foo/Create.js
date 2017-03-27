import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Form from './Form';
import { create, loading, error } from '../../actions/{{{ lc }}}/create';

class Create extends Component {
  static propTypes = {
    error: React.PropTypes.string,
    loading: React.PropTypes.bool.isRequired,
    created: React.PropTypes.object,
    create: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    if (this.props.created) {
      return <Redirect to={`edit/${encodeURIComponent(this.props.created['@id'])}`}/>;
    }

    return <div>
      <h1>Create a new {{{ title }}}</h1>

      {this.props.loading && <div className="alert alert-info">Loading...</div>}
      {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}

      <Form onSubmit={this.props.create} values={this.props.item}/>
      <Link to="." className="btn btn-default">Back to list</Link>
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
