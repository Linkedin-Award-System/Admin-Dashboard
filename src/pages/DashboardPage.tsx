import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';

export function DashboardPage() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name || user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            LinkedIn Creative Awards Ethiopia
          </h2>
          <p className="text-gray-600">
            Welcome to the admin dashboard. Use the navigation to manage
            categories, nominees, voting, payments, and content.
          </p>
        </div>
      </main>
    </div>
  );
}
