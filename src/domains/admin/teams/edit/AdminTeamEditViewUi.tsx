'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorLike } from '@apollo/client';
import type { Team, TeamUpdate } from '@/domains/team/contracts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

type AdminTeamEditViewUiProps = {
  team: Team;
  updateLoading: boolean;
  updateError: ErrorLike | null;
  deleteLoading: boolean;
  deleteError: ErrorLike | null;
  onUpdateTeam: (dto: TeamUpdate) => Promise<unknown>;
  onDeleteTeam: () => Promise<unknown>;
};

type AdminTeamEditFormProps = {
  team: Team;
  updateLoading: boolean;
  updateError: ErrorLike | null;
  deleteLoading: boolean;
  deleteError: ErrorLike | null;
  onUpdateTeam: (dto: TeamUpdate) => Promise<unknown>;
  onDeleteTeam: () => Promise<unknown>;
};

const AdminTeamEditForm = ({
  team,
  updateLoading,
  updateError,
  deleteLoading,
  deleteError,
  onUpdateTeam,
  onDeleteTeam,
}: AdminTeamEditFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(team.name ?? '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const combinedError = useMemo(() => {
    return (
      actionError ||
      (updateError && 'message' in updateError && typeof updateError.message === 'string'
        ? updateError.message
        : null) ||
      (deleteError && 'message' in deleteError && typeof deleteError.message === 'string' ? deleteError.message : null)
    );
  }, [actionError, updateError, deleteError]);

  const validate = () => {
    if (!name.trim()) {
      setNameError('Team name is required');
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!validate()) return;

    try {
      await onUpdateTeam({ name: name.trim() });
      router.push('/admin/teams');
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    try {
      await onDeleteTeam();
      router.push('/admin/teams');
      router.refresh();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <CardContent>
        {combinedError && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Operation failed</p>
            <p className="mt-1 text-sm">{combinedError}</p>
          </div>
        )}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Team Name *</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter team name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                aria-invalid={!!nameError}
              />
              {nameError && <FieldError>{nameError}</FieldError>}
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={updateLoading || deleteLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateLoading || deleteLoading}>
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
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete Team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Team</AlertDialogTitle>
              <AlertDialogDescription>
                Deleting a team can fail if it is still referenced (players/matches). This action cannot be undone.
              </AlertDialogDescription>
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
  );
};

const AdminTeamEditViewUi = ({
  team,
  updateLoading,
  updateError,
  deleteLoading,
  deleteError,
  onUpdateTeam,
  onDeleteTeam,
}: AdminTeamEditViewUiProps) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <AdminPageHeader title="Edit team" description="Update team details" backHref="/admin/teams" />

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>Edit the team name and save changes</CardDescription>
        </CardHeader>

        <AdminTeamEditForm
          key={team.id}
          team={team}
          updateLoading={updateLoading}
          updateError={updateError}
          deleteLoading={deleteLoading}
          deleteError={deleteError}
          onUpdateTeam={onUpdateTeam}
          onDeleteTeam={onDeleteTeam}
        />
      </Card>
    </div>
  );
};

export default AdminTeamEditViewUi;
