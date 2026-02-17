
import React, { useState } from 'react';
import { useApp } from '../store';
import { ServiceCategory, Service } from '../types';
import { 
  Lock, Unlock, Plus, Trash2, CreditCard, DollarSign, Calendar, Users, Award, Tag, Clock, ToggleLeft, ToggleRight
} from 'lucide-react';

interface AdminViewProps { onGoToChat?: () => void; }

const AdminView: React.FC<AdminViewProps> = () => {
  const { appointments, confirmAppointment, cancelAppointment, markAsPaid, salonConfig, updateSalonConfig, services, updateServices, toggleAdmin } = useApp();
  const [activeSubView, setActiveSubView] = useState<'ops' | 'stats' | 'services' | 'pix'>('ops');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [newService, setNewService] = useState<Partial<Service>>({ name: '', category: ServiceCategory.HAIR, duration: '60 min', price: 0, description: '' });

  const handleUnlock = () => { if (password === 'Ivone2026') setIsLocked(false); else alert('Senha incorreta!'); };

  const now = new Date();
  const thisMonthApps = appointments.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const newClientsCount = new Set(thisMonthApps.map(a => a.clientPhone)).size;
  const totalPoints = thisMonthApps.filter(a => a.status === 'completed').length * salonConfig.pointsPerService;
  const revenue = thisMonthApps.filter(a => a.paymentStatus === 'paid').reduce((acc, a) => acc + (services.find(s => s.id === a.serviceId)?.price || 0), 0);

  if (isLocked) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#D99489] shadow-xl border border-[#F5E6DA]">
          <Lock size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-[#4A3B39]">Portal Gestão</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Acesso Exclusivo Studio Ivone</p>
        </div>
        <input type="password" placeholder="Senha Mestra" value={password} onChange={e => setPassword(e.target.value)} className="w-full max-w-xs p-5 bg-white border border-[#F5E6DA] rounded-2xl text-center outline-none shadow-sm" />
        <button onClick={handleUnlock} className="w-full max-w-xs bg-[#D99489] text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all">Entrar</button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-16 animate-fade">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#4A3B39]">Painel Ivone</h2>
          <p className="text-[10px] text-[#86BDB1] font-bold uppercase tracking-widest">Gestão Studio</p>
        </div>
        <button onClick={() => { setIsLocked(true); toggleAdmin(); }} className="p-3 bg-white border border-[#F5E6DA] rounded-xl text-gray-400"><Unlock size={18}/></button>
      </header>

      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'ops', label: 'Agenda' },
          { id: 'stats', label: 'Relatórios' },
          { id: 'services', label: 'Serviços' },
          { id: 'pix', label: 'Pix' }
        ].map((v) => (
          <button key={v.id} onClick={() => setActiveSubView(v.id as any)} className={`flex-1 min-w-[80px] py-3 rounded-xl text-[9px] font-bold uppercase tracking-tighter transition-all ${activeSubView === v.id ? 'bg-white text-[#4A3B39] shadow-sm' : 'text-gray-400'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {activeSubView === 'ops' && (
        <div className="space-y-6 animate-fade">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Solicitações Pendentes</h3>
          {appointments.filter(a => a.status === 'pending').map(app => (
            <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-[#F5E6DA] shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800 text-sm">{app.clientName}</p>
                <p className="text-[10px] text-[#D99489] font-bold uppercase">{services.find(s => s.id === app.serviceId)?.name}</p>
                <p className="text-[10px] text-gray-400 italic">{app.date} às {app.time}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => confirmAppointment(app.id)} className="bg-[#86BDB1] text-white p-3 rounded-xl"><Plus size={16}/></button>
                <button onClick={() => cancelAppointment(app.id)} className="bg-red-50 text-red-300 p-3 rounded-xl"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-8">Validar Pagamentos</h3>
          {appointments.filter(a => a.paymentStatus === 'waiting_verification').map(app => (
            <div key={app.id} className="bg-[#FAF7F5] p-6 rounded-[2rem] border border-[#86BDB1]/20 flex justify-between items-center">
              <div><p className="text-xs font-bold text-gray-800">{app.clientName}</p><p className="text-[9px] text-gray-400 font-bold uppercase">R$ {services.find(s => s.id === app.serviceId)?.price}</p></div>
              <button onClick={() => markAsPaid(app.id)} className="bg-[#86BDB1] text-white px-5 py-2 rounded-xl text-[9px] font-bold uppercase">Aprovar Pix</button>
            </div>
          ))}
        </div>
      )}

      {activeSubView === 'stats' && (
        <div className="grid grid-cols-1 gap-4 animate-fade">
          <div className="bg-white p-6 rounded-[2.5rem] border border-[#F5E6DA] flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400"><Calendar size={20}/></div>
            <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Agendamentos Mês</p><h4 className="text-2xl font-serif font-bold text-gray-800">{thisMonthApps.length}</h4></div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-[#F5E6DA] flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400"><Users size={20}/></div>
            <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Clientes Novos</p><h4 className="text-2xl font-serif font-bold text-gray-800">{newClientsCount}</h4></div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-[#F5E6DA] flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-400"><Award size={20}/></div>
            <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pontos Distribuídos</p><h4 className="text-2xl font-serif font-bold text-gray-800">{totalPoints}</h4></div>
          </div>
          <div className="bg-[#86BDB1] p-8 rounded-[3rem] shadow-xl text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Receita Pix Validada</p>
            <h4 className="text-4xl font-serif font-bold tracking-tighter">R$ {revenue.toLocaleString('pt-BR')}</h4>
          </div>
        </div>
      )}

      {activeSubView === 'services' && (
        <div className="space-y-6 animate-fade">
          <section className="bg-white p-6 rounded-[2.5rem] border border-[#F5E6DA] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-[#4A3B39]"><Tag size={18}/> Novo Serviço</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nome do Serviço" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={newService.category} onChange={e => setNewService({...newService, category: e.target.value as any})} className="w-full p-4 bg-gray-50 rounded-xl text-[10px] font-bold uppercase outline-none">
                  {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Duração" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none" />
              </div>
              <input type="number" placeholder="Preço (R$)" value={newService.price} onChange={e => setNewService({...newService, price: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none" />
              <button onClick={() => { if(newService.name) { updateServices([...services, {...newService as any, id: Math.random().toString(36).substr(2, 9)}]); setNewService({name:'', price:0, duration:'60 min', category: ServiceCategory.HAIR}); } }} className="w-full bg-[#D99489] text-white py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg">Cadastrar Serviço</button>
            </div>
          </section>
          <div className="space-y-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2">Serviços Ativos</p>
            {services.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div><p className="text-xs font-bold text-gray-800">{s.name}</p><p className="text-[9px] text-gray-400">R$ {s.price} • {s.duration}</p></div>
                <button onClick={() => updateServices(services.filter(item => item.id !== s.id))} className="text-red-200 p-2"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubView === 'pix' && (
        <div className="space-y-6 animate-fade">
          <section className="bg-white p-8 rounded-[3rem] border border-[#F5E6DA] shadow-sm space-y-6">
            <div className="flex items-center gap-3"><CreditCard size={20} className="text-[#86BDB1]"/><h3 className="font-serif font-bold text-lg">Configurar Pix</h3></div>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-[9px] font-bold uppercase text-gray-400 ml-1">Chave Pix</label><input type="text" value={salonConfig.pixKey} onChange={e => updateSalonConfig({ pixKey: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none shadow-inner" /></div>
              <div className="space-y-1"><label className="text-[9px] font-bold uppercase text-gray-400 ml-1">Nome Recebedor</label><input type="text" value={salonConfig.pixName} onChange={e => updateSalonConfig({ pixName: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none shadow-inner" /></div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-dashed border-[#F5E6DA]">
                <div className="flex items-center gap-2"><Clock size={16} className="text-[#86BDB1]"/><p className="text-[10px] font-bold uppercase text-gray-600">Pix Antecipado Obrigatório</p></div>
                <button onClick={() => updateSalonConfig({ pixPrepayment: !salonConfig.pixPrepayment })}>
                  {salonConfig.pixPrepayment ? <ToggleRight size={32} className="text-[#86BDB1]"/> : <ToggleLeft size={32} className="text-gray-200"/>}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminView;
