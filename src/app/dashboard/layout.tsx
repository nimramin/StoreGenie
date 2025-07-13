import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, LogOut } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { NavLink } from './nav-link';
import { StoreLink } from './store-link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_name, store_slug')
    .eq('id', user.id)
    .single();

  const handleLogout = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', iconName: 'LayoutDashboard' },
    { name: 'Products', href: '/dashboard/products', iconName: 'ShoppingBag' },
    { name: 'Analytics', href: '#', iconName: 'BarChart', comingSoon: true },
    { name: 'Themes', href: '#', iconName: 'Palette', comingSoon: true },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30">
      <div className="flex">
        <aside className="w-64 flex-shrink-0 bg-background/80 backdrop-blur-sm border-r border-magic-accent/50 flex flex-col h-screen sticky top-0">
          <div className="p-6 flex items-center space-x-2 border-b border-magic-accent/50">
            <div className="p-2 rounded-xl bg-gradient-to-br from-magic-primary to-magic-secondary">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground truncate" title={profile?.store_name || 'StoreGenie'}>
              {profile?.store_name || 'StoreGenie'}
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                iconName={item.iconName}
                name={item.name}
                comingSoon={item.comingSoon}
              />
            ))}
          </nav>
          <div className="p-4 border-t border-magic-accent/50">
            <form action={handleLogout}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </form>
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="flex justify-between items-end p-6 border-b border-magic-accent/50">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <StoreLink storeSlug={profile?.store_slug || null} />
          </header>
          <main className="flex-1 p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}