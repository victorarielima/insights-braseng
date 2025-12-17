import { Play, Image as ImageIcon } from 'lucide-react';

interface MediaPlayerCardProps {
    mediaUrl: string;
    isImage?: boolean;
}

export function MediaPlayerCard({ mediaUrl, isImage = false }: MediaPlayerCardProps) {
    return (
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                    {isImage ? (
                        <ImageIcon className="w-5 h-5 text-primary" />
                    ) : (
                        <Play className="w-5 h-5 text-primary" />
                    )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    {isImage ? 'Imagem do Anúncio' : 'Vídeo do Anúncio'}
                </h3>
            </div>

            <div className={`relative mx-auto rounded-xl overflow-hidden bg-background/50 border border-border/50 ${isImage ? 'max-w-full' : 'max-w-[300px]'}`}>
                {isImage ? (
                    <img
                        src={mediaUrl}
                        alt="Imagem do anúncio"
                        className="w-full h-auto object-contain"
                    />
                ) : (
                    <video
                        src={mediaUrl}
                        controls
                        className="w-full aspect-[9/16] object-cover"
                        preload="metadata"
                    >
                        Seu navegador não suporta reprodução de vídeo.
                    </video>
                )}
            </div>
        </div>
    );
}
