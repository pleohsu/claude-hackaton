import React from 'react';

interface InputCardProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

export default function InputCard({
  label,
  children,
  error,
  required = false,
}: InputCardProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function TextInput({ error, className = '', ...props }: TextInputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-ocean-500 focus:border-ocean-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ error, options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-ocean-500 focus:border-ocean-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${className}`}
      {...props}
    >
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-ocean-500 focus:border-ocean-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${className}`}
      rows={4}
      {...props}
    />
  );
}
