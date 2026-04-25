import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { FloatingChat } from '@/components/chat/floating-chat';

export const MainShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <div>{children}</div>
      <SiteFooter />
      <FloatingChat />
    </div>
  );
};
