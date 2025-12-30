'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CreateTeamDto } from '@/graphql';
type AdminTeamCreateViewUiProps = {
	onAdminCreateTeam: (createTeamDto: CreateTeamDto) => void;
	adminCreateTeamLoading: boolean;
};
const AdminTeamCreateViewUi = ({
	onAdminCreateTeam,
	adminCreateTeamLoading,
}: AdminTeamCreateViewUiProps) => {
	const [formData, setFormData] = useState({
		name: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Team name is required';
		} else if (formData.name.trim().length < 2) {
			newErrors.name = 'Team name must be at least 2 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		await onAdminCreateTeam(formData);
	};

	const handleCancel = () => {
		// TODO: Implement navigation back or reset form
		window.history.back();
	};

	return (
		<div className="space-y-6 p-4 lg:p-6 max-w-4xl mx-auto">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight ">
					Create Team
				</h1>
				<p className="mt-2 text-muted-foreground">
					Add a new team to the tournament
				</p>
			</div>

			{/* Form Card */}
			<Card>
				<CardHeader>
					<CardTitle>Team Information</CardTitle>
					<CardDescription>
						Fill in the details below to create a new team
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit} className="space-y-10">
					<CardContent>
						<FieldGroup>
							{/* Team Name */}
							<Field>
								<FieldLabel htmlFor="name">
									Team Name *
								</FieldLabel>
								<FieldContent>
									<Input
										id="name"
										name="name"
										type="text"
										placeholder="Enter team name"
										value={formData.name}
										onChange={handleChange}
										aria-invalid={!!errors.name}
									/>
									{errors.name && (
										<FieldError>{errors.name}</FieldError>
									)}
									<FieldDescription>
										{/* The official name of the team */}
									</FieldDescription>
								</FieldContent>
							</Field>
						</FieldGroup>
					</CardContent>

					<CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							className="w-full sm:w-auto cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={adminCreateTeamLoading}
							className="w-full sm:w-auto cursor-pointer"
						>
							{adminCreateTeamLoading
								? 'Creating...'
								: 'Create Team'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default AdminTeamCreateViewUi;
