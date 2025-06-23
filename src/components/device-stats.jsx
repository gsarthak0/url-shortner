import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];

export default function DeviceStats({stats}) {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device, index) => ({
    device,
    count: deviceCount[device],
    percentage: ((deviceCount[device] / stats.length) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium capitalize">{data.payload.device}</p>
          <p className="text-cyan-400">
            {data.value} clicks ({((data.value / stats.length) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Stats List with Percentages */}
      <div className="space-y-2">
        {result.map((entry, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-white capitalize font-medium">{entry.device}</span>
            </div>
            <div className="text-right">
              <span className="text-cyan-400 font-semibold text-lg">{entry.percentage}%</span>
              <span className="text-gray-400 text-sm ml-2">({entry.count} clicks)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Chart without labels */}
      <div style={{width: "100%", height: 180}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={result}
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              dataKey="count"
              stroke="#334155"
              strokeWidth={2}
            >
              {result.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
