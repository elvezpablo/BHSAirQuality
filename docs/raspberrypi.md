# Raspberry Pi 

Software setup of Raspberry Pi 

## Cron

```bash
*/15 * * * * /bin/bash /home/pi/BUSD/getSensorData.sh >> /tmp/cronjob.log 2>&1
0 0 * * * /bin/bash -lc /home/pi/BUSD/processData.sh >> /tmp/cronjob.log 2>&1
```

## Scripts

There are 3 scripts which fit into 2 categories. 

### Data Capture

The `getSensorData.sh` script downloads the data from the [Aretas public API](https://api.com) and transforms the raw `json` for all the Berkeley public schools into CSV which can be more easily transformed using SQLite. 

This script is also performing a transformation of data which is uploaded directly into a Postgres database by the `school-data` script. This second script is a Golang script which filters the `json` to just Berkeley High data processing see below. 

### Data Processing

There are currently 2 redundant data flows of data processing which output data to external servers. 

The first is the github process which starts when the nightly cron job runs `processData.sh`. This script compiles the daily output into a single database with the device data and filters by Berkeley High school. It then outputs the Berkeley High data into a json file and makes it available for the manual github upload (commit and push).

The second uses the `school-data` Golang executable to compile the Berkeley High data. Instead of uploading to Github the data is imported to a hosted Postgres database at [Neon.tech](https://console.neon.tech/app/projects/cold-limit-763255)

### Data Storage

The raw data is currently stored as files on the Raspbery Pi. The processed data is both uploaded manually to github and uploaded to the Postgres server on `neon.tech` via the last step of the `getSensorData.sh` script. 

## Hosting

The code is hosted on Github with a commit to the `main` branch triggering a build process. On successful completion of the build Cloudflare will 

