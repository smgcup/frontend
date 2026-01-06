'use client';

import { CreatePlayerDto, PlayerPosition, PreferredFoot, TeamsDocument, TeamsQuery } from '@/graphql';
import { ErrorLike } from '@apollo/client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@apollo/client/react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';

type AdminPlayerCreateViewUiProps = {
  onAdminPlayerCreate: (createPlayerDto: CreatePlayerDto) => void;
  adminPlayerCreateLoading: boolean;
  adminPlayerCreateError: ErrorLike | null;
};
const AdminPlayerCreateViewUi = ({
  onAdminPlayerCreate,
  adminPlayerCreateLoading,
  adminPlayerCreateError,
}: AdminPlayerCreateViewUiProps) => {
  type FormState = {
    firstName: string;
    lastName: string;
    teamId: string;
    height: string;
    weight: string;
    yearOfBirth: string;
    imageUrl: string;
    position: PlayerPosition | '';
    prefferedFoot: PreferredFoot | '';
  };

  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    teamId: '',
    height: '',
    weight: '',
    yearOfBirth: '',
    imageUrl: '',
    position: '',
    prefferedFoot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTeamChange = (value: string) => {
    setFormData((prev) => ({ ...prev, teamId: value }));
    if (errors.teamId) setErrors((prev) => ({ ...prev, teamId: '' }));
  };

  const handlePositionChange = (value: PlayerPosition) => {
    setFormData((prev) => ({ ...prev, position: value }));
    if (errors.position) setErrors((prev) => ({ ...prev, position: '' }));
  };

  const handlePreferredFootChange = (value: PreferredFoot) => {
    setFormData((prev) => ({ ...prev, prefferedFoot: value }));
    if (errors.prefferedFoot) setErrors((prev) => ({ ...prev, prefferedFoot: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.teamId) newErrors.teamId = 'Team is required';

    if (!formData.height.trim()) {
      newErrors.height = 'Height is required';
    } else if (isNaN(parseFloat(formData.height))) {
      newErrors.height = 'Height must be a number';
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Weight must be a number';
    }

    if (!formData.yearOfBirth.trim()) {
      newErrors.yearOfBirth = 'Year of birth is required';
    } else if (isNaN(parseFloat(formData.yearOfBirth))) {
      newErrors.yearOfBirth = 'Year of birth must be a number';
    }
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    if (!formData.prefferedFoot) {
      newErrors.prefferedFoot = 'Preferred foot is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onAdminPlayerCreate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      teamId: formData.teamId,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      yearOfBirth: parseFloat(formData.yearOfBirth),
      imageUrl: formData.imageUrl.trim() || '',
      position: formData.position as PlayerPosition,
      prefferedFoot: formData.prefferedFoot as PreferredFoot,
    });

    window.history.back();
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AdminPageHeader title="Create player" description="Add a new player to a team" backHref="/admin/players" />

      <Card>
        <CardHeader>
          <CardTitle>Player Information</CardTitle>
          <CardDescription>Fill in the details below to create a new player</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-10">
          <CardContent>
            {(adminPlayerCreateError || teamsError) && (
              <div className="text-destructive mb-4">
                {adminPlayerCreateError && 'message' in adminPlayerCreateError
                  ? adminPlayerCreateError.message
                  : adminPlayerCreateError
                    ? String(adminPlayerCreateError)
                    : null}
                {teamsError && <div>{teamsError.message || 'Failed to load teams.'}</div>}
              </div>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                <FieldContent>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                <FieldContent>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Team *</FieldLabel>
                <FieldContent>
                  <Select disabled={teamsLoading} onValueChange={handleTeamChange} value={formData.teamId}>
                    <SelectTrigger aria-invalid={!!errors.teamId} className="w-full">
                      <SelectValue placeholder={teamsLoading ? 'Loading teams...' : 'Select a team'} />
                    </SelectTrigger>
                    <SelectContent>
                      {teamsData?.teams?.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.teamId && <FieldError>{errors.teamId}</FieldError>}
                  <FieldDescription />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="height">Height (cm) *</FieldLabel>
                <FieldContent>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="e.g. 180"
                    value={formData.height}
                    onChange={handleChange}
                    aria-invalid={!!errors.height}
                  />
                  {errors.height && <FieldError>{errors.height}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="weight">Weight (kg) *</FieldLabel>
                <FieldContent>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="e.g. 75"
                    value={formData.weight}
                    onChange={handleChange}
                    aria-invalid={!!errors.weight}
                  />
                  {errors.weight && <FieldError>{errors.weight}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="yearOfBirth">Year of Birth *</FieldLabel>
                <FieldContent>
                  <Input
                    id="yearOfBirth"
                    name="yearOfBirth"
                    type="number"
                    placeholder="e.g. 2008"
                    value={formData.yearOfBirth}
                    onChange={handleChange}
                    aria-invalid={!!errors.yearOfBirth}
                  />
                  {errors.yearOfBirth && <FieldError>{errors.yearOfBirth}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="position">Position *</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(v) => handlePositionChange(v as PlayerPosition)}
                    value={formData.position || undefined}
                  >
                    <SelectTrigger aria-invalid={!!errors.position} className="w-full">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PlayerPosition.Goalkeeper}>Goalkeeper</SelectItem>
                      <SelectItem value={PlayerPosition.Defender}>Defender</SelectItem>
                      <SelectItem value={PlayerPosition.Midfielder}>Midfielder</SelectItem>
                      <SelectItem value={PlayerPosition.Forward}>Forward</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.position && <FieldError>{errors.position}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="prefferedFoot">Preferred Foot *</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(v) => handlePreferredFootChange(v as PreferredFoot)}
                    value={formData.prefferedFoot || undefined}
                  >
                    <SelectTrigger aria-invalid={!!errors.prefferedFoot} className="w-full">
                      <SelectValue placeholder="Select preferred foot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PreferredFoot.Left}>Left</SelectItem>
                      <SelectItem value={PreferredFoot.Right}>Right</SelectItem>
                      <SelectItem value={PreferredFoot.Both}>Both</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.prefferedFoot && <FieldError>{errors.prefferedFoot}</FieldError>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
                <FieldContent>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                  <FieldDescription />
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={adminPlayerCreateLoading || teamsLoading}
              className="w-full sm:w-auto cursor-pointer"
            >
              {adminPlayerCreateLoading ? 'Creating...' : 'Create Player'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default AdminPlayerCreateViewUi;
