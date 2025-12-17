import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CampaignReport } from '@/utils/reportParser';

interface CostAnalysisChartProps {
  data: CampaignReport;
}

export function CostAnalysisChart({ data }: CostAnalysisChartProps) {
  const chartData = [
    {
      name: 'CPM',
      value: data.investment.cpm,
      description: 'Custo por Mil',
      color: '#2D6A4F'
    },
    {
      name: 'CPC',
      value: data.clicks.cpc,
      description: 'Custo por Clique',
      color: '#40916C'
    },
    {
      name: 'Visualização',
      value: data.results.videoViews.cost,
      description: 'Por visualização',
      color: '#52B788'
    },
    {
      name: 'Engajamento',
      value: data.results.totalEngagements.cost,
      description: 'Por engajamento',
      color: '#74C69D'
    },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-primary/30">
          <p className="text-foreground font-medium">{payload[0].payload.description}</p>
          <p className="font-mono" style={{ color: payload[0].payload.color }}>
            R$ {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="section-title">
        Análise de Custos
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
