import { AdminDashboard } from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin console</h1>
      <AdminDashboard />
    </div>
  );
}
