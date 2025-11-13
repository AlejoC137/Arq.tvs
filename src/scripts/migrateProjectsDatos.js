/**
 * Script de Migración: Inicializar campo Datos en Proyectos
 * 
 * Este script inicializa el campo Datos para todos los proyectos existentes
 * con la estructura base requerida.
 * 
 * Cómo ejecutar:
 * 1. Abrir la consola del navegador en la aplicación
 * 2. Copiar y pegar este código
 * 3. Llamar a: await migrateProjectsDatos()
 */

import supabase from '../config/supabaseClient.js';
import { DATOS_PROYECTO_INICIAL, stringifyDatosProyecto } from '../constants/datosProyecto.js';

/**
 * Migra todos los proyectos existentes para agregar el campo Datos
 */
export const migrateProjectsDatos = async () => {
  console.log('🚀 Iniciando migración de campo Datos en Proyectos...');
  
  try {
    // 1. Obtener todos los proyectos
    const { data: projects, error: fetchError } = await supabase
      .from('Proyectos')
      .select('id, name, Datos');
    
    if (fetchError) {
      throw new Error(`Error al obtener proyectos: ${fetchError.message}`);
    }
    
    console.log(`📦 Encontrados ${projects.length} proyectos`);
    
    // 2. Filtrar proyectos que necesitan migración
    const projectsToMigrate = projects.filter(p => !p.Datos || p.Datos === '');
    
    console.log(`🔄 Proyectos a migrar: ${projectsToMigrate.length}`);
    
    if (projectsToMigrate.length === 0) {
      console.log('✅ No hay proyectos que migrar. Todos ya tienen el campo Datos.');
      return { success: true, migrated: 0, total: projects.length };
    }
    
    // 3. Migrar cada proyecto
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const project of projectsToMigrate) {
      try {
        const datosString = stringifyDatosProyecto(DATOS_PROYECTO_INICIAL);
        
        const { error: updateError } = await supabase
          .from('Proyectos')
          .update({ Datos: datosString })
          .eq('id', project.id);
        
        if (updateError) {
          throw updateError;
        }
        
        successCount++;
        console.log(`✅ Migrado: ${project.name} (${project.id})`);
      } catch (err) {
        errorCount++;
        errors.push({ project: project.name, error: err.message });
        console.error(`❌ Error migrando ${project.name}:`, err);
      }
    }
    
    // 4. Resumen
    console.log('\n📊 Resumen de Migración:');
    console.log(`  ✅ Exitosos: ${successCount}`);
    console.log(`  ❌ Errores: ${errorCount}`);
    console.log(`  📦 Total: ${projects.length}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️ Errores encontrados:');
      errors.forEach(err => {
        console.log(`  - ${err.project}: ${err.error}`);
      });
    }
    
    return {
      success: errorCount === 0,
      migrated: successCount,
      errors: errorCount,
      total: projects.length,
      errorDetails: errors
    };
    
  } catch (err) {
    console.error('💥 Error fatal en migración:', err);
    throw err;
  }
};

/**
 * Verifica el estado de migración de los proyectos
 */
export const checkMigrationStatus = async () => {
  console.log('🔍 Verificando estado de migración...');
  
  try {
    const { data: projects, error } = await supabase
      .from('Proyectos')
      .select('id, name, Datos');
    
    if (error) throw error;
    
    const withDatos = projects.filter(p => p.Datos && p.Datos !== '');
    const withoutDatos = projects.filter(p => !p.Datos || p.Datos === '');
    
    console.log('\n📊 Estado de Migración:');
    console.log(`  ✅ Con Datos: ${withDatos.length}`);
    console.log(`  ❌ Sin Datos: ${withoutDatos.length}`);
    console.log(`  📦 Total: ${projects.length}`);
    
    if (withoutDatos.length > 0) {
      console.log('\n⚠️ Proyectos sin Datos:');
      withoutDatos.forEach(p => console.log(`  - ${p.name} (${p.id})`));
    }
    
    return {
      total: projects.length,
      withDatos: withDatos.length,
      withoutDatos: withoutDatos.length,
      projects: {
        withDatos: withDatos.map(p => ({ id: p.id, name: p.name })),
        withoutDatos: withoutDatos.map(p => ({ id: p.id, name: p.name }))
      }
    };
    
  } catch (err) {
    console.error('💥 Error verificando estado:', err);
    throw err;
  }
};

/**
 * Migra un proyecto específico por ID
 */
export const migrateProjectById = async (projectId) => {
  console.log(`🔄 Migrando proyecto ${projectId}...`);
  
  try {
    const datosString = stringifyDatosProyecto(DATOS_PROYECTO_INICIAL);
    
    const { data, error } = await supabase
      .from('Proyectos')
      .update({ Datos: datosString })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log(`✅ Proyecto migrado: ${data.name}`);
    return { success: true, project: data };
    
  } catch (err) {
    console.error(`❌ Error migrando proyecto:`, err);
    throw err;
  }
};

// Si se ejecuta como módulo, exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.migrateProjectsDatos = migrateProjectsDatos;
  window.checkMigrationStatus = checkMigrationStatus;
  window.migrateProjectById = migrateProjectById;
}

export default {
  migrateProjectsDatos,
  checkMigrationStatus,
  migrateProjectById
};
