
import { scaleBand, scaleLinear, scaleOrdinal, scaleUtc } from "@visx/scale";
import { Group as SVGGroup } from "@visx/group";
import { Bar } from "@visx/shape";
import React, { Fragment, useMemo, useState } from "react";
import { Text } from '@visx/text';

import { colors } from '../colors';
import { Data } from '../types';



const getPPM = (d: Data) => Math.round(d.value);
const getTime = (d: Data) =>
  `${new Date(d.timestamp).getHours()}:${new Date(d.timestamp).getMinutes()}`;

export default function CO2Graph({ mac, sensorData }: { mac: number | undefined, sensorData: Data[] }) {

  const data = sensorData.filter((d) => d.mac === mac);
  
  if(typeof data === "undefined" || data.length === 0) {
    return <div>No data</div>
  }

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
    [width, sensorData]
  );
  const timeScale = useMemo(
    () =>
    scaleLinear<number>({
        range: [0, width],
        round: true,
        domain: [data[0].timestamp, data[data.length-1].timestamp]       
      }),
    [width, sensorData]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [0, 3000],
      }),
    [height, sensorData]
  );

  const colorScale = useMemo(() => {
    return scaleLinear({
      domain: colors.map(x => x.ppm),
      range: colors.map(x => x.color)
    })
  }, [sensorData])

  const maxCO2 = Math.max(...data.map(getPPM));
  const timestamps = data.map(t => t.timestamp).filter(t => typeof t !== "undefined");
  // console.log(timestamps)
  const today = new Date(timestamps.length ? timestamps[5] : "January");
  today.setHours(11)
  today.setMinutes(41);
  const lunchStart = today.getTime();
  today.setHours(12)
  today.setMinutes(21);
  const lunchEnd = today.getTime()
  return (
    <div>
      <svg width={width} height={height}>
        <Text y={15} x={5} fontSize={".8rem"}>{`Max: ${maxCO2} ppm`}</Text>
        <Text y={30} x={5} fontSize={".8rem"}>{hoverdTime}</Text>
        
        <SVGGroup>
          {data.map((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = height - (yScale(getPPM(d)) ?? 0);
            const barX = xScale(getTime(d));
            const barY = height - barHeight;
            
            return (
              <Fragment key={`bar-${d.id}`}>
              {d.timestamp > lunchStart && d.timestamp < lunchEnd && (
                <rect  height={height} width={barWidth+2} x={barX} y={0} fill={'rgb(200, 200, 200, .4)'} />
              )}
              <Bar
                
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={colorScale(d.value)}
                onMouseEnter={() => {
                   const t = new Date(d.timestamp);
                  setHoveredTime(`${Math.round(d.value)}ppm @${t.getHours()}:${t.getMinutes()}`)
                }}
              />
              </Fragment>
            );
          })}
        </SVGGroup>
      </svg>
    </div>
  );
}
