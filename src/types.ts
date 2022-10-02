export type SensorLocation = {
  description: string;
  id: string;
  mac: number;
  lastReportTime: Date;
  room: number;
  building: string;
};

export type SensorData = {
  data: number;
  mac: number;
  timestamp: number;
  type: number;
};

export type SensorType = 'TFAHRENHEIT' | 'VOC' | 'CO2' | 'RH';

export type Sensors = Map<SensorType, SensorData>;
