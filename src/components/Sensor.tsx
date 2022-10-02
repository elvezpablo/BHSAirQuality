import { Group } from '@mantine/core';
import React, { ReactNode } from 'react';
import { SensorData } from '../types';
import styled from '@emotion/styled';

type Props = {
  label: ReactNode;
  data: SensorData | undefined;
  getColor: (value: number) => string;
  units: string;
};

const Value = styled.span<{ color: string }>`
  color: white;
  background-color: ${(props) => props.color};
  border-radius: 2px;
  padding: 0 3px;
  font-side: .8rem;
`;

const SubLabel = styled.div`
  color: rgb(33,33,33, .8);
  font-size: .7rem;
  // margin-top: -.5rem;
`;

export default function Sensor({ data, label, getColor, units }: Props) {
  if (typeof data === 'undefined') {
    return <div>No {label} data.</div>;
  }
  const value = Math.round(data.data);
  return (
    <Group
      style={{ borderTop: '1px solid rgb(33,33,33, .5)', padding: '.25rem' }}
      position="apart"
    >
      <div>
        <strong>{label}: </strong>
      </div>
      <Value color={getColor(value)}>
        {value}
        {units}
      </Value>
    </Group>
  );
}
