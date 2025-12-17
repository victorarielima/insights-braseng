import { CampaignReport, parseReport } from '@/utils/reportParser';

export interface ApiReport {
    id: number;
    relatorio: string;
    status: string;
    status_real: string;
    data_criacao: string;
    data_atualizacao: string;
    link_anuncio: string | null;
    nome_anuncio: string;
    id_anuncio?: number;
    transcricao_video?: string | null;
}

export interface ProcessedReport extends CampaignReport {
    id: string;
    adLink: string | null;
    updatedAt: string | null;
    isImage?: boolean;
}

const WEBHOOK_URL = 'https://n8n.nexosoftwere.cloud/webhook/00f1afb5-6781-48b4-ac4d-9d2c4e998022';
const GENERATE_WEBHOOK_URL = 'https://n8n.nexosoftwere.cloud/webhook/70fe9b02-cf05-4261-87db-5c897e9dad48';

export async function generateReports(): Promise<ProcessedReport[]> {
    const response = await fetch(GENERATE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiReport[] = await response.json();

    // Ensure data is an array
    const reports = Array.isArray(data) ? data : [data];

    return reports.map((item) => {
        // Parse the report text using existing parser
        const reportText = item.relatorio.replace(/\\n/g, '\n');
        const parsed = parseReport(reportText);

        // Check if link exists and is valid
        const adLink = item.link_anuncio;
        const hasLink = adLink && adLink.trim().length > 0 && adLink.includes('http');
        
        // Check if the link is an image
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
        const isImage = hasLink && imageExtensions.some(ext => adLink!.toLowerCase().includes(ext));

        return {
            ...parsed,
            id: String(item.id),
            campaignName: item.nome_anuncio || parsed.campaignName,
            createdAt: item.data_criacao || parsed.createdAt,
            updatedAt: item.data_atualizacao || null,
            videoUrl: hasLink ? adLink : null,
            adLink: hasLink ? adLink : null,
            isImage,
            settings: {
                ...parsed.settings,
                status: item.status_real || item.status || parsed.settings.status
            }
        };
    });
}

export async function fetchReports(): Promise<ProcessedReport[]> {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiReport[] = await response.json();

        // Ensure data is an array
        const reports = Array.isArray(data) ? data : [data];

        return reports.map((item) => {
            // Parse the report text using existing parser
            const reportText = item.relatorio.replace(/\\n/g, '\n');
            const parsed = parseReport(reportText);

            // Check if link exists and is valid
            const adLink = item.link_anuncio;
            const hasLink = adLink && adLink.trim().length > 0 && adLink.includes('http');
            
            // Check if the link is an image
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
            const isImage = hasLink && imageExtensions.some(ext => adLink!.toLowerCase().includes(ext));

            return {
                ...parsed,
                id: String(item.id),
                campaignName: item.nome_anuncio || parsed.campaignName,
                createdAt: item.data_criacao || parsed.createdAt,
                updatedAt: item.data_atualizacao || null,
                videoUrl: hasLink ? adLink : null,
                adLink: hasLink ? adLink : null,
                isImage,
                settings: {
                    ...parsed.settings,
                    status: item.status_real || item.status || parsed.settings.status
                }
            };
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
}

export function getReportById(reports: ProcessedReport[], id: string): ProcessedReport | undefined {
    return reports.find(report => report.id === id);
}
