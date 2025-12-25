import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MobilePageHeader = ({
	title,
	description,
	icon,
}: {
	title: string;
	description: string;
	icon: string;
}) => {
	return (
		<div className="border-b bg-card">
			<div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					← Back to Home
				</Link>
				<div className="flex items-center gap-8">
					<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
						<Image
							src={icon}
							alt="Player Icon"
							width={40}
							height={40}
						/>
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							{title}
						</h1>
						<p className="mt-2 text-md text-muted-foreground">
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MobilePageHeader;
