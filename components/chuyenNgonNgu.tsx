'use client';

import { cn } from '@/lib/tienIch';
import { useTheme } from '@/lib/nguCanhGiaoDien';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTheme();

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm',
          'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
          'transition-colors',
          className
        )}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase font-medium">{language}</span>
      </button>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-xl bg-secondary/50', className)}>
      <button
        onClick={() => setLanguage('vi')}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          language === 'vi'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        VI
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
          language === 'en'
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        EN
      </button>
    </div>
  );
}
