import { useNavigate } from 'react-router-dom';
import { ProcessedReport } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DollarSign,
    Users,
    MousePointerClick,
    Calendar,
    TrendingUp,
    CalendarClock
} from 'lucide-react';

interface ReportCardProps {
    report: ProcessedReport;
    delay?: number;
}

export function ReportCard({ report, delay = 0 }: ReportCardProps) {
    const navigate = useNavigate();

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatNumber = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
        }
        return value.toLocaleString('pt-BR');
    };

    const getStatusConfig = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return {
                    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                    label: 'Ativa',
                    dot: 'bg-emerald-400'
                };
            case 'PAUSED':
            case 'ADSET_PAUSED':
                return {
                    color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                    label: 'Pausada',
                    dot: 'bg-amber-400'
                };
            case 'COMPLETED':
                return {
                    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                    label: 'Concluída',
                    dot: 'bg-blue-400'
                };
            default:
                return {
                    color: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
                    label: status,
                    dot: 'bg-gray-400'
                };
        }
    };

    const statusConfig = getStatusConfig(report.settings.status);

    return (
        <Card
            className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
            style={{
                animationDelay: `${delay}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards',
                opacity: 0
            }}
            onClick={() => navigate(`/report/${report.id}`)}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header with status */}
            <div className="absolute top-4 right-4 z-10">
                <Badge variant="outline" className={`${statusConfig.color} font-medium flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                    {statusConfig.label}
                </Badge>
            </div>

            <div className="relative p-5 space-y-3">
                {/* Header */}
                <div className="space-y-2 pr-24">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {report.campaignName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            <span>{report.createdAt || 'N/A'}</span>
                        </div>
                        {report.updatedAt && (
                            <div className="flex items-center gap-1.5">
                                <CalendarClock className="w-3 h-3" />
                                <span>{report.updatedAt}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                        <div className="p-1.5 rounded-md bg-primary/15">
                            <DollarSign className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Investimento</p>
                            <p className="font-bold text-sm text-foreground truncate">{formatCurrency(report.investment.totalSpent)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                        <div className="p-1.5 rounded-md bg-blue-500/15">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Alcance</p>
                            <p className="font-bold text-sm text-foreground truncate">{formatNumber(report.investment.reach)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                        <div className="p-1.5 rounded-md bg-emerald-500/15">
                            <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Cliques</p>
                            <p className="font-bold text-sm text-foreground truncate">{formatNumber(report.clicks.totalClicks)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                        <div className="p-1.5 rounded-md bg-amber-500/15">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">CTR</p>
                            <p className="font-bold text-sm text-foreground truncate">{report.clicks.ctr.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </Card>
    );
}
