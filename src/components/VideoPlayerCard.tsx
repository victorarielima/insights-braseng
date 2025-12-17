import { Play, Image as ImageIcon } from 'lucide-react';
import { CampaignReport } from '@/utils/reportParser';

interface VideoPlayerCardProps {
  videoUrl: string;
  videoPerformance?: CampaignReport['videoPerformance'];
  isImage?: boolean;
}

export function VideoPlayerCard({ videoUrl, videoPerformance, isImage = false }: VideoPlayerCardProps) {
  // Format number with Brazilian locale
  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR');
  };

  // Calculate retention percentages for heatmap (only for videos)
  const retentionData = !isImage && videoPerformance ? [
    { label: '0%', percentage: 100, count: videoPerformance.totalViews },
    { label: '25%', percentage: videoPerformance.at25.percentage, count: videoPerformance.at25.count },
    { label: '50%', percentage: videoPerformance.at50.percentage, count: videoPerformance.at50.count },
    { label: '75%', percentage: videoPerformance.at75.percentage, count: videoPerformance.at75.count },
    { label: '100%', percentage: videoPerformance.atEnd.percentage, count: videoPerformance.atEnd.count },
  ] : null;

  // Get gradient color for smooth transitions
  const getGradientStyle = (index: number) => {
    if (!retentionData || index >= retentionData.length - 1) return {};

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

  // Get color based on retention
  const getRetentionColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    if (percentage >= 10) return 'bg-red-500';
    return 'bg-red-700';
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '900ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          {isImage ? (
            <ImageIcon className="w-5 h-5 text-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {isImage ? 'Imagem do Anúncio' : 'Vídeo do Anúncio'}
        </h3>
      </div>

      <div className={`relative mx-auto rounded-xl overflow-hidden bg-background/50 border border-border/50 ${isImage ? 'max-w-full' : 'max-w-[300px]'}`}>
        {isImage ? (
          <img
            src={videoUrl}
            alt="Imagem do anúncio"
            className="w-full h-auto object-contain"
          />
        ) : (
          <video
            src={videoUrl}
            controls
            className="w-full aspect-[9/16] object-cover"
            preload="metadata"
          >
            Seu navegador não suporta reprodução de vídeo.
          </video>
        )}
      </div>

      {/* Retention Heatmap */}
      {retentionData && videoPerformance && (
        <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10">
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
      )}
    </div>
  );
}
