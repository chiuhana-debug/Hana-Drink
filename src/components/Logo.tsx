import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'dark' 
}) => {
  const textColor = variant === 'light' ? '#fcf9f8' : '#322214';
  const redDotColor = '#cc2b2b';

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-11 text-base',
    lg: 'h-16 text-xl',
    xl: 'h-24 text-3xl',
  }[size];

  return (
    <div id="hana-drink-brand-logo" className={`inline-flex flex-col items-center justify-center select-none font-bold tracking-wider leading-none transition-transform duration-300 hover:scale-[1.02] ${sizeClasses} ${className}`}>
      <svg 
        viewBox="0 0 240 160" 
        className="w-auto h-full fill-current"
        style={{ color: textColor }}
        aria-label="HANA DRINK"
      >
        {/* HANA Top Row */}
        <g fill={textColor} stroke={textColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* H */}
          <path d="M 22 25 L 22 75 M 22 50 L 52 50 M 52 25 L 52 75" strokeWidth="12" fill="none" />
          
          {/* A */}
          <path d="M 72 75 L 72 45 C 72 26 102 26 102 45 L 102 75 M 72 56 L 102 56" strokeWidth="12" fill="none" />

          {/* N */}
          <path d="M 122 75 L 122 45 C 122 28 152 28 152 45 L 152 75" strokeWidth="12" fill="none" />

          {/* A */}
          <path d="M 172 75 L 172 45 C 172 26 202 26 202 45 L 202 75 M 172 56 L 202 56" strokeWidth="12" fill="none" />
        </g>

        {/* DRINK Bottom Row */}
        <g stroke={textColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* D */}
          <path d="M 22 100 L 22 145 M 22 100 C 58 100 58 145 22 145" />

          {/* R */}
          <path d="M 68 145 L 68 100 C 96 100 96 122 68 122 M 78 122 L 96 145" />

          {/* i stem */}
          <path d="M 116 114 L 116 145" />

          {/* N */}
          <path d="M 142 145 L 142 115 C 142 100 170 100 170 115 L 170 145" />

          {/* K */}
          <path d="M 194 100 L 194 145 M 216 102 L 194 124 L 216 145" />
        </g>

        {/* Red Dot on i */}
        <circle cx="116" cy="94" r="8" fill={redDotColor} stroke="none" />
      </svg>
    </div>
  );
};
