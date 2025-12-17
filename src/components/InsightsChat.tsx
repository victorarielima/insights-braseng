import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { ProcessedReport } from '@/services/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface InsightsCacheData {
    content: string;
    timestamp: number;
    reportHash: string;
}

interface InsightsChatProps {
    isOpen: boolean;
    onClose: () => void;
    report: ProcessedReport;
}

const INSIGHTS_WEBHOOK_URL = 'https://n8n.nexosoftwere.cloud/webhook/00aa3859-afb5-4eaa-b2b1-3b73254b8e04';

// Função para gerar hash do relatório
const generateReportHash = (report: ProcessedReport): string => {
    const relevant = {
        id: report.id,
        campaignName: report.campaignName,
        updatedAt: report.updatedAt,
        videoUrl: report.videoUrl,
    };
    return JSON.stringify(relevant);
};

// Função para obter chave de cache
const getCacheKey = (reportId: string | number): string => {
    return `insights_cache_${reportId}`;
};

// Função para obter insights do cache
const getCachedInsights = (reportId: string | number, currentHash: string): string | null => {
    const cacheKey = getCacheKey(reportId);
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        try {
            const cacheData: InsightsCacheData = JSON.parse(cached);
            // Verificar se o hash do relatório ainda é válido (dados não mudaram)
            if (cacheData.reportHash === currentHash) {
                return cacheData.content;
            }
        } catch {
            // Erro ao parsear cache, ignorar
        }
    }
    
    return null;
};

// Função para salvar insights em cache
const saveCachedInsights = (reportId: string | number, content: string, reportHash: string) => {
    const cacheKey = getCacheKey(reportId);
    const cacheData: InsightsCacheData = {
        content,
        timestamp: Date.now(),
        reportHash,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
};

// Função para limpar cache de insights
const clearInsightsCache = (reportId: string | number) => {
    const cacheKey = getCacheKey(reportId);
    localStorage.removeItem(cacheKey);
};

// Função para extrair texto da resposta (pode ser string ou array)
const extractResponseText = (data: unknown): string => {
    let text = '';
    
    if (typeof data === 'string') {
        text = data;
    } else if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0] as any;
        if (typeof firstItem === 'string') {
            text = firstItem;
        } else if (firstItem.output) {
            text = firstItem.output;
        } else {
            text = firstItem.response || firstItem.message || JSON.stringify(data);
        }
    } else if (typeof data === 'object' && data !== null) {
        const obj = data as any;
        text = obj.output || obj.response || obj.message || JSON.stringify(data);
    } else {
        text = JSON.stringify(data);
    }
    
    // Limpar e processar o texto
    text = text
        .replace(/\\n/g, '\n') // Converter \n em quebras de linha reais
        .replace(/\\\"/g, '"') // Converter \" em "
        .trim();
    
    return text;
};

