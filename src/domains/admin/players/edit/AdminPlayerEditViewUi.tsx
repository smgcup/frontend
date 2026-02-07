'use client';

import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';
import { PlayerPosition, PreferredFoot, UpdatePlayerDto } from '@/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cropper, { Area } from 'react-easy-crop';
import { ErrorLike } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import Image from 'next/image';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

type AdminPlayerEditViewUiProps = {
  teams: Team[];
  player: Player | undefined;
  updateLoading: boolean;
  updateError: ErrorLike | null;
  deleteLoading: boolean;
  deleteError: ErrorLike | null;
  onUpdatePlayer: (dto: UpdatePlayerDto) => Promise<unknown>;
  onDeletePlayer: () => Promise<unknown>;
};

type FormState = {
  firstName: string | null;
  lastName: string | null;
  teamId: string | null;
  height: number | null;
  weight: number | null;
  dateOfBirth: string | null;
  position: PlayerPosition | null;
  preferredFoot: PreferredFoot | null;
  class: string | null;
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
    firstName: null,
    lastName: null,
    teamId: null,
    height: null,
    weight: null,
    dateOfBirth: null,
    position: null,
    preferredFoot: null,
    class: null,
  });

  // Separate state for file upload and cropping
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Celebration image state
  const [celebrationImageFile, setCelebrationImageFile] = useState<File | null>(null);
  const [celebrationImagePreview, setCelebrationImagePreview] = useState<string | null>(null);

  // Cropping state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'image' | 'celebrationImage'>('image');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // `errors` is field-level validation; `actionError` is for async failures (update/delete).
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  // Snapshot of the server-loaded player data mapped into `FormState`.
  // Used for computing "dirty" fields and enabling the Save button.
  const [initialData, setInitialData] = useState<FormState | null>(null);

  const resetChangedFields = useMemo(
    () => ({
      firstName: false,
      lastName: false,
      teamId: false,
      height: false,
      weight: false,
      dateOfBirth: false,
      position: false,
      preferredFoot: false,
      class: false,
    }),
    [],
  );
  const [changedFields, setChangedFields] = useState<Record<FieldName, boolean>>(resetChangedFields);
  const [imageChanged, setImageChanged] = useState(false);
  const [celebrationImageChanged, setCelebrationImageChanged] = useState(false);

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
      firstName: player.firstName,
      lastName: player.lastName,
      teamId: player.team?.id || null,
      height: player.height ?? null,
      weight: player.weight ?? null,
      dateOfBirth: player.dateOfBirth ?? null,
      position: player.position ?? null,
      preferredFoot: player.preferredFoot ?? null,
      class: player?.class ?? null,
    };
    // Avoid synchronous setState inside an effect body (can cause cascading renders)
    // Defer the state sync to a microtask and cancel if the effect is cleaned up.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setInitialData(next);
      setFormData(next);
      setChangedFields(resetChangedFields);
      setImageChanged(false);
      setImageFile(null);
      setImagePreview(player.imageUrl ?? null);
      setCelebrationImageChanged(false);
      setCelebrationImageFile(null);
      setCelebrationImagePreview(player.celebrationImageUrl ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [player, resetChangedFields]);

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

  const markChanged = (field: FieldName, nextValue: FormState[FieldName]) => {
    // Only track dirtiness once we have an initial snapshot to compare against.
    if (!initialData) return;
    const isDirty = initialData[field] !== nextValue;
    setChangedFields((prev) => ({ ...prev, [field]: isDirty }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as FieldName;
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      markChanged(field, next[field]);
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'celebrationImage' = 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      // Open crop dialog with the selected image
      const previewUrl = URL.createObjectURL(file);
      setImageToCrop(previewUrl);
      setCropTarget(target);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropDialogOpen(true);
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = new window.Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size to the cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    });
  };

  const handleCropConfirm = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedBlob = await createCroppedImage(imageToCrop, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'cropped-image.png', { type: 'image/png' });

      if (cropTarget === 'celebrationImage') {
        setCelebrationImageFile(croppedFile);
        setCelebrationImageChanged(true);
        setCelebrationImagePreview(URL.createObjectURL(croppedBlob));
      } else {
        setImageFile(croppedFile);
        setImageChanged(true);
        setImagePreview(URL.createObjectURL(croppedBlob));
      }
      setCropDialogOpen(false);
      setImageToCrop(null);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setImageToCrop(null);
    // Reset the file input
    const inputId = cropTarget === 'celebrationImage' ? 'celebrationImage' : 'image';
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = () => {
    // Minimal client-side validation; server-side validation still applies.
    const newErrors: Record<string, string> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.teamId) newErrors.teamId = 'Team is required';

    if (!formData.height) newErrors.height = 'Height is required';
    else if (isNaN(formData.height)) newErrors.height = 'Height must be a number';

    if (!formData.weight) newErrors.weight = 'Weight is required';
    else if (isNaN(formData.weight)) newErrors.weight = 'Weight must be a number';

    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.preferredFoot) newErrors.preferredFoot = 'Preferred foot is required';

    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!validateForm()) return;

    try {
      // Only send changed fields (all fields are optional on PlayerUpdate)
      // Coerce numeric fields from string to number (input values are always strings)

      const dto: UpdatePlayerDto = {};
      if (changedFields.firstName) dto.firstName = formData.firstName?.trim();
      if (changedFields.lastName) dto.lastName = formData.lastName?.trim();
      if (changedFields.teamId) dto.teamId = formData.teamId;
      if (changedFields.height && formData.height) dto.height = Number(formData.height);
      if (changedFields.weight && formData.weight) dto.weight = Number(formData.weight);
      if (changedFields.dateOfBirth) dto.dateOfBirth = formData.dateOfBirth;
      if (changedFields.position) dto.position = formData.position;
      if (changedFields.preferredFoot) dto.preferredFoot = formData.preferredFoot;
      if (changedFields.class) dto.class = formData.class;

      // Handle image file upload
      if (imageChanged && imageFile) {
        const fileBase64 = await fileToBase64(imageFile);
        dto.image = {
          fileBase64,
          mimeType: imageFile.type,
        };
      }

      // Handle celebration image file upload
      if (celebrationImageChanged && celebrationImageFile) {
        const fileBase64 = await fileToBase64(celebrationImageFile);
        dto.celebrationImage = {
          fileBase64,
          mimeType: celebrationImageFile.type,
        };
      }

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

  const isDirty = Object.values(changedFields).some(Boolean) || imageChanged || celebrationImageChanged;
  const dirtyClass = (field: FieldName) => (changedFields[field] ? 'ring-1 ring-primary bg-primary/5' : '');

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
                      value={formData.firstName ?? ''}
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
                      value={formData.lastName ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errors.lastName}
                      className={dirtyClass('lastName')}
                    />
                    {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="class">Class</FieldLabel>
                  <FieldContent>
                    <Input
                      id="class"
                      name="class"
                      type="text"
                      placeholder="Enter class"
                      value={formData.class ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errors.class}
                      className={dirtyClass('class')}
                    />
                    {errors.class && <FieldError>{errors.class}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Team *</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, teamId: value }));
                        if (errors.teamId) setErrors((prev) => ({ ...prev, teamId: '' }));
                        markChanged('teamId', value);
                      }}
                      value={formData.teamId ?? ''}
                    >
                      <SelectTrigger
                        aria-invalid={!!errors.teamId}
                        className={`w-full ${changedFields.teamId ? 'ring-1 ring-primary bg-primary/5' : ''}`}
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
                      value={formData.height ?? ''}
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
                      value={formData.weight ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errors.weight}
                      className={dirtyClass('weight')}
                    />
                    {errors.weight && <FieldError>{errors.weight}</FieldError>}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="dateOfBirth">Date of Birth *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      placeholder="e.g. 2008-01-01"
                      value={formData.dateOfBirth ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errors.dateOfBirth}
                      className={dirtyClass('dateOfBirth')}
                    />
                    {errors.dateOfBirth && <FieldError>{errors.dateOfBirth}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="image">Player Image</FieldLabel>
                  <FieldContent>
                    {imagePreview && (
                      <div className="mb-2">
                        <Image
                          src={imagePreview}
                          alt="Player preview"
                          width={96}
                          height={96}
                          className="rounded-full object-cover border"
                          unoptimized
                        />
                      </div>
                    )}
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={imageChanged ? 'ring-1 ring-primary bg-primary/5' : ''}
                    />
                    <FieldDescription>Upload a new image to replace the current one</FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="celebrationImage">Celebration Image</FieldLabel>
                  <FieldContent>
                    {celebrationImagePreview && (
                      <div className="mb-2">
                        <Image
                          src={celebrationImagePreview}
                          alt="Celebration preview"
                          width={96}
                          height={96}
                          className="rounded-xl object-cover border"
                          unoptimized
                        />
                      </div>
                    )}
                    <Input
                      id="celebrationImage"
                      name="celebrationImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'celebrationImage')}
                      className={celebrationImageChanged ? 'ring-1 ring-primary bg-primary/5' : ''}
                    />
                    <FieldDescription>Upload a celebration image (square, rounded corners)</FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Position *</FieldLabel>
                  <FieldContent>
                    <Select
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, position: value as PlayerPosition }));
                        if (errors.position) setErrors((prev) => ({ ...prev, position: '' }));
                        markChanged('position', value);
                      }}
                      value={formData.position ?? ''}
                    >
                      <SelectTrigger
                        aria-invalid={!!errors.position}
                        className={`w-full ${changedFields.position ? 'ring-1 ring-primary bg-primary/5' : ''}`}
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
                        markChanged('preferredFoot', value);
                      }}
                      value={formData.preferredFoot ?? ''}
                    >
                      <SelectTrigger
                        aria-invalid={!!errors.preferredFoot}
                        className={`w-full ${changedFields.preferredFoot ? 'ring-1 ring-primary bg-primary/5' : ''}`}
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

      {/* Image Crop Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={(open) => !open && handleCropCancel()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>Adjust the crop area for the player photo</DialogDescription>
          </DialogHeader>
          <div className="relative h-80 w-full bg-muted rounded-lg overflow-hidden">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape={cropTarget === 'celebrationImage' ? 'rect' : 'round'}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={
                  cropTarget === 'celebrationImage'
                    ? { cropAreaStyle: { borderRadius: '0.75rem' } }
                    : undefined
                }
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCropConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlayerEditViewUi;
