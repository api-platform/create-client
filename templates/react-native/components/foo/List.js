import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import Spinner from '../Spinner';
import { list, reset } from '../../actions/{{{ lc }}}/list';
import { success } from '../../actions/{{{ lc }}}/delete';
import {pagination} from '../../utils/helpers';

class ListComponent extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.reset();
    this.props.list();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  static show(id) {
    Actions.popAndPush();
    Actions.{{title}}Show({id});
  }

  static renderRow(item) {
    return (
      <ListItem
        key={item['@id']}
        onPressRightIcon={() => ListComponent.show(item['@id'])}
        subtitle={
          <View>
            {{#each fields}}
            <View style={ {flexDirection: 'row'} }>
              <Text style={styles.listRow}>{{name}}: </Text>
              <Text style={styles.listRow}>{item['{{{ name }}}']}</Text>
            </View>
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
        <ScrollView contentInset={ {top: -24} } automaticallyAdjustContentInsets={false}>
          <List>
            { this.props.data['{{{ hydraPrefix }}}member'] &&  this.props.data['{{{ hydraPrefix }}}member'].map(item => ListComponent.renderRow(item))}
          </List>
        </ScrollView>
        {pagination(this.props.data['{{{ hydraPrefix }}}view'], this.props.list)}
      </View>

    );
  }

}

const mapStateToProps = (state) => {
  return {
    data: state.{{{ lc }}}.list.data,
    error: state.{{{ lc }}}.list.error,
    loading: state.{{{ lc }}}.list.loading,
};
};

const mapDispatchToProps = (dispatch) => {
  return {
    list: (page) => dispatch(list(page)),
    reset: () => {
      dispatch(reset());
      dispatch(success(null));
    },
  };
};

const styles = StyleSheet.create({
  loading: {
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  delete: {
    color: 'orange',
    fontWeight: 'bold',
  },
  listRow: {
    borderBottomWidth: 1,
    padding: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);
