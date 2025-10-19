import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseServer';
import DashboardClient from './DashboardClient';

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <DashboardClient userEmail={user.email || ''} />;
}