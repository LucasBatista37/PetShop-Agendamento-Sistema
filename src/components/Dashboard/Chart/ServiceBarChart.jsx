import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const ServiceBarChart = ({ data }) => (
  <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços mais solicitados</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 0 }}>
        <XAxis dataKey="service" />
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
  </section>
);

export default ServiceBarChart;
