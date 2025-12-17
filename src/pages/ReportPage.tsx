import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReports, ProcessedReport, getReportById } from '@/services/api';
import { MetricCard } from '@/components/MetricCard';
import { EngagementChart } from '@/components/EngagementChart';
import { CostAnalysisChart } from '@/components/CostAnalysisChart';
import { CampaignHeader } from '@/components/CampaignHeader';
import { AdContentCard } from '@/components/AdContentCard';
import { TargetingCard } from '@/components/TargetingCard';
import { VideoPlayerCard } from '@/components/VideoPlayerCard';
import { InsightsChat } from '@/components/InsightsChat';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DollarSign,
    Users,
    Eye,
    MousePointerClick,
    TrendingUp,
    Zap,
    Target,
    ArrowLeft,
    AlertCircle,
    BarChart3
} from 'lucide-react';

export default function ReportPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<ProcessedReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const loadReport = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                // Try to get from localStorage cache first
                const cached = localStorage.getItem('campaignReports');
                let reports: ProcessedReport[] = [];

                if (cached) {
                    reports = JSON.parse(cached);
                } else {
                    // If no cache, fetch from API
                    reports = await fetchReports();
                    localStorage.setItem('campaignReports', JSON.stringify(reports));
                }

                const found = getReportById(reports, id);

                if (found) {
                    setReport(found);
                } else {
                    setError('Relatório não encontrado');
                }
            } catch (err) {
                setError('Erro ao carregar o relatório');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [id]);

    const handleBack = () => {
        navigate('/');
    };

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const formatNumber = (value: number) => {
        return value.toLocaleString('pt-BR');
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="flex items-center h-16">
                            <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="gap-2 hover:bg-white/5"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </Button>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} className="h-28 rounded-xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-80 rounded-2xl" />
                        <Skeleton className="h-80 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !report) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <nav className="border-b border-white/10 bg-background/80 backdrop-blur-xl">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="flex items-center h-16">
                            <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="gap-2 hover:bg-white/5"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </Button>
                        </div>
                    </div>
                </nav>

                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-6 p-8">
                        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {error || 'Relatório não encontrado'}
                        </h1>
                        <p className="text-muted-foreground">
                            O relatório que você está procurando não existe ou houve um erro ao carregá-lo.
                        </p>
                        <Button onClick={handleBack} variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para a lista
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleBack}
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:bg-white/5 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Voltar</span>
                            </Button>

                            <div className="h-6 w-px bg-white/10" />

                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/20">
                                    <BarChart3 className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground hidden md:block">
                                    Relatório de Campanha
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8 max-w-7xl">
                <CampaignHeader report={report} onReset={handleBack} />

                {/* Main Content Section - Video/Image + Ad Content + Cards */}
                {report.videoUrl ? (
                    // Layout with video/image
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 items-start">
                        {/* Left Column - Video/Image + Button + Retention + Targeting */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            {/* Video/Image Card */}
                            <div className="glass-card p-3 sm:p-4 animate-slide-up h-fit" style={{ animationDelay: '100ms' }}>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                                    {report.isImage ? 'Imagem do Anúncio' : 'Vídeo do Anúncio'}
                                </h3>

                                <div className="relative mx-auto rounded-xl overflow-hidden bg-background/50 border border-border/50 max-w-[300px]">
                                    {report.isImage ? (
                                        <img
                                            src={report.videoUrl}
                                            alt="Imagem do anúncio"
                                            className="w-full aspect-[9/16] object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={report.videoUrl}
                                            controls
                                            className="w-full aspect-[9/16] object-cover"
                                            preload="metadata"
                                        >
                                            Seu navegador não suporta reprodução de vídeo.
                                        </video>
                                    )}
                                </div>
                            </div>

                            {/* Generate Insights Button - Outside the card */}
                            <Button
                                className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                                onClick={() => setChatOpen(true)}
                            >
                                <Zap className="w-4 h-4" />
                                Gerar Insights
                            </Button>

                            {/* Retention Map - Only for videos */}
                            {!report.isImage && report.videoPerformance && (
                                <div className="glass-card p-4">
                                    <div className="p-3 rounded-xl bg-secondary/30 border border-border">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                <span className="text-sm font-semibold text-foreground">Retenção de Audiência</span>
                                            </div>
                                            <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                                <span className="text-[10px] font-medium text-primary">{formatNumber(report.videoPerformance.totalViews)} views</span>
                                            </div>
                                        </div>

                                        <div className="relative h-12 rounded-lg overflow-hidden flex shadow-inner">
                                            {(() => {
                                                const retentionData = [
                                                    { label: '0%', percentage: 100, count: report.videoPerformance!.totalViews },
                                                    { label: '25%', percentage: report.videoPerformance!.at25.percentage, count: report.videoPerformance!.at25.count },
                                                    { label: '50%', percentage: report.videoPerformance!.at50.percentage, count: report.videoPerformance!.at50.count },
                                                    { label: '75%', percentage: report.videoPerformance!.at75.percentage, count: report.videoPerformance!.at75.count },
                                                    { label: '100%', percentage: report.videoPerformance!.atEnd.percentage, count: report.videoPerformance!.atEnd.count },
                                                ];
                                                const getGreenShade = (percentage: number) => {
                                                    // Verde claro (alta retenção) -> Verde escuro (baixa retenção)
                                                    const lightness = 25 + (percentage / 100) * 40; // 25% a 65%
                                                    return `hsl(145, 55%, ${lightness}%)`;
                                                };
                                                return retentionData.slice(0, -1).map((point, index) => (
                                                    <div
                                                        key={point.label}
                                                        className="flex-1 relative flex flex-col items-center justify-center border-r border-white/10 last:border-r-0"
                                                        style={{ background: `linear-gradient(to right, ${getGreenShade(retentionData[index].percentage)}, ${getGreenShade(retentionData[index + 1].percentage)})` }}
                                                    >
                                                        <span className="text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                                            {formatNumber(retentionData[index + 1].count)}
                                                        </span>
                                                        <span className="text-[9px] text-white/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                                            {retentionData[index + 1].percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>

                                        <div className="flex justify-between mt-1.5 px-1">
                                            {['0%', '25%', '50%', '75%', '100%'].map((label, index, arr) => (
                                                <span key={label} className={`text-[10px] font-medium ${index === 0 ? 'text-primary' : index === arr.length - 1 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Targeting Card */}
                            <TargetingCard settings={report.settings} />
                        </div>

                        {/* Right Column - Ad Content + Metrics Cards */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <AdContentCard content={report.content} />

                            {/* Metrics Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                <MetricCard
                                    title="Investimento Total"
                                    value={formatCurrency(report.investment.totalSpent)}
                                    icon={<DollarSign className="w-4 h-4" />}
                                    variant="primary"
                                    delay={0}
                                />
                                <MetricCard
                                    title="Alcance"
                                    value={formatNumber(report.investment.reach)}
                                    icon={<Users className="w-4 h-4" />}
                                    subtitle="pessoas únicas"
                                    variant="accent"
                                    delay={100}
                                />
                                <MetricCard
                                    title="Impressões"
                                    value={formatNumber(report.investment.impressions)}
                                    icon={<Eye className="w-4 h-4" />}
                                    subtitle={`Frequência: ${report.investment.frequency.toFixed(2)}`}
                                    delay={200}
                                />
                                <MetricCard
                                    title="CPM"
                                    value={formatCurrency(report.investment.cpm)}
                                    icon={<TrendingUp className="w-4 h-4" />}
                                    subtitle="custo por mil"
                                    variant="warning"
                                    delay={300}
                                />
                                <MetricCard
                                    title="Cliques Totais"
                                    value={formatNumber(report.clicks.totalClicks)}
                                    icon={<MousePointerClick className="w-4 h-4" />}
                                    delay={400}
                                />
                                <MetricCard
                                    title="Cliques Únicos"
                                    value={formatNumber(report.clicks.uniqueClicks)}
                                    icon={<Target className="w-4 h-4" />}
                                    delay={500}
                                />
                                <MetricCard
                                    title="CTR"
                                    value={`${report.clicks.ctr.toFixed(2)}%`}
                                    icon={<Zap className="w-4 h-4" />}
                                    subtitle="taxa de cliques"
                                    variant="success"
                                    delay={600}
                                />
                                <MetricCard
                                    title="CPC"
                                    value={formatCurrency(report.clicks.cpc)}
                                    icon={<DollarSign className="w-4 h-4" />}
                                    subtitle="custo por clique"
                                    delay={700}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Layout without video/image - full width, single column
                    <div className="flex flex-col gap-6 mb-6">
                        <AdContentCard content={report.content} />
                        <TargetingCard settings={report.settings} />

                        {/* Generate Insights Button */}
                        <Button
                            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                            onClick={() => setChatOpen(true)}
                        >
                            <Zap className="w-4 h-4" />
                            Gerar Insights
                        </Button>

                        {/* Metrics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <MetricCard
                                title="Investimento Total"
                                value={formatCurrency(report.investment.totalSpent)}
                                icon={<DollarSign className="w-4 h-4" />}
                                variant="primary"
                                delay={0}
                            />
                            <MetricCard
                                title="Alcance"
                                value={formatNumber(report.investment.reach)}
                                icon={<Users className="w-4 h-4" />}
                                subtitle="pessoas únicas"
                                variant="accent"
                                delay={100}
                            />
                            <MetricCard
                                title="Impressões"
                                value={formatNumber(report.investment.impressions)}
                                icon={<Eye className="w-4 h-4" />}
                                subtitle={`Frequência: ${report.investment.frequency.toFixed(2)}`}
                                delay={200}
                            />
                            <MetricCard
                                title="CPM"
                                value={formatCurrency(report.investment.cpm)}
                                icon={<TrendingUp className="w-4 h-4" />}
                                subtitle="custo por mil"
                                variant="warning"
                                delay={300}
                            />
                            <MetricCard
                                title="Cliques Totais"
                                value={formatNumber(report.clicks.totalClicks)}
                                icon={<MousePointerClick className="w-4 h-4" />}
                                delay={400}
                            />
                            <MetricCard
                                title="Cliques Únicos"
                                value={formatNumber(report.clicks.uniqueClicks)}
                                icon={<Target className="w-4 h-4" />}
                                delay={500}
                            />
                            <MetricCard
                                title="CTR"
                                value={`${report.clicks.ctr.toFixed(2)}%`}
                                icon={<Zap className="w-4 h-4" />}
                                subtitle="taxa de cliques"
                                variant="success"
                                delay={600}
                            />
                            <MetricCard
                                title="CPC"
                                value={formatCurrency(report.clicks.cpc)}
                                icon={<DollarSign className="w-4 h-4" />}
                                subtitle="custo por clique"
                                delay={700}
                            />
                        </div>
                    </div>
                )}


                {/* Charts Section - Bottom */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <CostAnalysisChart data={report} />
                    <EngagementChart data={report.results} />
                </div>

                {/* Insights Chat Modal */}
                {report && (
                    <InsightsChat
                        isOpen={chatOpen}
                        onClose={() => setChatOpen(false)}
                        report={report}
                    />
                )}
            </div>
        </div>
    );
}
