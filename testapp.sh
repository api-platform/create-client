#!/bin/sh
set -e

if [ "$1" ]; then
  rm -rf ./tmp/app
  mkdir -p ./tmp/app
fi

if [ "$1" = "next" ]; then
  yarn create next-app --typescript --eslint ./tmp/app/next
  yarn prettier --write ./tmp/app/next
  yarn --cwd ./tmp/app/next add isomorphic-unfetch formik react-query

  # Tailwind
  yarn --cwd ./tmp/app/next add tailwindcss postcss autoprefixer
  yarn --cwd ./tmp/app/next tailwindcss init -p
  cp ./templates/common/tailwind.config.js ./tmp/app/next
  cp ./templates/common/style.css ./tmp/app/next/styles

  cp -R ./tmp/next/* ./tmp/app/next
  rm ./tmp/app/next/pages/index.tsx
  rm -rf ./tmp/app/next/pages/api
  yarn --cwd ./tmp/app/next build
  start-server-and-test 'yarn --cwd ./tmp/app/next start' http://127.0.0.1:3000/books/ 'yarn playwright test'
fi

if [ "$1" = "react" ]; then
  yarn create react-app --template typescript ./tmp/app/reactapp
  yarn --cwd ./tmp/app/reactapp add react-router-dom react-hook-form

  cp -R ./tmp/react/* ./tmp/app/reactapp/src
  cp ./templates/react/index.tsx ./tmp/app/reactapp/src
  start-server-and-test 'BROWSER=none yarn --cwd ./tmp/app/reactapp start' http://127.0.0.1:3000/books/ 'yarn playwright test'
fi

if [ "$1" = "nuxt" ]; then
  yarn create nuxt-app --answers "'{\"name\":\"nuxt\",\"language\":\"js\",\"pm\":\"yarn\",\"ui\":\"vuetify\",\"template\":\"html\",\"features\":[],\"linter\":[],\"test\":\"none\",\"mode\":\"spa\",\"target\":\"static\",\"devTools\":[],\"vcs\":\"none\"}'" ./tmp/app/nuxt
  yarn --cwd ./tmp/app/nuxt add moment lodash vuelidate vuex-map-fields

  cp -R ./tmp/nuxt/* ./tmp/app/nuxt
  NUXT_TELEMETRY_DISABLED=1 yarn --cwd ./tmp/app/nuxt generate
  start-server-and-test 'yarn --cwd ./tmp/app/nuxt start --hostname 127.0.0.1' http://127.0.0.1:3000/books/ 'yarn playwright test'
fi

if [ "$1" = "vue" ]; then
  cd ./tmp/app
  npm init vue@3 -- --typescript --router --pinia --eslint-with-prettier vue
  cd ../..
  yarn --cwd ./tmp/app/vue install
  yarn --cwd ./tmp/app/vue add lodash @types/lodash dayjs

  # Tailwind
  yarn --cwd ./tmp/app/vue add tailwindcss postcss autoprefixer
  yarn --cwd ./tmp/app/vue tailwindcss init -p
  cp ./templates/common/tailwind.config.js ./tmp/app/vue
  cp ./templates/common/style.css ./tmp/app/vue/src/assets

  cp -R ./tmp/vue/* ./tmp/app/vue/src
  cp ./templates/vue/main.ts ./tmp/app/vue/src
  cp ./templates/vue/App.vue ./tmp/app/vue/src
  yarn --cwd ./tmp/app/vue build
  start-server-and-test 'yarn --cwd ./tmp/app/vue vite preview --port 3000' http://localhost:3000/books/ 'yarn playwright test'
fi
