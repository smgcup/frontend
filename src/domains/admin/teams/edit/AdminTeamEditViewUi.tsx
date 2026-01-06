'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ErrorLike } from '@apollo/client';
import type { TeamByIdQuery, UpdateTeamDto } from '@/graphql';
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
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';

type AdminTeamEditViewUiProps = {
  team: TeamByIdQuery['teamById'] | undefined;
  teamLoading: boolean;
  teamError: ErrorLike | null | undefined;
  updateLoading: boolean;
  updateError: ErrorLike | null | undefined;
  deleteLoading: boolean;
  deleteError: ErrorLike | null | undefined;
  onUpdateTeam: (dto: UpdateTeamDto) => Promise<unknown>;
  onDeleteTeam: () => Promise<unknown>;
};

const AdminTeamEditViewUi = ({
  team,
  teamLoading,
  teamError,
  updateLoading,
  updateError,
  deleteLoading,
  deleteError,
  onUpdateTeam,
  onDeleteTeam,
}: AdminTeamEditViewUiProps) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!team) return;
    setName(team.name ?? '');
  }, [team]);

  const getErrorMessage = (e: unknown) => {
    if (!e) return 'Unknown error';
    if (typeof e === 'string') return e;
    if (typeof e === 'object' && e && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
      return (e as { message: string }).message;
    }
    return String(e);
  };

  const combinedError = useMemo(() => {
    return (
      actionError ||
      (teamError && 'message' in teamError && typeof teamError.message === 'string' ? teamError.message : null) ||
      (updateError && 'message' in updateError && typeof updateError.message === 'string' ? updateError.message : null) ||
      (deleteError && 'message' in deleteError && typeof deleteError.message === 'string' ? deleteError.message : null)
    );
  }, [actionError, teamError, updateError, deleteError]);

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
    <div className="space-y-6 p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Team</h1>
          <p className="mt-2 text-muted-foreground">Update team details</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/teams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>Edit the team name and save changes</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-10">
          <CardContent>
            {combinedError && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                <p className="font-medium">Operation failed</p>
                <p className="mt-1 text-sm">{combinedError}</p>
              </div>
            )}

            {teamLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading team...
              </div>
            ) : (
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
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={updateLoading || deleteLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={teamLoading || updateLoading || deleteLoading}>
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
                  disabled={teamLoading || updateLoading || deleteLoading}
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
      </Card>
    </div>
  );
};

export default AdminTeamEditViewUi;


