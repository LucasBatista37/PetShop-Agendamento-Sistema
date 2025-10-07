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

  return (
    <section
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
      aria-label={title || "Gráfico do tipo donut"}
    >
      {title && (
        <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <div className="flex items-center justify-center">
        <div className="w-[220px] h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={96}
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
                    const { cx, cy } = viewBox;
                    if (cx == null || cy == null) return null;
                    return (
                      <>
                        <text
                          x={cx}
                          y={cy - 10}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="12"
                          fill="#6B7280"
                        >
                          Total
                        </text>
                        <text
                          x={cx}
                          y={cy + 10}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="20"
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
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {computedTotal > 0 ? (
          displayData.map((d) => (
            <span
              key={d.name}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
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
    </section>
  );
}
