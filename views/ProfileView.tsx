
import React, { useState } from 'react';
import { useApp } from '../store';
import { SALON_INFO } from '../constants';
import { 
  LogOut, 
  MapPin, 
  Cake, 
  Edit2, 
  Save, 
  X, 
  Calendar, 
  Clock, 
  Phone,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  CreditCard,
  MessageCircle,
  XCircle
} from 'lucide-react';

const ProfileView: React.FC = () => {
  const { user, appointments, logout, requestCancellation, informPaymentSent, services } = useApp();
  const [historyTab, setHistoryTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!user) return null;

  const userAppointments = appointments.filter(a => a.clientPhone === user.phone);
  const upcomingApps = userAppointments.filter(app => app.status !== 'cancelled' && app.status !== 'completed').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastApps = userAppointments.filter(app => app.status === 'completed' || app.status === 'cancelled').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const copyPix = () => {
    navigator.clipboard.writeText(SALON_INFO.pixKey);
    alert('Chave Pix Copiada!');
  };

  const getStatusBadge = (app: any) => {
    if (app.status === 'confirmed') return <span className="text-[8px] font-bold uppercase bg-green-50 text-green-500 px-2 py-1 rounded-lg">Horário Reservado</span>;
    if (app.status === 'pending') return <span className="text-[8px] font-bold uppercase bg-amber-50 text-amber-500 px-2 py-1 rounded-lg">Em Análise</span>;
    if (app.status === 'request_cancellation') return <span className="text-[8px] font-bold uppercase bg-red-50 text-red-500 px-2 py-1 rounded-lg">Cancelamento Pendente</span>;
    if (app.status === 'completed') return <span className="text-[8px] font-bold uppercase bg-blue-50 text-blue-500 px-2 py-1 rounded-lg">Concluído</span>;
    return <span className="text-[8px] font-bold uppercase bg-gray-100 text-gray-400 px-2 py-1 rounded-lg">Cancelado</span>;
  };

  const getPaymentBadge = (app: any) => {
    if (app.paymentStatus === 'paid') return <span className="text-[8px] font-bold uppercase bg-green-100 text-green-600 px-2 py-1 rounded-lg">Pago</span>;
    if (app.paymentStatus === 'waiting_verification') return <span className="text-[8px] font-bold uppercase bg-amber-100 text-amber-600 px-2 py-1 rounded-lg">Verificando...</span>;
    return <span className="text-[8px] font-bold uppercase bg-red-50 text-red-400 px-2 py-1 rounded-lg">Pendente</span>;
  };

  return (
    <div className="p-6 space-y-10 pb-12 animate-fade">
      <section className="flex flex-col items-center text-center space-y-5">
        <div className="w-24 h-24 bg-[#D4B499] rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-serif font-bold shadow-2xl ring-8 ring-[#F5E6DA]">
          {user.name.charAt(0)}
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">{user.name}</h2>
          <div className="flex items-center justify-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <span>{user.phone}</span>
            <span>SBC - SP</span>
          </div>
        </div>
        <button onClick={logout} className="text-[9px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-2 border border-red-50 px-6 py-2 rounded-2xl">
          <LogOut size={14} /> Sair
        </button>
      </section>

      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-[#F5E6DA]/50 dark:border-zinc-800 shadow-sm space-y-6">
        <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white">Informações da Conta</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
            <div className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center text-[#D4B499]">
              <Cake size={20} />
            </div>
            <div>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Aniversário</p>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{user.birthDate.split('-').reverse().join('/')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
            <div className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center text-[#D4B499]">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">WhatsApp</p>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{user.phone}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileView;
