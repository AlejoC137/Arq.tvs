// ARCHIVO: src/components/CrudForm.jsx

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

const CrudForm = ({ initialData, fields, onSubmit }) => {
  // Inicializa el estado con los datos iniciales o un objeto vacío si es nulo (para 'Crear')
  const [formData, setFormData] = useState(initialData || {});

  // Sincroniza el estado si el `initialData` cambia (al editar otro ítem)
  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const { name, label, type = 'text', placeholder, required, options } = field;
    // Asegura que el valor sea siempre un string para evitar errores con inputs no controlados
    const value = formData[name] || '';

    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder || `Escribe ${label.toLowerCase()}...`}
            required={required}
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="3"
          />
        );
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Seleccionar --</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default: // 'text', 'number', 'email', etc.
        return (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder || `Ingresa ${label.toLowerCase()}`}
            required={required}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default CrudForm;