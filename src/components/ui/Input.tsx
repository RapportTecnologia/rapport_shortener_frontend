import React from 'react';

/**
 * Componente Input - Campo de entrada com estilo moderno
 * @param label - Rótulo do campo
 * @param error - Mensagem de erro (opcional)
 * @param icon - Ícone a ser exibido (opcional)
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent 
            outline-none transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${props.readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
