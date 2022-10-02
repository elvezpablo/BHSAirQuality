import React, { useEffect, useState, Fragment } from 'react';
import {
  Title,
  Button,
  Text,
  Group,
  SimpleGrid,
  Container,
  NativeSelect,
  Grid,
  Stack,
} from '@mantine/core';
import { SensorLocation, SensorData, SensorType, Sensors } from './types';

import Sensor from './components/Sensor';
import {
  getCO2Color,
  getHumidityColor,
  getTempColor,
  getVOCColor,
} from './colors';

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
  if (room) {
    return room.pop()[0];
  }

  return description.match(/^BHS # ([A-Z])/)[1];
};

const parseSensorLocation = (data: SensorLocation[]): SensorLocation[] => {
  return data
    .map(({ id, description, mac, lastReportTime }) => ({
      id,
      description,
      mac,
      room: description.match(/[0-9]{2,3}/)
        ? parseInt(description.match(/[0-9]{2,3}/)[0])
        : 100,
      lastReportTime: new Date(lastReportTime),
      building: firstLetter(description),
    }))
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

    data.set(SensorTypeMap[d.type], d);
    macMap.set(d.mac, data);
  });

  return macMap;
};

export default function App() {
  const [sensors, setSensors] = useState<SensorLocation[]>([]);
  const [sensorDataMap, setSensorDataMap] = useState<Map<number, Sensors>>();
  const [buildings, setBuildings] = useState<string[]>([]);
  const [building, setBuilding] = useState('');

  useEffect(() => {
    (async () => {
      const chosenBuilding = sensors.filter((s) => s.building === building);
      const ids = chosenBuilding.map((c) => c.id);
      // load all sensors for building
      const macMap = await loadSensorData(ids);

      setSensorDataMap(macMap);
    })();
  }, [building]);

  const loadStatus = async () => {
    const response = await fetch(GET_DEVICES_URL);
    const json = await response.json();

    const s = parseSensorLocation(json[0].sensorLocations);
    const buildings = s
      .map((c) => c.building)
      .filter((val, idx, self) => self.indexOf(val) === idx);

    setBuildings(buildings);
    setSensors(s);
    setBuilding('C');
  };

  return (
    <Container>
      <Group position="apart" py={'sm'}>
        <Title order={2}>Berkeley High Building {building}</Title>
        <Group>
          <NativeSelect
            data={buildings}
            placeholder={building}
            onChange={(e) => setBuilding(e.target.value)}
          />
          <Button
            radius="xs"
            onClick={() => {
              loadStatus();
            }}
          >
            Load
          </Button>
        </Group>
      </Group>
      <SimpleGrid cols={4}>
        {sensors
          .filter((s) => s.building === building)
          .sort((a, b) => (a.room > b.room ? 1 : -1))
          .map((s) => {
            const data = sensorDataMap ? sensorDataMap.get(s.mac) : undefined;

            return (
              <div style={{ border: '1px solid #333' }} key={s.id}>
                <Title order={4}>{s.description}</Title>

                {data && (
                  <div>
                    <Sensor
                      label={<span>Temp</span>}
                      data={data.get('TFAHRENHEIT')}
                      getColor={getTempColor}
                      units={'˚F'}
                    />
                    <Sensor
                      label={<span>VOC</span>}
                      data={data.get('VOC')}
                      getColor={getVOCColor}
                      units={'%'}
                    />

                    <Sensor
                      label={<span>Humidity</span>}
                      data={data.get('RH')}
                      getColor={getHumidityColor}
                      units={'%'}
                    />
                    <Sensor
                      label={
                        <span>
                          CO<sub>2</sub>
                        </span>
                      }
                      data={data.get('CO2')}
                      getColor={getCO2Color}
                      units={'ppm'}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </SimpleGrid>
    </Container>
  );
}
