'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Loader2, Eye, Save } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import type { News } from '@/domains/news/contracts';
import type { UpdateNewsDto, ImageUploadInput } from '@/graphql';

type AdminNewsEditViewUiProps = {
  news: News | null;
  newsLoading: boolean;
  updateLoading: boolean;
  onUpdateNews: (updateNewsDto: UpdateNewsDto) => Promise<unknown>;
};

const CATEGORIES = [
  { value: 'match', label: 'Match' },
  { value: 'team', label: 'Team' },
  { value: 'player', label: 'Player' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'announcement', label: 'Announcement' },
];

type AdminNewsEditFormProps = {
  news: News;
  updateLoading: boolean;
  onUpdateNews: (updateNewsDto: UpdateNewsDto) => Promise<unknown>;
};

const AdminNewsEditForm = ({ news, updateLoading, onUpdateNews }: AdminNewsEditFormProps) => {
  const [formData, setFormData] = useState(() => ({
    title: news.title,
    content: news.content,
    category: news.category,
  }));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(news.imageUrl);
  const [imageChanged, setImageChanged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);

  // Track which fields have changed
  const [initialData] = useState(() => ({
    title: news.title,
    content: news.content,
    category: news.category,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageChanged(true);
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
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

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dto: UpdateNewsDto = {};

    // Only include changed fields
    if (formData.title !== initialData.title) {
      dto.title = formData.title.trim();
    }
    if (formData.content !== initialData.content) {
      dto.content = formData.content.trim();
    }
    if (formData.category !== initialData.category) {
      dto.category = formData.category;
    }

    // Handle image upload if changed
    if (imageChanged && imageFile) {
      const fileBase64 = await fileToBase64(imageFile);
      const image: ImageUploadInput = {
        fileBase64,
        mimeType: imageFile.type,
      };
      dto.image = image;
    }

    await onUpdateNews(dto);
  };

  const hasChanges =
    formData.title !== initialData.title ||
    formData.content !== initialData.content ||
    formData.category !== initialData.category ||
    imageChanged;

  return (
    <div className="py-4 lg:p-10">
      <div className="space-y-6 max-w-4xl mx-auto">
        <AdminPageHeader title="Edit article" subtitle={`Editing: ${news.title}`} backHref="/admin/news" />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>Update the article information below</CardDescription>
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
                        className={`text-base ${formData.title !== initialData.title ? 'ring-1 ring-primary bg-primary/5' : ''}`}
                      />
                      {errors.title && <FieldError>{errors.title}</FieldError>}
                    </FieldContent>
                  </Field>

                  {/* Category */}
                  <Field>
                    <FieldLabel htmlFor="category">Category *</FieldLabel>
                    <FieldContent>
                      <Select value={formData.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger
                          id="category"
                          aria-invalid={!!errors.category}
                          className={formData.category !== initialData.category ? 'ring-1 ring-primary bg-primary/5' : ''}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <FieldError>{errors.category}</FieldError>}
                    </FieldContent>
                  </Field>

                  {/* Image Upload */}
                  <Field>
                    <FieldLabel htmlFor="image">Cover Image</FieldLabel>
                    <FieldContent>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        aria-invalid={!!errors.image}
                        className={imageChanged ? 'ring-1 ring-primary bg-primary/5' : ''}
                      />
                      {errors.image && <FieldError>{errors.image}</FieldError>}
                      <FieldDescription>Upload a new image to replace the current one</FieldDescription>
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
                        className={`resize-none font-mono text-sm ${formData.content !== initialData.content ? 'ring-1 ring-primary bg-primary/5' : ''}`}
                      />
                      {errors.content && <FieldError>{errors.content}</FieldError>}
                      <FieldDescription>You can use Markdown for formatting</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end border-t pt-6">
                <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/admin/news">Cancel</Link>
                </Button>
                <Button type="submit" disabled={updateLoading || !hasChanges} className="w-full sm:w-auto gap-2">
                  {updateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {updateLoading ? 'Saving...' : 'Save Changes'}
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
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
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
                <CardTitle className="text-base">Article Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>ID:</strong> <span className="font-mono text-xs">{news.id}</span>
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(news.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminNewsEditViewUi = ({ news, newsLoading, updateLoading, onUpdateNews }: AdminNewsEditViewUiProps) => {
  if (newsLoading) {
    return (
      <div className="py-4 lg:p-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="py-4 lg:p-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h2 className="text-xl font-semibold">Article not found</h2>
          <Button asChild>
            <Link href="/admin/news">Back to News</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <AdminNewsEditForm key={news.id} news={news} updateLoading={updateLoading} onUpdateNews={onUpdateNews} />;
};

export default AdminNewsEditViewUi;
