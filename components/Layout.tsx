
import React from 'react';
import { useApp } from '../store';
import { 
  Home, 
  Calendar, 
  User as UserIcon, 
  Award, 
  Settings,
  Bell,
  MessageCircle,
  Accessibility
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Fix: Define interface for Tab items to include optional badge
interface TabItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, isAdmin, toggleAdmin, notifications, chatMessages } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  
  const unreadChat = isAdmin 
    ? chatMessages.filter(m => !m.read && m.sender === 'client').length
    : chatMessages.filter(m => m.userId === user?.id && !m.read && m.sender === 'admin').length;

  // Reordenação solicitada: Home, Admin (se admin), Agenda, Chat, Acessibilidade, Pontos, Perfil
  // Fix: Explicitly type the tabs array to allow the 'badge' property
  const tabs: TabItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', icon: Settings, label: 'Admin' });
  }

  tabs.push(
    { id: 'schedule', icon: Calendar, label: 'Agenda' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', badge: unreadChat },
    { id: 'accessibility', icon: Accessibility, label: 'Acesso' },
    { id: 'points', icon: Award, label: 'Pontos' },
    { id: 'profile', icon: UserIcon, label: 'Perfil' }
  );

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="bg-white dark:bg-zinc-900 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-[#F5E6DA]/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D99489] rounded-full flex items-center justify-center text-white text-[12px] font-serif font-bold shadow-sm">IH</div>
          <div className="flex flex-col">
            <h1 className="text-sm font-serif font-bold text-[#4A3B39] dark:text-white leading-tight">IVONE HAIR</h1>
            <span className="text-[8px] font-bold text-[#86BDB1] tracking-[0.4em] uppercase">STUDIO</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 text-gray-400 hover:text-[#D99489] transition-colors"
          >
            <Bell size={22} />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D99489] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadNotifs}
              </span>
            )}
          </button>
          
          <button 
            onClick={toggleAdmin}
            className="text-[8px] px-2 py-1 border border-[#F5E6DA] rounded-lg bg-[#FAF7F5] dark:bg-zinc-800 uppercase tracking-widest text-gray-400 font-bold"
          >
            {isAdmin ? 'Sair Admin' : 'Admin'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-[#F5E6DA]/50 flex justify-around items-center py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50 transition-colors">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-2xl relative ${
                isActive ? 'text-[#D99489]' : 'text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#D99489]/10' : ''}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
              {(tab.badge && tab.badge > 0) ? (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border border-white">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
