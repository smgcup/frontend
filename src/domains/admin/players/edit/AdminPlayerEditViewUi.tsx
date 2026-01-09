'use client';

import type { PlayerEdit, PlayerTeam, PlayerUpdate } from '@/domains/player/contracts';
import { PreferredFoot, PlayerPosition } from '@/domains/player/contracts';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorLike } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Loader2, Save, Trash2 } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { getErrorMessage } from '@/domains/admin/players/utils/getErrorMessage';

type AdminPlayerEditViewUiProps = {
  teams: PlayerTeam[];
  player: PlayerEdit | undefined;
  updateLoading: boolean;
  updateError: ErrorLike | null;
  deleteLoading: boolean;
  deleteError: ErrorLike | null;
  onUpdatePlayer: (dto: PlayerUpdate) => Promise<unknown>;
  onDeletePlayer: () => Promise<unknown>;
};

type FormState = {
  firstName: string;
  lastName: string;
  teamId: string;
  height: string;
  weight: string;
  yearOfBirth: string;
  imageUrl: string;
  position: PlayerPosition | '';
  preferredFoot: PreferredFoot | '';
};

type FieldName = keyof FormState;

const AdminPlayerEditViewUi = ({
  teams,
  player,
  updateLoading,
  updateError,
  deleteLoading,
  deleteError,
  onUpdatePlayer,
  onDeletePlayer,
}: AdminPlayerEditViewUiProps) => {
  const router = useRouter();

  // Form inputs are controlled, so we keep everything as strings here and only coerce
  // to numbers/enums at submit time (avoids `undefined` / NaN edge-cases in <input />).
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    teamId: '',
    height: '',
    weight: '',
    yearOfBirth: '',
    imageUrl: '',
    position: '',
    preferredFoot: '',
  });

  // `errors` is field-level validation; `actionError` is for async failures (update/delete).
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  // Snapshot of the server-loaded player data mapped into `FormState`.
  // Used for computing "dirty" fields and enabling the Save button.
  const [initialData, setInitialData] = useState<FormState | null>(null);
  const [dirtyFields, setDirtyFields] = useState<Record<FieldName, boolean>>({
    firstName: false,
    lastName: false,
    teamId: false,
    height: false,
    weight: false,
    yearOfBirth: false,
    imageUrl: false,
    position: false,
    preferredFoot: false,
  });

  // When the `player` arrives/changes (SSR/CSR hydration, navigation between IDs, refetch),
  // sync it into local controlled form state.
  //
  // We also capture the initial snapshot (`initialData`) so we can:
  // - compute "dirty" fields by comparing to this baseline
  // - reset dirty state back to "clean" whenever the loaded player changes
  useEffect(() => {
    if (!player) return;
    // Normalize nullable API fields into safe controlled-input values.
    const next: FormState = {
      firstName: player.firstName ?? '',
      lastName: player.lastName ?? '',
      teamId: player.team?.id ?? '',
      height: String(player.height ?? ''),
      weight: String(player.weight ?? ''),
      yearOfBirth: String(player.yearOfBirth ?? ''),
      imageUrl: player.imageUrl ?? '',
      position: player.position ?? '',
      preferredFoot: player.preferredFoot ?? '',
    };
    // Avoid synchronous setState inside an effect body (can cause cascading renders)
    // Defer the state sync to a microtask and cancel if the effect is cleaned up.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setInitialData(next);
      setFormData(next);
      setDirtyFields({
        firstName: false,
        lastName: false,
        teamId: false,
        height: false,
        weight: false,
        yearOfBirth: false,
        imageUrl: false,
        position: false,
        preferredFoot: false,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [player]);

  const combinedError = useMemo(() => {
    // Prefer local action errors (caught exceptions) over request errors, so the most
    // relevant message is shown after a user-triggered action.
    return (
      actionError ||
      (updateError && 'message' in updateError && typeof updateError.message === 'string'
        ? updateError.message
        : null) ||
      (deleteError && 'message' in deleteError && typeof deleteError.message === 'string' ? deleteError.message : null)
    );
  }, [actionError, updateError, deleteError]);

  const markDirty = (field: FieldName, nextValue: FormState[FieldName]) => {
    // Only track dirtiness once we have an initial snapshot to compare against.
    if (!initialData) return;
    const isDirty = initialData[field] !== nextValue;
    setDirtyFields((prev) => ({ ...prev, [field]: isDirty }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as FieldName;
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as FormState;
      markDirty(field, next[field]);
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    // Minimal client-side validation; server-side validation still applies.
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.teamId) newErrors.teamId = 'Team is required';

    if (!formData.height.trim()) newErrors.height = 'Height is required';
    else if (isNaN(parseFloat(formData.height))) newErrors.height = 'Height must be a number';

    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    else if (isNaN(parseFloat(formData.weight))) newErrors.weight = 'Weight must be a number';

    if (!formData.yearOfBirth.trim()) newErrors.yearOfBirth = 'Year of birth is required';
    else if (isNaN(parseFloat(formData.yearOfBirth))) newErrors.yearOfBirth = 'Year of birth must be a number';

    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.preferredFoot) newErrors.preferredFoot = 'Preferred foot is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!validateForm()) return;

    try {
      // Only send changed fields (all fields are optional on PlayerUpdate)
      const dto: PlayerUpdate = {};
      if (dirtyFields.firstName) dto.firstName = formData.firstName.trim();
      if (dirtyFields.lastName) dto.lastName = formData.lastName.trim();
      if (dirtyFields.teamId) dto.teamId = formData.teamId;
      if (dirtyFields.height) dto.height = parseFloat(formData.height);
      if (dirtyFields.weight) dto.weight = parseFloat(formData.weight);
      if (dirtyFields.yearOfBirth) dto.yearOfBirth = parseFloat(formData.yearOfBirth);
      if (dirtyFields.imageUrl) dto.imageUrl = formData.imageUrl.trim() || '';
      if (dirtyFields.position) dto.position = formData.position as PlayerPosition;
      if (dirtyFields.preferredFoot) dto.preferredFoot = formData.preferredFoot as PreferredFoot;

      // If nothing changed, just go back (no-op update)
      if (Object.keys(dto).length === 0) {
        router.push('/admin/players');
        return;
      }

      await onUpdatePlayer(dto);
      router.push('/admin/players');
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleDelete = async () => {
    setActionError(null);
    try {
      await onDeletePlayer();
      router.push('/admin/players');
      // Ensure the list page revalidates after navigation (avoids stale cached data).
      router.refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const isDirty = Object.values(dirtyFields).some(Boolean);
  const dirtyClass = (field: FieldName) => (dirtyFields[field] ? 'ring-1 ring-primary bg-primary/5' : '');

  const selectedTeamName = useMemo(() => {
    // If the player is linked to a team that isn't in the `teams` list (e.g. filtered
    // list, pagination, or stale cache), still show the currently selected team label.
    if (teams.length && formData.teamId) {
      return teams.find((t) => t.id === formData.teamId)?.name ?? null;
    }
    return player?.team?.name ?? null;
  }, [teams, formData.teamId, player?.team?.name]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AdminPageHeader title="Edit player" description="Update player details" backHref="/admin/players" />

      <Card>
        <CardHeader>
          <CardTitle>Player Information</CardTitle>
          <CardDescription>Edit the details below and save changes</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-10">
          <CardContent>
            {combinedError && <div className="text-destructive mb-4">{combinedError}</div>}

            {!player ? (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                <p className="font-medium">Player not found</p>
                <p className="mt-1 text-sm">This player may have been deleted or is not assigned to any team.</p>
              </div>
            ) : !initialData ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading player...
              </div>
            ) : (
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
                      className={dirtyClass('firstName')}
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
                      className={dirtyClass('lastName')}
                    />
                    {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Team *</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, teamId: value }));
                        if (errors.teamId) setErrors((prev) => ({ ...prev, teamId: '' }));
                        markDirty('teamId', value);
                      }}
                      value={formData.teamId}
                    >
                      <SelectTrigger
                        aria-invalid={!!errors.teamId}
                        className={`w-full ${dirtyFields.teamId ? 'ring-1 ring-primary bg-primary/5' : ''}`}
                      >
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.teamId && !teams.some((t) => t.id === formData.teamId) && selectedTeamName && (
                          <SelectItem value={formData.teamId}>{selectedTeamName}</SelectItem>
                        )}
                        {teams.map((team) => (
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
                      className={dirtyClass('height')}
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
                      className={dirtyClass('weight')}
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
                      placeholder="e.g. 2001"
                      value={formData.yearOfBirth}
                      onChange={handleChange}
                      aria-invalid={!!errors.yearOfBirth}
                      className={dirtyClass('yearOfBirth')}
                    />
                    {errors.yearOfBirth && <FieldError>{errors.yearOfBirth}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
                  <FieldContent>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className={dirtyClass('imageUrl')}
                    />
                    <FieldDescription />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Position *</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, position: value as PlayerPosition }));
                        if (errors.position) setErrors((prev) => ({ ...prev, position: '' }));
                        markDirty('position', value as PlayerPosition);
                      }}
                      value={formData.position}
                    >
                      <SelectTrigger
                        aria-invalid={!!errors.position}
                        className={`w-full ${dirtyFields.position ? 'ring-1 ring-primary bg-primary/5' : ''}`}
                      >
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PlayerPosition).map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.position && <FieldError>{errors.position}</FieldError>}
                    <FieldDescription />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Preferred Foot *</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, preferredFoot: value as PreferredFoot }));
                        if (errors.preferredFoot) setErrors((prev) => ({ ...prev, preferredFoot: '' }));
                        markDirty('preferredFoot', value as PreferredFoot);
                      }}
                      value={formData.preferredFoot}
                    >
                      <SelectTrigger
                        aria-invalid={!!errors.preferredFoot}
                        className={`w-full ${dirtyFields.preferredFoot ? 'ring-1 ring-primary bg-primary/5' : ''}`}
                      >
                        <SelectValue placeholder="Select preferred foot" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PreferredFoot).map((foot) => (
                          <SelectItem key={foot} value={foot}>
                            {foot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.preferredFoot && <FieldError>{errors.preferredFoot}</FieldError>}
                    <FieldDescription />
                  </FieldContent>
                </Field>
              </FieldGroup>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={updateLoading || deleteLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLoading || deleteLoading || !isDirty}>
                {updateLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save
              </Button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto"
                  disabled={updateLoading || deleteLoading}
                >
                  {deleteLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Player
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Player</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminPlayerEditViewUi;
