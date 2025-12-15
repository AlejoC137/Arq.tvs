import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAgenda, updateAgenda } from '../store/actions/actions';
import { X, Calendar, Clock, UtensilsCrossed, Table2, Volume2, FileText } from 'lucide-react';

const AgendaForm = ({ isOpen, onClose, onSuccess, editingEvent = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    nombre_contacto: '',
    telefono_contacto: '',
    email_contacto: '',
    num_personas: '',
    servicios: {
      alimentos: {
        activo: false,
        descripcion: ''
      },
      mesas: {
        activo: false,
        descripcion: ''
      },
      audioVisual: {
        activo: false,
        descripcion: ''
      },
      otros: {
        activo: false,
        descripcion: ''
      }
    }
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        titulo: editingEvent.titulo || '',
        descripcion: editingEvent.descripcion || '',
        fecha: editingEvent.fecha || '',
        hora_inicio: editingEvent.hora_inicio || '',
        hora_fin: editingEvent.hora_fin || '',
        nombre_contacto: editingEvent.nombre_contacto || '',
        telefono_contacto: editingEvent.telefono_contacto || '',
        email_contacto: editingEvent.email_contacto || '',
        num_personas: editingEvent.num_personas || '',
        servicios: editingEvent.servicios || {
          alimentos: { activo: false, descripcion: '' },
          mesas: { activo: false, descripcion: '' },
          audioVisual: { activo: false, descripcion: '' },
          otros: { activo: false, descripcion: '' }
        }
      });
    } else {
      resetForm();
    }
  }, [editingEvent, isOpen]);

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      nombre_contacto: '',
      telefono_contacto: '',
      email_contacto: '',
      num_personas: '',
      servicios: {
        alimentos: { activo: false, descripcion: '' },
        mesas: { activo: false, descripcion: '' },
        audioVisual: { activo: false, descripcion: '' },
        otros: { activo: false, descripcion: '' }
      }
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (serviceName) => {
    setFormData(prev => ({
      ...prev,
      servicios: {
        ...prev.servicios,
        [serviceName]: {
          ...prev.servicios[serviceName],
          activo: !prev.servicios[serviceName].activo
        }
      }
    }));
  };

  const handleServiceDescription = (serviceName, descripcion) => {
    setFormData(prev => ({
      ...prev,
      servicios: {
        ...prev.servicios,
        [serviceName]: {
          ...prev.servicios[serviceName],
          descripcion
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.fecha) {
      setError('Por favor complete los campos requeridos (Título y Fecha)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const eventData = {
        ...formData,
        num_personas: formData.num_personas ? parseInt(formData.num_personas) : null,
        servicios: JSON.stringify(formData.servicios)
      };

      if (editingEvent) {
        await dispatch(updateAgenda(editingEvent.id, eventData));
      } else {
        await dispatch(createAgenda(eventData));
      }

      onSuccess();
      resetForm();
    } catch (err) {
      console.error('Error al guardar evento:', err);
      setError('Error al guardar el evento. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información del Evento
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Evento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Reunión de trabajo, Evento corporativo..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detalles adicionales del evento..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin
                </label>
                <input
                  type="time"
                  name="hora_fin"
                  value={formData.hora_fin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Personas
              </label>
              <input
                type="number"
                name="num_personas"
                value={formData.num_personas}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cantidad estimada de asistentes"
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Información de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre_contacto"
                  value={formData.nombre_contacto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Persona de contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono_contacto"
                  value={formData.telefono_contacto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número de contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email_contacto"
                  value={formData.email_contacto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Servicios Solicitados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Servicios Solicitados
            </h3>

            {/* Alimentos */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.servicios.alimentos.activo}
                  onChange={() => handleServiceToggle('alimentos')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <UtensilsCrossed className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Alimentos y Bebidas</span>
              </label>
              {formData.servicios.alimentos.activo && (
                <textarea
                  value={formData.servicios.alimentos.descripcion}
                  onChange={(e) => handleServiceDescription('alimentos', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Ej: Desayuno completo para 20 personas, café, refrigerios..."
                />
              )}
            </div>

            {/* Mesas */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.servicios.mesas.activo}
                  onChange={() => handleServiceToggle('mesas')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Table2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Mesas y Sillas</span>
              </label>
              {formData.servicios.mesas.activo && (
                <textarea
                  value={formData.servicios.mesas.descripcion}
                  onChange={(e) => handleServiceDescription('mesas', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Ej: 5 mesas redondas con 6 sillas cada una, ubicación cerca de ventanas..."
                />
              )}
            </div>

            {/* AudioVisual */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.servicios.audioVisual.activo}
                  onChange={() => handleServiceToggle('audioVisual')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Volume2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Equipo Audiovisual</span>
              </label>
              {formData.servicios.audioVisual.activo && (
                <textarea
                  value={formData.servicios.audioVisual.descripcion}
                  onChange={(e) => handleServiceDescription('audioVisual', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Ej: Proyector, pantalla, micrófono inalámbrico, sistema de sonido..."
                />
              )}
            </div>

            {/* Otros */}
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.servicios.otros.activo}
                  onChange={() => handleServiceToggle('otros')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Otros Servicios</span>
              </label>
              {formData.servicios.otros.activo && (
                <textarea
                  value={formData.servicios.otros.descripcion}
                  onChange={(e) => handleServiceDescription('otros', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Cualquier otro requerimiento especial..."
                />
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Guardando...' : editingEvent ? 'Actualizar' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendaForm;
