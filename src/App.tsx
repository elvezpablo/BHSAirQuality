import { Center, Container, Group, Loader, NativeSelect, Title } from "@mantine/core";
import { Suspense, useEffect, useState } from "react";
import BuildingGraphs from "./components/BuildingGraphs";
import CampusMap from './components/CampusMap';
import Legend from "./components/Legend";
import { loadSensorData, loadStatus } from "./services/Aretas";
import { getDayData, getDays } from "./services/PI";
import { Data, DayData, SensorLocation, Sensors } from "./types";

export default function App() {
  const [sensors, setSensors] = useState<SensorLocation[]>([]);
  const [sensorDataMap, setSensorDataMap] = useState<Map<number, Sensors>>();
  const [buildings, setBuildings] = useState<string[]>([]);
  const [building, setBuilding] = useState("");
  const [dayData, setDayData] = useState<Data[]>([]);
  const [days, setDays] = useState<DayData>({});
  const [day, setDay] = useState<string>();

  useEffect(() => {
    (async () => {
      const days = await getDays();
      const latest = Object.keys(days).at(-1);
      setDays(days);
      if (latest) {
        const data = await getDayData(days[latest].path);
        setDayData(data);
        setDay(latest);
      }
      const [buildingsData, sensorsData] = await loadStatus();
      setBuildings(buildingsData);
      setSensors(sensorsData);
      setBuilding("C");
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
  // console.log(sensors)
  return (
    <Container style={{ position: "relative" }}>
      <Group position="apart" py={"sm"}>
        <Title order={2}>Berkeley High Building {building}</Title>
        <Legend />
        <Group>
          Select Building
          <NativeSelect
            data={buildings}
            value={building}
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
              setDayData(data);
            }}
          />
        </Group>
      </Group>
      <div style={{display: "flex", gap: "16px"}}>
        <div style={{width:"48%"}}>
          <CampusMap onSelect={(b) => setBuilding(b)} selected={building} />
        </div>
        <div style={{width:"52%", height: "800px", overflowY: "auto"}}>
        {buildings.length > 0 ? (
      <BuildingGraphs
          day={day}
          building={building}
          sensors={sensors}
          sensorDataMap={sensorDataMap}
          days={days}
          dayData={dayData}
        />) : <Center><Loader/></Center>}
        </div>
      
      </div>
      
      
    </Container>
  );
}
