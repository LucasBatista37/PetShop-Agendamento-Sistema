import React from "react";
import BaseDonutChart from "./BaseDonutChart";

function formatTotal(total, currency = false) {
  if (!currency) return new Intl.NumberFormat("pt-BR").format(total ?? 0);
  const code = typeof currency === "string" ? currency : "BRL";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(total ?? 0);
}

const STATUS_PALETTE = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#60A5FA"];

export default function DonutChart({
  title,
  header = null,
  data = [],
  total,
  currency = false,
  className = "",
  compact = false,
  diameter = 170,
  thickness = 24,
  legendPlacement = "below",
}) {
  const sectionPadding = compact ? "p-4" : "p-4";
  const labelTopSize = compact ? 11 : 12;
  const labelBottomSize = compact ? 16 : 20;

  return (
    <BaseDonutChart
      title={title}
      header={header}
      className={className}
      sectionPadding={sectionPadding}
      legendPlacement={legendPlacement}
      data={data}
      total={total}
      palette={STATUS_PALETTE}
      diameter={diameter}
      thickness={thickness}
      legendMode="chips"
      centerContent={({ cx, cy, total: t }) => (
        <>
          <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fontSize={labelTopSize} fill="#6B7280">
            Total
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={labelBottomSize} fontWeight="600" fill="#111827">
            {formatTotal(t, currency)}
          </text>
        </>
      )}
    />
  );
}
