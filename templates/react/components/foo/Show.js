import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {retrieve, reset} from '../../actions/{{{ lc }}}/show';


class Show extends Component {
  static propTypes = {
    retrieveError: PropTypes.string,
    retrieveLoading: PropTypes.bool.isRequired,
    retrieved: PropTypes.object,
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset();
  }

  // del = () => {
  //   if (confirm('Are you sure you want to delete this item?')) this.props.del(this.props.retrieved);
  // }; // del = () => {
  //   if (confirm('Are you sure you want to delete this item?')) this.props.del(this.props.retrieved);
  // };

  render() {

    const item = this.props.updated ? this.props.updated : this.props.retrieved;

    return (<div>
      <h1>Show {item && item['@id']}</h1>

      {(this.props.retrieveLoading ) && <div className="alert alert-info" role="status">Loading...</div>}
      {this.props.retrieveError && <div className="alert alert-danger" role="alert"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {this.props.retrieveError}</div>}

      {item && <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
{{#each fields}}
            <tr>
              <td>{{name}}</td>
              <td>{item['{{{ name }}}']}</td>
            </tr>
{{/each }}
          </tbody>
        </table>
      </div>
      }

      <Link to=".." className="btn btn-default">Back to list</Link>
      {/* DELETE  EDIT actions ??? */}
      {/*<button onClick={this.del} className="btn btn-danger">Delete</button>*/}
    </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    retrieveError: state.{{{lc}}}.show.retrieveError,
    retrieveLoading: state.{{{lc}}}.show.retrieveLoading,
    retrieved:state.{{{lc}}}.show.retrieved
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    retrieve: id => dispatch(retrieve(id)),
    reset: () => dispatch(reset())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
