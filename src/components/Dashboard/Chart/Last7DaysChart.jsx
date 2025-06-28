import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const Last7DaysChart = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos 7 dias</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-12">Nenhum dado disponível para exibir.</p>
      )}
    </section>
  );
};

export default Last7DaysChart;
