export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Projects</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
    </div>
  );
};