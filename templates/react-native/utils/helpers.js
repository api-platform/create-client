import React from 'react';
import { View } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export function paginationRoute(item) {
  return '/' + item.split('/').splice(-1, 1);
}

export function pagination(view, list) {
  if (!view) return;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'center',
        alignContent: 'center',
      }}
    >
      <SocialIcon
        type="fast-backward"
        iconColor={view['hydra:previous'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['hydra:first']))}
        disabled={!view['hydra:previous']}
      />
      <SocialIcon
        type="backward"
        iconColor={view['hydra:previous'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['hydra:previous']))}
        disabled={!view['hydra:previous']}
      />
      <SocialIcon
        type="forward"
        iconColor={view['hydra:next'] ? '#3faab4' : 'grey'}
        onPress={() => list(paginationRoute(view['hydra:next']))}
        disabled={!view['hydra:next']}
      />

      <SocialIcon
        type="fast-forward"
        iconColor={view['hydra:next'] ? '#3faab4' : 'grey'}
        disabled={!view['hydra:next']}
        onPress={() => list(paginationRoute(view['hydra:last']))}
        activityIndicatorStyle={{ backgroundColor: 'red' }}
      />
    </View>
  );
}

export function delayRefresh() {
  setTimeout(() => {
    Actions.refresh({ refresh: Math.random() });
  }, 500);
}
