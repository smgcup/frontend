import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import {
	UsersIcon,
	UserPlus,
	Plus,
	CalendarPlus,
	FileText,
} from 'lucide-react';
import { goalIcon, matchIcon, playerIcon, teamIcon } from '@/public/icons';
import { cn } from '@/lib/utils';

type Statistic = {
	id: string;
	label: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
};

type QuickAction = {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	href: string;
	color: string;
};

const AdminHomeViewUi = () => {
	// Sample statistics - replace with actual data from your API
	const statistics: Statistic[] = [
		{
			id: '1',
			label: 'Total Teams',
			value: 12,
			icon: (
				<Image src={teamIcon} alt="Team Icon" width={40} height={40} />
			),
			color: 'text-green-500',
		},
		{
			id: '2',
			label: 'Total Players',
			value: 240,
			icon: (
				<Image
					src={playerIcon}
					alt="Player Icon"
					width={40}
					height={40}
				/>
			),
			color: 'text-blue-500',
		},
		{
			id: '3',
			label: 'Total Matches',
			value: 48,
			icon: (
				<Image
					src={matchIcon}
					alt="Match Icon"
					width={40}
					height={40}
				/>
			),
			color: 'text-purple-500',
		},
		{
			id: '4',
			label: 'Total Goals',
			value: 156,
			icon: (
				<Image src={goalIcon} alt="Goal Icon" width={40} height={40} />
			),
			color: 'text-orange-500',
		},
	];

	const quickActions: QuickAction[] = [
		{
			id: '1',
			title: 'Create Team',
			description: 'Add a new team to the tournament',
			icon: <UsersIcon className="h-6 w-6" />,
			href: '/admin/teams/create',
			color: 'text-green-500',
		},
		{
			id: '2',
			title: 'Create Player',
			description: 'Register a new player',
			icon: <UserPlus className="h-6 w-6" />,
			href: '/admin/players/create',
			color: 'text-blue-500',
		},
		{
			id: '3',
			title: 'Create Match',
			description: 'Schedule a new match',
			icon: <CalendarPlus className="h-6 w-6" />,
			href: '/admin/matches/create',
			color: 'text-purple-500',
		},
		{
			id: '4',
			title: 'Create News',
			description: 'Publish a news article',
			icon: <FileText className="h-6 w-6" />,
			href: '/admin/news/create',
			color: 'text-orange-500',
		},
	];

	return (
		<div className="space-y-16 p-4 lg:p-10">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="mt-2 text-muted-foreground">
					Overview of your tournament management
				</p>
			</div>

			{/* Statistics Cards */}
			<div>
				<h2 className="mb-4 text-xl font-semibold">Statistics</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{statistics.map(stat => (
						<div
							key={stat.id}
							className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{stat.label}
									</p>
									<p className="mt-2 text-3xl font-bold">
										{stat.value}
									</p>
								</div>
								<div className={cn('opacity-80', stat.color)}>
									{stat.icon}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{quickActions.map(action => (
						<Link key={action.id} href={action.href}>
							<div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
								<div className="flex flex-col items-start gap-4">
									<div
										className={cn(
											'rounded-lg bg-primary/10 p-3',
											action.color
										)}
									>
										{action.icon}
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-semibold">
											{action.title}
										</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											{action.description}
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="w-full cursor-pointer"
									>
										<Plus className="mr-2 h-4 w-4" />
										Create
									</Button>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminHomeViewUi;
