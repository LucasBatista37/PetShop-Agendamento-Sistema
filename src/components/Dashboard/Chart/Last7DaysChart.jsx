import React, { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const GRID = "#E5E7EB";
const TICKS = "#6B7280";

function useIsMobile(breakpoint = 480) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width:${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [breakpoint]);
  return isMobile;
}

function mergeByDay(curr = []) {
  return (curr || [])
    .map((d) => ({ day: d.day, value: d.total ?? d.value ?? 0 }))
    .sort((a, b) => ("" + a.day).localeCompare("" + b.day));
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-[13px] text-gray-900">
        Agendamentos <strong>{p.value ?? 0}</strong>
      </div>
    </div>
  );
};

export default function Last7DaysChart({
  data = [],
  title = "Agendamentos",
  mobileHeight = 240,
  desktopHeight = 240,
  breakpoint = 100,
  showYAxisOnMobile = false,
}) {
  const [mode, setMode] = useState("line");
  const isMobile = useIsMobile(breakpoint);
  const merged = useMemo(() => mergeByDay(data), [data]);
  const hasData = merged && merged.length > 0;

  const PURPLE = "#6366F1";

  const height = isMobile ? mobileHeight : desktopHeight;
  const tickFontSize = isMobile ? 11 : 12;
  const tickMargin = isMobile ? 6 : 10;
  const chartMargin = isMobile
    ? { top: 6, right: 8, bottom: 0, left: 20 }
    : { top: 8, right: 12, bottom: 0, left: 0 };
  const dotProps = isMobile
    ? { r: 2.5, stroke: PURPLE, strokeWidth: 2, fill: "#fff" }
    : { r: 3, stroke: PURPLE, strokeWidth: 3, fill: "#fff" };
  const activeDotProps = isMobile
    ? { r: 4, stroke: PURPLE, strokeWidth: 2, fill: "#fff" }
    : { r: 5, stroke: PURPLE, strokeWidth: 3, fill: "#fff" };
  const barSize = isMobile ? 18 : 26;
  const showYAxis = isMobile ? showYAxisOnMobile : true;

  return (
    <section className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-800">
          {title}
        </h3>

        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode("line")}
            aria-pressed={mode === "line"}
            className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md transition
              ${
                mode === "line"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Linha
          </button>
          <button
            type="button"
            onClick={() => setMode("bar")}
            aria-pressed={mode === "bar"}
            className={`ml-1 px-3 py-2 text-xs md:text-sm font-medium rounded-md transition
              ${
                mode === "bar"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Barras
          </button>
        </div>
      </div>

      {!hasData ? (
        <p className="text-gray-500 text-center py-10 md:py-12 text-sm">
          Nenhum dado disponível para exibir.
        </p>
      ) : mode === "line" ? (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged} margin={chartMargin}>
              <CartesianGrid
                stroke={GRID}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tickMargin={tickMargin}
                tick={{ fill: TICKS, fontSize: tickFontSize }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              {showYAxis && (
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: TICKS, fontSize: tickFontSize }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
              )}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  strokeDasharray: "3 3",
                  stroke: "#D1D5DB",
                  strokeWidth: isMobile ? 1.5 : 2,
                }}
                wrapperStyle={{ outline: "none" }}
              />
              <Line
                type="monotoneX"
                dataKey="value"
                stroke={PURPLE}
                strokeWidth={isMobile ? 2.5 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={dotProps}
                activeDot={activeDotProps}
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-in-out"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={merged} margin={chartMargin}>
              <CartesianGrid
                stroke={GRID}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tickMargin={tickMargin}
                tick={{ fill: TICKS, fontSize: tickFontSize }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              {showYAxis && (
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: TICKS, fontSize: tickFontSize }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
              )}
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
              />
              <Bar
                dataKey="value"
                fill={PURPLE}
                radius={[8, 8, 0, 0]}
                barSize={barSize}
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
