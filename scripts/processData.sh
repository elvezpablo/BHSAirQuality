#!/bin/bash 

BASE_DIR="/home/pi/BUSD"
DATA_DIR="$BASE_DIR/data"
OUT_DIR="$BASE_DIR/output"

YESTERDAY=`date --date="yesterday" +"%d%m%y"`
DAY=${1:-$YESTERDAY}
DAY_DIR="$DATA_DIR/$DAY"
DB=$OUT_DIR/$DAY.db
GIT_DATA=$BASE_DIR/BHSAirQuality/public/data

touch $DB

sqlite3 $DB "CREATE TABLE devices (id INTEGER PRIMARY KEY, school TEXT, name TEXT);"

sqlite3 $DB<<EOF

.mode csv
.import $BASE_DIR/allDevices.csv devices

EOF

sqlite3 $DB "CREATE TABLE data_tmp (value REAL, mac INTEGER, timestamp INTEGER, type INTEGER);"


for f in $DAY_DIR/*.csv
do

sqlite3 $DB<<EOF
.mode csv
.import $f data_tmp
EOF

done

sqlite3 $DB "CREATE TABLE data (id INTEGER PRIMARY KEY AUTOINCREMENT, value REAL, mac INTEGER, timestamp INTEGER, type INTEGER);"

sqlite3 $DB "INSERT INTO data (value, mac, timestamp, type) SELECT * FROM data_tmp;"

sqlite3 $DB "DROP TABLE data_tmp"

sqlite3 $DB<<EOF 
.mode json 
.output "${OUT_DIR}/${DAY}_CO2.json"
SELECT 
 d.mac,
 d.timestamp, 
 d.value,
 d.type 
FROM 
 data d 
JOIN 
 devices s 
ON 
 s.id = d.mac 
WHERE 
 s.school = "Berkeley High School" 
ORDER BY 
 s.name, d.timestamp
EOF

cp "${OUT_DIR}/${DAY}_CO2.json" $GIT_DATA

rm $DB

cd $GIT_DATA

FILE_LIST=`ls -1rt *_CO2.json | jq -R -s -c 'split("\n")[:-1]'`

echo $FILE_LIST > files.json

WEATHER_DAY=`date +"%Y-%m-%d"`
API_KEY=FSTH42R57F8NUKA7K3WMWNDG7
URL="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Berkeley%2C%20CA/${WEATHER_DAY}/?unitGroup=us&elements=datetimeEpoch%2Ctemp%2Cwindspeed%2Cwinddir%2Ccloudcover&include=hours&key=${API_KEY}&contentType=json"

curl $URL  | jq .days[].hours > $GIT_DATA/${DAY}_weather.json

git add .