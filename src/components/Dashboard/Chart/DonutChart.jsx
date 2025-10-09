import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";

const PALETTE = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#60A5FA"];

function formatTotal(total, currency = false) {
  if (!currency) return new Intl.NumberFormat("pt-BR").format(total);
  const code = typeof currency === "string" ? currency : "BRL";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(total);
}

export default function DonutChart({
  title,
  data = [],
  total,
  currency = false,
  className = "",
  compact = false,
  diameter = 170,
  thickness = 24,
  legendPlacement = "below",
}) {
  const computedTotal = useMemo(
    () =>
      typeof total === "number"
        ? total
        : data.reduce((acc, d) => acc + (Number(d.value) || 0), 0),
    [total, data]
  );

  const displayData = useMemo(() => {
    if (computedTotal <= 0)
      return [{ name: "Sem dados", value: 1, color: "#E5E7EB" }];
    return data.map((d, i) => ({
      ...d,
      color: d.color || PALETTE[i % PALETTE.length],
    }));
  }, [data, computedTotal]);

  const outerRadius = Math.max(50, Math.round(diameter / 2) - 4);
  const innerRadius = Math.max(outerRadius - thickness, 28);

  const titleClasses = [
    "font-semibold text-gray-800 text-center",
    compact ? "text-large mb-4" : "text-base mb-4",
  ].join(" ");

  const sectionPadding = compact ? "p-4" : "p-6";
  const labelTopSize = compact ? 11 : 12;
  const labelBottomSize = compact ? 16 : 20;

  const legendItemClass = compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  const Chart = (
    <div
      style={{ width: diameter, height: diameter, minWidth: diameter }}
      className="flex-shrink-0 mx-auto"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            paddingAngle={4}
            cornerRadius={8}
            isAnimationActive
          >
            {displayData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
            <Label
              position="center"
              content={({ viewBox }) => {
                const { cx, cy } = viewBox || {};
                if (cx == null || cy == null) return null;
                return (
                  <>
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={labelTopSize}
                      fill="#6B7280"
                    >
                      Total
                    </text>
                    <text
                      x={cx}
                      y={cy + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={labelBottomSize}
                      fontWeight="600"
                      fill="#111827"
                    >
                      {formatTotal(computedTotal, currency)}
                    </text>
                  </>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const Legend = (
    <div
      className={`flex ${
        legendPlacement === "right" ? "flex-col" : "flex-wrap justify-center"
      } gap-2`}
    >
      {computedTotal > 0 ? (
        displayData.map((d) => (
          <span
            key={d.name}
            className={`inline-flex items-center gap-2 rounded-md border border-gray-200 ${legendItemClass} text-gray-700`}
          >
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            {d.name}
          </span>
        ))
      ) : (
        <span className="text-sm text-gray-500">Sem dados para o período</span>
      )}
    </div>
  );

  return (
    <section
      className={`bg-white rounded-xl ${sectionPadding} shadow-sm border border-gray-100 ${className}`}
      aria-label={title || "Gráfico do tipo donut"}
    >
      {title && <h3 className={titleClasses}>{title}</h3>}

      {legendPlacement === "right" ? (
        // grid com duas colunas e conteúdo JUSTAMENTE centralizado
        <div className="grid grid-cols-[auto_auto] items-center justify-center gap-4">
          {Chart}
          {Legend}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center">{Chart}</div>
          <div className="mt-3">{Legend}</div>
        </>
      )}
    </section>
  );
}
