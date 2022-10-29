#!/bin/bash

# Text styles
bold=`tput bold`
normal=`tput sgr0`
italic='\033[3m'
underline='\033[4;32m'
# Color variables
red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
blue='\033[0;34m'
magenta='\033[0;35m'
cyan='\033[0;36m'
# Clear the color after that
clear='\033[0m'

entrypoint="https://demo.api-platform.com"

echo -e "${green}++===================================++"
echo "||                                   ||"
echo -e "|| ${italic}${underline}THANKS FOR USING FONIVA GENERATOR${clear}${green} ||"
echo "||                                   ||"
echo "++===================================++"

echo -e "${yellow}» Please provide answers to the following questions${clear}\n"

echo -e "Enter the entrypoint: (${cyan}${italic}Ex: https://demo.api-platform.com${clear})"
read PROVIDED_ENTRYPOINT

if [ $PROVIDED_ENTRYPOINT ]; then
echo -e "Entrypoint provided:${magenta} $PROVIDED_ENTRYPOINT ${clear}"
fi

echo  -e "Enter your Project name:${clear}"
read PROJECT_NAME

PS3="
${bold}OpenApi${normal} recommended for JSON format
${bold}Hydra${normal} intended for JSOND format

What format do you want to use: "
echo -e "\r\n"
select option in "OpenApi" "Hydra"
do
  case $option in
    "OpenApi") 
      FORMAT="OpenApi"
      echo -e "${magenta}Set OpenApi as format...${clear}"
      break;;
    "Hydra") 
      FORMAT="Hydra"
      echo -e "${magenta}Set Hydra as format...${clear}"
      break;;
    esac
done


if [ $PROVIDED_ENTRYPOINT ]; then
  entrypoint="$PROVIDED_ENTRYPOINT"
fi

format=""
if [ $FORMAT ]; then
  format="-f $FORMAT"
fi

echo -e "${green}$PROJECT_NAME init..."
echo "Creating $PROJECT_NAME folder..." | tr ' ' '\n' |

rm -rf ../$PROJECT_NAME &&
echo "Create vue project...." &&
npm init -y vue@2 -- --router ../$PROJECT_NAME &&
echo "Create vue project....Done"  &&

echo "Add packages...."  &&
npm --cwd ../$PROJECT_NAME add vuex@3 vuex-map-fields lodash bootstrap font-awesome &&

echo "Add packages....Done"  &&
./src/index.js $entrypoint ../$PROJECT_NAME/src --generator vue $format

echo "You are good to go!"
