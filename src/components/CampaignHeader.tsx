import { CampaignReport } from '@/utils/reportParser';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, MessageSquare, Calendar } from 'lucide-react';

interface CampaignHeaderProps {
  report: CampaignReport;
  onReset: () => void;
}

export function CampaignHeader({ report, onReset }: CampaignHeaderProps) {
  const statusColor = report.settings.status === 'ACTIVE' ? 'bg-success' : 'bg-muted';

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 animate-pulse-slow">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{report.campaignName}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={`${statusColor} text-foreground border-0`}>
                  {report.settings.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {report.settings.ageRange}
                </span>
                {report.createdAt && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{report.createdAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4 text-primary" />
            <span>Tipo de CTA: {report.settings.ctaType.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
