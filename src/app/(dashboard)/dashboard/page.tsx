import { PageHeader } from "@/components/shared/page-header";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Module Owner: Sohil — Coming Soon" 
      />
      <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        Placeholder for Dashboard content.
      </div>
    </div>
  );
}
