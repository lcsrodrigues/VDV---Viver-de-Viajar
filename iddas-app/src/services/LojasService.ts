import { BaseService } from './BaseService';
import { Loja } from '../types/Loja';

const initialLojas: Loja[] = [
  { id: '1', titulo: 'Amazon' },
  { id: '2', titulo: 'Magazine Luiza' },
  { id: '3', titulo: 'Casas Bahia' },
  { id: '4', titulo: 'Ponto Frio' },
  { id: '5', titulo: 'Decolar' },
  { id: '6', titulo: 'CVC' },
  { id: '7', titulo: 'Booking.com' },
  { id: '8', titulo: 'Submarino Viagens' },
];

export const lojasService = new BaseService<Loja>('lojas', initialLojas);

