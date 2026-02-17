
import React from 'react';
import { useApp } from '../store';
import { Award, Sparkles, Scissors, Footprints } from 'lucide-react';

const PointsView: React.FC = () => {
  const { user } = useApp();

  if (!user) return null;

  const rules = [
    {
      id: 'escovas',
      title: 'Minhas Escovas',
      current: user.points.escovas,
      total: 2,
      reward: '15% de desconto automático',
      icon: Scissors,
      color: 'bg-rose-50 text-rose-500'
    },
    {
      id: 'unhas',
      title: 'Manicure + Pedicure',
      current: user.points.manicurePedicure,
      total: 2,
      reward: 'Spa dos Pés Relaxante Grátis',
      icon: Footprints,
      color: 'bg-amber-50 text-amber-500'
    },
    {
      id: 'cilios',
      title: 'Extensão de Cílios',
      current: user.points.ciliosManutencao,
      total: 2,
      reward: 'Massagem Facial Energizante Grátis',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-500'
    }
  ];

  return (
    <div className="p-6 space-y-8 animate-fade pb-10">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5E6DA] rounded-full text-[#D4B499] mb-2 shadow-inner">
          <Award size={32} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-800">Clube de Pontos</h2>
        <p className="text-sm text-gray-400">Complete apenas 2 serviços e ganhe um mimo especial</p>
      </header>

      <div className="space-y-6">
        {rules.map((rule) => {
          const Icon = rule.icon;
          const progress = Math.min((rule.current / rule.total) * 100, 100);
          
          return (
            <div key={rule.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#F5E6DA]/50 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${rule.color} shadow-sm`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm">{rule.title}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Status: {rule.current} de {rule.total}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4B499] to-[#8B5E3C] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-gray-600 bg-[#FAF7F5] p-2 rounded-xl border border-[#F5E6DA]/30">
                  <Sparkles size={14} className="text-[#D4B499]" />
                  <span>Prêmio: <span className="text-[#8B5E3C] font-bold">{rule.reward}</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {user.rewards.length > 0 && (
        <section className="bg-white border-2 border-[#D4B499] p-7 rounded-[3rem] space-y-5 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-serif font-bold text-xl text-[#8B5E3C] flex items-center gap-2">
              <Award size={22} />
              Seus Mimos Liberados
            </h3>
            <div className="mt-4 space-y-2">
              {user.rewards.map((reward, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#FAF7F5] p-4 rounded-2xl border border-[#D4B499]/20">
                  <div className="w-2 h-2 bg-[#D4B499] rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-gray-700">{reward}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-[#D4B499] font-bold uppercase tracking-widest text-center relative z-10 mt-4 bg-white/50 py-2 rounded-lg">
            ⚠️ Benefícios não cumulativos com outras promoções.
          </p>
          <Award className="absolute -right-8 -bottom-8 text-[#D4B499] opacity-5 rotate-12" size={160} />
        </section>
      )}
    </div>
  );
};

export default PointsView;
