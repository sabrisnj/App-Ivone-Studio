
import React, { useState } from 'react';
import { useApp } from './store';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import ScheduleView from './views/ScheduleView';
import PointsView from './views/PointsView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';
import NotificationView from './views/NotificationView';
import ChatView from './views/ChatView';
import AccessibilityView from './views/AccessibilityView';
import AppointmentsView from './views/AppointmentsView';
import RatingPopup from './components/RatingPopup';

const App: React.FC = () => {
  const { user, login, isAdmin, toggleAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  
  const [lName, setLName] = useState('');
  const [lPhone, setLPhone] = useState('');
  const [lBirth, setLBirth] = useState('');

  if (!user && isAdmin) {
    return <Layout activeTab="admin" setActiveTab={setActiveTab}><AdminView onGoToChat={() => setActiveTab('chat')} /></Layout>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#FFF9F8] transition-colors">
        <div className="w-full max-w-md bg-white rounded-[40px] p-12 shadow-2xl space-y-10 animate-fade text-center border border-[#F5E6DA]/20">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-[#D99489] rounded-full mx-auto flex items-center justify-center text-white text-3xl font-serif font-bold shadow-lg">IH</div>
            <h1 className="text-3xl font-serif font-bold text-[#4A3B39]">Ivone Studio</h1>
            <p className="text-[10px] font-bold text-[#86BDB1] tracking-[0.4em] uppercase">Beleza & Estética</p>
          </div>
          <div className="space-y-4 text-left">
            <input placeholder="Seu Nome" value={lName} onChange={e => setLName(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#D99489] shadow-inner text-sm" />
            <input placeholder="WhatsApp" value={lPhone} onChange={e => setLPhone(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#D99489] shadow-inner text-sm" />
            <input type="date" value={lBirth} onChange={e => setLBirth(e.target.value)} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#D99489] shadow-inner text-sm" />
          </div>
          <div className="space-y-5">
            <button onClick={() => login(lName, lPhone, lBirth)} disabled={!lName || !lPhone || !lBirth} className="w-full bg-[#D99489] text-white py-5 rounded-2xl font-bold shadow-xl shadow-[#D99489]/20 disabled:opacity-50 active:scale-95 transition-all uppercase tracking-widest text-[11px]">Entrar no Studio</button>
            <button onClick={() => { toggleAdmin(); setActiveTab('admin'); }} className="w-full py-2 text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] hover:text-[#D99489] transition-colors">Acesso Gestão Ivone</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <RatingPopup />
      {activeTab === 'home' && <HomeView onQuickRebook={(id) => { setPreselectedServiceId(id); setActiveTab('schedule'); }} onGoToAdmin={() => setActiveTab('admin')} />}
      {activeTab === 'schedule' && <ScheduleView preselectedServiceId={preselectedServiceId} onClearPreselected={() => setPreselectedServiceId(null)} onComplete={() => setActiveTab('home')} />}
      {activeTab === 'chat' && <ChatView />}
      {activeTab === 'points' && <PointsView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'appointments' && <AppointmentsView />}
      {activeTab === 'admin' && <AdminView onGoToChat={() => setActiveTab('chat')} />}
      {activeTab === 'notifications' && <NotificationView />}
      {activeTab === 'accessibility' && <AccessibilityView />}
    </Layout>
  );
};

export default App;
