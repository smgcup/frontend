import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Gamemode } from '../contracts';

const GameCard = ({
  title,
  subtitle,
  badge,
  backgroundImage,
  stats,
  href,
}: Gamemode) => {
  return (
    <div className="group relative h-[480px] w-full overflow-hidden rounded-[40px] bg-zinc-900 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/10">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col p-8 sm:p-10">
        {/* Badge */}
        <div className="mb-4">
          <span
            className={cn(
              "inline-block rounded-full px-4 py-1.5 text-[11px] font-black tracking-widest uppercase shadow-lg",
              badge.variant === 'popular' 
                ? "bg-amber-400 text-zinc-950 shadow-amber-400/20" 
                : "bg-teal-400 text-zinc-950 shadow-teal-400/20"
            )}
          >
            {badge.text}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-auto mb-6">
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase sm:text-5xl md:text-6xl leading-[0.9]">
            {title}
          </h2>
          <p className="mt-3 text-base font-semibold text-zinc-400 tracking-tight">
            {subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-zinc-800/60 p-3 py-4 backdrop-blur-md border border-white/5 transition-all duration-300 group-hover:bg-zinc-800/80 group-hover:border-white/10"
            >
              <div className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                badge.variant === 'popular' ? "text-amber-400" : "text-teal-400"
              )}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-wider text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link 
          href={href}
          className="flex h-12 w-full items-center justify-between rounded-full bg-white px-5 transition-all duration-300 hover:bg-zinc-100 active:scale-[0.98] group/btn"
        >
          <span className="text-sm font-black text-zinc-950 uppercase tracking-widest">
            Play Now
          </span>
          <div className="flex items-center justify-center h-5 w-5 rounded-full transition-transform duration-300 group-hover/btn:translate-x-1">
             <ArrowRight className="h-4 w-4 text-zinc-950" strokeWidth={3} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
