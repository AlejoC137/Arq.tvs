import React, { useState } from 'react';
import { Play, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { migrateProjectsDatos, checkMigrationStatus } from '../scripts/migrateProjectsDatos';

/**
 * Componente para ejecutar la migración del campo Datos en Proyectos
 * Este es un componente temporal que se puede acceder para inicializar la BD
 */
const MigracionDatosProyectos = () => {
  const [status, setStatus] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  const handleCheckStatus = async () => {
    setIsRunning(true);
    try {
      const result = await checkMigrationStatus();
      setStatus(result);
    } catch (error) {
      console.error('Error al verificar estado:', error);
      alert('Error al verificar estado. Ver consola para detalles.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleMigrate = async () => {
    if (!window.confirm('¿Estás seguro de ejecutar la migración? Esto inicializará el campo Datos en todos los proyectos que no lo tengan.')) {
      return;
    }

    setIsRunning(true);
    setMigrationResult(null);

    try {
      const result = await migrateProjectsDatos();
      setMigrationResult(result);
      
      // Actualizar el estado después de la migración
      const newStatus = await checkMigrationStatus();
      setStatus(newStatus);
    } catch (error) {
      console.error('Error en migración:', error);
      alert('Error en la migración. Ver consola para detalles.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Migración de Campo Datos en Proyectos
        </h1>
        
        <p className="text-gray-600 mb-6">
          Esta herramienta inicializa el campo <code className="bg-gray-100 px-2 py-1 rounded">Datos</code> en 
          todos los proyectos existentes con la estructura base requerida para almacenar materiales constantes, 
          etapa y presentaciones.
        </p>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleCheckStatus}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
            Verificar Estado
          </button>

          <button
            onClick={handleMigrate}
            disabled={isRunning || (status && status.withoutDatos === 0)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-5 h-5" />
            Ejecutar Migración
          </button>
        </div>

        {/* Estado actual */}
        {status && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Estado Actual
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total de Proyectos</div>
                <div className="text-2xl font-bold text-gray-800">{status.total}</div>
              </div>
              <div>
                <div className="text-gray-600">Con Datos</div>
                <div className="text-2xl font-bold text-green-600">{status.withDatos}</div>
              </div>
              <div>
                <div className="text-gray-600">Sin Datos</div>
                <div className="text-2xl font-bold text-orange-600">{status.withoutDatos}</div>
              </div>
            </div>

            {status.projects.withoutDatos.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Proyectos sin Datos:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {status.projects.withoutDatos.map(p => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Resultado de migración */}
        {migrationResult && (
          <div className={`p-4 border rounded-md ${
            migrationResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
              migrationResult.success ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {migrationResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Migración Completada
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Migración Completada con Errores
                </>
              )}
            </h3>
            
            <div className="text-sm space-y-1">
              <div>✅ Proyectos migrados exitosamente: <strong>{migrationResult.migrated}</strong></div>
              <div>❌ Proyectos con errores: <strong>{migrationResult.errors}</strong></div>
              <div>📦 Total de proyectos: <strong>{migrationResult.total}</strong></div>
            </div>

            {migrationResult.errorDetails && migrationResult.errorDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-700 mb-2">Errores Encontrados:</h4>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {migrationResult.errorDetails.map((err, idx) => (
                    <li key={idx}>{err.project}: {err.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">ℹ️ Información</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• La migración es segura: solo actualiza proyectos que no tienen el campo Datos</li>
            <li>• Estructura inicial: tareas=[], materialesConstantes=[], etapa="Planificación", presentacionesEspacio=[]</li>
            <li>• Puedes ejecutar la migración múltiples veces sin problemas</li>
            <li>• Los logs detallados están disponibles en la consola del navegador</li>
          </ul>
        </div>

        {/* SQL manual (por si necesitan crear la columna) */}
        <details className="mt-6">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
            📋 SQL para crear la columna Datos (si no existe)
          </summary>
          <div className="mt-2 p-4 bg-gray-900 rounded-md">
            <code className="text-sm text-green-400">
              ALTER TABLE "Proyectos" ADD COLUMN IF NOT EXISTS "Datos" TEXT;
            </code>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Ejecuta este comando en el editor SQL de Supabase si la columna no existe.
          </p>
        </details>
      </div>
    </div>
  );
};

export default MigracionDatosProyectos;
