const HOST = "https://bhs.prangel.workers.dev";
const VERSION = "/v1";
const URL = `${HOST}${VERSION}`;

const getBuildings = async (): Promise<string[]> => {
  const response = await fetch(`${URL}/buildings`);
  if (!response.ok) {
    throw new Error("could not fetch buildings");
  }
  const json = await response.json();

  return json as string[];
};

export type SensorResponse = {
  id: number;
  mac: number;
  timestamp: number;
  name: string;
  room: string;
  data: number;
};

export type SensorDataResponse = {
  id: number;
  mac: number;
  timestamp: string;
  name: string;
  room: string;
  data: number;
};

export type SensorData = {
  timestamp: number;
  data: number;
  id: number;
};

export type SensorsDataLists = {
  [type: number]: SensorData[];
};

export type SensorsData = {
  [mac: string]: {
    room: string;
    name: string;
    data: SensorsDataLists;
  };
};

const getBuildingData = async (
  building_id: string,
  sensor_type: number = 181,
  date?: string
): Promise<SensorsData> => {
  let url = `${URL}/building/${building_id}/type/${sensor_type}`;
  if (date) {
    url += `?date=${date}`;
  }
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`could not fetch building "${building_id}" sensors`);
  }
  const json = (await response.json()) as SensorDataResponse[];

  const sensorData: SensorsData = {};

  json.forEach((s) => {
    if (!Reflect.has(sensorData, s.mac)) {
      const d: SensorsDataLists = {};
      d[sensor_type] = [
        {
          id: s.id,
          data: s.data,
          timestamp: parseInt(s.timestamp),
        },
      ];

      sensorData[s.mac] = {
        room: s.room,
        name: s.name,
        data: d,
      };
    } else {
      sensorData[s.mac].data[sensor_type].push({
        id: s.id,
        data: s.data,
        timestamp: parseInt(s.timestamp),
      });
    }
  });

  return sensorData;
};

const getBuildingMaxData = async (
  building_id: string,
  sensor_type: number = 181,
  date?: string
): Promise<SensorResponse[]> => {
  let url = `${URL}/building/${building_id}/type/${sensor_type}/max`;
  if (date) {
    url += `?date=${date}`;
  }
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`could not fetch building "${building_id}" sensors`);
  }
  const json = await response.json();

  return json as SensorResponse[];
};

const getSensorData = async (
  sensor_id: string,
  sensor_type: number = 181,
  date?: string
): Promise<SensorResponse> => {
  const response = await fetch(
    `${URL}/sensor/${sensor_id}/data/${sensor_type}`
  );

  if (!response.ok) {
    throw new Error(`could not fetch sensor ${sensor_id}`);
  }
  const json = await response.json();

  return json as SensorResponse;
};
1;

export { getBuildings, getBuildingData, getSensorData, getBuildingMaxData };
