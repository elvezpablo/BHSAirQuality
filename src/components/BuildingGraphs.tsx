import React, { useEffect, useMemo } from "react";
import { SimpleGrid, Title, useMantineTheme } from "@mantine/core";
import { scaleLinear } from "@visx/scale";
import CO2Graph from "./CO2Graph";
import { colors } from "../colors";
import Sensor from "./Sensor";
import { Data, DayData, SensorLocation, Sensors } from "../types";
import { Weather } from '../data/weather';

type Props = {
  day: string | undefined;
  days: DayData;
  dayData: Data[];
  building: string;
  sensors: SensorLocation[];
  sensorDataMap: Map<number, Sensors> | undefined;
  weather: Weather[];
};

export default function BuildingGraphs({
  building,
  day,
  dayData,
  days,
  sensorDataMap,
  sensors,
  weather
}: Props) {
  const theme = useMantineTheme();
  const colorScale = useMemo(() => {
    return scaleLinear({
      domain: colors.map((x) => x.ppm),
      range: colors.map((x) => x.color),
    });
  }, []);

  return (
    <SimpleGrid cols={1} >
      {sensors
        .filter((s) => s.building === building)
        .sort((a, b) => (a.room > b.room ? 1 : -1))
        .map((s) => {
          const data = sensorDataMap ? sensorDataMap.get(s.mac) : undefined;

          if (typeof data === "undefined") {
            return "";
          }

          return (
            <div
              style={{
                border: "1px solid #333",
                backgroundColor: "rgb(180,180,180, .3)",
                borderRadius: "3px",
                
              }}
              key={s.id}
            >
              <Title
                style={{
                  textAlign: "center",
                  padding: "4px",
                  backgroundColor: "rgb(200,200,200, .4)",
                  borderBottom: "1px solid rgb(100,100,100,.4)",
                }}
                order={4}
              >
                {s.description.replace("BHS # ", "")}
              </Title>

              {data && (
                <div>
                  <Sensor
                    label={
                      <span>
                        Current CO<sub>2</sub>
                      </span>
                    }
                    data={data.get("CO2")}
                    getColor={colorScale}
                    units={"ppm"}
                  />
                </div>
              )}
              {data && data.get("CO2") && day && weather && (
                <CO2Graph
                  day={days[day].date}
                  sensorData={dayData}
                  mac={data.get("CO2")?.mac}
                  isDark={theme.colorScheme === "dark"}
                  weather={weather}
                />
              )}
            </div>
          );
        })}
    </SimpleGrid>
  );
}
