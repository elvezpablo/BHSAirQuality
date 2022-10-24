import { Text } from "@visx/text";
import styled from "@emotion/styled";

const Building = styled.path<{ selected: boolean }>`
  stroke: white;
  stroke-width: 3;
  fill: ${({ selected, theme }) =>
    selected ? theme.colors.blue[8] : "transparent"};
  fill-opacity: 0.6;
  :hover {
    cursor: pointer;
    fill: ${({ selected, theme }) =>
      selected ? theme.colors.blue[8] : theme.colors.gray[9]};
    fill-opacity: 0.8;
  }
`;

type Props = {
  selected: string;
  onSelect: (building: string) => void;
};

export default function CampusMap({ selected, onSelect }: Props) {
  const strokeWidth = 4;
  const strokeColor = "white";

  return (
    <svg  fill="transparent" viewBox="0 0 461 662">
      <pattern id="mapHatch" patternUnits="userSpaceOnUse" width="4" height="4">
        <path
          d="M-1,1 l2,-2
           M0,4 l4,-4
           M3,5 l2,-2"
          style={{ stroke: "rgb(66, 66, 66, .8)", strokeWidth: 1 }}
        />
      </pattern>
      {/* E */}
      <Building
        d="M376 249.5V193H460V249.5H455V297H460V351.5H443V357.5H391.5V351.5H376V293H387.5V261.5H381.5V249.5H376Z"
        selected={selected == "E"}
        onClick={() => onSelect("E")}
      />
      <Text
        x={410}
        y={280}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        E
      </Text>
      {/* D */}
      <Building
        d="M364 55.5V7.5H387.5V12.5H404.5V1H416.5V12.5H460V175H398C383.5 175 374.61 161.5 374.315 152.5C374.042 144.195 381 130.5 398 130.5V76.5H381V55.5H364Z"
        selected={selected == "D"}
        onClick={() => onSelect("D")}
      />
      <Text
        x={420}
        y={100}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        D
      </Text>
      {/* H */}
      <Building
        d="M5.5 34V12.5L105 8.5L110 53.5H63V148H85V175H63V192H5.5V44.5H11.5V34H5.5Z"
        stroke={strokeColor}
        selected={selected == "H"}
        onClick={() => onSelect("H")}
      />
      <Text
        x={25}
        y={100}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        H
      </Text>
      {/* C */}
      <Building
        d="M128.5 289V244L174 242.5V235L303.5 230V236H354V284H309.5V292.5H296.5V285.5L179.5 289V295H168.5V289H128.5Z"
        selected={selected == "C"}
        onClick={() => onSelect("C")}
      />
      <Text
        x={235}
        y={268}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        C
      </Text>
      {/* F */}
      <Building
        d="M188 449V396H307V387H326V449H276V458.5H246.5V449H188Z"
        selected={selected == "F"}
        onClick={() => onSelect("F")}
      />
      <Text
        x={255}
        y={430}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        F
      </Text>
      {/* M */}
      <Building
        d="M374 450V383H461V496.5H444V504.5H399V496.5H382.5V450H374Z"
        selected={selected == "M"}
        onClick={() => onSelect("M")}
      />
      <Text
        x={410}
        y={440}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        M
      </Text>
      {/* G */}
      <Building
        d="M31 217.5V208.5H63V221.5H85V310H117V338H85V372H69.5V359.5H59V372H8.5V320.5H1V281H5.5V217.5H31Z"
        selected={selected == "G"}
        onClick={() => onSelect("G")}
      />
      <Text
        x={35}
        y={298}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        G
      </Text>
      {/* everything below is not interactive */}
      {/* A */}
      <path
        fill={"url(#mapHatch)"}
        d="M127 66.0103V23.5103H161.5V28.0103H188.5C224.884 -2.83349 247.035 -2.05426 288.5 19.5103H319V11.5103H347.5V61.5103H329.5V84.0103H319C317.214 103.969 314.492 113.017 305.5 124.01L313 132.51L303.5 142.01L307.5 147.01L295 160.51L283.5 147.01C257.905 163.658 241.433 164.662 208.5 152.51L195 170.01L186.5 164.51L191.5 157.51L178 147.01L186.5 135.51C173.803 120.848 169.404 110.546 167 88.0103H155V66.0103H127Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Text
        x={233}
        y={100}
        fontSize={"1.5rem"}
        fontWeight="bold"
        fill={strokeColor}
        pointerEvents="none"
      >
        A
      </Text>
      {/* track */}
      <path
        fill={"url(#mapHatch)"}
        d="M8.5 602.5V463C14 434 48 407.474 93 407.471C145 407.466 169 438 176 463V602.5C176 640.5 126 663.7 93 661.5C55.5 659 8.5 639.5 8.5 602.5Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* baseball */}
      <path
        fill={"url(#mapHatch)"}
        d="M460 661V516C460 516 389.5 509.731 350 551C310.5 592.269 315 661 315 661H460Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
