import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const StatusPieChart = ({ data }) => (
  <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Status dos agendamentos</h3>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </section>
);

export default StatusPieChart;
