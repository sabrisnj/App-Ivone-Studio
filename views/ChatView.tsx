
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { Send, MessageCircle, User } from 'lucide-react';

const ChatView: React.FC = () => {
  const { user, chatMessages, sendChatMessage, markChatAsRead, isTyping, isAdmin, appointments } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtra mensagens do usuário logado ou todas se for Admin
  const messages = chatMessages.filter(m => isAdmin || m.userId === user?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (user) markChatAsRead(user.id, isAdmin ? 'admin' : 'client');
  }, [messages.length, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isTyping) {
      sendChatMessage(inputText, isAdmin ? 'admin' : 'client');
      setInputText('');
    }
  };

  // Função para encontrar o nome do cliente associado ao userId
  const getClientName = (userId: string) => {
    if (userId === user?.id && !isAdmin) return 'Você';
    const appointment = appointments.find(a => a.clientPhone === userId); // Simplificação usando telefone como id no mock
    return appointment?.clientName || 'Cliente';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade">
      {/* Header do Chat */}
      <header className="p-6 border-b border-[#F5E6DA]/50 dark:border-zinc-800 flex items-center gap-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-12 h-12 bg-[#FAF7F5] dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-[#D4B499] border border-[#F5E6DA] dark:border-zinc-700">
          <MessageCircle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-white">
            {isAdmin ? 'Canal da Ivone' : 'Atendimento Studio'}
          </h3>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> {isAdmin ? 'Você está online' : 'Ivone online agora'}
          </p>
        </div>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 px-10">
            <MessageCircle size={48} className="text-[#D4B499]" />
            <p className="text-sm font-medium italic leading-relaxed text-gray-500 dark:text-gray-400">
              Olá! Mande uma mensagem para iniciar a conversa.
            </p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col ${m.sender === (isAdmin ? 'admin' : 'client') ? 'items-end' : 'items-start'} animate-fade`}
              >
                {/* Exibição do Nome do Cliente para o Admin */}
                {isAdmin && m.sender === 'client' && (
                  <span className="text-[7px] font-bold text-[#D4B499] uppercase tracking-widest mb-1 px-2 flex items-center gap-1">
                    <User size={8}/> {getClientName(m.userId)}
                  </span>
                )}
                
                <div 
                  className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm leading-relaxed ${
                    m.sender === (isAdmin ? 'admin' : 'client')
                      ? 'bg-[#D4B499] text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-zinc-800 border border-[#F5E6DA] dark:border-zinc-700 text-gray-700 dark:text-gray-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                   {isAdmin && m.sender === 'client' && (
                     <span className="text-[8px] text-[#86BDB1] font-bold uppercase tracking-tighter">
                       Via App •
                     </span>
                   )}
                   <span className="text-[8px] text-gray-300 font-bold uppercase tracking-tighter">
                    {new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Indicador de Digitação */}
            {isTyping && !isAdmin && (
              <div className="flex flex-col items-start animate-fade">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-[1.8rem] rounded-tl-none border border-gray-100 dark:border-zinc-700 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-[8px] text-[#D4B499] font-bold uppercase tracking-widest mt-1 px-1">
                  Ivone está digitando...
                </span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-[#F5E6DA]/50 dark:border-zinc-800 transition-colors">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isTyping && !isAdmin ? "Aguardando Ivone..." : "Digite sua mensagem..."}
            disabled={isTyping && !isAdmin}
            className="flex-1 bg-[#FAF7F5] dark:bg-zinc-800 border border-transparent focus:border-[#D4B499] rounded-[1.5rem] px-5 py-4 text-sm outline-none transition-all placeholder:text-gray-300 dark:text-white disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || (isTyping && !isAdmin)}
            className="bg-[#D4B499] text-white p-4 rounded-[1.5rem] shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[8px] text-gray-300 dark:text-zinc-600 text-center mt-3 uppercase font-bold tracking-[0.2em]">
          Ivone Hair Studio • Tecnologia Gemini AI
        </p>
      </div>
    </div>
  );
};

export default ChatView;
