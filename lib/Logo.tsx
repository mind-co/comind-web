import React from "react";

interface LogoProps {
  size: number;
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  const letterSpacing = "-5";

  return (
    <svg
      width={size * 4.5}
      height={size}
      viewBox="0 0 100 100"
      style={{ zIndex: -1, pointerEvents: "none" }}
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="60"
        letterSpacing={letterSpacing}
        fontFamily="Frontage Pro Bold"
      >
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"{"}</tspan>
        <tspan fill="rgb(var(--comind-tertiary-rgb))">co</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">mind</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"}"}</tspan>
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing={letterSpacing}
        fontSize="60"
        fontFamily="Frontage Pro"
        opacity={0.25}
      >
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"{"}</tspan>
        <tspan fill="rgb(var(--comind-tertiary-rgb))">co</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">mind</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"}"}</tspan>
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing={letterSpacing}
        fontSize="60"
        fontFamily="Frontage Pro Bottom"
        opacity={0.25}
      >
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"{"}</tspan>
        <tspan fill="rgb(var(--comind-tertiary-rgb))">co</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">mind</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"}"}</tspan>
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="60"
        letterSpacing={letterSpacing}
        fontFamily="Frontage Pro Outline"
      >
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"{"}</tspan>
        <tspan fill="rgb(var(--comind-tertiary-rgb))">co</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">mind</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"}"}</tspan>
      </text>

      {/* <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="60"
        letterSpacing={letterSpacing}
        fontFamily="Frontage Pro Line"
      >
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"{"}</tspan>
        <tspan fill="rgb(var(--comind-tertiary-rgb))">co</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">mind</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">{"}"}</tspan>
      </text> */}

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="60"
        letterSpacing={letterSpacing}
        fontFamily="Frontage Pro Neon"
      >
        <tspan fill="var(--mantine-color-text)">{"{"}</tspan>
        <tspan fill="var(--mantine-color-text)">co</tspan>
        <tspan fill="var(--mantine-color-text)">mind</tspan>
        <tspan fill="var(--mantine-color-text)">{"}"}</tspan>
      </text>
      {/* <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="80"
        fontFamily="Frontage Pro Neon"
      >
        <tspan fill="rgb(var(--comind-primary-rgb))">co</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">mind</tspan>
      </text> */}
    </svg>
  );
};

export default Logo;
