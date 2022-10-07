import React from "react";
import {
  scaleLinear,
  scaleOrdinal,
  scaleThreshold,
  scaleQuantile,
} from "@visx/scale";
// import { GlyphStar, GlyphWye, GlyphTriangle, GlyphDiamond } from '@visx/glyph';
import { LegendLinear, LegendItem, LegendLabel } from "@visx/legend";
import { colors } from "../colors";

const oneDecimalFormat = (f: number) => parseFloat(`${f}`).toFixed(2);
const legendGlyphSize = 10;

const linearScale = scaleLinear({
  domain: colors.map((x) => x.ppm),
  range: colors.map((x) => x.color),
});

export default function Legend() {
  return (
	<div style={{position: "absolute", top: "60px", right: "-90px"}} >
    <LegendLinear
      scale={linearScale}
      labelFormat={(d) => `${d.valueOf()} ppm`}
	  steps={colors.length}
	  itemDirection="column"
	  
    >
      {(labels) =>
        labels.map((label, i) => (
          <LegendItem
            key={`legend-quantile-${i}`}
            onClick={() => {
              alert(`clicked: ${JSON.stringify(label)}`);
            }}
          >
            <svg
              width={legendGlyphSize}
              height={legendGlyphSize}
              style={{ margin: "2px 0" }}
            >
              <circle
                fill={label.value}
                r={legendGlyphSize / 2}
                cx={legendGlyphSize / 2}
                cy={legendGlyphSize / 2}
              />
            </svg>
            <LegendLabel align="left" margin="0 4px">
              {label.text}
            </LegendLabel>
          </LegendItem>
        ))
      }
    </LegendLinear>
	</div>
  );
}
