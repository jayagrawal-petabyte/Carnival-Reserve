import React from 'react';

interface CardProps {
  title?: string;
  badge?: string;
  badgeColor?: string;
  stacked?: boolean;
  bg?: string;
  children: React.ReactNode;
  className?: string;
}

export const NeoCard: React.FC<CardProps> = ({
  title,
  badge,
  badgeColor = 'bg-[#FFE600]',
  stacked = false,
  bg = 'bg-white',
  children,
  className = '',
}) => {
  return (
    <div className={`relative ${stacked ? 'mb-4' : ''}`}>
      {/* Stacked paper outline offset inspired by image 1 & 3 */}
      {stacked && (
        <>
          <div className="absolute inset-0 bg-black rounded-2xl transform translate-x-2 translate-y-2 pointer-events-none" />
          <div className="absolute inset-0 bg-[#00E5FF] border-3 border-black rounded-2xl transform translate-x-3.5 translate-y-3.5 pointer-events-none" />
        </>
      )}

      <div
        className={`relative border-3 border-black rounded-2xl p-5 ${
          stacked ? 'shadow-none' : 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
        } ${bg} ${className}`}
      >
        {(title || badge) && (
          <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-4">
            {title && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#FF007A] border border-black" />
                <h3 className="font-black text-lg uppercase tracking-tight text-black flex items-center gap-1.5">
                  {title}
                </h3>
              </div>
            )}
            {badge && (
              <span
                className={`text-black border-2 border-black rounded-full px-3 py-0.5 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${badgeColor}`}
              >
                {badge}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
