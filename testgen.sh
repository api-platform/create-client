#!/bin/sh
set -e

entrypoint="https://demo.api-platform.com"
if [ $ENTRYPOINT ]; then
  entrypoint="$ENTRYPOINT"
fi

gens="react react-native next vue vuetify nuxt quasar typescript"
if [ $1 ]; then
  gens="$1"
fi

format=""
if [ $FORMAT ]; then
  format="-f $FORMAT"
fi

echo "$gens" | tr ' ' '\n' | while read gen; do
  ./lib/index.js $entrypoint ./tmp/$gen -g $gen $format
done
