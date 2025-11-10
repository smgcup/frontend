import React from 'react';
import TeamPage from '@/components/Team/TeamPage';

interface PageProps {
    params: {
        teamId: string;
    };
}

export default function Page({ params }: PageProps) {
    return <TeamPage teamId={params.teamId} />;
}

