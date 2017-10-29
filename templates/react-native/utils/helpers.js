import React from 'react';
import {View} from 'react-native';
import {Button, Icon, Badge, SocialIcon} from 'react-native-elements';

export function paginationRoute(item) {
  return '/' + item.split('/').splice(-1, 1);
}

export function pagination(view, list) {
  return (
    <View style={ {flexDirection: 'row', alignSelf: 'center', alignContent: 'center'} }>
      <SocialIcon
        type='fast-backward'
        iconColor={view['hydra:previous'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['hydra:first']))}
        disabled={!view['hydra:previous']}
      />
      <SocialIcon
        type='backward'
        iconColor={view['hydra:previous'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['hydra:previous']))}
        disabled={!view['hydra:previous']}
      />
      <SocialIcon
        type='forward'
        iconColor={view['hydra:next'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['hydra:next']))}
        disabled={!view['hydra:next']}
      />

      <SocialIcon
        type='fast-forward'
        iconColor={view['hydra:next'] ? '#3faab4' : 'grey'}
        disabled={!view['hydra:next']}
        onPress={() => list(paginationRoute(view['hydra:last']))}
        // style={ {backgroundColor: 'black'} }
        activityIndicatorStyle={ {backgroundColor:'red'} }
      />
    </View>
  );
}
