#!/bin/bash 

TOKEN="2dda18d0-f7e8-486e-903d-eebf831a9bf0"
DAY=`date +"%d%m%y"`
TIME=`date +"%d%m%y_%H%M"`
BASE_DIR="/home/pi/BUSD/"
DATA_DIR="$BASE_DIR/data/"
DAY_DIR="$DATA_DIR/$DAY"
URL="https://iot.aretas.ca/rest/publicaccess/latestdata?publicAccessToken=$TOKEN"
# make the directory for the dat if it doesn't exist
# ths currently leads with the day number not the month :( 
mkdir -p $DAY_DIR
# download the latest data
curl -X POST -d @$BASE_DIR/allSensors.json -H  "Content-Type: application/json" $URL -o "$DAY_DIR/$TIME.json" 
# map the json to csv values 
cat $DAY_DIR/$TIME.json |  jq -r '(map(keys) | add | unique) as $cols | map(. as $row | $cols | map($row[.])) as $rows | $rows[] | @csv' > $DAY_DIR/${TIME}_back.csv
# go to new dir
cd $DAY_DIR
# a golang script which parses just BHS data 
# it also removes outlier data
# and transforms into a CSV
# this is to save storage  size on server
${BASE_DIR}school-data $TIME.json
# upload to neon postgre servers
# this is a very efficient means up bulk importing to a server
# XXXXX ask Paul
psql -w -U elvezpablo -h 763255.cloud.neon.tech main -c "\\copy data(data,mac,timestamp,type) from '${DAY_DIR}/${TIME}.csv' DELIMITER ',' CSV"
