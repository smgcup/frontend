import AdminHomeViewUi from './AdminHomeViewUi';
import { AdminStatistics } from './ssr/getAdminHomePageData';

type AdminHomeViewProps = {
  statistics: AdminStatistics;
};

const AdminHomeView = ({ statistics }: AdminHomeViewProps) => {
  return <AdminHomeViewUi statistics={statistics} />;
};

export default AdminHomeView;
