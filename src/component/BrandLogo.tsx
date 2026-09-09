import React from 'react';

interface BrandLogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export default function BrandLogo({ size = 32, showText = false, className = '' }: BrandLogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img 
                src="/icon.svg" 
                alt="Chatich Logo" 
                width={size} 
                height={size} 
                className="select-none object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" 
            />
            {showText && (
                <span className="font-chakra font-bold tracking-wider" style={{ fontSize: size * 0.7, lineHeight: 1 }}>
                    CHATICH
                </span>
            )}
        </div>
    );
}
