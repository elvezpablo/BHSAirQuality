

type Props = {
	isDark: boolean;
}

export default function DiagonalHatch({isDark}:Props) {
	const fillColor = isDark ? "rgb(200, 200, 200, .8)" : "rgb(10, 10, 10, .8)";
	return (
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
	)
}