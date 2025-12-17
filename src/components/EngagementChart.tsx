import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CampaignReport } from '@/utils/reportParser';

interface EngagementChartProps {
  data: CampaignReport['results'];
}

export function EngagementChart({ data }: EngagementChartProps) {
  const chartData = [
    { name: 'Visualizações', value: data.videoViews.count, color: '#1B4332' },
    { name: 'Cliques', value: data.linkClicks.count, color: '#2D6A4F' },
    { name: 'Reações', value: data.reactions, color: '#40916C' },
    { name: 'Curtidas', value: data.netLikes, color: '#52B788' },
    { name: 'Compartilhamentos', value: data.shares, color: '#74C69D' },
    { name: 'Conversas', value: data.conversations.count, color: '#95D5B2' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-primary/30">
          <p className="text-foreground font-medium">{payload[0].name}</p>
          <p className="font-mono" style={{ color: payload[0].payload.color }}>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ name, percent }: any) => {
    if (percent < 0.05) return null;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="section-title">
        Distribuição de Engajamento
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-muted-foreground text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
