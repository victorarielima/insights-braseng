import { useState, useEffect, useMemo } from 'react';
import { fetchReports, generateReports, ProcessedReport } from '@/services/api';
import { ReportCard } from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  TrendingUp,
  Target,
  DollarSign,
  RefreshCw,
  AlertCircle,
  LayoutDashboard,
  Sparkles,
  Search
} from 'lucide-react';

export default function Index() {
  const [reports, setReports] = useState<ProcessedReport[]>(() => {
    // Carregar dados do localStorage na inicialização
    const cached = localStorage.getItem('campaignReports');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(() => {
    return localStorage.getItem('campaignReports') !== null;
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered reports based on search
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      return report.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [reports, searchTerm]);

  const saveToCache = (data: ProcessedReport[]) => {
    localStorage.setItem('campaignReports', JSON.stringify(data));
    setReports(data);
  };

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReports();
      saveToCache(data);
      setHasLoaded(true);
    } catch (err) {
      setError('Não foi possível carregar os relatórios. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setLoading(true);
    setError(null);

    try {
      // Chama o webhook de geração e aguarda a resposta com os dados
      const data = await generateReports();
      saveToCache(data);
      setHasLoaded(true);
    } catch (err) {
      console.error(err);
      setError('Erro ao gerar relatórios. Tente novamente.');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const activeReports = reports.filter(r => r.settings.status === 'ACTIVE').length;
  const totalInvestment = reports.reduce((acc, r) => acc + r.investment.totalSpent, 0);
  const totalReach = reports.reduce((acc, r) => acc + r.investment.reach, 0);
  const avgCTR = reports.length > 0
    ? reports.reduce((acc, r) => acc + r.clicks.ctr, 0) / reports.length
    : 0;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">Campaign</span>
                <span className="font-bold text-lg text-primary">Hub</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={handleGenerate}
                disabled={generating || loading}
                className="gap-2"
              >
                <Sparkles className={`w-4 h-4 ${generating ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{generating ? 'Gerando...' : 'Gerar Relatórios'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadReports()}
                disabled={loading || generating}
                className="gap-2 border-white/10 hover:bg-white/5"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative border-b border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] translate-y-1/2" />

        <div className="relative container mx-auto px-6 py-8 max-w-7xl">
          {/* Stats Grid - Single Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-primary/20">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{reports.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total de Campanhas</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{activeReports}</p>
              <p className="text-sm text-muted-foreground mt-1">Campanhas Ativas</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-warning/20">
                  <DollarSign className="w-5 h-5 text-warning" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(totalInvestment)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Investido</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-accent/20">
                  <Target className="w-5 h-5 text-accent" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{formatNumber(totalReach)}</p>
              <p className="text-sm text-muted-foreground mt-1">Alcance Total</p>
            </div>
          </div>
        </div>
      </div >

      {/* Main Content */}
      < div className="container mx-auto px-6 py-10 max-w-7xl" >
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Relatórios de Campanhas</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Selecione uma campanha para visualizar os detalhes
              </p>
            </div>

            {
              reports.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-3 py-1.5 rounded-lg bg-secondary border border-border">
                    CTR médio: <span className="text-foreground font-medium">{avgCTR.toFixed(2)}%</span>
                  </span>
                </div>
              )
            }
          </div>

          {/* Filters */}
          {
            reports.length > 0 && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome da campanha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card border-border focus:border-primary"
                />
              </div>
            )
          }
        </div>

        {/* Error State */}
        {
          error && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <p className="text-lg font-medium text-foreground">Erro ao carregar relatórios</p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button onClick={() => loadReports()} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </Button>
            </div>
          )
        }

        {/* Loading State */}
        {
          loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-card/50 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )
        }

        {/* Reports Grid */}
        {
          !loading && !error && reports.length > 0 && filteredReports.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  delay={index * 50}
                />
              ))}
            </div>
          )
        }

        {/* No Results State */}
        {
          !loading && !error && reports.length > 0 && filteredReports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="p-4 rounded-2xl bg-muted/50">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">Nenhum resultado encontrado</p>
              <p className="text-muted-foreground text-sm">Tente ajustar os filtros de busca</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="gap-2"
              >
                Limpar filtros
              </Button>
            </div>
          )
        }

        {/* Empty State */}
        {
          !loading && !error && reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="p-4 rounded-2xl bg-muted/50">
                <BarChart3 className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">Nenhum relatório encontrado</p>
              <p className="text-muted-foreground text-sm">Os relatórios aparecerão aqui quando disponíveis</p>
            </div>
          )
        }
      </div >


    </div >
  );
}
