import { cn } from '@/lib/utils';
import { fantasyTheme } from '@/lib/gamemodeThemes';
import type { FantasyPlayer } from '../contracts';
import JerseyIcon from './JerseyIcon';

type PlayerCardProps = {
  player: FantasyPlayer;
};

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col w-[68px] h-[102px] rounded-lg overflow-hidden shrink-0',
        'backdrop-blur-[2px] border border-white/20 shadow-lg',
        fantasyTheme.bgLight,
      )}
    >
      <div className="relative flex-1 flex flex-col min-h-0">
        {player.isCaptain && (
          <div className={cn('absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[12px] font-bold text-white border border-white shadow z-10', fantasyTheme.bg)}>
            C
          </div>
        )}

        <div className="flex-1 flex items-center justify-center min-h-0">
          <JerseyIcon
            color={player.jersey.color}
            textColor={player.jersey.textColor}
            label={player.jersey.label}
            size={48}
          />
        </div>

        <span className="text-[10px] font-bold text-white text-center truncate w-full leading-tight shrink-0 pb-0.5">
          {player.name}
        </span>
      </div>

      <div className={cn('text-white text-[11px] font-bold py-1.5 flex items-center justify-center h-[20px] shrink-0', fantasyTheme.bgHover)}>
        {player.points}
      </div>
    </div>
  );
};

export default PlayerCard;
