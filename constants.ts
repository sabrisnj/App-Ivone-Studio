
import { Service, ServiceCategory, Voucher } from './types';

export const COLORS = {
  primary: '#D99489',
  secondary: '#86BDB1',
  accent: '#8B5E3C',
  background: '#FFF9F8',
  text: '#4A3B39',
};

export const SALON_INFO = {
  whatsapp: '+55 11 99730-8578',
  pixKey: 'ivoneperpetuo13@gmail.com',
  address: 'Rua Olinda, 23 – Jardim Nova Pietro, São Bernardo do Campo – SP',
  instagram: '@ivonehairstudio'
};

export const SERVICES: Service[] = [
  { 
    id: '1', 
    name: 'Coloração Premium', 
    category: ServiceCategory.HAIR, 
    duration: '120 min', 
    price: 0,
    description: 'Tratamento de cor com tecnologia botânica que preserva a saúde da fibra.' 
  },
  { 
    id: '2', 
    name: 'Escova Modelada', 
    category: ServiceCategory.HAIR, 
    duration: '45 min', 
    price: 0,
    description: 'Finalização profissional com movimento natural e brilho intenso.' 
  },
  { 
    id: '3', 
    name: 'Manicure + Pedicure SPA', 
    category: ServiceCategory.NAILS, 
    duration: '90 min', 
    price: 0,
    description: 'Ritual completo com esfoliação de sais marinhos e hidratação.' 
  },
  { 
    id: '4', 
    name: 'Extensão de Cílios', 
    category: ServiceCategory.FACE, 
    duration: '120 min', 
    price: 0,
    description: 'Técnica fio a fio para um olhar marcante e natural.' 
  }
];

export const MOCK_VOUCHERS: Voucher[] = [
  { id: 'v1', name: 'Mimo Boas-vindas', description: 'Desconto especial no seu primeiro serviço.', limit: 10, redeemed: 7 },
  { id: 'v2', name: 'Reserva Antecipada', description: 'Spa dos Pés incluso para agendamentos matinais.', limit: 5, redeemed: 4 },
];
