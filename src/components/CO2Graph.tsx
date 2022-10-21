import { Group as SVGGroup } from "@visx/group";
import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";
import { Bar, BarRounded } from "@visx/shape";
import { Text } from "@visx/text";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { colors } from "../colors";
import { Data } from "../types";

type Props = {
  mac: number | undefined;
  sensorData: Data[];
  day: Date;
  isDark: boolean;
};

const getPPM = (d: Data) => Math.round(d.value);
const getTime = (d: Data) =>
  `${new Date(d.timestamp).getHours()}:${new Date(d.timestamp).getMinutes()}`;
const getTimestamp = (d: Data) => d.timestamp;

export default function CO2Graph({ mac, sensorData, day, isDark }: Props) {
  const data = sensorData.filter((d) => d.mac === mac);
  day.setHours(6);
  day.setMinutes(0);
  const startTime = day.getTime();
  day.setHours(18);
  day.setMinutes(45);
  const endTime = day.getTime();

  if (typeof data === "undefined" || data.length === 0) {
    return <div>No data</div>;
  }

  const [hoverdTime, setHoveredTime] = useState("");
  const width = 454;
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
      domain: colors.map((x) => x.ppm),
      range: colors.map((x) => x.color),
    });
  }, [sensorData]);

  const maxCO2 = data.reduce((prev, curr) => {
    if (!prev) {
      return curr;
    }
    if (getPPM(curr) > getPPM(prev)) {
      return curr;
    }
    return prev;
  });

  day.setHours(11);
  day.setMinutes(41);
  const lunchStart = day.getTime();

  day.setHours(12);
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

  const fillColor = isDark ? "rgb(200, 200, 200, .8)" : "rgb(10, 10, 10, .8)";
  
  return (
    <div style={{ overflow: "auto" }}>
      <svg width={width} height={height}>
        <pattern
          id="diagonalHatch"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <path
            d="M-1,1 l2,-2
           M0,4 l4,-4
           M3,5 l2,-2"
            style={{ stroke: fillColor, strokeWidth: 1 }}
          />
        </pattern>
        <rect
          height={height}
          width={1}
          x={timeScale(firstPeriodStart)}
          y={0}
          fill={fillColor}
          opacity={0.4}
        />
        <rect
          height={height}
          width={lunchEndX - lunchStartX}
          x={lunchStartX}
          y={0}
          fill={"url(#diagonalHatch)"}
          opacity={0.2}
        />
        <rect
          height={height}
          width={1}
          x={timeScale(sixthPeriodEnd)}
          y={0}
          fill={fillColor}
          opacity={0.4}
        />
        <SVGGroup>
          {data.map((d) => {
            const barWidth = 5;
            const barHeight = height - (yScale(getPPM(d)) ?? 0);
            const barX = timeScale(getTimestamp(d));
            const barY = height - barHeight;

            return (
              <BarRounded
                key={`bar-${d.id}`}
                x={barX}
                y={barY}
                width={barWidth}
                opacity={0.8}
                radius={2}
                all
                height={barHeight}
                fill={colorScale(d.value)}
                onMouseEnter={() => {
                  
                  setHoveredTime(
                    `${Math.round(
                      d.value
                    )}ppm @ ${format(
                      new Date(d.timestamp),
                      "h:mm"
                    )}`
                  );
                }}
              />
            );
          })}
        </SVGGroup>
        
        <Text
          x={timeScale(maxCO2.timestamp) + 10}
          y={Math.max(yScale(maxCO2.value) - 20, 12)}
          fontSize={".8rem"}
          fill={fillColor}
          style={{"textShadow": "1px 1px rgb(0,0,0,.4)"}}
        >{`${Math.round(maxCO2.value)} ppm @ ${format(
          new Date(maxCO2.timestamp),
          "h:mm"
        )}`}</Text>
        <line
          x1={timeScale(maxCO2.timestamp) + 12}
          
          y1={Math.max(yScale(maxCO2.value) - 17, 14)}
          x2={timeScale(maxCO2.timestamp) + 4}
          y2={yScale(maxCO2.value) - 2}
          stroke={fillColor}
          strokeWidth={0.5}
        />
        <Text y={15} x={5} fontSize={".8rem"} style={{"textShadow": "1px 1px rgb(0,0,0,.4)"}} fill={fillColor}>
          {hoverdTime}
        </Text>
      </svg>
    </div>
  );
}
