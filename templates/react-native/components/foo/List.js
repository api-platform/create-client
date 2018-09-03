import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Spinner from '../Spinner';
import { list, reset } from '../../actions/{{{lc}}}/list';
import { success } from '../../actions/{{{lc}}}/delete';
import { pagination } from '../../utils/helpers';

class ListComponent extends Component {

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    refresh:PropTypes.number
  };

  componentDidMount() {
    this.props.reset();
    this.props.list();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refresh !== this.props.refresh) {
      this.props.list();
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  static show(id) {
    Actions.{{{lc}}}Show({id});
  }

  static renderRow(item) {
    const {listRowLeft, listRowRight, viewList} = styles;

    return (
        <ListItem
            key={Math.random()}
            onPressRightIcon={() => ListComponent.show(item['@id'])}
            subtitle={
              <View>
{{#each fields}}
  {{#ifNotResource reference }}
                <View style={viewList}>
                  <Text style={listRowLeft}>{{{name}}}: </Text>
                  <Text style={[listRowRight, {fontWeight: 'bold'}]}>{item['{{{name}}}']}</Text>
                </View>
  {{/ifNotResource}}
{{/each}}
              </View>
            }
        />
    );
  }

  render() {
    if (this.props.loading) {
      return <Spinner size="large"/>;
    }

    return (
        <View style={ {flex: 1} }>
          <ScrollView contentInset={ {top: -24} }
                      automaticallyAdjustContentInsets>
            <List>
              {this.props.data['hydra:member'] &&
              this.props.data['hydra:member'].map(
                  item => ListComponent.renderRow(item))}
            </List>
          </ScrollView>
          {pagination(this.props.data['hydra:view'], this.props.list)}
        </View>
    );
  }
}

const mapStateToProps = state => {
  const {data, error, loading} = state.{{{lc}}}.list;
  return {data, error, loading};
};

const mapDispatchToProps = dispatch => {
  return {
    list: (page) => dispatch(list(page)),
    reset: () => {
      dispatch(reset());
      dispatch(success(null));
    },
  };
};

const styles = {
  viewList: {
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  listRowLeft: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 5,
    justifyContent: 'flex-start',
    position: 'relative',
    color: 'gray',
    fontSize: 16,
  },
  listRowRight: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 5,
    justifyContent: 'flex-start',
    position: 'relative',
    fontSize: 18,
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);
