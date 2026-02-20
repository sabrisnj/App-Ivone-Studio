
import React, { useState, useRef } from 'react';
import { useApp } from '../store';
import { SALON_INFO } from '../constants';
import { ServiceCategory, Service } from '../types';
import { 
  Instagram, 
  Leaf,
  Sparkles,
  Cake,
  Ticket,
  ChevronRight,
  Scissors,
  Footprints,
  Plus,
  X,
  Image as ImageIcon,
  Trash2,
  Calendar,
  Zap,
  Upload,
  Camera,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface HomeViewProps {
  onQuickRebook: (serviceId: string) => void;
  onGoToAdmin?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onQuickRebook, onGoToAdmin }) => {
  const { user, isBirthMonth, vouchers, redeemVoucher, salonConfig, services, isAdmin, updateServices, toggleAdmin } = useApp();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fixedVouchers = vouchers.filter(v => v.id.startsWith('v_terca') || v.id.startsWith('v_quarta'));
  const otherVouchers = vouchers.filter(v => !v.id.startsWith('v_terca') && !v.id.startsWith('v_quarta')).slice(-2).reverse();
  const displayVouchers = [...fixedVouchers, ...otherVouchers];

  const handleVoucherAction = (v: any) => {
    if (v.serviceId) {
      onQuickRebook(v.serviceId);
    } else {
      redeemVoucher(v.id);
    }
  };

  const getServiceStyle = (category: ServiceCategory) => {
    switch (category) {
      case ServiceCategory.HAIR: 
        return { 
          icon: <Scissors size={32} />, 
          bg: 'bg-rose-50 dark:bg-rose-900/20', 
          text: 'text-rose-400', 
          border: 'border-rose-100 dark:border-rose-800/30'
        };
      case ServiceCategory.NAILS: 
        return { 
          icon: <Footprints size={32} />, 
          bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
          text: 'text-emerald-400', 
          border: 'border-emerald-100 dark:border-emerald-800/30'
        };
      case ServiceCategory.FACE: 
        return { 
          icon: <Sparkles size={32} />, 
          bg: 'bg-amber-50 dark:bg-amber-900/20', 
          text: 'text-amber-400', 
          border: 'border-amber-100 dark:border-amber-800/30'
        };
      case ServiceCategory.BODY: 
        return { 
          icon: <Leaf size={32} />, 
          bg: 'bg-teal-50 dark:bg-teal-900/20', 
          text: 'text-teal-400', 
          border: 'border-teal-100 dark:border-teal-800/30'
        };
      default: 
        return { 
          icon: <Zap size={32} />, 
          bg: 'bg-gray-50 dark:bg-zinc-800', 
          text: 'text-gray-400', 
          border: 'border-gray-100 dark:border-zinc-700'
        };
    }
  };

  const handleAddPhoto = (url?: string) => {
    const photoToAdd = url || newPhotoUrl;
    if (selectedService && photoToAdd.trim()) {
      const updatedGallery = [...(selectedService.gallery || []), photoToAdd];
      const updatedServices = services.map(s => 
        s.id === selectedService.id ? { ...s, gallery: updatedGallery } : s
      );
      updateServices(updatedServices);
      setSelectedService({ ...selectedService, gallery: updatedGallery });
      setNewPhotoUrl('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedService) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleAddPhoto(base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro no upload:", error);
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    if (selectedService) {
      const updatedGallery = (selectedService.gallery || []).filter((_, i) => i !== index);
      const updatedServices = services.map(s => 
        s.id === selectedService.id ? { ...s, gallery: updatedGallery } : s
      );
      updateServices(updatedServices);
      setSelectedService({ ...selectedService, gallery: updatedGallery });
    }
  };

  const handleAdminEnter = () => {
    if (!isAdmin) toggleAdmin();
    if (onGoToAdmin) onGoToAdmin();
  };

  return (
    <div className="p-6 space-y-10 pb-12 animate-fade">
      {/* Banner de Aniversário */}
      {isBirthMonth && (
        <section className="bg-gradient-to-r from-[#D99489] to-[#86BDB1] p-7 rounded-[3rem] shadow-xl text-white relative overflow-hidden ring-8 ring-white/20">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <Cake size={20} className="text-white animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Presente do Mês</span>
            </div>
            <h3 className="text-3xl font-serif font-bold leading-none">Parabéns, {user?.name.split(' ')[0]}!</h3>
            <p className="text-[10px] font-medium text-white/95 max-w-[250px]">
              Sua beleza merece uma celebração extra. Use o voucher <b>NIVER10</b> este mês no Studio. ✨
            </p>
          </div>
          <Sparkles className="absolute -right-4 -top-4 opacity-20 rotate-12" size={120} />
        </section>
      )}

      {/* Hero Dinâmico */}
      <section className="bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 rounded-[3.5rem] p-9 shadow-sm relative overflow-hidden group transition-colors">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
             <div className="h-[1px] w-6 bg-[#D4B499]" />
             <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#D4B499]">
              {salonConfig.dynamicText.heroTitle}
             </span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-[#4A3B39] dark:text-white leading-[0.9] tracking-tighter transition-colors">
            Oi, {user?.name.split(' ')[0]}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm max-w-[220px] leading-relaxed italic">
            {salonConfig.dynamicText.heroSubtitle}
          </p>
          <div className="pt-4 flex gap-3">
            <a 
              href={`https://instagram.com/${SALON_INFO.instagram.replace('@', '')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#D99489] to-[#86BDB1] text-white px-6 py-3.5 rounded-2xl text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Instagram size={16} /> @ivonehairstudio
            </a>
          </div>
        </div>
        <Leaf className="absolute -right-12 -bottom-12 opacity-[0.03] text-[#D4B499] group-hover:scale-110 transition-transform duration-1000" size={280} />
      </section>

      {/* Central de Promoções */}
      <section className="space-y-5">
        <div className="px-2">
          <h3 className="text-2xl font-serif font-bold text-[#4A3B39] dark:text-white">Mimos Exclusivos</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold italic">Edição Limitada</p>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar px-1 pb-4">
          {displayVouchers.map(v => {
            const left = v.limit - v.redeemed;
            const isExhausted = left <= 0;
            return (
              <div 
                key={v.id} 
                className={`min-w-[260px] bg-white dark:bg-zinc-900 border border-[#F5E6DA] dark:border-zinc-800 p-7 rounded-[3rem] shadow-sm space-y-5 relative overflow-hidden group border-b-4 border-b-[#86BDB1]/20 transition-all ${isExhausted ? 'opacity-40 grayscale-[0.8] scale-95' : ''}`}
              >
                <div className="space-y-1 relative z-10">
                  <h4 className="font-bold text-[#4A3B39] dark:text-white text-base leading-tight">
                    {v.name} {isExhausted && '(Esgotado)'}
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">{v.description}</p>
                  {v.price && <p className="text-lg font-bold text-[#D99489]">R$ {v.price}</p>}
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <div className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase ${isExhausted ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-500'}`}>
                    {isExhausted ? 'Sem estoque' : v.serviceId ? 'Oferta Fixa' : `Restam ${left} un.`}
                  </div>
                  <button 
                    onClick={() => handleVoucherAction(v)}
                    disabled={isExhausted}
                    className="bg-[#D99489] text-white p-3.5 rounded-2xl shadow-lg active:scale-90 disabled:bg-gray-200 disabled:shadow-none transition-all flex items-center gap-2"
                  >
                    {v.serviceId ? <Calendar size={20} /> : <Ticket size={20} />}
                    {v.serviceId && <span className="text-[10px] font-bold uppercase">Agendar</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Protocolos Studio (Icon-First Colorido) */}
      <section className="space-y-6">
        <div className="px-2">
          <h3 className="text-2xl font-serif font-bold text-[#4A3B39] dark:text-white">
            {salonConfig.dynamicText.studioDescription}
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            {salonConfig.dynamicText.protocolSectionTitle}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => {
            const style = getServiceStyle(service.category);
            return (
              <button 
                key={service.id} 
                onClick={() => setSelectedService(service)}
                className={`bg-white dark:bg-zinc-900 border rounded-[2.5rem] p-7 flex flex-col items-center text-center gap-5 shadow-sm hover:shadow-md active:scale-[0.97] transition-all group ${style.border}`}
              >
                <div className={`w-16 h-16 ${style.bg} ${style.text} rounded-[1.5rem] flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner`}>
                  {style.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-[#4A3B39] dark:text-white uppercase tracking-wider leading-tight">
                    {service.name}
                  </h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Toque p/ Galeria</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Botão de Gestão Administrativa (Exclusivo Ivone) */}
      <section className="pt-6">
        <button 
          onClick={handleAdminEnter}
          className="w-full bg-[#FAF7F5] dark:bg-zinc-900 border border-dashed border-[#F5E6DA] dark:border-zinc-800 p-8 rounded-[3rem] flex flex-col items-center gap-4 transition-all hover:border-[#D4B499] group active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-[#D4B499] shadow-sm transition-colors">
            <ShieldCheck size={28} />
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#8B5E3C]">Painel de Gestão Ivone</h4>
            <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">Acesso restrito à administração</p>
          </div>
        </button>
      </section>

      {/* Modal de Galeria/Protocolo */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[3.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-[#F5E6DA]/20">
            <header className="p-8 pb-4 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-[#D4B499] uppercase tracking-widest">{selectedService.category}</span>
                <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white">{selectedService.name}</h3>
              </div>
              <button onClick={() => setSelectedService(null)} className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-gray-400"><X size={20}/></button>
            </header>

            <div className="flex-1 overflow-y-auto px-8 space-y-6 no-scrollbar pb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                {selectedService.description}
              </p>

              {/* Galeria de Fotos Interna */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14}/> Inspirações Reais
                </h4>
                {selectedService.gallery && selectedService.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedService.gallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-sm bg-gray-100">
                        <img src={img} className="w-full h-full object-cover" loading="lazy" />
                        {isAdmin && (
                          <button 
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12}/>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 bg-gray-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getServiceStyle(selectedService.category).bg} ${getServiceStyle(selectedService.category).text}`}>
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Aguardando as primeiras fotos<br/>deste protocolo ✨</p>
                  </div>
                )}
              </div>

              {/* Admin: Painel de Gerenciamento da Galeria */}
              {isAdmin && (
                <div className="bg-[#FAF7F5] dark:bg-zinc-900 p-7 rounded-[2.5rem] border border-[#F5E6DA] dark:border-zinc-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest">Ivone: Gestão de Fotos</h4>
                    <span className="text-[8px] bg-white dark:bg-zinc-800 px-2 py-1 rounded-lg border border-[#F5E6DA]">Portfólio Vivo</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Link da foto..." 
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="flex-1 bg-white dark:bg-zinc-800 p-4 rounded-xl text-[10px] outline-none border border-transparent focus:border-[#D4B499] shadow-inner"
                      />
                      <button 
                        onClick={() => handleAddPhoto()}
                        className="bg-[#D4B499] text-white p-4 rounded-xl shadow-lg active:scale-90 transition-transform"
                      >
                        <Plus size={18}/>
                      </button>
                    </div>

                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-zinc-800 text-[#86BDB1] border border-[#86BDB1]/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#86BDB1] hover:text-white transition-all disabled:opacity-50"
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-[#86BDB1] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera size={16} />
                        )}
                        {isUploading ? "Processando..." : "Subir da Minha Galeria"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <footer className="p-8 pt-0">
               <button 
                onClick={() => { onQuickRebook(selectedService.id); setSelectedService(null); }}
                className="w-full bg-gradient-to-r from-[#D4B499] to-[#8B5E3C] text-white py-5 rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
               >
                 <Calendar size={18}/> Reservar Horário
               </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
