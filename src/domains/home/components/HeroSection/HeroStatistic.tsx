import React from 'react';
import Image from 'next/image';

type HeroStatisticProps = {
	icon: string;
	value: number;
	label: string;
};
const HeroStatistic = ({ icon, value, label }: HeroStatisticProps) => {
	return (
		<div className="flex flex-col items-center">
			<div className="mb-2 rounded-full bg-primary/10 p-3">
				<Image
					src={icon}
					alt="Goal Icon"
					width={32}
					height={32}
					loading="lazy"
				/>
			</div>
			<div className="text-3xl font-bold">{value}</div>
			<div className="text-sm text-muted-foreground">{label}</div>
		</div>
	);
};

export default HeroStatistic;
