import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const ServiceBarChart = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços mais solicitados</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ left: 0 }}>
            <XAxis
              dataKey="service"
              tickFormatter={(value) =>
                value.length > 10 ? value.slice(0, 10) + "…" : value
              }
              textAnchor="end"
              interval={0}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#6366F1"
              maxBarSize={40}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-12">Nenhum dado disponível para exibir.</p>
      )}
    </section>
  );
};

export default ServiceBarChart;
