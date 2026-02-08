import type { FantasyPlayer } from '../contracts';
import JerseyIcon from './JerseyIcon';

type PlayerCardProps = {
  player: FantasyPlayer;
};

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className="flex flex-col w-[60px] h-[90px] rounded-lg overflow-hidden bg-white shadow-md border border-gray-100 shrink-0">
      <div className="relative flex-1 flex flex-col items-center justify-center">
        {player.isCaptain && (
          <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[6px] font-bold text-white border border-white shadow z-10">
            C
          </div>
        )}
        <div className="flex justify-center mb-1">
          <JerseyIcon
            color={player.jersey.color}
            textColor={player.jersey.textColor}
            label={player.jersey.label}
            size={36}
          />
        </div>
        <span className="text-[10px] font-bold text-black text-center truncate w-full leading-tight">
          {player.name}
        </span>
      </div>
      <div className="bg-[#38003C] text-white text-[11px] font-bold py-1.5 flex items-center justify-center h-[20px]">
        {player.points}
      </div>
    </div>
  );
};

export default PlayerCard;
