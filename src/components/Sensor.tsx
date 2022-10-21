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
  text-shadow: 1px 1px rgb(0,0,0,.4);
`;


export default function Sensor({ data, label, getColor, units }: Props) {
  if (typeof data === 'undefined') {
    return (
      <div style={{ textAlign: 'center', lineHeight: '2rem' }}>
        No {label} data.
      </div>
    );
  }
  const value = Math.round(data.data);
  return (
    <Group
      style={{
        borderBottom: '1px solid rgb(100,100,100, .3)',
        padding: '.25rem',
        backgroundColor: 'rgb(10,10,10, .3)',
      }}
      position="apart"
    >
      <div>
        <strong>{label}: </strong>
      </div>
      <Value color={getColor(value)}>
        {value}
        <span style={{ fontSize: '.7rem' }}> {units}</span>
      </Value>
      
    </Group>
  );
}
