import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "13px",
      }}
    >
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "4px" }}>
        {label}
      </p>
      <p style={{ color: "#f97316", fontWeight: 600 }}>
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export default function BalanceTrendChart({ data }) {
  if (!data?.length) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{
            fontSize: 12,
            fill: "var(--color-text-secondary)",
            fontFamily: "Inter",
          }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{
            fontSize: 12,
            fill: "var(--color-text-secondary)",
            fontFamily: "Inter",
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#balanceGrad)"
          dot={{ fill: "#f97316", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#f97316", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
