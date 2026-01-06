import AdminShell from '@/domains/admin/layout/AdminShell';
import { HomeIcon, CalendarIcon, UsersIcon, FileText, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell
      items={[
        { title: 'Overview', url: '/admin', icon: <HomeIcon /> },
        { title: 'Teams', url: '/admin/teams', icon: <UsersIcon /> },
        { title: 'Players', url: '/admin/players', icon: <User /> },
        { title: 'Matches', url: '/admin/matches', icon: <CalendarIcon /> },
        { title: 'News', url: '/admin/news', icon: <FileText /> },
      ]}
    >
      {children}
    </AdminShell>
  );
}
