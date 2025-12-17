export interface CampaignReport {
  campaignName: string;
  createdAt: string | null;
  videoUrl: string | null;
  investment: {
    totalSpent: number;
    reach: number;
    impressions: number;
    frequency: number;
    cpm: number;
  };
  clicks: {
    totalClicks: number;
    uniqueClicks: number;
    ctr: number;
    cpc: number;
  };
  results: {
    videoViews: { count: number; cost: number };
    linkClicks: { count: number; cost: number };
    reactions: number;
    shares: number;
    netLikes: number;
    conversations: { count: number; cost: number };
    totalEngagements: { count: number; cost: number };
  };
  settings: {
    status: string;
    ctaType: string;
    ageRange: string;
    interests: string[];
    jobTitles: string[];
  };
  content: string;
  videoPerformance: {
    totalViews: number;
    at25: { count: number; percentage: number };
    at50: { count: number; percentage: number };
    at75: { count: number; percentage: number };
    atEnd: { count: number; percentage: number };
  };
}

function extractNumber(text: string, pattern: RegExp): number {
  const match = text.match(pattern);
  if (match) {
    const numStr = match[1].replace(/\./g, '').replace(',', '.');
    return parseFloat(numStr);
  }
  return 0;
}

function extractCostPair(text: string, pattern: RegExp): { count: number; cost: number } {
  const match = text.match(pattern);
  if (match) {
    const count = parseInt(match[1].replace(/\./g, ''));
    const cost = parseFloat(match[2].replace(',', '.'));
    return { count, cost };
  }
  return { count: 0, cost: 0 };
}

