import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { FileText, Plus, UsersIcon, UserPlus, CalendarIcon, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';

type Statistic = {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  href: string;
  description: string;
};

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
};

const AdminHomeViewUi = () => {
  // Hardcoded overview numbers for now (replace with API later)
  const statistics: Statistic[] = [
    {
      id: '1',
      label: 'Teams',
      value: 3,
      icon: <Users className="h-6 w-6" />,
      color: 'text-green-500',
      href: '/admin/teams',
      description: 'Create, edit, and delete teams',
    },
    {
      id: '2',
      label: 'Players',
      value: 24,
      icon: <User className="h-6 w-6" />,
      color: 'text-blue-500',
      href: '/admin/players',
      description: 'Manage player profiles and details',
    },
    {
      id: '3',
      label: 'Matches',
      value: 0,
      icon: <CalendarIcon className="h-6 w-6" />,
      color: 'text-purple-500',
      href: '/admin/matches',
      description: 'Scheduling coming soon',
    },
    {
      id: '4',
      label: 'News',
      value: 5,
      icon: <FileText className="h-6 w-6" />,
      color: 'text-orange-500',
      href: '/admin/news',
      description: 'Publish and edit articles',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Create Team',
      description: 'Add a new team to the tournament',
      icon: <UsersIcon className="h-6 w-6" />,
      href: '/admin/teams/create',
      color: 'text-green-500',
    },
    {
      id: '2',
      title: 'Create Player',
      description: 'Register a new player',
      icon: <UserPlus className="h-6 w-6" />,
      href: '/admin/players/create',
      color: 'text-blue-500',
    },
    {
      id: '3',
      title: 'Create News',
      description: 'Publish a news article',
      icon: <FileText className="h-6 w-6" />,
      href: '/admin/news/create',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader title="Overview" description="Quick navigation and snapshot of your tournament management" />

      {/* Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat) => (
          <Link key={stat.id} href={stat.href} className="group">
            <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 h-full">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{stat.description}</p>
                </div>
                <div className={cn('shrink-0 rounded-lg bg-primary/10 p-3', stat.color)}>{stat.icon}</div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                  Manage
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.id} href={action.href}>
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col items-start gap-4">
                  <div className={cn('rounded-lg bg-primary/10 p-3', action.color)}>{action.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomeViewUi;
