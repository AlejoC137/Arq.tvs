// ========================================
// UTILIDADES DE TOAST NOTIFICATIONS
// ========================================

/**
 * Muestra un toast de éxito
 * TODO: Implementar con una librería de toast como react-hot-toast o sonner
 */
export const showSuccessToast = (message) => {
  console.log(`✅ SUCCESS: ${message}`);
  
  // Implementación básica con alert (temporal)
  // En producción, reemplazar con una librería de toast
  if (typeof window !== 'undefined' && window.confirm) {
    // Usar console.log en lugar de alert para mejor UX
    console.log(`🎉 ${message}`);
  }
};

/**
 * Muestra un toast de error
 */
export const showErrorToast = (message) => {
  console.error(`❌ ERROR: ${message}`);
  
  // Implementación básica con alert (temporal)
  if (typeof window !== 'undefined' && window.confirm) {
    console.error(`🚨 ${message}`);
  }
};

/**
 * Muestra un toast informativo
 */
export const showInfoToast = (message) => {
  console.info(`ℹ️ INFO: ${message}`);
  
  if (typeof window !== 'undefined' && window.confirm) {
    console.info(`📢 ${message}`);
  }
};

/**
 * Muestra un toast de advertencia
 */
export const showWarningToast = (message) => {
  console.warn(`⚠️ WARNING: ${message}`);
  
  if (typeof window !== 'undefined' && window.confirm) {
    console.warn(`⚠️ ${message}`);
  }
};

/**
 * Toast genérico
 */
export const showToast = (message, type = 'info') => {
  switch (type) {
    case 'success':
      showSuccessToast(message);
      break;
    case 'error':
      showErrorToast(message);
      break;
    case 'warning':
      showWarningToast(message);
      break;
    case 'info':
    default:
      showInfoToast(message);
      break;
  }
};

// ========================================
// CONFIGURACIÓN DE TOAST (PARA FUTURO USO)
// ========================================

/**
 * Configuración por defecto de los toast
 */
export const TOAST_CONFIG = {
  duration: 3000, // 3 segundos
  position: 'top-right',
  style: {
    fontSize: '14px',
    fontWeight: '500',
  },
  success: {
    duration: 2000,
    icon: '✅',
  },
  error: {
    duration: 4000,
    icon: '❌',
  },
  warning: {
    duration: 3500,
    icon: '⚠️',
  },
  info: {
    duration: 3000,
    icon: 'ℹ️',
  },
};

/**
 * TODO: Implementar con react-hot-toast
 * 
 * Instalación:
 * npm install react-hot-toast
 * 
 * Implementación mejorada:
 * import toast from 'react-hot-toast';
 * 
 * export const showSuccessToast = (message) => {
 *   toast.success(message, TOAST_CONFIG.success);
 * };
 * 
 * export const showErrorToast = (message) => {
 *   toast.error(message, TOAST_CONFIG.error);
 * };
 * 
 * Y así sucesivamente...
 */

export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showToast,
  TOAST_CONFIG
};
