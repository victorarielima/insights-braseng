import { CampaignReport } from '@/utils/reportParser';

export interface MockReport extends CampaignReport {
  id: string;
  thumbnail?: string;
}

export const mockReports: MockReport[] = [
  {
    id: '1',
    campaignName: 'Stories 12/12 - Teste do Vídeo',
    createdAt: '12/12/2024',
    videoUrl: null,
    investment: {
      totalSpent: 5.04,
      reach: 74,
      impressions: 104,
      frequency: 1.41,
      cpm: 68.11
    },
    clicks: {
      totalClicks: 1,
      uniqueClicks: 1,
      ctr: 0.96,
      cpc: 5.04
    },
    results: {
      videoViews: { count: 10, cost: 0.50 },
      linkClicks: { count: 1, cost: 5.04 },
      reactions: 1,
      shares: 0,
      netLikes: 1,
      conversations: { count: 0, cost: 0 },
      totalEngagements: { count: 12, cost: 0.42 }
    },
    settings: {
      status: 'ACTIVE',
      ctaType: 'WHATSAPP_MESSAGE',
      ageRange: '18 a 65 anos',
      interests: ['Senior management', 'Empresarios'],
      jobTitles: ['Empresário', 'Sócio Proprietário', 'Proprietário(a)', 'Sócio-Diretor Comercial']
    },
    content: 'Esta opção é a que costuma converter melhor para empresários cansados, pois valida o sentimento deles. Título: Você tem uma empresa ou um emprego que te dá dor de cabeça? 🤯 Faça o teste do vídeo: se você sumir por 15 dias, o dinheiro continua entrando ou a operação para? Se a resposta foi "PARA TUDO", precisamos conversar urgente.',
    videoPerformance: {
      totalViews: 74,
      at25: { count: 8, percentage: 10.81 },
      at50: { count: 2, percentage: 2.70 },
      at75: { count: 1, percentage: 1.35 },
      atEnd: { count: 0, percentage: 0 }
    }
  },
  {
    id: '2',
    campaignName: 'Campanha Black Friday',
    createdAt: '24/11/2024',
    videoUrl: null,
    investment: {
      totalSpent: 250.00,
      reach: 12500,
      impressions: 45000,
      frequency: 3.6,
      cpm: 5.55
    },
    clicks: {
      totalClicks: 890,
      uniqueClicks: 650,
      ctr: 1.98,
      cpc: 0.28
    },
    results: {
      videoViews: { count: 3200, cost: 0.08 },
      linkClicks: { count: 890, cost: 0.28 },
      reactions: 156,
      shares: 45,
      netLikes: 234,
      conversations: { count: 89, cost: 2.81 },
      totalEngagements: { count: 4524, cost: 0.06 }
    },
    settings: {
      status: 'COMPLETED',
      ctaType: 'SHOP_NOW',
      ageRange: '25 a 55 anos',
      interests: ['Compras online', 'Tecnologia', 'Eletrônicos'],
      jobTitles: ['Profissional Liberal', 'Gerente', 'Analista']
    },
    content: '🔥 BLACK FRIDAY CHEGOU! Até 70% OFF em produtos selecionados. Não perca a maior promoção do ano. Ofertas por tempo limitado!',
    videoPerformance: {
      totalViews: 8500,
      at25: { count: 5100, percentage: 60 },
      at50: { count: 3400, percentage: 40 },
      at75: { count: 2125, percentage: 25 },
      atEnd: { count: 1275, percentage: 15 }
    }
  },
  {
    id: '3',
    campaignName: 'Lançamento Produto X',
    createdAt: '05/12/2024',
    videoUrl: null,
    investment: {
      totalSpent: 1500.00,
      reach: 85000,
      impressions: 180000,
      frequency: 2.12,
      cpm: 8.33
    },
    clicks: {
      totalClicks: 4200,
      uniqueClicks: 3100,
      ctr: 2.33,
      cpc: 0.36
    },
    results: {
      videoViews: { count: 15000, cost: 0.10 },
      linkClicks: { count: 4200, cost: 0.36 },
      reactions: 890,
      shares: 234,
      netLikes: 1200,
      conversations: { count: 340, cost: 4.41 },
      totalEngagements: { count: 21864, cost: 0.07 }
    },
    settings: {
      status: 'ACTIVE',
      ctaType: 'LEARN_MORE',
      ageRange: '18 a 45 anos',
      interests: ['Inovação', 'Startups', 'Empreendedorismo'],
      jobTitles: ['CEO', 'Fundador', 'Diretor']
    },
    content: '🚀 Apresentamos o Produto X - A revolução que você estava esperando. Descubra como transformar sua rotina com nossa nova solução. Saiba mais!',
    videoPerformance: {
      totalViews: 42000,
      at25: { count: 29400, percentage: 70 },
      at50: { count: 21000, percentage: 50 },
      at75: { count: 12600, percentage: 30 },
      atEnd: { count: 8400, percentage: 20 }
    }
  },
  {
    id: '4',
    campaignName: 'Remarketing Carrinho Abandonado',
    createdAt: '10/12/2024',
    videoUrl: null,
    investment: {
      totalSpent: 89.50,
      reach: 2340,
      impressions: 8900,
      frequency: 3.80,
      cpm: 10.06
    },
    clicks: {
      totalClicks: 156,
      uniqueClicks: 98,
      ctr: 1.75,
      cpc: 0.57
    },
    results: {
      videoViews: { count: 450, cost: 0.20 },
      linkClicks: { count: 156, cost: 0.57 },
      reactions: 23,
      shares: 5,
      netLikes: 34,
      conversations: { count: 28, cost: 3.20 },
      totalEngagements: { count: 696, cost: 0.13 }
    },
    settings: {
      status: 'ACTIVE',
      ctaType: 'SHOP_NOW',
      ageRange: '22 a 50 anos',
      interests: ['E-commerce', 'Compras'],
      jobTitles: []
    },
    content: '⏰ Ei! Você esqueceu algo no carrinho... Volte agora e finalize sua compra com 10% de desconto exclusivo!',
    videoPerformance: {
      totalViews: 1200,
      at25: { count: 840, percentage: 70 },
      at50: { count: 540, percentage: 45 },
      at75: { count: 300, percentage: 25 },
      atEnd: { count: 180, percentage: 15 }
    }
  },
  {
    id: '5',
    campaignName: 'Webinar Gratuito - Marketing Digital',
    createdAt: '01/12/2024',
    videoUrl: null,
    investment: {
      totalSpent: 320.00,
      reach: 15600,
      impressions: 42000,
      frequency: 2.69,
      cpm: 7.62
    },
    clicks: {
      totalClicks: 1250,
      uniqueClicks: 890,
      ctr: 2.98,
      cpc: 0.26
    },
    results: {
      videoViews: { count: 5600, cost: 0.06 },
      linkClicks: { count: 1250, cost: 0.26 },
      reactions: 345,
      shares: 89,
      netLikes: 456,
      conversations: { count: 156, cost: 2.05 },
      totalEngagements: { count: 7896, cost: 0.04 }
    },
    settings: {
      status: 'PAUSED',
      ctaType: 'SIGN_UP',
      ageRange: '20 a 40 anos',
      interests: ['Marketing Digital', 'Redes Sociais', 'Growth Hacking'],
      jobTitles: ['Social Media', 'Marketing Manager', 'Growth Hacker', 'Analista de Marketing']
    },
    content: '📚 WEBINAR GRATUITO: Aprenda as estratégias de marketing digital que geraram R$1M em vendas. Vagas limitadas - Inscreva-se agora!',
    videoPerformance: {
      totalViews: 12000,
      at25: { count: 8400, percentage: 70 },
      at50: { count: 6000, percentage: 50 },
      at75: { count: 4200, percentage: 35 },
      atEnd: { count: 2880, percentage: 24 }
    }
  }
];

export const getReportById = (id: string): MockReport | undefined => {
  return mockReports.find(report => report.id === id);
};
