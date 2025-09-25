import React from "react";

const ProgressCircle = ({ percentage = 0, label = "Complete" }) => {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className="progress-circle"
      style={{ display: "block", margin: "0 auto" }}
    >
      <circle
        stroke="#444"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#00ffcc"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset, transition: "stroke-dashoffset 0.35s" }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fill="#00ffcc"
        fontSize="24px"
        fontWeight="bold"
      >
        {percentage}%
      </text>
      <text
        x="50%"
        y="65%"
        dy=".3em"
        textAnchor="middle"
        fill="#00ffcc"
        fontSize="12px"
      >
        {label}
      </text>
    </svg>
  );
};

export default ProgressCircle;
