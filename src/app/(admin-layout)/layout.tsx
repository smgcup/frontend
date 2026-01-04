import Sidebar from '@/domains/admin/auth/components/Sidebar';
import { HomeIcon, CalendarIcon, UsersIcon, FileText } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar
        items={[
          {
            title: 'Dashboard',
            url: '/admin',
            icon: <HomeIcon />,
          },
          {
            title: 'News',
            url: '/admin/news',
            icon: <FileText />,
          },
          {
            title: 'Matches',
            url: '/admin/matches',
            icon: <CalendarIcon />,
          },
          {
            title: 'Teams & Players',
            url: '/admin/teams',
            icon: <UsersIcon />,
          },
        ]}
      />
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0 px-4 lg:px-6 py-6">{children}</div>
      </main>
    </>
  );
}
