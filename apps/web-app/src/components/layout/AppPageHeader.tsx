import type { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
}

export function AppPageHeader({ title, description, leading, actions }: AppPageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="shrink-0" />
          {leading}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold">{title}</h1>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}