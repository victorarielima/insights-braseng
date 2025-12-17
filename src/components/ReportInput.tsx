import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Sparkles } from 'lucide-react';

interface ReportInputProps {
  onSubmit: (report: string) => void;
  initialValue?: string;
}

export function ReportInput({ onSubmit, initialValue = '' }: ReportInputProps) {
  const [reportText, setReportText] = useState(initialValue);

  const handleSubmit = () => {
    if (reportText.trim()) {
      onSubmit(reportText);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Importar Relatório</h2>
          <p className="text-sm text-muted-foreground">Cole o relatório de performance no formato Meta Ads</p>
        </div>
      </div>
      
      <Textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        placeholder="Cole aqui o relatório completo da campanha..."
        className="min-h-[200px] bg-secondary/30 border-border/50 focus:border-primary/50 resize-none font-mono text-sm"
      />
      
      <Button 
        onClick={handleSubmit}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-2"
        disabled={!reportText.trim()}
      >
        <Sparkles className="w-4 h-4" />
        Analisar Relatório
      </Button>
    </div>
  );
}
