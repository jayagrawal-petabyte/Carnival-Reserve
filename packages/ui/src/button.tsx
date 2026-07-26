import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'pink' | 'cyan' | 'lime' | 'purple' | 'orange' | 'black' | 'white';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  children: React.ReactNode;
}

export const NeoButton: React.FC<ButtonProps> = ({
  variant = 'yellow',
  size = 'md',
  pill = false,
  children,
  className = '',
  ...props
}) => {
  const roundedClass = pill ? 'rounded-full' : 'rounded-xl';

  const baseStyle =
    `font-black uppercase tracking-wider transition-all duration-150 border-3 border-black flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer ${roundedClass}`;

  const variants = {
    yellow: 'bg-[#FFE600] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF066]',
    pink: 'bg-[#FF007A] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF3395]',
    cyan: 'bg-[#00E5FF] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#33ECFF]',
    lime: 'bg-[#70FF00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#8CFF33]',
    purple: 'bg-[#C084FC] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#D8B4FE]',
    orange: 'bg-[#FF6B35] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF8559]',
    black: 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,230,0,1)] hover:bg-slate-900',
    white: 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
