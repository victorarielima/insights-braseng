import { FileText } from 'lucide-react';

interface AdContentCardProps {
  content: string;
}

export function AdContentCard({ content }: AdContentCardProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="section-title">
        Conteúdo do Anúncio
      </h3>
      <div className="bg-secondary/30 rounded-lg p-4 border border-border/30">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content || 'Nenhum conteúdo disponível'}
        </p>
      </div>
    </div>
  );
}
