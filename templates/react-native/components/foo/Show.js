import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ScrollView, Alert, View, StyleSheet} from 'react-native';
import {Card, List, ListItem, SocialIcon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import Spinner from '../Spinner';
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
    this.props.retrieve(this.props.id);
  }

  componentWillUnmount() {
    this.props.reset();
  }

  remove()  {
    const {del, retrieved} = this.props;
    Alert.alert(
      '',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => del(retrieved)},
      ],
      { cancelable: false }
    );
  };

  static renderRow(title, value) {
    return (
      <ListItem
        key={value}
        hideChevron={true}
        title={title}
        subtitle={value}
        subtitleNumberOfLines={100}
      />
    );
  }

  actionButtons(id) {
    return (
      <View style={ {flexDirection: 'row', alignSelf: 'center', alignContent: 'center'} }>
        <SocialIcon
          type='plus-circle'
          iconColor='#3faab4'
          onPress={() => Actions.{{title}}Create()}
        />
        <SocialIcon
          type='edit'
          iconColor='#3faab4'
          onPress={() => Actions.{{title}}Update({id})}
        />
        <SocialIcon
          type='minus-circle'
          iconColor='#3faab4'
          onPress={() => this.remove()}
        />
      </View>
    );
  }

  render() {

    if (this.props.loading) return <Spinner size="large"/>;

    if (this.props.deleted) {
      Alert.alert(
        '',
        'Item has been deleted!',
        [
          {text: 'OK', onPress: () => Actions.{{title}}List()},
        ],
        { cancelable: false }
      );
    }

    const item = this.props.retrieved;

    return (
      <View style={ {flex: 1} }>
        <ScrollView>
          {item &&
          <Card title={item['@id']}>
            <List>
            {{#each fields}}
              {Show.renderRow('{{{name}}}', item['{{{ name }}}'])}
            {{/each}}
            </List>
          </Card>
          }
        </ScrollView>
        {item && this.actionButtons(item['@id'])}
      </View>
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
