import React from 'react';
import {View} from 'react-native';
import {SocialIcon} from 'react-native-elements';

export function paginationRoute(item) {
  return '/' + item.split('/').splice(-1, 1);
}

export function pagination(view, list) {
  if (!view) return;
  return (
    <View style={ {flexDirection: 'row', alignSelf: 'center', alignContent: 'center'} }>
      <SocialIcon
        type='fast-backward'
        iconColor={view['{{{ hydraPrefix }}}first'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['{{{ hydraPrefix }}}first']))}
        disabled={!view['{{{ hydraPrefix }}}first']}
      />
      <SocialIcon
        type='backward'
        iconColor={view['{{{ hydraPrefix }}}previous'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['{{{ hydraPrefix }}}previous']))}
        disabled={!view['{{{ hydraPrefix }}}previous']}
      />
      <SocialIcon
        type='forward'
        iconColor={view['{{{ hydraPrefix }}}next'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['{{{ hydraPrefix }}}next']))}
        disabled={!view['{{{ hydraPrefix }}}next']}
      />

      <SocialIcon
        type='fast-forward'
        iconColor={view['{{{ hydraPrefix }}}next'] ? '#3faab4' : 'grey'}
        disabled={!view['{{{ hydraPrefix }}}next']}
        onPress={() => list(paginationRoute(view['{{{ hydraPrefix }}}last']))}
        // style={ {backgroundColor: 'black'} }
        activityIndicatorStyle={ {backgroundColor:'red'} }
      />
    </View>
  );
}
