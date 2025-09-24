import React, { useEffect, useState } from 'react';
import { CardKPI } from '../components/CardKPI';
import { Badge } from '../components/Badge';
import { 
  Coins, 
  TrendingUp, 
  DollarSign, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { movimentacoesService } from '../services/MovimentacoesService';
import { programasService } from '../services/ProgramasService';
import { lojasService } from '../services/LojasService';
import { Movimentacao } from '../types/Movimentacao';
import { Program } from '../types/Program';
import { Loja } from '../types/Loja';

interface DashboardProps {
  onMenuItemClick: (item: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onMenuItemClick }) => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [programas, setProgramas] = useState<Program[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movData, progData, lojaData] = await Promise.all([
          movimentacoesService.list(),
          programasService.list(),
          lojasService.list()
        ]);
        setMovimentacoes(movData);
        setProgramas(progData);
        setLojas(lojaData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate KPIs
  const totalQuantidade = movimentacoes.reduce((sum, mov) => sum + mov.quantidade, 0);
  const totalInvestido = movimentacoes.reduce((sum, mov) => sum + (mov.valorInvestido || 0), 0);
  const totalEconomia = movimentacoes.reduce((sum, mov) => sum + (mov.totalEconomia || 0), 0);
  const conversaoMedia = totalInvestido > 0 ? totalInvestido / totalQuantidade : 0;

  // Current month movements for bar chart
  const currentMonth = '2025-09';
  const currentMonthMovements = movimentacoes.filter(mov => mov.data.startsWith(currentMonth));
  
  const movementsByType = currentMonthMovements.reduce((acc, mov) => {
    acc[mov.tipoOperacao] = (acc[mov.tipoOperacao] || 0) + mov.quantidade;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(movementsByType).map(([tipo, quantidade]) => ({
    tipo,
    quantidade
  }));

  // Monthly evolution data
  const monthlyData = [
    { mes: '2025-05', quantidade: 45000, valorInvestido: 900 },
    { mes: '2025-06', quantidade: 52000, valorInvestido: 1100 },
    { mes: '2025-07', quantidade: 48000, valorInvestido: 950 },
    { mes: '2025-08', quantidade: 61000, valorInvestido: 1250 },
    { mes: '2025-09', quantidade: totalQuantidade, valorInvestido: totalInvestido },
  ];

  // Latest movements (last 5)
  const latestMovements = movimentacoes
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const getProgramaName = (programaId: string) => {
    return programas.find(p => p.id === programaId)?.programa || 'N/A';
  };

  const getLojaName = (lojaId?: string) => {
    if (!lojaId) return 'N/A';
    return lojas.find(l => l.id === lojaId)?.titulo || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardKPI
          title="Saldo Total"
          value={totalQuantidade}
          subtitle="milhas/pontos"
          icon={Coins}
        />
        <CardKPI
          title="Total Investido"
          value={`R$ ${totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <CardKPI
          title="Total Economia"
          value={`R$ ${totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
        />
        <CardKPI
          title="Conversão Média"
          value={`R$ ${conversaoMedia.toLocaleString('pt-BR', { minimumFractionDigits: 4 })}`}
          subtitle="por unidade"
          icon={Calculator}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Movements by Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Movimentações por Tipo (Setembro 2025)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="tipo" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Monthly Evolution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Evolução Mensal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="quantidade" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Quantidade"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="valorInvestido" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Valor Investido (R$)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Movements */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Últimas Movimentações
          </h3>
          <button 
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => onMenuItemClick("movimentacoes")}
          >
            Ver todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="space-y-3">
          {latestMovements.map((movimento) => (
            <div key={movimento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Badge type={movimento.tipoOperacao} />
                <div>
                  <p className="font-medium text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                    {getProgramaName(movimento.programaId)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getLojaName(movimento.lojaId)} • {new Date(movimento.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {movimento.quantidade.toLocaleString('pt-BR')} {movimento.moedaDigital.toLowerCase()}
                </p>
                {movimento.valor && (
                  <p className="text-sm text-gray-600">
                    R$ {movimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

