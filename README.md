# BHS Air Quality

Data output from IAQ Dashboard API.

https://berkeleyusdpublic.iaqdashboard.ca/public-portal.html

## Research and CURL requests

School IDS are embedded in the HTML page and have been imported in the `/data/schools.json` file.

This project uses the Berkeley High id as the payload for the sensor request.

### School Sensor Data

Request sensor information for a school via POST request with an array of school ids.

This project sends a single id for Berkeley High.

```bash

curl https://iot.aretas.ca/rest/publicaccess/getdevices?publicAccessToken=2dda18d0-f7e8-486e-903d-eebf831a9bf0&locationIds=c62e0d42341740bfbd3bb321154219df

```

### Response

Example response snippet. The array of sensor data is used to construct the second request for all the sensor information. This can be sent as one request with multiple ids.

```json
[
  {
    "city": "Berkeley",
    "country": "United States",
    "description": "Berkeley High School",
    "id": "c62e0d42341740bfbd3bb321154219df",
    "lat": 37.867386,
    "lon": -122.27141,
    "owner": "c0971f38e406e0373232b466e401d2a2",
    "state": "California",
    "streetAddress": "1980 Allston Way",
    "timezone": "America/Los_Angeles",
    "zipCode": "94704",
    "sensorLocations": [
      {
        "areaType": 0,
        "areaUsageHints": {
          "ceilingHeight": -1,
          "floorArea": -1,
          "hasOpeningWindows": -1,
          "hasPeople": -1,
          "occupantCountHint": -1
        },
        "buildingMapId": "3c78dbf90c0d434bbaf1d3857fd13610",
        "description": "BHS # H301",
        "downInterval": 0,
        "id": "03153b9b495242368cd7c72d87338f8a",
        "imgMapX": 1610,
        "imgMapY": 2358,
        "isShared": false,
        "isSharedPublic": true,
        "lastReportTime": 1656301154107,
        "lat": 37.867386,
        "lon": -122.27141,
        "mac": 1102833697,
        "notifyIfDown": false,
        "owner": "c62e0d42341740bfbd3bb321154219df",
        "ownerClientId": "c0971f38e406e0373232b466e401d2a2"
      }
    ]
  }
] 
```


### Parsing Data

The sensor `description` is parsed to separate the sensors by building and floor.

## Sensor Data

The array of sensor ids is used to request information on the 4 sensors. The request below queries for a single sensor.

```bash

 curl -v -X POST -d '["06d5b139864c474e88434ec20e8f4132"]' -H "Content-Type: application/json" "https://iot.aretas.ca/rest/publicaccess/latestdata?publicAccessToken=2dda18d0-f7e8-486e-903d-eebf831a9bf0"
 
````

### Sensor Response

For BHS ~160 sensor ids are sent but not all return data. 

```json
[
  {
    "data": 72.76058,
    "mac": 1102832393,
    "timestamp": 1664889004527,
    "type": 242
  },
  {
    "data": 11748,
    "mac": 1102832393,
    "timestamp": 1664889025727,
    "type": 96
  },
  {
    "data": 54.439613,
    "mac": 1102832393,
    "timestamp": 1664889009846,
    "type": 248
  },
  {
    "data": 447,
    "mac": 1102832393,
    "timestamp": 1664889015167,
    "type": 181
  }
]
```

The sensor data is parsed into a map with the `mac` (assuming mac address of the device) as the lookup key.

- 242 = TFAHRENHEIT
- 96 = VOC
- 181 = CO2
- 248 = RH

The bin thresholds for the each sensor type are located in the `/data/sensorType.json` file and are used to color the value pills.
