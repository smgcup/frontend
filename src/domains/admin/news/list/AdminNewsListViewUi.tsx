'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
	Plus,
	Pencil,
	Trash2,
	Clock,
	FileText,
	ImageIcon,
	Loader2,
} from 'lucide-react';
import { GetNewsQuery } from '@/graphql';

type NewsItem = GetNewsQuery['news'][number];

type AdminNewsListViewUiProps = {
	news: NewsItem[];
	newsLoading: boolean;
	deleteLoading: boolean;
	onDeleteNews: (id: string) => Promise<void>;
};

const AdminNewsListViewUi = ({
	news,
	newsLoading,
	deleteLoading,
	onDeleteNews,
}: AdminNewsListViewUiProps) => {
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const handleDelete = async (id: string) => {
		setDeletingId(id);
		await onDeleteNews(id);
		setDeletingId(null);
	};

	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			match: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
			team: 'bg-green-500/10 text-green-500 border-green-500/20',
			player: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
			tournament: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
		};
		return colors[category.toLowerCase()] || 'bg-primary/10 text-primary border-primary/20';
	};

	if (newsLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-muted-foreground">Loading news...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">News Management</h1>
					<p className="mt-1 text-muted-foreground">
						Create, edit, and manage news articles
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link href="/admin/news/create">
						<Plus className="h-4 w-4" />
						Create Article
					</Link>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-blue-500/20 p-3">
								<FileText className="h-5 w-5 text-blue-500" />
							</div>
							<div>
								<p className="text-2xl font-bold">{news.length}</p>
								<p className="text-sm text-muted-foreground">Total Articles</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* News List */}
			{news.length === 0 ? (
				<Card className="border-dashed">
					<CardContent className="flex flex-col items-center justify-center py-16">
						<div className="rounded-full bg-muted p-4 mb-4">
							<FileText className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-semibold mb-2">No articles yet</h3>
						<p className="text-muted-foreground text-center mb-6 max-w-sm">
							Get started by creating your first news article
						</p>
						<Button asChild>
							<Link href="/admin/news/create">
								<Plus className="h-4 w-4 mr-2" />
								Create Article
							</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{news.map(item => (
						<Card
							key={item.id}
							className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
						>
							<div className="flex flex-col sm:flex-row">
								{/* Image Preview */}
								<div className="relative h-48 sm:h-auto sm:w-48 lg:w-64 shrink-0 bg-muted">
									{item.imageUrl ? (
										<Image
											src={item.imageUrl}
											alt={item.title}
											fill
											className="object-cover"
										/>
									) : (
										<div className="flex h-full items-center justify-center">
											<ImageIcon className="h-12 w-12 text-muted-foreground/50" />
										</div>
									)}
								</div>

								{/* Content */}
								<div className="flex flex-1 flex-col p-5">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<Badge
													variant="outline"
													className={getCategoryColor(item.category)}
												>
													{item.category}
												</Badge>
												<span className="flex items-center gap-1 text-xs text-muted-foreground">
													<Clock className="h-3 w-3" />
													{formatDate(item.createdAt)}
												</span>
											</div>
											<h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
												{item.title}
											</h3>
											<p className="mt-2 text-sm text-muted-foreground line-clamp-2">
												{item.content}
											</p>
										</div>

										{/* Actions */}
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="icon"
												asChild
												className="h-9 w-9"
											>
												<Link href={`/admin/news/${item.id}/edit`}>
													<Pencil className="h-4 w-4" />
													<span className="sr-only">Edit</span>
												</Link>
											</Button>

											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
													>
														{deletingId === item.id ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4" />
														)}
														<span className="sr-only">Delete</span>
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Delete Article</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to delete &quot;{item.title}&quot;?
															This action cannot be undone.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															variant="destructive"
															onClick={() => handleDelete(item.id)}
														>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminNewsListViewUi;
