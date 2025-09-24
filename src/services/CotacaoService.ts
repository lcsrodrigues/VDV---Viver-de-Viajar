import { Cotacao } from "../types/Cotacao";
import { BaseService } from "./BaseService";

const initialCotacoes: Cotacao[] = [
  {
    id: "1",
    clientId: "1",
    contractId: "1",
    destination: "Paris, França",
    departureDate: "2026-03-10",
    returnDate: "2026-03-20",
    adults: 2,
    children: 0,
    status: "quoted",
    estimatedValue: 8500.00,
    milesUsed: 120000,
    notes: "Cotação para lua de mel",
  },
  {
    id: "2",
    clientId: "2",
    contractId: "2",
    destination: "Orlando, EUA",
    departureDate: "2025-12-15",
    returnDate: "2025-12-28",
    adults: 2,
    children: 2,
    status: "pending",
    estimatedValue: 12000.00,
    milesUsed: 180000,
    notes: "Viagem em família para a Disney",
  },
  {
    id: "3",
    clientId: "1",
    contractId: "1",
    destination: "Tóquio, Japão",
    departureDate: "2025-11-05",
    returnDate: "2025-11-15",
    adults: 1,
    children: 0,
    status: "booked",
    estimatedValue: 6800.00,
    milesUsed: 95000,
    notes: "Viagem de negócios",
  },
];

export const cotacaoService = new BaseService<Cotacao>("cotacoes", initialCotacoes);


