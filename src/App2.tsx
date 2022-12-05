import {
  Center,
  Container,
  Group,
  Loader,
  NativeSelect,
  Title,
} from "@mantine/core";
import CampusMap from "./components/CampusMap";
import Legend from "./components/Legend";
import { DatePicker } from "@mantine/dates";
import { useAtom } from "jotai";
import {
  loadBuildingsAtom,
  selectorControlAtom,
  sensorsAtom,
} from "./state/Selector";
import CO2Bars from './components/data/CO2Bars';

export default function App2() {
  const [buildings] = useAtom(loadBuildingsAtom);
  const [{ building, state, date }, setSelction] = useAtom(selectorControlAtom);
  const [sensors] = useAtom(sensorsAtom);

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
            disabled={state === "loading"}
            onChange={(e) => {
              setSelction({ date, building: e.target.value });
            }}
          />
          <DatePicker
            placeholder="Today"
            firstDayOfWeek="sunday"
            minDate={new Date("Oct 3 2022 080:00:00 GMT-0800")}
			onChange={(e) => {console.log(e)}}
          />
        </Group>
      </Group>
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ width: "48%" }}>
          <CampusMap
            onSelect={(b) => setSelction({ date, building: b })}
            selected={building}
          />
        </div>
        <div style={{ width: "52%", height: "800px", overflowY: "auto" }}>
          {Object.keys(sensors).slice(0,10).map((s) => {
            const sensor = sensors[parseInt(s)];
            return <CO2Bars key={sensor.name} sensorData={sensor.data[181]} />
            // return <div key={sensor.name}>{`${sensor.room}`}</div>;
          })}
        </div>
      </div>
    </Container>
  );
}
