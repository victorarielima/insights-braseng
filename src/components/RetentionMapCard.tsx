import { CampaignReport } from '@/utils/reportParser';

interface RetentionMapCardProps {
    videoPerformance: CampaignReport['videoPerformance'];
}

export function RetentionMapCard({ videoPerformance }: RetentionMapCardProps) {
    // Format number with Brazilian locale
    const formatNumber = (value: number) => {
        return value.toLocaleString('pt-BR');
    };

    if (!videoPerformance) return null;

    // Calculate retention percentages for heatmap
    const retentionData = [
        { label: '0%', percentage: 100, count: videoPerformance.totalViews },
        { label: '25%', percentage: videoPerformance.at25.percentage, count: videoPerformance.at25.count },
        { label: '50%', percentage: videoPerformance.at50.percentage, count: videoPerformance.at50.count },
        { label: '75%', percentage: videoPerformance.at75.percentage, count: videoPerformance.at75.count },
        { label: '100%', percentage: videoPerformance.atEnd.percentage, count: videoPerformance.atEnd.count },
    ];

    // Get gradient color for smooth transitions
    const getGradientStyle = (index: number) => {
        if (index >= retentionData.length - 1) return {};

        const current = retentionData[index];
        const next = retentionData[index + 1];

        const getHSL = (percentage: number) => {
            // Green (120) to Red (0) based on retention
            const hue = Math.round((percentage / 100) * 120);
            return `hsl(${hue}, 70%, 45%)`;
        };

        return {
            background: `linear-gradient(to right, ${getHSL(current.percentage)}, ${getHSL(next.percentage)})`,
        };
    };

    return (
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-semibold text-foreground">Retenção de Audiência</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-xs font-medium text-primary">{formatNumber(videoPerformance.totalViews)} visualizações</span>
                    </div>
                </div>

                {/* Heatmap bar with values */}
                <div className="relative h-14 rounded-xl overflow-hidden flex shadow-inner">
                    {retentionData.slice(0, -1).map((point, index) => (
                        <div
                            key={point.label}
                            className="flex-1 relative flex flex-col items-center justify-center border-r border-white/10 last:border-r-0"
                            style={getGradientStyle(index)}
                        >
                            <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                {formatNumber(retentionData[index + 1].count)}
                            </span>
                            <span className="text-[10px] text-white/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                {retentionData[index + 1].percentage.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>

                {/* Timeline labels */}
                <div className="flex justify-between mt-2 px-1">
                    {retentionData.map((point, index) => (
                        <div key={point.label} className="text-center">
                            <span className={`text-xs font-medium ${index === 0 ? 'text-emerald-400' : index === retentionData.length - 1 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                {point.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-400" />
                        <span className="text-[10px] text-muted-foreground">Alta retenção</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-yellow-500 to-orange-500" />
                        <span className="text-[10px] text-muted-foreground">Média</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-600 to-red-700" />
                        <span className="text-[10px] text-muted-foreground">Baixa retenção</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
