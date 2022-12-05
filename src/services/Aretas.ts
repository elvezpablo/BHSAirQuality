import {
  SensorLocation,
  SensorData,
  SensorType,
  Sensors,
  Data,
  DayData,
} from "../types";

const SCHOOL = "c62e0d42341740bfbd3bb321154219df";
const API_KEY = "2dda18d0-f7e8-486e-903d-eebf831a9bf0";
const BASE_PATH = "https://iot.aretas.ca/rest/publicaccess/";
const GET_LATEST_DATA = `${BASE_PATH}latestdata?publicAccessToken=${API_KEY}`;
const GET_DEVICES_URL = `${BASE_PATH}getdevices?publicAccessToken=${API_KEY}&locationIds=${SCHOOL}`;

const SensorTypeMap: { [key: number]: SensorType } = {
  242: "TFAHRENHEIT",
  96: "VOC",
  181: "CO2",
  248: "RH",
  32: "PMC1.0", //PM 1.0 concentration (ug/m^3)
  33: "PMC2.5", // PM 2.5 concentration (ug/m^3)
  34: "PMC10" // PM 10 concentration (ug/m^3)
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
      };
    })
    .sort((a, b) => (a.building > b.building ? 1 : -1));
};

export const loadSensorData = async (ids: string[]) => {
  const response = await fetch(GET_LATEST_DATA, {
    method: "POST",
    body: JSON.stringify(ids),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json: SensorData[] = await response.json();
  const macMap = new Map<number, Sensors>();
  json.forEach((d) => {
    const data = macMap.has(d.mac)
      ? macMap.get(d.mac)
      : new Map<SensorType, SensorData>();

    if (data) {
      data.set(SensorTypeMap[d.type], d);
      macMap.set(d.mac, data);
    }
  });

  return macMap;
};

export const loadStatus = async () => {
    const response = await fetch(GET_DEVICES_URL);
    const json = await response.json();

    const sensors = parseSensorLocation(json[0].sensorLocations);
    const buildings = sensors
      .map((c) => c.building)
      .filter((val, idx, self) => self.indexOf(val) === idx);

	return [buildings, sensors] as const;
  };
