
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Appointment, Voucher, Notification, ChatMessage, ServiceCategory, SalonConfig, Service, AccessibilityConfig } from './types';
import { MOCK_VOUCHERS, SERVICES as INITIAL_SERVICES } from './constants';
import { GoogleGenAI } from "@google/genai";

interface AppState {
  user: User | null;
  appointments: Appointment[];
  vouchers: Voucher[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  services: Service[];
  isAdmin: boolean;
  salonConfig: SalonConfig;
  isTyping: boolean;
  accessibility: AccessibilityConfig;
  isBirthMonth: boolean;
  login: (name: string, phone: string, birthDate: string) => void;
  logout: () => void;
  toggleAdmin: () => void;
  addAppointment: (app: Omit<Appointment, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) => void;
  confirmAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  markAsPaid: (id: string) => void;
  cancelAppointment: (id: string) => void;
  requestCancellation: (id: string) => void;
  informPaymentSent: (id: string) => void;
  updateSalonConfig: (config: Partial<SalonConfig>) => void;
  updateServices: (services: Service[]) => void;
  updateVouchers: (vouchers: Voucher[]) => void;
  sendChatMessage: (text: string, sender: 'client' | 'admin', targetUserId?: string) => void;
  redeemVoucher: (id: string) => void;
  markNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  markChatAsRead: (userId: string, sender: 'client' | 'admin') => void;
  updateAccessibility: (config: Partial<AccessibilityConfig>) => void;
  rateAppointment: (id: string, rating: number, comment?: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('ivone_user') || 'null'));
  const [appointments, setAppointments] = useState<Appointment[]>(() => JSON.parse(localStorage.getItem('ivone_apps') || '[]'));
  const [services, setServices] = useState<Service[]>(() => JSON.parse(localStorage.getItem('ivone_services') || JSON.stringify(INITIAL_SERVICES)));
  const [salonConfig, setSalonConfig] = useState<SalonConfig>(() => JSON.parse(localStorage.getItem('ivone_config') || JSON.stringify({
    pointsPerService: 1,
    pointsTarget: 2,
    pixPrepayment: true,
    pixName: 'Ivone Perpetuo',
    pixKey: 'ivoneperpetuo13@gmail.com',
    businessHours: { days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    dynamicText: { heroTitle: "The Ivory Experience", heroSubtitle: "Realçando sua essência mais pura.", studioDescription: "Protocolos Studio", protocolSectionTitle: "Nossa Curadoria" }
  })));
  const [accessibility, setAccessibility] = useState<AccessibilityConfig>(() => JSON.parse(localStorage.getItem('ivone_accessibility') || JSON.stringify({
    darkMode: false, highContrast: false, fontSize: 100, readAloud: false,
  })));
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => { localStorage.setItem('ivone_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('ivone_apps', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('ivone_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('ivone_config', JSON.stringify(salonConfig)); }, [salonConfig]);
  useEffect(() => { localStorage.setItem('ivone_accessibility', JSON.stringify(accessibility)); }, [accessibility]);

  const isBirthMonth = useMemo(() => {
    if (!user?.birthDate) return false;
    return new Date(user.birthDate).getUTCMonth() === new Date().getUTCMonth();
  }, [user]);

  const login = (name: string, phone: string, birthDate: string) => {
    setUser({ id: Math.random().toString(36).substr(2, 9), name, phone, birthDate, createdAt: new Date().toISOString(), points: { escovas: 0, manicurePedicure: 0, ciliosManutencao: 0 }, rewards: [] });
  };

  const logout = () => { setUser(null); setIsAdmin(false); };
  const toggleAdmin = () => setIsAdmin(!isAdmin);

  const addAppointment = (app: Omit<Appointment, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) => {
    const newApp: Appointment = { ...app, id: Math.random().toString(36).substr(2, 9), status: 'pending', paymentStatus: 'unpaid', createdAt: new Date().toISOString() };
    setAppointments(prev => [...prev, newApp]);
  };

  const confirmAppointment = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
  const completeAppointment = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
  const markAsPaid = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, paymentStatus: 'paid' } : a));
  const cancelAppointment = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  const requestCancellation = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'request_cancellation' } : a));
  const informPaymentSent = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, paymentStatus: 'waiting_verification' } : a));
  
  const updateSalonConfig = (config: Partial<SalonConfig>) => setSalonConfig(prev => ({ ...prev, ...config }));
  const updateServices = (newServices: Service[]) => setServices(newServices);
  const updateVouchers = (newVouchers: Voucher[]) => setVouchers(newVouchers);
  const updateAccessibility = (config: Partial<AccessibilityConfig>) => setAccessibility(prev => ({ ...prev, ...config }));
  const redeemVoucher = (id: string) => setVouchers(prev => prev.map(v => v.id === id ? { ...v, redeemed: v.redeemed + 1 } : v));
  const markNotificationsAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markChatAsRead = (userId: string, sender: 'client' | 'admin') => setChatMessages(prev => prev.map(m => m.userId === userId && m.sender !== sender ? { ...m, read: true } : m));
  const rateAppointment = (id: string, rating: number) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, rating } : a));

  const sendChatMessage = async (text: string, sender: 'client' | 'admin', targetUserId?: string) => {
    const userId = sender === 'client' ? user?.id : targetUserId;
    if (!userId) return;
    const newMessage: ChatMessage = { id: Math.random().toString(36).substr(2, 9), userId, sender, text, timestamp: new Date(), read: false };
    setChatMessages(prev => [...prev, newMessage]);
    if (sender === 'client') {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview', contents: `Cliente: ${text}`,
          config: { systemInstruction: "Você é Ivone, dona de um estúdio de beleza de luxo.", temperature: 0.7 }
        });
        setChatMessages(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), userId, sender: 'admin', text: response.text || "Estou à disposição!", timestamp: new Date(), read: false }]);
      } catch (e) { console.error(e); } finally { setIsTyping(false); }
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, appointments, vouchers, notifications, chatMessages, services, isAdmin, salonConfig, isTyping, accessibility, isBirthMonth,
      login, logout, toggleAdmin, addAppointment, confirmAppointment, completeAppointment, markAsPaid, cancelAppointment, 
      requestCancellation, informPaymentSent, updateSalonConfig, updateServices, updateVouchers, sendChatMessage,
      redeemVoucher, markNotificationsAsRead, deleteNotification, markChatAsRead, updateAccessibility, rateAppointment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado com AppProvider');
  return context;
};
