import React, { useEffect, useMemo, useState } from 'react';
import {
  Title,
  Group,
  SimpleGrid,
  Container,
  NativeSelect,
} from '@mantine/core';
import { scaleLinear } from '@visx/scale';
import { SensorLocation, Sensors, Data, DayData } from './types';
import Sensor from './components/Sensor';
import {colors} from './colors';
import CO2Graph from './components/CO2Graph';
import Legend from './components/Legend';
import { loadSensorData, loadStatus } from './services/Aretas';
import {getDayData, getDays} from './services/PI';

export default function App() {
  const [sensors, setSensors] = useState<SensorLocation[]>([]);
  const [sensorDataMap, setSensorDataMap] = useState<Map<number, Sensors>>();
  const [buildings, setBuildings] = useState<string[]>([]);
  const [building, setBuilding] = useState('');
  const [dayData, setDayData] = useState<Data[]>([]);
  const [days, setDays] = useState<DayData>({});
  const [day, setDay] = useState<string>();

  useEffect(() => {
    (async () => {
      const days = await getDays();
      const latest = Object.keys(days).at(-1);
      setDays(days);
      if (latest){

        const data = await getDayData(days[latest].path);
        setDayData(data);
        setDay(latest)
      }
      const [buildingsData, sensorsData] = await loadStatus();
      setBuildings(buildingsData);
      setSensors(sensorsData);
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
            onChange={async (e) => {
              setDay(e.target.value);
              const data = await getDayData(days[e.target.value].path);              
              setDayData(data)
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
                {data && data.get('CO2') && day && <CO2Graph day={days[day].date} sensorData={dayData} mac={data.get('CO2')?.mac} />}
              </div>
            );
          })}
      </SimpleGrid>
    </Container>
  );
}
