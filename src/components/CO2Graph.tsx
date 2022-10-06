
import { scaleBand, scaleLinear, scaleUtc } from "@visx/scale";
import { Group as SVGGroup } from "@visx/group";
import { Bar } from "@visx/shape";
import React, { useMemo, useState } from "react";
import { Text } from '@visx/text';
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
  const [hoverdTime, setHoveredTime] = useState("");
  const width = 218;
  const height = 160;
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
  const timeScale = useMemo(
    () =>
    scaleLinear<number>({
        range: [0, width],
        round: true,
        domain: [data[0].timestamp, data[data.length-1].timestamp]       
      }),
    [width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [0, 3000],
      }),
    [height]
  );

  const maxCO2 = Math.max(...data.map(getPPM));

  const lunchStart = new Date('Wed Oct 05 2022 11:42:00 GMT-0700 (Pacific Daylight Time)').getTime();
  const lunchEnd = new Date('Wed Oct 05 2022 12:21:00 GMT-0700 (Pacific Daylight Time)').getTime()
  const lunchX = timeScale(lunchStart);

  const lunchWidth =  timeScale(lunchEnd) - lunchX;
  
  return (
    <div>
      <svg width={width} height={height}>
        <Text y={15} x={5} fontSize={".8rem"}>{`Max: ${maxCO2} ppm`}</Text>
        <Text y={30} x={5} fontSize={".8rem"}>{hoverdTime}</Text>
        {/* <rect height={height} width={lunchWidth} x={lunchX} y={0} fill={'rgb(0, 0, 100, .2)'} /> */}
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
                onMouseEnter={() => {
                   const t = new Date(d.timestamp);
                  setHoveredTime(`${t.getHours()}:${t.getMinutes()}`)
                }}
              />
            );
          })}
        </SVGGroup>
      </svg>
    </div>
  );
}
