import { Loader2 } from 'lucide-react';

const AdminMatchLivePageLoading = () => {
  return (
    <div className="py-4 lg:p-10">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading match...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminMatchLivePageLoading;
