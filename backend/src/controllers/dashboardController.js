import Dashboard from '../models/Dashboard.js';

export const obterDashboard = async (req, res) => {
  try {
    const metricas = await Dashboard.obterMetricasGlobais();
    res.status(200).json(metricas);
  } catch (error) {
    console.error('Erro ao carregar métricas do dashboard:', error.message);
    res.status(500).json({ erro: 'Falha interna ao processar os indicadores.' });
  }
};