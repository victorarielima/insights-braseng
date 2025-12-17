import { CampaignReport } from '@/utils/reportParser';
import { Users, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TargetingCardProps {
  settings: CampaignReport['settings'];
}

export function TargetingCard({ settings }: TargetingCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="section-title">
        Segmentação
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">●</span> Interesses
          </p>
          <div className="flex flex-wrap gap-2">
            {settings.interests.map((interest, i) => (
              <Badge key={i} variant="secondary" className="bg-primary/20 text-primary border border-primary/40 font-medium">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
            <Briefcase className="w-3 h-3" /> Cargos
          </p>
          <div className="flex flex-wrap gap-2">
            {settings.jobTitles.map((job, i) => (
              <Badge key={i} variant="outline" className="border-primary/30 text-foreground">
                {job}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