// Componente para renderizar markdown
const MarkdownText = ({ text }: { text: string }) => {
    // Limpar linhas com apenas separadores
    let cleanText = text
        .split('\n')
        .filter(line => !line.match(/^-+$/)) // Remove linhas com apenas hífens
        .join('\n');
    
    // Dividir por linhas
    const lines = cleanText.split('\n').map(line => line.trim()).filter(Boolean);
    
    return (
        <div className="space-y-2">
            {lines.map((line, i) => {
                if (!line) return null;
                
                // Headers (###)
                if (line.startsWith('###')) {
                    return (
                        <h3 key={i} className="text-sm font-bold mt-3 mb-2 text-foreground">
                            {line.replace(/^###\s*/, '').trim()}
                        </h3>
                    );
                }
                
                // Headers (##)
                if (line.startsWith('##')) {
                    return (
                        <h2 key={i} className="text-base font-bold mt-4 mb-2 text-foreground">
                            {line.replace(/^##\s*/, '').trim()}
                        </h2>
                    );
                }
                
                // Headers (#)
                if (line.startsWith('#') && !line.startsWith('##')) {
                    return (
                        <h1 key={i} className="text-lg font-bold mt-4 mb-2 text-foreground">
                            {line.replace(/^#\s*/, '').trim()}
                        </h1>
                    );
                }
                
                // Lista com bolinha
                if (line.startsWith('-')) {
                    const content = line.replace(/^-\s*/, '').trim();
                    // Processar bold em **texto:**
                    const parts = content.split(/(\*\*[^*]+\*\*)/g);
                    
                    return (
                        <div key={i} className="flex gap-2 text-sm leading-relaxed">
                            <span className="text-foreground">•</span>
                            <p className="text-foreground">
                                {parts.map((part, idx) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return (
                                            <strong key={idx}>
                                                {part.replace(/\*\*/g, '')}
                                            </strong>
                                        );
                                    }
                                    return part;
                                })}
                            </p>
                        </div>
                    );
                }
                
                // Parágrafo normal com bold
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                return (
                    <p key={i} className="text-sm leading-relaxed text-foreground">
                        {parts.map((part, idx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <strong key={idx}>
                                        {part.replace(/\*\*/g, '')}
                                    </strong>
                                );
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

export function InsightsChat({ isOpen, onClose, report }: InsightsChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialMessageSent, setInitialMessageSent] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para o final das mensagens
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Enviar relatório automaticamente quando o chat abrir
    useEffect(() => {
        if (isOpen && !initialMessageSent) {
            sendInitialReport();
            setInitialMessageSent(true);
        }
    }, [isOpen, initialMessageSent]);

    const sendInitialReport = async () => {
        setLoading(true);
        
        try {
            // Gerar hash do relatório para validação de cache
            const reportHash = generateReportHash(report);
            
            // Verificar cache
            const cachedContent = getCachedInsights(report.id, reportHash);
            if (cachedContent) {
                // Usar insights em cache
                const userMessage: Message = {
                    id: `msg-${Date.now()}`,
                    role: 'user',
                    content: `Analisando relatório do anúncio: ${report.campaignName}`,
                    timestamp: new Date(),
                };
                
                const assistantMessage: Message = {
                    id: `msg-${Date.now() + 1}`,
                    role: 'assistant',
                    content: cachedContent,
                    timestamp: new Date(),
                };
                
                setMessages([userMessage, assistantMessage]);
                setLoading(false);
                return;
            }
            
            // Cache miss - Adicionar mensagem do usuário
            const userMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'user',
                content: `Analisando relatório do anúncio: ${report.campaignName}`,
                timestamp: new Date(),
            };
            setMessages([userMessage]);

            // Debug: log detalhado
            console.log('=== REPORT DEBUG ===');
            console.log('Full Report:', report);
            console.log('Report Keys:', Object.keys(report));
            console.log('reportText value:', report.reportText);
            console.log('reportText type:', typeof report.reportText);
            console.log('reportText length:', report.reportText?.length);

            // Enviar relatório para o webhook
            const response = await fetch(INSIGHTS_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(report),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar relatório');
            }

            const data = await response.json();
            const responseText = extractResponseText(data);
            
            // Salvar insights em cache
            saveCachedInsights(report.id, responseText, reportHash);
            
            // Adicionar resposta do assistente
            const assistantMessage: Message = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: responseText,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erro ao enviar relatório:', error);
            const errorMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao processar seu relatório. Por favor, tente novamente.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!input.trim() || loading) return;

        // Adicionar mensagem do usuário
        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Enviar apenas a pergunta para o webhook (sem o relatório completo)
            const response = await fetch(INSIGHTS_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportText: input,
                    campaignName: report.campaignName,
                    conversationHistory: messages,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem');
            }

            const data = await response.json();
            const responseText = extractResponseText(data) || 'Não foi possível processar a resposta.';
            
            // Adicionar resposta do assistente
            const assistantMessage: Message = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: responseText,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            const errorMessage: Message = {
                id: `msg-${Date.now()}`,
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col bg-background border border-border/50">
                <DialogHeader className="border-b border-border/50">
                    <DialogTitle className="text-xl font-bold">
                        Análise de Insights - {report.campaignName}
                    </DialogTitle>
                </DialogHeader>

                {/* Messages Area */}
                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 p-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                    <p>Processando seu relatório...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-xl px-4 py-2 rounded-lg ${
                                                message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-secondary-foreground'
                                            }`}
                                        >
                                            {message.role === 'user' ? (
                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                    {message.content}
                                                </p>
                                            ) : (
                                                <MarkdownText text={message.content} />
                                            )}
                                            <span className="text-xs opacity-70 mt-1 block">
                                                {message.timestamp.toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-xl px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <p className="text-sm">Gerando resposta...</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border/50 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            placeholder="Faça uma pergunta sobre os insights..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-1 bg-background/50 border-border/50"
                        />
                        <Button
                            type="submit"
                            disabled={loading || !input.trim()}
                            size="sm"
                            className="gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
