// src/components/MaterialCreador.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Loader2, Save, Type, Rss, DollarSign, BarChart, HardHat, FileText } from 'lucide-react';

// Ajusta las rutas y acciones según tu proyecto
import { createRow } from '../store/actions/actions';
// import { createMaterial } from "../actions/actions"; // Descomenta si tienes una acción específica

// --- Componentes Internos del Formulario (para un layout limpio) ---

/**
 * Un componente genérico para inputs de texto, número o url.
 */
const FormInput = ({ label, name, type = 'text', placeholder, value, onChange, disabled, icon: Icon }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1.5 text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        step={type === 'number' ? '0.01' : undefined} // Para decimales en precios/medidas
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${Icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

/**
 * Un componente genérico para textareas.
 */
const FormTextarea = ({ label, name, placeholder, value, onChange, disabled, rows = 3 }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-1.5 text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
    />
  </div>
);

// --- Componente Principal: MaterialCreador ---

const MaterialCreador = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  // Estado inicial basado en las columnas del CSV y campos lógicos
  const initialState = {
    // Identificación
    categoria: '',
    tipo: '',
    // nombre: '', // El CSV no tiene 'nombre', usa 'categoria' y 'tipo'. Puedes añadir 'nombre' si es necesario.
    
    // Dimensiones Físicas
    alto_mm: null,
    ancho_mm: null,
    espesor_mm: null,
    largo_m: null,
    
    // Especificaciones
    acabado: '',
    grado: '',
    unidad: '', // ej: 'und', 'kg', 'm' (campo del form anterior, aún útil)
    stock: null,  // (campo del form anterior, aún útil)
    
    // Costos y Proveedor
    precio_COP: null,
    proveedor: '',
    
    // Información Adicional
    uso_recomendado: '',
    observaciones_tecnicas: '',
    notas: '', // (campo del form anterior)
    foto_url: '' // 'imagen_url' en el form anterior, 'foto_url' en el CSV
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    let finalValue = value;
    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
      if (isNaN(finalValue)) {
        finalValue = null;
      }
    }
      
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoria || !formData.tipo) {
      setError('Los campos "Categoría" y "Tipo" son obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepara los datos a enviar, asegurando que los números sean números
      const dataToSubmit = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          // Si el estado inicial para esta clave era un número, asegura que sea un número o null
          if (typeof initialState[key] === 'number') {
            return [key, Number(value) || null];
          }
          return [key, value];
        })
      );
      
      // Limpia los valores null que no quieras enviar (opcional)
      // const cleanData = Object.fromEntries(
      //   Object.entries(dataToSubmit).filter(([_, v]) => v !== null)
      // );
      
      console.log("Enviando material:", dataToSubmit);

      // Intenta usar createMaterial si existe, si no, usa createRow
      let action;
      // if (typeof createMaterial === 'function') {
      //   action = dispatch(createMaterial(dataToSubmit));
      // } else {
      //   action = dispatch(createRow('Materiales', dataToSubmit));
      // }
      
      // Simplificado a la acción que sabemos que existe
      action = dispatch(createRow('Materiales', dataToSubmit));
      
      await action;

      // Éxito
      setLoading(false);
      setFormData(initialState); // Limpiar formulario
      onSuccess(); // Llama a la función onSuccess (que refrescará los datos y cerrará el modal)

    } catch (err) {
      console.error("Error al crear el material:", err);
      setError(err.message || 'No se pudo crear el material.');
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={onClose} // Cierra al hacer clic en el fondo
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col"
        onMouseDown={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Crear Nuevo Material</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario (Cuerpo del Modal) */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {error && (
              <div className="p-3 text-red-700 bg-red-100 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Sección 1: Identificación */}
            <fieldset className="border rounded-lg p-4 pt-2">
              <legend className="text-lg font-medium text-blue-600 px-2 flex items-center gap-2">
                <Type className="w-5 h-5" /> Identificación
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormInput 
                  label="Categoría (Obligatorio)" 
                  name="categoria" 
                  placeholder="Ej: Tubo Rectangular, Perfil C"
                  value={formData.categoria}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <FormInput 
                  label="Tipo (Obligatorio)" 
                  name="tipo" 
                  placeholder="Ej: Rectangular, estructural"
                  value={formData.tipo}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </fieldset>

            {/* Sección 2: Dimensiones */}
            <fieldset className="border rounded-lg p-4 pt-2">
              <legend className="text-lg font-medium text-blue-600 px-2 flex items-center gap-2">
                <BarChart className="w-5 h-5" /> Dimensiones Físicas
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <FormInput 
                  label="Alto (mm)" 
                  name="alto_mm" 
                  type="number"
                  placeholder="Ej: 120"
                  value={formData.alto_mm}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="Ancho (mm)" 
                  name="ancho_mm" 
                  type="number"
                  placeholder="Ej: 60"
                  value={formData.ancho_mm}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="Espesor (mm)" 
                  name="espesor_mm" 
                  type="number"
                  placeholder="Ej: 2"
                  value={formData.espesor_mm}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="Largo (m)" 
                  name="largo_m" 
                  type="number"
                  placeholder="Ej: 6"
                  value={formData.largo_m}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </fieldset>

            {/* Sección 3: Especificaciones y Stock */}
            <fieldset className="border rounded-lg p-4 pt-2">
              <legend className="text-lg font-medium text-blue-600 px-2 flex items-center gap-2">
                <HardHat className="w-5 h-5" /> Especificaciones y Stock
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <FormInput 
                  label="Acabado" 
                  name="acabado" 
                  placeholder="Ej: Estructural HR50, Negro"
                  value={formData.acabado}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="Grado" 
                  name="grado" 
                  placeholder="Ej: GR50"
                  value={formData.grado}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="Unidad de medida" 
                  name="unidad" 
                  placeholder="Ej: und, m, m2, kg"
                  value={formData.unidad}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="Stock" 
                  name="stock" 
                  type="number"
                  placeholder="Ej: 100"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </fieldset>

            {/* Sección 4: Costos y Suministro */}
            <fieldset className="border rounded-lg p-4 pt-2">
              <legend className="text-lg font-medium text-blue-600 px-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Costos y Suministro
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <FormInput 
                  label="Precio (COP)" 
                  name="precio_COP" 
                  type="number"
                  placeholder="Ej: 209900"
                  value={formData.precio_COP}
                  onChange={handleChange}
                  disabled={loading}
                  icon={DollarSign}
                />
                <FormInput 
                  label="Proveedor" 
                  name="proveedor" 
                  placeholder="Ej: Homecenter / Multimarca"
                  value={formData.proveedor}
                  onChange={handleChange}
                  disabled={loading}
                  icon={Rss}
                />
              </div>
            </fieldset>
            
            {/* Sección 5: Información Adicional */}
            <fieldset className="border rounded-lg p-4 pt-2">
              <legend className="text-lg font-medium text-blue-600 px-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Información Adicional
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <FormTextarea
                  label="Uso Recomendado"
                  name="uso_recomendado"
                  placeholder="Describir usos comunes..."
                  value={formData.uso_recomendado}
                  onChange={handleChange}
                  disabled={loading}
                />
                 <FormTextarea
                  label="Observaciones Técnicas"
                  name="observaciones_tecnicas"
                  placeholder="Detalles técnicos, normas, etc..."
                  value={formData.observaciones_tecnicas}
                  onChange={handleChange}
                  disabled={loading}
                />
                 <FormTextarea
                  label="Notas Generales"
                  name="notas"
                  placeholder="Cualquier otra nota relevante..."
                  value={formData.notas}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FormInput 
                  label="URL de Foto" 
                  name="foto_url" 
                  type="url"
                  placeholder="https://ejemplo.com/imagen.png"
                  value={formData.foto_url}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </fieldset>

          </div>

          {/* Footer del Modal (Acciones) */}
          <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.categoria || !formData.tipo} // Deshabilita si faltan campos obligatorios
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Material
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialCreador;