
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { SALON_INFO } from '../constants';
import { ServiceCategory } from '../types';
import { 
  CheckCircle2, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Copy,
  ArrowRight,
  Info,
  Sparkles,
  Ticket,
  AlertCircle
} from 'lucide-react';

interface ScheduleViewProps {
  preselectedServiceId?: string | null;
  onClearPreselected?: () => void;
  onComplete?: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ preselectedServiceId, onClearPreselected, onComplete }) => {
  const { user, addAppointment, services, salonConfig } = useApp();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [confirmed, setConfirmed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'Todos'>('Todos');
  const [dateError, setDateError] = useState('');

  const dayMap: { [key: string]: number } = { 
    'Dom': 0, 'Seg': 1, 'Ter': 2, 'Qua': 3, 'Qui': 4, 'Sex': 5, 'Sáb': 6 
  };
  const allowedDays = salonConfig.businessHours.days.map(d => dayMap[d]);

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedService(preselectedServiceId);
      setStep(2);
      if (onClearPreselected) onClearPreselected();
    }
  }, [preselectedServiceId]);

  const steps = ['Serviço', 'Data', 'Dados', 'Ticket'];

  const handleConfirm = () => {
    addAppointment({
      serviceId: selectedService,
      clientName: name,
      clientPhone: phone,
      date: selectedDate,
      time: selectedTime,
    });
    setConfirmed(true);
    setStep(4);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(salonConfig.pixKey);
    alert('Chave Pix copiada!');
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else {
      setConfirmed(false);
      setStep(1);
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const handleDateChange = (dateStr: string) => {
    const selected = new Date(dateStr);
    const dayOfWeek = selected.getUTCDay();

    if (!allowedDays.includes(dayOfWeek)) {
      setDateError(`O estúdio não abre neste dia. Dias disponíveis: ${salonConfig.businessHours.days.join(', ')}.`);
      setSelectedDate('');
    } else {
      setDateError('');
      setSelectedDate(dateStr);
    }
  };

  const categories = ['Todos', ...Object.values(ServiceCategory)];
  const filteredServices = activeCategory === 'Todos' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const serviceData = services.find(s => s.id === selectedService);
  const today = new Date().toISOString().split('T')[0];

  if (confirmed && step === 4) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade">
        <div className="relative">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
            <CheckCircle2 size={56} />
          </div>
          <Sparkles className="absolute -top-3 -right-3 text-amber-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-gray-800">Pedido Enviado!</h2>
          <p className="text-gray-500 text-sm px-6 leading-relaxed">
            Seu agendamento está em análise. Fique de olho na aba "Minha Área" para a confirmação.
          </p>
        </div>

        {salonConfig.pixPrepayment && (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-zinc-800 w-full space-y-6 relative transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest px-1">
                <span>Depósito de Reserva (Pix)</span>
                <Info size={14} />
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-700 flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 truncate w-full text-center">{salonConfig.pixKey}</span>
                <button onClick={copyPix} className="bg-white dark:bg-zinc-700 text-[#D4B499] px-6 py-2 rounded-xl shadow-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Copy size={14} /> Copiar Chave
                </button>
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Recebedor: {salonConfig.pixName}</p>
            </div>
            <button 
               onClick={handleFinish}
               className="w-full bg-[#D4B499] text-white py-5 rounded-[2rem] font-bold shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Concluir Experiência
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-12 animate-fade">
      <div className="flex items-center justify-between px-6">
        {steps.map((s, idx) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`h-1.5 w-10 rounded-full transition-all duration-700 ${
              step >= idx + 1 ? 'bg-[#D4B499]' : 'bg-gray-100 dark:bg-zinc-800'
            }`} />
            <span className={`text-[7px] font-bold uppercase tracking-widest ${step >= idx + 1 ? 'text-[#8B5E3C]' : 'text-gray-300'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[50vh]">
        {step === 1 && (
          <div className="space-y-6 animate-fade">
            <div className="px-2">
              <h3 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Protocolos</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Escolha seu tratamento</p>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-bold whitespace-nowrap transition-all border ${
                    activeCategory === cat ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]' : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-100 dark:border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {filteredServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-6 rounded-[2.5rem] flex flex-col gap-4 transition-all border text-left ${
                    selectedService === service.id ? 'bg-[#FAF7F5] dark:bg-zinc-800 border-[#D4B499]' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex-1 pr-4 space-y-1">
                      <span className="text-[8px] font-bold text-[#D4B499] uppercase tracking-widest">{service.category}</span>
                      <h4 className="font-bold text-gray-800 dark:text-white text-sm">{service.name}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed italic">{service.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className="text-[10px] text-[#8B5E3C] font-bold">R$ {service.price}</p>
                      <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">{service.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-fade">
             <div className="px-2">
              <h3 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Agenda</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sua disponibilidade</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <CalendarIcon size={14} className="text-[#D4B499]" /> Data
              </label>
              <input 
                type="date" 
                min={today}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full p-6 bg-white dark:bg-zinc-900 border rounded-[2.5rem] outline-none font-bold shadow-sm transition-colors ${dateError ? 'border-red-400 text-red-400' : 'border-gray-100 dark:border-zinc-800 text-[#8B5E3C]'}`}
              />
              {dateError && (
                <p className="text-[10px] text-red-500 font-bold px-4 animate-bounce">
                  {dateError}
                </p>
              )}
            </div>

            <div className={`space-y-4 transition-opacity duration-500 ${!selectedDate ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Clock size={14} className="text-[#D4B499]" /> Horários Disponíveis
              </label>
              <div className="grid grid-cols-3 gap-3">
                {times.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-5 rounded-[1.5rem] text-[10px] font-bold transition-all border ${
                      selectedTime === t ? 'bg-[#D4B499] text-white border-[#D4B499]' : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-50 dark:border-zinc-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade">
            <div className="px-2">
              <h3 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Check-out</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resumo do agendamento</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative transition-colors">
              <div className="bg-[#8B5E3C] p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Ticket size={18} className="text-[#D4B499]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Resumo Studio</span>
                 </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center border-b border-dashed border-gray-100 dark:border-zinc-800 pb-4">
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Serviço</p>
                    <p className="text-lg font-serif font-bold text-gray-800 dark:text-white">{serviceData?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Valor</p>
                    <p className="text-lg font-bold text-[#8B5E3C]">R$ {serviceData?.price}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Data</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{selectedDate.split('-').reverse().join('/')}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Hora</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{selectedTime}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-zinc-800">
                  <div className="flex items-start gap-2 text-[9px] text-[#D4B499] italic leading-tight">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <p>Agendamentos e mimos não são cumulativos com outras promoções. Pagamento via Pix garante sua vaga.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="bg-white dark:bg-zinc-800 text-gray-300 w-24 py-5 rounded-[2rem] border border-gray-100 dark:border-zinc-700 flex items-center justify-center active:scale-95 transition-all">
            <ChevronLeft size={24} />
          </button>
        )}
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : handleConfirm()}
          disabled={
            (step === 1 && !selectedService) || 
            (step === 2 && (!selectedDate || !selectedTime))
          }
          className="flex-1 bg-gradient-to-r from-[#D4B499] to-[#8B5E3C] text-white py-5 rounded-[2rem] font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-30 transition-all active:scale-95 group"
        >
          <span className="text-xs font-bold uppercase tracking-widest">
            {step === 3 ? 'Confirmar Agendamento' : 'Próxima Etapa'}
          </span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ScheduleView;
