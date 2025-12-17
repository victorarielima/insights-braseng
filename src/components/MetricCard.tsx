import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  delay?: number;
}

export function MetricCard({ title, value, icon, subtitle, variant = 'default', delay = 0 }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const variantStyles = {
    default: 'border-border/50 hover:border-muted-foreground/30',
    primary: 'border-primary/30 hover:border-primary/60 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]',
    success: 'border-success/30 hover:border-success/60 hover:shadow-[0_0_30px_hsl(var(--success)/0.2)]',
    warning: 'border-warning/30 hover:border-warning/60 hover:shadow-[0_0_30px_hsl(var(--warning)/0.2)]',
    accent: 'border-accent/30 hover:border-accent/60 hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)]',
  };

  const iconColors = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent',
  };

  return (
    <div
      className={cn(
        'metric-card opacity-0 p-3',
        variantStyles[variant],
        isVisible && 'animate-fade-in'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={cn('p-1.5 rounded-lg bg-secondary/50', iconColors[variant])}>
          {icon}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-0.5">{title}</p>
      <p className="text-xl font-bold font-mono text-foreground">{value}</p>
      {subtitle && (
        <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
