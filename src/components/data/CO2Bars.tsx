import { Group as SVGGroup } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { useMemo } from "react";
import { colors } from "../../colors";
import { SensorData } from "../../services/bhs";

type Props = {
  sensorData: SensorData[];
  date?: Date;
};

const getPPM = (d: SensorData) => d.data;
const getTimestamp = (d: SensorData) => d.timestamp;
const hours_8 = 28_800_000;
export default function CO2Bars({ sensorData, date }: Props) {

  const width = 472;
  const height = 160;
  const fillColor = "rgb(200, 200, 200, .8)";
  // TODO: need to adjust for timezone offset
  const day = typeof date === "undefined" ? new Date() : date;
  day.setHours(0,0,0,0);  
  
  const startTime = day.getTime() ;
  const endTime = startTime + hours_8 * 3;

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


  day.setHours(8);
  day.setMinutes(30);
  const firstPeriodStart = day.getTime();
  day.setMinutes(33);
  day.setHours(15);
  const sixthPeriodEnd = day.getTime();
  

  return (
      <svg width={width} height={height}>
        <SVGGroup>
          {sensorData.map((d) => {
            const barWidth = 3;
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
                fill={colorScale(d.data)}
                onClick={() => {
                  console.log(`${Math.round(d.data)}`)
                  console.log(new Date(d.timestamp))
                  console.log(d.timestamp)
                }}
              />
            );
          })}
        </SVGGroup>
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
          width={1}
          x={timeScale(sixthPeriodEnd)}
          y={0}
          fill={fillColor}
          opacity={0.4}
        />      
      </svg>
    
  );
}
