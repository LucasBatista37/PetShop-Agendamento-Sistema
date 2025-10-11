import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";

const DEFAULT_PALETTE = ["#6366F1", "#60A5FA", "#F59E0B", "#10B981", "#EF4444", "#A78BFA"];

export default function BaseDonutChart({
  title,
  header = null,
  className = "",
  sectionPadding = "p-4",
  legendPlacement = "below",
  data = [],
  total,
  emptyLabel = "Sem dados para o período",
  palette = DEFAULT_PALETTE,
  diameter = 180,
  thickness = 26,
  centerContent, 
  legendMode = "chips", 
  showPercent = false,
  percentPrecision = 0,
  valueFormatter = (n) => new Intl.NumberFormat("pt-BR").format(n ?? 0),
  legendItemClass = "text-sm",
}) {
  const computedTotal = useMemo(
    () => (typeof total === "number" ? total : (data || []).reduce((acc, d) => acc + (Number(d.value) || 0), 0)),
    [total, data]
  );

  const displayData = useMemo(() => {
    if (computedTotal <= 0) return [{ name: "Sem dados", value: 1, color: "#E5E7EB" }];
    return (data || []).map((d, i) => ({
      ...d,
      name: d.name ?? d.label ?? `Item ${i + 1}`,
      value: Number(d.value) || 0,
      color: d.color || palette[i % palette.length],
    }));
  }, [data, computedTotal, palette]);

  const outerRadius = Math.max(54, Math.round(diameter / 2) - 2);
  const innerRadius = Math.max(outerRadius - thickness, 28);

  const percent = (v) => (computedTotal > 0 ? ((v / computedTotal) * 100).toFixed(percentPrecision) : "0");

  const Legend =
    computedTotal > 0 ? (
      legendMode === "chips" ? (
        <div className="flex flex-wrap justify-center gap-2">
          {displayData.map((d) => (
            <span
              key={d.name}
              className={`inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 ${legendItemClass}`}
            >
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {displayData.map((d) => (
            <div key={d.name} className="flex items-center justify-between py-1 text-sm">
              <div className="inline-flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: d.color }} />
                <span className="text-gray-700">
                  {d.name} {showPercent && <span className="text-gray-500">({percent(d.value)}%)</span>}
                </span>
              </div>
              <span className="tabular-nums text-gray-800">{valueFormatter(d.value)}</span>
            </div>
          ))}
        </div>
      )
    ) : (
      <span className="text-sm text-gray-500">{emptyLabel}</span>
    );

  const Chart = (
    <div style={{ width: diameter, height: diameter, minWidth: diameter }} className="flex-shrink-0 mx-auto">
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
            {centerContent && (
              <Label
                position="center"
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox || {};
                  if (cx == null || cy == null) return null;
                  return centerContent({ cx, cy, total: computedTotal });
                }}
              />
            )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <section className={`bg-white rounded-xl ${sectionPadding} shadow-sm border border-gray-100 ${className}`}>
      {header ? <div className="mb-2">{header}</div> : title && <h3 className="font-semibold text-gray-800 text-center text-base mb-4">{title}</h3>}

      {legendPlacement === "right" ? (
        <div className="grid grid-cols-[auto_auto] items-center justify-center gap-5">
          {Chart}
          <div className="w-44">{Legend}</div>
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
