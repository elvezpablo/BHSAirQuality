import '@emotion/react';
import { MantineTheme } from '@mantine/styles';


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

export type Data = {
  name: string;
  mac: number;
  timestamp: number;
  value: number;
  id: number;
  type?: number;
};

export type DayData = {
  [s:string]: {
    date: Date
    path: string
  }
}

export type SensorType = 'TFAHRENHEIT' | 'VOC' | 'CO2' | 'RH';

export type Sensors = Map<SensorType, SensorData>;


declare module '@emotion/react' {
  export interface Theme extends MantineTheme {}
}