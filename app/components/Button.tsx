interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'font-bold transition-all duration-100 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-red-500 via-red-400 to-red-500 text-white rounded-xl shadow-[0_6px_0_#991b1b,0_10px_20px_rgba(220,38,38,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#991b1b,0_14px_25px_rgba(220,38,38,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#991b1b,0_4px_10px_rgba(220,38,38,0.4)] before:content-[""] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-shimmer',
    secondary: 'bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 text-gray-800 rounded-full shadow-[0_4px_0_#9ca3af,0_6px_12px_rgba(156,163,175,0.4)] hover:scale-110 active:scale-95'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}