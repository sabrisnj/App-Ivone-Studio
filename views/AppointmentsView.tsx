
import React, { useState } from 'react';
import { useApp } from '../store';
import { SALON_INFO } from '../constants';
import { 
  Calendar, 
  Clock, 
  Copy,
  CreditCard,
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AppointmentsView: React.FC = () => {
  const { user, appointments, requestCancellation, informPaymentSent, services } = useApp();
  const [historyTab, setHistoryTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!user) return (
    <div className="p-10 text-center space-y-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
        <Calendar size={40} />
      </div>
      <p className="text-gray-400 font-medium">Faça login para ver seus agendamentos.</p>
    </div>
  );

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
    <div className="p-6 space-y-8 pb-12 animate-fade">
      <div className="flex justify-between items-end px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Meus Agendamentos</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Acompanhe seus horários</p>
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-2xl">
          <button onClick={() => setHistoryTab('upcoming')} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${historyTab === 'upcoming' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-gray-400'}`}>Ativos</button>
          <button onClick={() => setHistoryTab('past')} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase transition-all ${historyTab === 'past' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-gray-400'}`}>Histórico</button>
        </div>
      </div>
      
      <div className="space-y-4">
        {(historyTab === 'upcoming' ? upcomingApps : pastApps).length === 0 ? (
          <div className="p-12 bg-gray-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-zinc-800 text-center space-y-3">
            <Calendar size={32} className="mx-auto text-gray-200" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nenhum agendamento encontrado</p>
          </div>
        ) : (historyTab === 'upcoming' ? upcomingApps : pastApps).map(app => {
          const service = services.find(s => s.id === app.serviceId);
          return (
            <div key={app.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-[#F5E6DA]/50 dark:border-zinc-800 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm">{service?.name}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-medium text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {app.date.split('-').reverse().join('/')}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {app.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(app)}
                    {getPaymentBadge(app)}
                  </div>
                </div>
              </div>

              {app.paymentStatus === 'unpaid' && app.status !== 'cancelled' && app.status !== 'request_cancellation' && (
                <div className="bg-[#FAF7F5] dark:bg-zinc-800 p-4 rounded-2xl border border-dashed border-[#D4B499]/30 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8B5E3C]">
                     <span>Pagar Antecipado (Pix)</span>
                     <button onClick={copyPix} className="flex items-center gap-1 text-[#D4B499]"><Copy size={12}/> Copiar</button>
                  </div>
                  <button 
                    onClick={() => informPaymentSent(app.id)}
                    className="w-full bg-[#86BDB1] text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CreditCard size={14}/> Já paguei via Pix
                  </button>
                </div>
              )}

              {historyTab === 'upcoming' && app.status !== 'request_cancellation' && (
                <div className="pt-2 border-t border-gray-50 dark:border-zinc-800">
                  {cancellingId === app.id ? (
                    <div className="flex gap-2 animate-fade">
                      <button 
                        onClick={() => { requestCancellation(app.id); setCancellingId(null); }}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-[9px] font-bold uppercase"
                      >
                        Confirmar Cancelamento
                      </button>
                      <button 
                        onClick={() => setCancellingId(null)}
                        className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-xl text-[9px] font-bold text-gray-400 uppercase"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setCancellingId(app.id)}
                      className="text-[9px] text-gray-300 font-bold uppercase tracking-widest flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <XCircle size={12} /> Cancelar Agendamento
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsView;
