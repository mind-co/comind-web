import React from "react";

interface LogoProps {
  size: number;
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  const letterSpacing = "-10";

  return (
    <svg width={size * 2.6} height={size} viewBox="0 0 100 100">
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
        <tspan fill="rgb(var(--comind-tertiary-rgb))">c</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">o</tspan>
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
        <tspan fill="rgb(var(--comind-tertiary-rgb))">c</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">o</tspan>
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
        <tspan fill="rgb(var(--comind-tertiary-rgb))">c</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">o</tspan>
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
        <tspan fill="rgb(var(--comind-tertiary-rgb))">c</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">o</tspan>
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
        <tspan fill="rgb(var(--comind-tertiary-rgb))">c</tspan>
        <tspan fill="rgb(var(--comind-primary-rgb))">o</tspan>
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
        <tspan fill="var(--mantine-color-text)">c</tspan>
        <tspan fill="var(--mantine-color-text)">o</tspan>
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
        <tspan fill="rgb(var(--comind-primary-rgb))">c</tspan>
        <tspan fill="rgb(var(--comind-secondary-rgb))">o</tspan>
      </text> */}
    </svg>
  );
};

export default Logo;