export function parseReport(reportText: string): CampaignReport {
  // Extract campaign name
  const campaignMatch = reportText.match(/Campanha:\s*(.+?)(?:\n|$)/);
  const campaignName = campaignMatch ? campaignMatch[1].trim() : 'Campanha Desconhecida';

  // Investment section
  const totalSpent = extractNumber(reportText, /Gasto Total:\s*R\$\s*([\d.,]+)/);
  const reach = extractNumber(reportText, /Alcance.*?:\s*([\d.]+)\s*pessoas/);
  const impressions = extractNumber(reportText, /Impressões.*?:\s*([\d.]+)/);
  const frequency = extractNumber(reportText, /Frequência.*?:\s*([\d.,]+)/);
  const cpm = extractNumber(reportText, /CPM.*?:\s*R\$\s*([\d.,]+)/);

  // Clicks section
  const totalClicks = extractNumber(reportText, /Cliques Totais.*?:\s*([\d.]+)/);
  const uniqueClicks = extractNumber(reportText, /Cliques Únicos.*?:\s*([\d.]+)/);
  const ctr = extractNumber(reportText, /CTR.*?:\s*([\d.,]+)%/);
  const cpc = extractNumber(reportText, /CPC.*?:\s*R\$\s*([\d.,]+)/);

  // Results section - Updated regex to match new format
  // Format: "Visualizações do vídeo: 10 (R$ 0,50 cada)" or "Visualizações qualificadas: 10 (R$ 0,50 cada)"
  const videoViews = extractCostPair(reportText, /Visualizações (?:do vídeo|qualificadas).*?:\s*([\d.]+)\s*\(R\$\s*([\d.,]+)/);
  // Format: "Cliques no link: 1 (R$ 5,04 cada)" or "Cliques no Link: 1 (R$ 5,04 cada)"
  const linkClicks = extractCostPair(reportText, /Cliques no [Ll]ink:\s*([\d.]+)\s*\(R\$\s*([\d.,]+)/);
  // Format: "Reações no post: 1" or "Reações no Post: 1"
  const reactions = extractNumber(reportText, /Reações no [Pp]ost:\s*([\d.]+)/);
  const shares = extractNumber(reportText, /Compartilhamentos:\s*([\d.]+)/);
  // Format: "Curtidas líquidas: 1" or "Curtidas Líquidas: 1"
  const netLikes = extractNumber(reportText, /Curtidas [Ll]íquidas.*?:\s*([\d.]+)/);
  // Format: "Conversas iniciadas (mensagem): 0 (R$ 0,00 cada)"
  const conversations = extractCostPair(reportText, /Conversas [Ii]niciadas.*?:\s*([\d.]+)\s*\(R\$\s*([\d.,]+)/);
  // Format: "Engajamentos totais: 12 (R$ 0,42 cada)" or "Engajamentos Totais: 12 (R$ 0,42 cada)"
  const totalEngagements = extractCostPair(reportText, /Engajamentos [Tt]otais.*?:\s*([\d.]+)\s*\(R\$\s*([\d.,]+)/);

  // Settings section
  const statusMatch = reportText.match(/Status atual:\s*(\w+)/);
  const ctaMatch = reportText.match(/Tipo de CTA.*?:\s*(\w+)/);
  // Format: "Faixa etária: 18 a 65 anos" or "Público: 18 a 65 anos"
  const ageMatch = reportText.match(/(?:Faixa etária|Público).*?:\s*(\d+\s*a\s*\d+\s*anos)/);
  const interestsMatch = reportText.match(/Interesses:\s*(.+?)(?:\n|$)/);
  const jobMatch = reportText.match(/Cargo(?:s)? de trabalho:\s*(.+?)(?:\n\n|\n📝|\n🎯|$)/s);

  // Creation date
  const createdAtMatch = reportText.match(/Data de criação:\s*(.+?)(?:\n|$)/);
  const createdAt = createdAtMatch ? createdAtMatch[1].trim() : null;

  // Content section - capture everything until video link or video performance section or next section
  const contentMatch = reportText.match(/📝 CONTEÚDO DO ANÚNCIO\n([\s\S]*?)(?:\n🔗 Link|\n\n📽️|\n\n🎯|$)/);
  const content = contentMatch ? contentMatch[1].trim() : '';

  // Video URL
  const videoUrlMatch = reportText.match(/🔗 Link do vídeo:\s*(https?:\/\/[^\s]+)/);
  const videoUrl = videoUrlMatch ? videoUrlMatch[1].trim() : null;

  // Video performance - Updated regex to match new format
  // Format: "• Total de visualizações: 74" or "Total de visualizações: 74"
  const totalVideoViews = extractNumber(reportText, /Total de visualizações:\s*([\d.]+)/);
  // Format: "• Até 25%: 8 pessoas = (10,81%)" - note lowercase "pessoas"
  const at25Match = reportText.match(/Até 25%:\s*([\d.]+)\s*pessoas?\s*=\s*\(([\d.,]+)%\)/i);
  const at50Match = reportText.match(/Até 50%:\s*([\d.]+)\s*pessoas?\s*=\s*\(([\d.,]+)%\)/i);
  const at75Match = reportText.match(/Até 75%:\s*([\d.]+)\s*pessoas?\s*=\s*\(([\d.,]+)%\)/i);
  const atEndMatch = reportText.match(/Até o final.*?:\s*([\d.]+)\s*pessoas?\s*=\s*\(([\d.,]+)%\)/i);

  return {
    campaignName,
    createdAt,
    videoUrl,
    investment: {
      totalSpent,
      reach,
      impressions,
      frequency,
      cpm,
    },
    clicks: {
      totalClicks,
      uniqueClicks,
      ctr,
      cpc,
    },
    results: {
      videoViews,
      linkClicks,
      reactions,
      shares,
      netLikes,
      conversations,
      totalEngagements,
    },
    settings: {
      status: statusMatch ? statusMatch[1] : 'N/A',
      ctaType: ctaMatch ? ctaMatch[1] : 'N/A',
      ageRange: ageMatch ? ageMatch[1] : 'N/A',
      interests: interestsMatch ? interestsMatch[1].split(',').map(s => s.trim()) : [],
      jobTitles: jobMatch ? jobMatch[1].split(',').map(s => s.trim()) : [],
    },
    content,
    videoPerformance: {
      totalViews: totalVideoViews,
      at25: {
        count: at25Match ? parseInt(at25Match[1].replace(/\./g, '')) : 0,
        percentage: at25Match ? parseFloat(at25Match[2].replace(',', '.')) : 0,
      },
      at50: {
        count: at50Match ? parseInt(at50Match[1].replace(/\./g, '')) : 0,
        percentage: at50Match ? parseFloat(at50Match[2].replace(',', '.')) : 0,
      },
      at75: {
        count: at75Match ? parseInt(at75Match[1].replace(/\./g, '')) : 0,
        percentage: at75Match ? parseFloat(at75Match[2].replace(',', '.')) : 0,
      },
      atEnd: {
        count: atEndMatch ? parseInt(atEndMatch[1].replace(/\./g, '')) : 0,
        percentage: atEndMatch ? parseFloat(atEndMatch[2].replace(',', '.')) : 0,
      },
    },
  };
}
