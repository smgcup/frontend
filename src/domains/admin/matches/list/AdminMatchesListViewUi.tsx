'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { type Match } from '@/domains/matches/contracts';
import AdminMatchCard from './components/AdminMatchCard';

type AdminMatchesListViewUiProps = {
  matches: Match[];
  deleteLoading: boolean;
  onDeleteMatch: (id: string) => Promise<void>;
};

const AdminMatchesListViewUi = ({ matches, deleteLoading, onDeleteMatch }: AdminMatchesListViewUiProps) => {
  // Track which match is currently being deleted (for showing loading state on specific match)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Track which match's ID popup is currently shown
  const [showMatchId, setShowMatchId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDeleteMatch(id);
    setDeletingId(null);
  };

  const handleToggleMatchId = (id: string) => {
    setShowMatchId(showMatchId === id ? null : id);
  };

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMatchId) {
        const target = event.target as HTMLElement;

        const popups = document.querySelectorAll('[data-match-popup]');
        const matchTexts = document.querySelectorAll('[data-match-text]');

        let isClickInside = false;

        popups.forEach((popup) => {
          if (popup.contains(target)) {
            isClickInside = true;
          }
        });

        matchTexts.forEach((text) => {
          if (text === target || text.contains(target)) {
            isClickInside = true;
          }
        });

        if (!isClickInside) {
          setShowMatchId(null);
        }
      }
    };

    if (showMatchId) {
      // Use a slight delay to allow onClick handlers to fire first
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMatchId]);

  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Matches"
        subtitle={`${matches.length} total`}
        description="Create, edit, and manage matches"
        actions={
          <Button asChild className="gap-2 w-full sm:w-auto">
            <Link href="/admin/matches/create">
              <Plus className="h-4 w-4" />
              Create match
            </Link>
          </Button>
        }
      />

      {matches.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">Get started by creating your first match</p>
            <Button asChild>
              <Link href="/admin/matches/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Match
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <AdminMatchCard
              key={match.id}
              match={match}
              deleteLoading={deleteLoading}
              deletingId={deletingId}
              showMatchId={showMatchId}
              onDeleteMatch={handleDelete}
              onToggleMatchId={handleToggleMatchId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMatchesListViewUi;
