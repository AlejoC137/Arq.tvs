import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Label } from './ui/Label.jsx';
import { Select } from './ui/Select.jsx';
import { Textarea } from './ui/Textarea.jsx';

const CrudForm = ({ 
  fields = [], 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = "Guardar",
  cancelText = "Cancelar"
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
      
      if (field.validate) {
        const error = field.validate(formData[field.name], formData);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleChange(field.name, e.target.value),
      placeholder: field.placeholder,
      disabled: loading || field.disabled,
      className: errors[field.name] ? 'border-destructive' : ''
    };

    switch (field.type) {
      case 'select':
        return (
          <Select {...commonProps}>
            {field.placeholder && (
              <option value="">{field.placeholder}</option>
            )}
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
        
      case 'textarea':
        return (
          <Textarea 
            {...commonProps} 
            rows={field.rows || 3}
          />
        );
        
      case 'number':
        return (
          <Input 
            {...commonProps} 
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );
        
      case 'email':
        return <Input {...commonProps} type="email" />;
        
      case 'password':
        return <Input {...commonProps} type="password" />;
        
      case 'date':
        return <Input {...commonProps} type="date" />;
        
      case 'datetime-local':
        return <Input {...commonProps} type="datetime-local" />;
        
      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {fields.map(field => (
          <div key={field.name} className={field.className || ''}>
            <Label htmlFor={field.name} className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {renderField(field)}
            
            {errors[field.name] && (
              <p className="text-sm text-destructive mt-1">
                {errors[field.name]}
              </p>
            )}
            
            {field.help && !errors[field.name] && (
              <p className="text-sm text-muted-foreground mt-1">
                {field.help}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : submitText}
        </Button>
      </div>
    </form>
  );
};

export { CrudForm };
