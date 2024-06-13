#!/bin/sh
set -e

if [ "$1" ]; then
  rm -rf ./tmp/app/$1
  mkdir -p ./tmp/app/
fi

if [ "$1" = "next" ]; then
  pnpm create next-app --eslint --no-app --tailwind --typescript --no-src-dir --import-alias="@/*" --use-pnpm ./tmp/app/next
  pnpm --dir ./tmp/app/$1 add isomorphic-unfetch formik react-query

  # Tailwind
  cp ./templates/common/tailwind.config.ts ./tmp/app/$1
  cp ./templates/common/style.css ./tmp/app/$1/styles

  cp -R ./tmp/$1/* ./tmp/app/$1


  rm ./tmp/app/$1/pages/index.tsx
  rm -rf ./tmp/app/$1/pages/api
  
  pnpm --dir ./tmp/app/$1 exec eslint --no-eslintrc -c ./.eslintrc.json -f unix .

  pnpm --dir ./tmp/app/$1 build --no-lint
  pnpm playwright install
  APP=$1 pnpm playwright test
fi

if [ "$1" = "react" ]; then
  COREPACK_ENABLE_AUTO_PIN=0 COREPACK_ENABLE_STRICT=0 yarn create react-app --template typescript ./tmp/app/react-app
  COREPACK_ENABLE_AUTO_PIN=0 COREPACK_ENABLE_STRICT=0 yarn --cwd ./tmp/app/react-app add react-router-dom react-hook-form

  cp -R ./tmp/$1/* ./tmp/app/react-app/src
  cp ./templates/react/index.tsx ./tmp/app/react-app/src

  pnpm playwright install
  APP=$1 pnpm playwright test
fi

if [ "$1" = "nuxt" ]; then
  npx nuxi init ./tmp/app/$1 --git-init false --package-manager pnpm

  rm ./tmp/app/$1/app.vue
  rm ./tmp/app/$1/nuxt.config.ts

  cp ./templates/$1/nuxt.config.ts ./tmp/app/$1

  pnpm --dir ./tmp/app/$1 add dayjs @pinia/nuxt qs @types/qs

  cp -R ./tmp/$1/* ./tmp/app/$1

  # Tailwind
  pnpm --dir ./tmp/app/$1 add -D tailwindcss postcss autoprefixer
  cp ./templates/common/tailwind.config.ts ./tmp/app/$1
  cp ./templates/common/style.css ./tmp/app/$1/assets/css

  pnpm --dir ./tmp/app/$1 build

  pnpm playwright install
  APP=$1 pnpm playwright test
fi

if [ "$1" = "vue" ]; then
  cd ./tmp/app
  pnpm create vue --typescript --router --pinia --eslint-with-prettier vue
  cd ../..
  pnpm --dir ./tmp/app/$1 install
  pnpm --dir ./tmp/app/$1 add qs @types/qs dayjs

  # Tailwind
  pnpm --dir ./tmp/app/$1 add -D tailwindcss postcss autoprefixer
  pnpm --dir ./tmp/app/$1 exec tailwindcss init -p --ts

  cp ./templates/common/tailwind.config.ts ./tmp/app/$1
  cp ./templates/common/style.css ./tmp/app/$1/src/assets

  cp -R ./tmp/$1/* ./tmp/app/$1/src
  cp ./templates/$1/main.ts ./tmp/app/$1/src
  cp ./templates/$1/App.vue ./tmp/app/$1/src

  pnpm --dir ./tmp/app/$1 build
  pnpm playwright install
  APP=$1 pnpm playwright test
fi

if [ "$1" = "vuetify" ]; then
  cd ./tmp/app
  pnpm create vuetify --ts --preset essentials --install-dependencies
  cd ../..
  pnpm --dir ./tmp/app/$1 install
  pnpm --dir ./tmp/app/$1 add dayjs qs @types/qs vue-i18n vue-router

  # Tailwind
  # pnpm --dir ./tmp/app/$1 add -D tailwindcss postcss autoprefixer
  # pnpm --dir ./tmp/app/$1 exec tailwindcss init -p --ts

  # cp ./templates/common/tailwind.config.ts ./tmp/app/$1
  # cp ./templates/common/style.css ./tmp/app/$1/src/assets

  cp -R ./tmp/$1/* ./tmp/app/$1/src
  cp ./templates/$1/plugins/index.ts ./tmp/app/$1/src/plugins/index.ts
  cp ./templates/$1/plugins/i18n.ts ./tmp/app/$1/src/plugins/i18n.ts
  cp ./templates/$1/plugins/vuetify.ts ./tmp/app/$1/src/plugins/vuetify.ts
  cp -R ./templates/common/public/* ./tmp/app/$1/public
  cp ./templates/$1/main.ts ./tmp/app/$1/src/main.ts
  mkdir -p ./tmp/app/$1/src/mocks/
  cp -R ./templates/common/mocks/* ./tmp/app/$1/src/mocks

  pnpm --dir ./tmp/app/$1 dev

  # pnpm --dir ./tmp/app/$1 build
  # pnpm playwright install
  # APP=$1 pnpm playwright test
fi