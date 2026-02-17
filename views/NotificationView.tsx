
import React, { useEffect } from 'react';
import { useApp } from '../store';
// Add Sparkles to the lucide-react imports
import { Bell, Calendar, Tag, Info, Trash2, X, Sparkles } from 'lucide-react';

const NotificationView: React.FC = () => {
  const { notifications, markNotificationsAsRead, deleteNotification } = useApp();

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule': return <Calendar className="text-blue-400" size={18} />;
      case 'promo': return <Tag className="text-amber-400" size={18} />;
      default: return <Info className="text-[#D4B499]" size={18} />;
    }
  };

  return (
    <div className="p-6 space-y-8 pb-12 animate-fade">
      <header className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">Inbox</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lembretes & Ofertas</p>
        </div>
        <div className="bg-[#FAF7F5] p-3 rounded-2xl text-[#D4B499] shadow-sm">
          <Bell size={24} />
        </div>
      </header>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-gray-100 text-center space-y-4 shadow-inner">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <Bell size={32} />
            </div>
            <p className="text-xs text-gray-400 font-medium italic">Sua caixa de entrada está limpa!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-5 rounded-[2rem] border transition-all flex gap-4 group relative ${
                !notif.read ? 'bg-white border-[#F5E6DA] shadow-md' : 'bg-gray-50/50 border-transparent'
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-50`}>
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold leading-tight pr-4 ${!notif.read ? 'text-gray-800' : 'text-gray-500'}`}>
                    {notif.title}
                  </h4>
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className={`text-[11px] leading-relaxed ${!notif.read ? 'text-gray-600' : 'text-gray-400'}`}>
                  {notif.body}
                </p>
                <div className="pt-2 flex justify-between items-center">
                   <span className="text-[8px] text-gray-300 font-bold uppercase tracking-tighter">
                    {notif.timestamp.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!notif.read && <div className="w-1.5 h-1.5 bg-[#D4B499] rounded-full" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#D4B499]/10 p-6 rounded-[2rem] border border-[#D4B499]/20 flex gap-4 items-center">
        <Sparkles size={24} className="text-[#D4B499]" />
        <p className="text-[10px] text-[#8B5E3C] leading-relaxed font-bold uppercase tracking-tighter">
          Dica: Mantenha suas notificações ativas para ganhar mimos relâmpago!
        </p>
      </div>
    </div>
  );
};

export default NotificationView;
