import { Group } from "@mantine/core";
import { GradientTealBlue } from "@visx/gradient";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group as SVGGroup } from "@visx/group";
import { Bar } from "@visx/shape";
import React, { useMemo } from "react";
import { SensorData } from "../types";
import sensorData from "../data/051022_CO2.json";
import { getCO2Color } from '../colors';

type Data = {
  name: string;
  mac: number;
  timestamp: number;
  value: number;
};

const getPPM = (d: Data) => Math.round(d.value);
const getTime = (d: Data) =>
  `${new Date(d.timestamp).getHours()}:${new Date(d.timestamp).getMinutes()}`;

export default function CO2Graph({ mac }: { mac: number | undefined }) {
  const data = sensorData.filter((d) => d.mac === mac);
  const width = 218;
  const height = 180;
  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, width],
        round: true,
        domain: data.map(getTime),
        padding: 0.4,
      }),
    [width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [0, Math.max(...data.map(getPPM))],
      }),
    [height]
  );
  return (
    <div>
      <svg width={width} height={height}>
        
        <SVGGroup>
          {data.map((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = height - (yScale(getPPM(d)) ?? 0);
            const barX = xScale(getTime(d));
            const barY = height - barHeight;
            
            return (
              <Bar
                key={`bar-${d.timestamp}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={getCO2Color(d.value)}
                onClick={() => {
                  alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                }}
              />
            );
          })}
        </SVGGroup>
      </svg>
    </div>
  );
}
