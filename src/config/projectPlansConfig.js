// ARCHIVO: src/config/projectPlansConfig.js

import P1Casa2 from '../components/casas/Casa2/p1';
import P2Casa2 from '../components/casas/Casa2/p2';
import S1Casa2 from '../components/casas/Casa2/s1';
import T1Casa2 from '../components/casas/Casa2/t1';

import P1Casa1 from '../components/casas/Casa1/p1';
import P2Casa1 from '../components/casas/Casa1/p2';

import P1Casa4 from '../components/casas/Casa4/p1';
import P2Casa4 from '../components/casas/Casa4/p2';
import S1Casa4 from '../components/casas/Casa4/s1';

/**
 * Configuración de planos por proyecto
 * Cada entrada define qué planos están disponibles para un proyecto específico
 */
export const PROJECT_PLANS_CONFIG = {
  // Casa 2 - Configuración completa con 4 planos
  'casa2': {
    title: 'Casa 2',
    defaultPlan: 'p2',
    plans: [
      {
        id: 'p1',
        label: 'Planta P1',
        component: P1Casa2
      },
      {
        id: 'p2',
        label: 'Planta P2',
        component: P2Casa2
      },
      {
        id: 's1',
        label: 'Sección S1',
        component: S1Casa2
      },
      {
        id: 't1',
        label: 'Técnico T1',
        component: T1Casa2
      }
    ]
  },
  
  // Casa 1 - Configuración con 2 planos
  'casa1': {
    title: 'Casa 1',
    defaultPlan: 'p1',
    plans: [
      {
        id: 'p1',
        label: 'Planta P1',
        component: P1Casa1
      },
      {
        id: 'p2',
        label: 'Planta P2',
        component: P2Casa1
      }
    ]
  },

  // Casa 4 - Configuración con 3 planos
  'casa4': {
    title: 'Casa 4',
    defaultPlan: 'p1',
    plans: [
      {
        id: 'p1',
        label: 'Planta P1',
        component: P1Casa4
      },
      {
        id: 'p2',
        label: 'Planta P2',
        component: P2Casa4
      },
      {
        id: 's1',
        label: 'Sótano S1',
        component: S1Casa4
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
