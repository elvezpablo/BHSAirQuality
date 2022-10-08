
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime, scaleUtc } from "@visx/scale";
import { Group as SVGGroup } from "@visx/group";
import { Bar } from "@visx/shape";
import React, { Fragment, useMemo, useState } from "react";
import { Text } from '@visx/text';

import { colors } from '../colors';
import { Data } from '../types';

type Props = { 
  mac: number | undefined, 
  sensorData: Data[] 
  day: Date
}

const getPPM = (d: Data) => Math.round(d.value);
const getTime = (d: Data) =>
  `${new Date(d.timestamp).getHours()}:${new Date(d.timestamp).getMinutes()}`;
const getTimestamp = (d:Data) => d.timestamp;


export default function CO2Graph({ mac, sensorData, day }: Props) {

  const data = sensorData.filter((d) => d.mac === mac);
  day.setHours(6);
  const startTime = day.getTime();
  day.setHours(18);
  const endTime = day.getTime();

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
    scaleTime<number>({
        range: [0, width],
        round: true,
        domain: [startTime, endTime],
           
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
  
  day.setHours(11)
  day.setMinutes(41);
  const lunchStart = day.getTime();

  day.setHours(12)
  day.setMinutes(21);
  const lunchEnd = day.getTime();

  const lunchStartX = timeScale(lunchStart);
  const lunchEndX = timeScale(lunchEnd);

  
  day.setHours(8);
  day.setMinutes(30);
  const firstPeriodStart = day.getTime();

  day.setMinutes(33);
  day.setHours(15);
  const sixthPeriodEnd = day.getTime();
  return (
    <div>
      <svg width={width} height={height}>
        <Text y={15} x={5} fontSize={".8rem"}>{`Max: ${maxCO2} ppm`}</Text>
        <Text y={30} x={5} fontSize={".8rem"}>{hoverdTime}</Text>
        <rect  height={height} width={1} x={timeScale(firstPeriodStart)} y={0} fill={'rgb(200, 200, 200, .8)'} />
        <rect  height={height} width={lunchEndX - lunchStartX} x={lunchStartX} y={0} fill={'rgb(200, 200, 200, .4)'} />
        <rect  height={height} width={1} x={timeScale(sixthPeriodEnd)} y={0} fill={'rgb(200, 200, 200, .8)'} />
        <SVGGroup>
          {data.map((d) => {
            const barWidth = 3;
            const barHeight = height - (yScale(getPPM(d)) ?? 0);
            const barX = timeScale(getTimestamp(d));
            const barY = height - barHeight;
            
            return (
              <Fragment key={`bar-${d.id}`}>
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
