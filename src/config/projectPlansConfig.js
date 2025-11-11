// ARCHIVO: src/config/projectPlansConfig.js

// Casa 2
import P1C2 from '../components/casas/Casa2/P1C2';
import P2C2 from '../components/casas/Casa2/P2C2';
import S1C2 from '../components/casas/Casa2/S1C2';
import T1C2 from '../components/casas/Casa2/T1C2';


// Casa 4
import P1C4 from '../components/casas/Casa4/P1C4';
import P2C4 from '../components/casas/Casa4/P2C4';
import S1C4 from '../components/casas/Casa4/S1C4';

export const PROJECT_PLANS_CONFIG = {
  // Casa 2 - Configuración completa con 4 planos
  'casa2': {
    title: 'Casa 2',
    defaultPlan: 'p2',
    plans: [
      {
        id: 'p1',
        label: 'Planta P1',
        component: P1C2
      },
      {
        id: 'p2',
        label: 'Planta P2',
        component: P2C2
      },
      {
        id: 's1',
        label: 'Sección S1',
        component: S1C2
      },
      {
        id: 't1',
        label: 'Técnico T1',
        component: T1C2
      }
    ]
  },
  
  // Casa 1 - Configuración con 2 planos


  // Casa 4 - Configuración con 3 planos
  'casa4': {
    title: 'Casa 4',
    defaultPlan: 'p1',
    plans: [
      {
        id: 'p1',
        label: 'Planta P1',
        component: P1C4
      },
      {
        id: 'p2',
        label: 'Planta P2',
        component: P2C4
      },
      {
        id: 's1',
        label: 'Sótano S1',
        component: S1C4
      }
    ]
  },

  // Configuración por defecto (cuando no hay planos específicos)
  'default': {
    title: 'Planos del Proyecto',
    defaultPlan: null,
    plans: []
  }
};

/**
 * Obtiene la configuración de planos para un proyecto
 * @param {Object} project - El objeto proyecto
 * @returns {Object} - Configuración de planos
 */
export const getProjectPlanConfig = (project) => {
  if (!project) return PROJECT_PLANS_CONFIG.default;
  
  // Buscar por nombre del proyecto (convertido a minúsculas y sin espacios)
  const projectKey = project.name?.toLowerCase().replace(/\s+/g, '');
  
  // Si existe configuración específica, devolverla
  if (PROJECT_PLANS_CONFIG[projectKey]) {
    return PROJECT_PLANS_CONFIG[projectKey];
  }
  
  // Si no, devolver configuración por defecto
  return PROJECT_PLANS_CONFIG.default;
};

/**
 * Verifica si un proyecto tiene planos configurados
 * @param {Object} project - El objeto proyecto
 * @returns {boolean} - true si tiene planos
 */
export const hasProjectPlans = (project) => {
  const config = getProjectPlanConfig(project);
  return config.plans.length > 0;
};
