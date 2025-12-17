import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { CampaignReport } from '@/utils/reportParser';

interface VideoFunnelChartProps {
  data: CampaignReport['videoPerformance'];
}

export function VideoFunnelChart({ data }: VideoFunnelChartProps) {
  const chartData = [
    { name: 'Total', value: 100, count: data.totalViews, label: `${data.totalViews} pessoas` },
    { name: '25%', value: data.at25.percentage, count: data.at25.count, label: `${data.at25.count} pessoas (${data.at25.percentage.toFixed(1)}%)` },
    { name: '50%', value: data.at50.percentage, count: data.at50.count, label: `${data.at50.count} pessoas (${data.at50.percentage.toFixed(1)}%)` },
    { name: '75%', value: data.at75.percentage, count: data.at75.count, label: `${data.at75.count} pessoas (${data.at75.percentage.toFixed(1)}%)` },
    { name: '100%', value: data.atEnd.percentage, count: data.atEnd.count, label: `${data.atEnd.count} pessoas (${data.atEnd.percentage.toFixed(1)}%)` },
  ];

  const colors = ['#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#22C55E'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-primary/30">
          <p className="text-foreground font-medium">{item.name === 'Total' ? 'Total de Visualizações' : `Até ${item.name} do vídeo`}</p>
          <p className="text-primary font-mono">
            {item.count} pessoas
          </p>
          {item.name !== 'Total' && (
            <p className="text-muted-foreground text-sm">
              {item.value.toFixed(2)}% de retenção
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="section-title">
        <span className="text-xl">📽️</span>
        Retenção do Vídeo
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Total de visualizações: <span className="text-foreground font-medium">{data.totalViews}</span>
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 100 }}>
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
              <LabelList
                dataKey="label"
                position="right"
                fill="hsl(var(--muted-foreground))"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>Início</span>
        <span>Fim do vídeo</span>
      </div>
    </div>
  );
}
