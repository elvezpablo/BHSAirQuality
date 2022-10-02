import React from 'react';
import { SensorData } from '../types';

const getColor = (value: number) => {
  if (value >= 1000) {
    return 'red';
  }
  if (value >= 650) {
    return 'orange';
  }
  if (value >= 390) {
    return 'green';
  }
  return 'black';
};

type Props = {
  label: string;
  data: SensorData;
};

export default function Sensor({ data }: { data: SensorData }) {
  return (
    <div>
      <strong>
        CO<sub>2</sub>
      </strong>
      : <span style={{ color: getColor(data.data) }}>{data.data}</span>
    </div>
  );
}
