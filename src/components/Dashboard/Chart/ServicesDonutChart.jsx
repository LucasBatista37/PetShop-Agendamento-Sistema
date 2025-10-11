import React from "react";
import BaseDonutChart from "./BaseDonutChart";

const SERVICES_PALETTE = [
  "#6366F1",
  "#60A5FA",
  "#F59E0B",
  "#A78BFA",
  "#10B981",
];

function formatNumber(n) {
  return new Intl.NumberFormat("pt-BR").format(n ?? 0);
}

export default function ServicesDonutChart({
  title,
  header = null,
  data = [],
  total,
  className = "",
  diameter = 180,
  thickness = 26,
  legendPlacement = "below",
  centerLabel = "serviços",
  percentPrecision = 0,
}) {
  return (
    <BaseDonutChart
      title={title}
      header={header}
      className={className}
      legendPlacement={legendPlacement}
      data={data}
      total={total}
      palette={SERVICES_PALETTE}
      diameter={diameter}
      thickness={thickness}
      legendMode="rows"
      showPercent
      percentPrecision={percentPrecision}
      valueFormatter={formatNumber}
      centerContent={({ cx, cy, total: t }) => (
        <>
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={24}
            fontWeight="700"
            fill="#111827"
          >
            {formatNumber(t)}
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill="#6B7280"
          >
            {centerLabel}
          </text>
        </>
      )}
    />
  );
}
