import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/{{{ lc }}}/show';


class Show extends Component {
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

    // del = () => {
    //     if (confirm('Are you sure you want to delete this item?')) this.props.del(this.props.retrieved);
    // };

    render() {
        if (this.props.deleted) return <Redirect to=".."/>;

        const item = this.props.retrieved;

        return <div>
            <h1>Show {item && item['@id']}</h1>

        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        retrieveError: state.{{{ lc }}}.show.retrieveError,
        retrieveLoading: state.{{{ lc }}}.show.retrieveLoading,
        retrieved: state.{{{ lc }}}.show.retrieved,
};
};

const mapDispatchToProps = (dispatch) => {
    return {
        retrieve: id => dispatch(retrieve(id)),
        reset: () => {
            dispatch(reset());
            dispatch(error(null));
            dispatch(loading(false));
            dispatch(success(null));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Show);
