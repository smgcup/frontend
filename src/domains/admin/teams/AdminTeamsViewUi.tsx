"use client";

import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, User } from "lucide-react";
import Image from "next/image";
import { playerIcon, teamIcon } from "@/public/icons";
import type { TeamsWithPlayersQuery } from "@/graphql";

type Player = NonNullable<TeamsWithPlayersQuery["teams"][0]["players"]>[0];

type AdminTeamsViewUiProps = {
	teams: TeamsWithPlayersQuery["teams"];
	players: Player[];
	error?: unknown;
};

const AdminTeamsViewUi = ({ teams, players, error }: AdminTeamsViewUiProps) => {
	const currentYear = new Date().getFullYear();

	if (error) {
		return (
			<div className="p-4">
				<div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
					<p>Error loading teams and players. Please try again later.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 p-4 lg:p-10">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Teams & Players</h1>
					<p className="mt-2 text-muted-foreground">Manage teams and players in the tournament</p>
				</div>
				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<Button asChild className="w-full sm:w-auto">
						<Link href="/admin/teams/create">
							<Plus className="mr-2 h-4 w-4" />
							Create Team
						</Link>
					</Button>
					<Button asChild variant="outline" className="w-full sm:w-auto">
						<Link href="/admin/players/create">
							<Plus className="mr-2 h-4 w-4" />
							Create Player
						</Link>
					</Button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Card size="sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Image src={teamIcon} alt="Team Icon" width={24} height={24} />
							Total Teams
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{teams.length}</p>
					</CardContent>
				</Card>
				<Card size="sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Image src={playerIcon} alt="Player Icon" width={24} height={24} />
							Total Players
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{players.length}</p>
					</CardContent>
				</Card>
			</div>

			{/* Teams Section */}
			<div>
				<h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
					<Users className="h-5 w-5" />
					Teams ({teams.length})
				</h2>

				{/* Mobile: accordion list */}
				<div className="md:hidden">
					<Accordion type="multiple" className="gap-2">
						{teams.map((team) => {
							const count = team.players?.length ?? 0;
							return (
								<AccordionItem key={team.id} value={team.id} className="border-none">
									<AccordionTrigger className="bg-card px-3 hover:no-underline ring-1 ring-foreground/10">
										<div className="flex w-full items-center justify-between gap-3">
											<span className="font-medium">{team.name}</span>
											<span className="text-xs text-muted-foreground">{count} players</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-3 pb-3">
										{team.players && team.players.length > 0 ? (
											<ul className="space-y-2">
												{team.players.map((player) => (
													<li
														key={player.id}
														className="flex items-start justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2"
													>
														<div className="min-w-0">
															<p className="truncate text-sm font-medium">
																{player.firstName} {player.lastName}
															</p>
															<p className="text-xs text-muted-foreground">
																{player.position} • {player.prefferedFoot}
															</p>
														</div>
														<div className="shrink-0 text-right text-xs text-muted-foreground">
															<p>{currentYear - Math.round(player.yearOfBirth)}y</p>
															<p>{player.height}cm</p>
														</div>
													</li>
												))}
											</ul>
										) : (
											<p className="text-sm text-muted-foreground">No players assigned</p>
										)}
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				</div>

				{/* Desktop: grid cards */}
				<div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{teams.map((team) => (
						<Card key={team.id}>
							<CardHeader>
								<CardTitle>{team.name}</CardTitle>
								<p className="text-sm text-muted-foreground">{team.players?.length ?? 0} players</p>
							</CardHeader>
							<CardContent>
								{team.players && team.players.length > 0 ? (
									<div className="space-y-2">
										<p className="text-sm font-medium text-muted-foreground">Players:</p>
										<ul className="space-y-1">
											{team.players.slice(0, 5).map((player) => (
												<li key={player.id} className="text-sm flex items-center gap-2">
													<User className="h-3 w-3" />
													<span>
														{player.firstName} {player.lastName}
													</span>
													<span className="text-muted-foreground">({player.position})</span>
												</li>
											))}
											{team.players.length > 5 && (
												<li className="text-sm text-muted-foreground">
													+{team.players.length - 5} more
												</li>
											)}
										</ul>
									</div>
								) : (
									<p className="text-sm text-muted-foreground">No players assigned</p>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* All Players Section */}
			<div>
				<h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
					<User className="h-5 w-5" />
					All Players ({players.length})
				</h2>

				{/* Mobile: accordion list */}
				<div className="md:hidden">
					<Accordion type="multiple" className="gap-2">
						{players.map((player) => (
							<AccordionItem key={player.id} value={player.id} className="border-none">
								<AccordionTrigger className="bg-card px-3 hover:no-underline ring-1 ring-foreground/10">
									<div className="flex w-full items-center justify-between gap-3">
										<span className="truncate font-medium">
											{player.firstName} {player.lastName}
										</span>
										<span className="shrink-0 text-xs text-muted-foreground">
											{player.position}
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-3 pb-3">
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div className="rounded-md border bg-muted/30 px-3 py-2">
											<p className="text-xs text-muted-foreground">Age</p>
											<p className="font-medium">
												{currentYear - Math.round(player.yearOfBirth)}
											</p>
										</div>
										<div className="rounded-md border bg-muted/30 px-3 py-2">
											<p className="text-xs text-muted-foreground">Foot</p>
											<p className="font-medium">{player.prefferedFoot}</p>
										</div>
										<div className="rounded-md border bg-muted/30 px-3 py-2">
											<p className="text-xs text-muted-foreground">Height</p>
											<p className="font-medium">{player.height} cm</p>
										</div>
										<div className="rounded-md border bg-muted/30 px-3 py-2">
											<p className="text-xs text-muted-foreground">Weight</p>
											<p className="font-medium">{player.weight} kg</p>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				{/* Desktop: grid cards */}
				<div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{players.map((player) => (
						<Card key={player.id}>
							<CardHeader>
								<CardTitle className="text-base">
									{player.firstName} {player.lastName}
								</CardTitle>
								<p className="text-sm text-muted-foreground">{player.position}</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-1 text-sm">
									<p className="text-muted-foreground">
										Age: {currentYear - Math.round(player.yearOfBirth)}
									</p>
									<p className="text-muted-foreground">Height: {player.height} cm</p>
									<p className="text-muted-foreground">Weight: {player.weight} kg</p>
									<p className="text-muted-foreground">Foot: {player.prefferedFoot}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default AdminTeamsViewUi;
