import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fantasyTheme } from '@/lib/gamemodeThemes';
import type { PlayerPosition } from '../contracts';

type EmptySlotCardProps = {
  position: PlayerPosition;
};

const EmptySlotCard = ({ position }: EmptySlotCardProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg overflow-hidden shrink-0',
        'backdrop-blur-[2px] border border-dashed border-white/30',
        'w-[72px] h-[100px] cursor-pointer',
        fantasyTheme.bgLight,
      )}
    >
      {/* Plus icon area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Position label */}
      <div className="bg-white/10 px-1 py-0.5 flex items-center justify-center min-h-[18px]">
        <span className="text-[10px] font-bold text-white text-center truncate w-full leading-tight">
          {position}
        </span>
      </div>
    </div>
  );
};

export default EmptySlotCard;
