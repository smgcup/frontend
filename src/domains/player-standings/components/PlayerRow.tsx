import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PlayerStanding } from '../contracts';
import PositionBadge from '@/components/PositionBadge';

type PlayerRowProps = {
  player: PlayerStanding;
  isLast: boolean;
};

const PlayerRow = ({ player, isLast }: PlayerRowProps) => {
  return (
    <Link
      href={`/players/${player.id}`}
      className={cn(
        'flex items-center p-3 hover:bg-muted transition-colors h-[72px]',
        !isLast && 'border-b border-border',
      )}
    >
      <div className="mr-2 shrink-0">
        <PositionBadge position={player.rank} className="mx-0" />
      </div>

      <div className="w-10 h-10 mr-3 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
          {player.imageUrl ? (
            <Image
              src={player.imageUrl}
              alt={player.lastName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">?</div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 mr-2">
        <div className="font-bold text-sm truncate leading-tight">
          {player.firstName} {player.lastName}
        </div>
        <div className="font-semibold text-sm truncate leading-tight">{player.team?.name}</div>
        <div className="text-xs text-muted-foreground truncate capitalize">{player.position}</div>
      </div>

      <div className="font-bold text-xl shrink-0">{player.statValue}</div>
    </Link>
  );
};

export default PlayerRow;
