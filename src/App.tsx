import React, { useEffect, useMemo, useState } from 'react';
import {
  Title,
  Group,
  SimpleGrid,
  Container,
  NativeSelect,
} from '@mantine/core';
import { SensorLocation, SensorData, SensorType, Sensors, Data, DayData } from './types';
import Sensor from './components/Sensor';
import {
  colors,
} from './colors';
import CO2Graph from './components/CO2Graph';
import { scaleLinear } from '@visx/scale';
import Legend from './components/Legend';
import d0510 from "./data/051022_CO2.json";
import d0610 from "./data/061022_CO2.json";
import d0710 from "./data/071022_CO2.json";
import d1010 from "./data/101022_CO2.json";
import d1110 from "./data/111022_CO2.json";
import d1210 from "./data/121022_CO2.json";



const days:DayData = {
  "12/10": {
    date: new Date("Wed Oct 12 2022 06:00:00 GMT-0700 (Pacific Daylight Time)"),
    data: d1210
  },
    "11/10": {
      date: new Date("Tue Oct 11 2022 06:00:00 GMT-0700 (Pacific Daylight Time)"),
      data: d1110
    },
    "10/10": {
      date: new Date("Mon Oct 10 2022 06:00:00 GMT-0700 (Pacific Daylight Time)"),
      data: d1010
    },
    "07/10": {
      date: new Date("Fri Oct 07 2022 06:00:00 GMT-0700 (Pacific Daylight Time)"),
      data: d0710
    },
    "06/10": {
      date: new Date("Thu Oct 06 2022 06:00:00 GMT-0700 (Pacific Daylight Time)"),
      data: d0610,
    },
    "05/10": {
      date: new Date("Wed Oct 05 2022 06:00:00 GMT-0700 (Pacific Daylight Time)"),
      data: d0510
    }
}
  


const SCHOOL = 'c62e0d42341740bfbd3bb321154219df';
const API_KEY = '2dda18d0-f7e8-486e-903d-eebf831a9bf0';
const BASE_PATH = 'https://iot.aretas.ca/rest/publicaccess/';
const GET_DEVICES_URL = `${BASE_PATH}getdevices?publicAccessToken=${API_KEY}&locationIds=${SCHOOL}`;
const GET_LATEST_DATA = `${BASE_PATH}latestdata?publicAccessToken=${API_KEY}`;

const SensorTypeMap: { [key: number]: SensorType } = {
  242: 'TFAHRENHEIT',
  96: 'VOC',
  181: 'CO2',
  248: 'RH',
};

const firstLetter = (description: string) => {
  const room = description.match(/[A-Z][0-9]{1,3}/);

  if (room && room.length > 0) {    
    return room[0][0];
  }

  const match = description.match(/^BHS # ([A-Z])/);
  return match ? match[1] : "X";
  
};

const parseSensorLocation = (data: SensorLocation[]): SensorLocation[] => {
  return data
    .map(({ id, description, mac, lastReportTime }) => {
      const room = description.match(/[0-9]{2,3}/);
      return {
      id,
      description,
      mac,
      room: room ? parseInt(room[0]) : 100,
      lastReportTime: new Date(lastReportTime),
      building: firstLetter(description),
    }
    
  })
    .sort((a, b) => (a.building > b.building ? 1 : -1));
};

const loadSensorData = async (ids: string[]) => {
  const response = await fetch(GET_LATEST_DATA, {
    method: 'POST',
    body: JSON.stringify(ids),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json: SensorData[] = await response.json();
  const macMap = new Map<number, Sensors>();
  json.forEach((d) => {
    const data = macMap.has(d.mac)
      ? macMap.get(d.mac)
      : new Map<SensorType, SensorData>();

      if(data) {
        data.set(SensorTypeMap[d.type], d);
        macMap.set(d.mac, data);
      }
  });

  return macMap;
};

export default function App() {
  const [sensors, setSensors] = useState<SensorLocation[]>([]);
  const [sensorDataMap, setSensorDataMap] = useState<Map<number, Sensors>>();
  const [buildings, setBuildings] = useState<string[]>([]);
  const [building, setBuilding] = useState('');
  const [dayData, setDayData] = useState<Data[]>(d0710);
  const [day, setDay] = useState<string>('12/10');

  useEffect(() => {
    (async () => {
      await loadStatus();
      setBuilding('C');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const chosenBuilding = sensors.filter((s) => s.building === building);
      const ids = chosenBuilding.map((c) => c.id);
      // load all sensors for building
      const macMap = await loadSensorData(ids);

      setSensorDataMap(macMap);
    })();
  }, [building, dayData]);

  const loadStatus = async () => {
    const response = await fetch(GET_DEVICES_URL);
    const json = await response.json();

    const s = parseSensorLocation(json[0].sensorLocations);
    const buildings = s
      .map((c) => c.building)
      .filter((val, idx, self) => self.indexOf(val) === idx);

    setBuildings(buildings);
    setSensors(s);
  };

  const colorScale = useMemo(() => {
    return scaleLinear({
      domain: colors.map(x => x.ppm),
      range: colors.map(x => x.color)
    })
  }, []);

  return (
    <Container style={{position: "relative"}}>
      <Group position="apart" py={'sm'}>
        <Title order={2}>Berkeley High Building {building}</Title>
        <Legend />
        <Group>
          Select Building
          <NativeSelect
            data={buildings}
            placeholder={building}
            onChange={(e) => setBuilding(e.target.value)}
          />
          Day
          <NativeSelect
            data={Object.keys(days)}
            value={day}
            onChange={(e) => {
              setDay(e.target.value);              
            }}
          />
        </Group>
      </Group>
      <SimpleGrid cols={4}>
        {sensors
          .filter((s) => s.building === building)
          .sort((a, b) => (a.room > b.room ? 1 : -1))
          .map((s) => {
            const data = sensorDataMap ? sensorDataMap.get(s.mac) : undefined;

            if(typeof data === "undefined") {
              return "";
            }

            return (
              <div
                style={{
                  border: '1px solid #333',
                  backgroundColor: 'rgb(180,180,180, .3)',
                  borderRadius: '3px',
                }}
                key={s.id}
              >
                <Title
                  style={{
                    textAlign: 'center',
                    padding: '4px',
                    backgroundColor: 'rgb(200,200,200, 1)',
                    borderBottom: '1px solid rgb(100,100,100,.4)',
                  }}
                  order={4}
                >
                  {s.description.replace('BHS # ', '')}
                </Title>

                {data && (
                  <div>
                    <Sensor
                      label={
                        <span>
                          Current CO<sub>2</sub>
                        </span>
                      }
                      data={data.get('CO2')}
                      getColor={colorScale}
                      units={'ppm'}
                    />
                  </div>
                )}
                {data && data.get('CO2') && <CO2Graph day={days[day].date} sensorData={days[day].data} mac={data.get('CO2')?.mac} />}
              </div>
            );
          })}
      </SimpleGrid>
    </Container>
  );
}
