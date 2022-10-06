import React, { useEffect, useMemo, useState } from 'react';
import {
  Title,
  Group,
  SimpleGrid,
  Container,
  NativeSelect,
} from '@mantine/core';
import { SensorLocation, SensorData, SensorType, Sensors } from './types';
import Sensor from './components/Sensor';
import {
  getCO2Color,
  getHumidityColor,
  getTempColor,
  getVOCColor,
  colors,
} from './colors';
import CO2Graph from './components/CO2Graph';
import { scaleLinear } from '@visx/scale';

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
  };

  const colorScale = useMemo(() => {
    return scaleLinear({
      domain: colors.map(x => x.ppm),
      range: colors.map(x => x.color)
    })
  }, [])

  return (
    <Container>
      <Group position="apart" py={'sm'}>
        <Title order={2}>Berkeley High Building {building}</Title>
        <Group>
          Select Building
          <NativeSelect
            data={buildings}
            placeholder={building}
            onChange={(e) => setBuilding(e.target.value)}
          />
        </Group>
      </Group>
      <SimpleGrid cols={4}>
        {sensors
          .filter((s) => s.building === building)
          .sort((a, b) => (a.room > b.room ? 1 : -1))
          .map((s) => {
            const data = sensorDataMap ? sensorDataMap.get(s.mac) : undefined;

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
                    {/* <Sensor
                      label={<span>Temp</span>}
                      data={data.get('TFAHRENHEIT')}
                      getColor={getTempColor}
                      units={'˚F'}
                    />
                    <Sensor
                      label={<span>VOC</span>}
                      data={data.get('VOC')}
                      getColor={getVOCColor}
                      units={'ppm/ppb'}
                    />

                    <Sensor
                      label={<span>Humidity</span>}
                      data={data.get('RH')}
                      getColor={getHumidityColor}
                      units={'%'}
                    /> */}
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
                {data && data.get('CO2') && <CO2Graph mac={data.get('CO2')?.mac} />}
              </div>
            );
          })}
      </SimpleGrid>
    </Container>
  );
}
