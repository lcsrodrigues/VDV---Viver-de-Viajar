import { Cotacao } from "../types/Cotacao";
import { BaseService } from "./BaseService";

const initialCotacoes: Cotacao[] = [
  {
    id: "1",
    clientId: "1",
    destination: "Paris, França",
    departureDate: "2026-03-10",
    returnDate: "2026-03-20",
    adults: 2,
    children: 0,
    status: "quoted",
    notes: "Cotação para lua de mel",
  },
  {
    id: "2",
    clientId: "2",
    destination: "Orlando, EUA",
    departureDate: "2025-12-15",
    returnDate: "2025-12-28",
    adults: 2,
    children: 2,
    status: "pending",
    notes: "Viagem em família para a Disney",
  },
];

export const cotacaoService = new BaseService<Cotacao>("cotacoes", initialCotacoes);


