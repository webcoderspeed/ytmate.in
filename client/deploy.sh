#!/bin/bash
set -e

red=`tput setaf 1`
green=`tput setaf 2`

action=$1

if [[ $action == '--init' ]]; then
  start () {
    pm2 start "yarn start" --name ytmate-frontend
  }

elif [[ $action == '--delete' ]]; then
  pm2 delete ytmate-frontend
  exit 1

else 
  start () {
    pm2 restart ytmate-frontend
  }
fi

FORMATTED_INPUT="${1,,}"

# hard deploy -> remove & install node_modules & soft deploy only install new

if [[ $FORMATTED_INPUT == '--hard' ]];
then
	echo -e "Deploy Type: HARD\nRemoving node_modules"
	rm -rf node_modules/
else
	echo "Deploy Type: SOFT"
fi

rm -rf ./.next

yarn 

yarn build

# sudo rm -rf /var/www/ytmate.in_backup/*

# sudo cp -rp /var/www/ytmate.in/* /var/www/ytmate.in_backup

sudo rm -rf /var/www/ytmate.in/*

sudo cp -rp ./build/* /var/www/ytmate.in

ls -lt /var/www/ytmate.in

start

sudo nginx -t

sudo systemctl restart nginx

echo "${red} Previous backup is at ytmate.in_backup"

echo "${green} Deployed ytmate.in app & restarted nginx"