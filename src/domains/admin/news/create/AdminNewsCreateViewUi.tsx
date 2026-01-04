'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, ImageIcon, Loader2, Eye } from 'lucide-react';
import { CreateNewsDto } from '@/graphql';

type AdminNewsCreateViewUiProps = {
	onCreateNews: (createNewsDto: CreateNewsDto) => Promise<unknown>;
	createLoading: boolean;
};

const CATEGORIES = [
	{ value: 'match', label: 'Match' },
	{ value: 'team', label: 'Team' },
	{ value: 'player', label: 'Player' },
	{ value: 'tournament', label: 'Tournament' },
	{ value: 'announcement', label: 'Announcement' },
];

const AdminNewsCreateViewUi = ({
	onCreateNews,
	createLoading,
}: AdminNewsCreateViewUiProps) => {
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		imageUrl: '',
		category: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showPreview, setShowPreview] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const handleCategoryChange = (value: string) => {
		setFormData(prev => ({ ...prev, category: value }));
		if (errors.category) {
			setErrors(prev => ({ ...prev, category: '' }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Title is required';
		} else if (formData.title.trim().length < 5) {
			newErrors.title = 'Title must be at least 5 characters';
		}

		if (!formData.content.trim()) {
			newErrors.content = 'Content is required';
		} else if (formData.content.trim().length < 20) {
			newErrors.content = 'Content must be at least 20 characters';
		}

		if (!formData.imageUrl.trim()) {
			newErrors.imageUrl = 'Image URL is required';
		} else if (!isValidUrl(formData.imageUrl)) {
			newErrors.imageUrl = 'Please enter a valid URL';
		}

		if (!formData.category) {
			newErrors.category = 'Category is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		await onCreateNews(formData);
	};

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			{/* Page Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild className="shrink-0">
					<Link href="/admin/news">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Create Article</h1>
					<p className="mt-1 text-muted-foreground">
						Write a new news article for the tournament
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				{/* Main Form */}
				<Card>
					<CardHeader>
						<CardTitle>Article Details</CardTitle>
						<CardDescription>
							Fill in the information below to create a new article
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-6">
							<FieldGroup>
								{/* Title */}
								<Field>
									<FieldLabel htmlFor="title">Title *</FieldLabel>
									<FieldContent>
										<Input
											id="title"
											name="title"
											type="text"
											placeholder="Enter article title"
											value={formData.title}
											onChange={handleChange}
											aria-invalid={!!errors.title}
											className="text-base"
										/>
										{errors.title && <FieldError>{errors.title}</FieldError>}
									</FieldContent>
								</Field>

								{/* Category */}
								<Field>
									<FieldLabel htmlFor="category">Category *</FieldLabel>
									<FieldContent>
										<Select
											value={formData.category}
											onValueChange={handleCategoryChange}
										>
											<SelectTrigger
												id="category"
												aria-invalid={!!errors.category}
											>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{CATEGORIES.map(cat => (
													<SelectItem key={cat.value} value={cat.value}>
														{cat.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.category && (
											<FieldError>{errors.category}</FieldError>
										)}
									</FieldContent>
								</Field>

								{/* Image URL */}
								<Field>
									<FieldLabel htmlFor="imageUrl">Image URL *</FieldLabel>
									<FieldContent>
										<Input
											id="imageUrl"
											name="imageUrl"
											type="url"
											placeholder="https://example.com/image.jpg"
											value={formData.imageUrl}
											onChange={handleChange}
											aria-invalid={!!errors.imageUrl}
										/>
										{errors.imageUrl && (
											<FieldError>{errors.imageUrl}</FieldError>
										)}
										<FieldDescription>
											Provide a direct link to the article cover image
										</FieldDescription>
									</FieldContent>
								</Field>

								{/* Content */}
								<Field>
									<FieldLabel htmlFor="content">Content *</FieldLabel>
									<FieldContent>
										<Textarea
											id="content"
											name="content"
											placeholder="Write your article content here... (Markdown supported)"
											value={formData.content}
											onChange={handleChange}
											aria-invalid={!!errors.content}
											rows={12}
											className="resize-none font-mono text-sm"
										/>
										{errors.content && (
											<FieldError>{errors.content}</FieldError>
										)}
										<FieldDescription>
											You can use Markdown for formatting
										</FieldDescription>
									</FieldContent>
								</Field>
							</FieldGroup>
						</CardContent>

						<CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end border-t pt-6">
							<Button
								type="button"
								variant="outline"
								asChild
								className="w-full sm:w-auto"
							>
								<Link href="/admin/news">Cancel</Link>
							</Button>
							<Button
								type="submit"
								disabled={createLoading}
								className="w-full sm:w-auto gap-2"
							>
								{createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
								{createLoading ? 'Creating...' : 'Create Article'}
							</Button>
						</CardFooter>
					</form>
				</Card>

				{/* Preview Panel */}
				<div className="space-y-4">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">Image Preview</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowPreview(!showPreview)}
									className="gap-1 text-xs"
								>
									<Eye className="h-3 w-3" />
									{showPreview ? 'Hide' : 'Show'}
								</Button>
							</div>
						</CardHeader>
						{showPreview && (
							<CardContent>
								<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
									{formData.imageUrl && isValidUrl(formData.imageUrl) ? (
										<Image
											src={formData.imageUrl}
											alt="Preview"
											fill
											className="object-cover"
											onError={e => {
												(e.target as HTMLImageElement).style.display = 'none';
											}}
										/>
									) : (
										<div className="flex h-full items-center justify-center">
											<ImageIcon className="h-12 w-12 text-muted-foreground/30" />
										</div>
									)}
								</div>
							</CardContent>
						)}
					</Card>

					<Card className="bg-muted/30">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Tips</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-2">
							<p>
								<strong>Title:</strong> Keep it concise and engaging
							</p>
							<p>
								<strong>Image:</strong> Use high-quality images (16:9 ratio recommended)
							</p>
							<p>
								<strong>Content:</strong> Markdown formatting is supported for rich text
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AdminNewsCreateViewUi;
