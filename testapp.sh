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
  npx nuxi init ./tmp/app/nuxt

  rm ./tmp/app/nuxt/app.vue
  rm ./tmp/app/nuxt/nuxt.config.ts

  cp ./templates/nuxt/nuxt.config.ts ./tmp/app/nuxt

  yarn --cwd ./tmp/app/nuxt add dayjs @pinia/nuxt qs @types/qs

  cp -R ./tmp/nuxt/* ./tmp/app/nuxt

  # Tailwind
  yarn --cwd ./tmp/app/nuxt add tailwindcss postcss autoprefixer
  yarn --cwd ./tmp/app/nuxt tailwindcss init -p
  cp ./templates/common/tailwind.config.js ./tmp/app/nuxt
  cp ./templates/common/style.css ./tmp/app/nuxt/assets/css

  yarn --cwd ./tmp/app/nuxt generate

  start-server-and-test 'yarn --cwd ./tmp/app/nuxt preview' http://127.0.0.1:3000/books/ 'yarn playwright test'
fi

if [ "$1" = "vue" ]; then
  cd ./tmp/app
  npm init vue@3 -- --typescript --router --pinia --eslint-with-prettier vue
  cd ../..
  yarn --cwd ./tmp/app/vue install
  yarn --cwd ./tmp/app/vue add qs @types/qs dayjs

  # Tailwind
  yarn --cwd ./tmp/app/vue add tailwindcss postcss autoprefixer
  yarn --cwd ./tmp/app/vue tailwindcss init -p
  cp ./templates/common/tailwind.config.js ./tmp/app/vue
  cp ./templates/common/style.css ./tmp/app/vue/src/assets

  cp -R ./tmp/vue/* ./tmp/app/vue/src
  cp ./templates/vue/main.ts ./tmp/app/vue/src
  cp ./templates/vue/App.vue ./tmp/app/vue/src
  yarn --cwd ./tmp/app/vue build
  start-server-and-test 'yarn --cwd ./tmp/app/vue vite preview' http://localhost:3000/books/ 'yarn playwright test'
fi

if [ "$1" = "angular" ]; then
  cd ./tmp/app
  npm install @angular/cli

  ng new angular --ssr --standalone --style=css
  cd ../..
  yarn --cwd ./tmp/app/angular add tailwindcss postcss autoprefixer dayjs
  yarn --cwd ./tmp/app/angular tailwindcss init -p

  cp ./templates/common/tailwind.config.js ./tmp/app/angular
  cp ./templates/common/style.css ./tmp/app/angular/src/styles.css

  cp -R ./tmp/angular/* ./tmp/app/angular/src

  file="./tmp/app/angular/tsconfig.json"
  newContent='"baseUrl": "./src",\
  "paths": {\
    "@components/*" : ["app/components/*"],\
    "@interface/*" : ["app/interface/*"],\
    "@service/*" : ["app/service/*"],\
    "@router/*" : ["app/router/*"],\
    "@utils/*" : ["app/utils/*"],\
  },'
  sed -i.bak '21a\'"$newContent" "$file"
  yarn --cwd ./tmp/app/angular build
  start-server-and-test 'yarn --cwd ./tmp/app/angular start --port=3000' http://127.0.0.1:3000/books/ 'yarn playwright test'
fi
