import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type FantasyTabItem<T extends string = string> = {
  id: T;
  label: string;
  icon: LucideIcon;
};

type FantasyTabsProps<T extends string> = {
  tabs: FantasyTabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  sticky?: boolean;
};

const FantasyTabs = <T extends string>({ tabs, activeTab, onTabChange, sticky = true }: FantasyTabsProps<T>) => {
  return (
    <div
      className={cn(
        '-mx-2 px-0 pt-0 border-b border-white/10 mb-4 bg-[#07000f] lg:static lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0 lg:bg-transparent lg:flex lg:justify-center lg:border-b-0',
        sticky && 'sticky top-[52px] z-30',
      )}
    >
      <div className="flex w-full bg-white/6 rounded-none lg:rounded-lg overflow-hidden lg:inline-flex lg:w-auto lg:gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all relative',
              activeTab === tab.id ? 'text-fuchsia-400' : 'text-white/50 hover:text-white/70',
            )}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            {tab.label}
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-400" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FantasyTabs;
