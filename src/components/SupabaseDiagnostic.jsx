import React, { useState } from 'react';
import supabase from '../config/supabaseClient.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Badge } from './ui/Badge.jsx';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Shield, Key } from 'lucide-react';

const SupabaseDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostic = async () => {
    setIsLoading(true);
    const results = [];

    // 1. Test basic connection
    try {
      const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
      if (error) {
        results.push({
          test: 'Conexión básica',
          status: 'error',
          message: `Error: ${error.message}`,
          details: `Código: ${error.code || 'N/A'}`,
          icon: XCircle
        });
      } else {
        results.push({
          test: 'Conexión básica',
          status: 'success',
          message: 'Conexión establecida correctamente',
          details: `Respuesta recibida`,
          icon: CheckCircle
        });
      }
    } catch (err) {
      results.push({
        test: 'Conexión básica',
        status: 'error',
        message: `Error de red: ${err.message}`,
        details: 'Verificar URL y credenciales',
        icon: XCircle
      });
    }

    // 2. Test table access - projects
    try {
      const { data, error } = await supabase.from('projects').select('id').limit(1);
      if (error) {
        results.push({
          test: 'Acceso tabla projects',
          status: 'error',
          message: `Error: ${error.message}`,
          details: error.code === 'PGRST116' ? 'Tabla no existe' : `Código: ${error.code}`,
          icon: XCircle
        });
      } else {
        results.push({
          test: 'Acceso tabla projects',
          status: 'success',
          message: 'Acceso correcto a tabla projects',
          details: `${data.length} registros encontrados`,
          icon: CheckCircle
        });
      }
    } catch (err) {
      results.push({
        test: 'Acceso tabla projects',
        status: 'error',
        message: `Error: ${err.message}`,
        details: 'Problema de acceso a tabla',
        icon: XCircle
      });
    }

    // 3. Test table access - tasks
    try {
      const { data, error } = await supabase.from('tasks').select('id').limit(1);
      if (error) {
        results.push({
          test: 'Acceso tabla tasks',
          status: 'error',
          message: `Error: ${error.message}`,
          details: error.code === 'PGRST116' ? 'Tabla no existe' : `Código: ${error.code}`,
          icon: XCircle
        });
      } else {
        results.push({
          test: 'Acceso tabla tasks',
          status: 'success',
          message: 'Acceso correcto a tabla tasks',
          details: `${data.length} registros encontrados`,
          icon: CheckCircle
        });
      }
    } catch (err) {
      results.push({
        test: 'Acceso tabla tasks',
        status: 'error',
        message: `Error: ${err.message}`,
        details: 'Problema de acceso a tabla',
        icon: XCircle
      });
    }

    // 4. Test RLS status
    try {
      const { data, error } = await supabase.rpc('check_rls_status');
      if (error && error.code !== '42883') { // Function does not exist is OK
        results.push({
          test: 'Estado RLS',
          status: 'warning',
          message: 'No se puede verificar RLS automáticamente',
          details: 'Verificar manualmente en Supabase Dashboard',
          icon: Shield
        });
      } else {
        results.push({
          test: 'Estado RLS',
          status: 'info',
          message: 'RLS necesita verificación manual',
          details: 'Revisar políticas en Dashboard',
          icon: Shield
        });
      }
    } catch (err) {
      results.push({
        test: 'Estado RLS',
        status: 'warning',
        message: 'Verificación RLS no disponible',
        details: 'Revisar políticas manualmente',
        icon: Shield
      });
    }

    // 5. Test authentication
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      results.push({
        test: 'Estado de autenticación',
        status: user ? 'success' : 'info',
        message: user ? `Usuario autenticado: ${user.email}` : 'Usuario anónimo (usando ANON_KEY)',
        details: user ? `ID: ${user.id}` : 'Conexión con clave pública',
        icon: Key
      });
    } catch (err) {
      results.push({
        test: 'Estado de autenticación',
        status: 'error',
        message: `Error de autenticación: ${err.message}`,
        details: 'Verificar configuración de auth',
        icon: Key
      });
    }

    setDiagnostics(results);
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success': return <Badge variant="success">OK</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'warning': return <Badge variant="warning">Advertencia</Badge>;
      case 'info': return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="secondary">N/A</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          Diagnóstico de Conexión Supabase
        </CardTitle>
        <CardDescription>
          Diagnóstico detallado del estado de conexión y acceso a la base de datos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium">URL: {import.meta.env.VITE_SUPABASE_URL}</p>
            <p className="text-sm text-muted-foreground">
              Clave: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}
            </p>
          </div>
          
          <Button
            onClick={runDiagnostic}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Ejecutar Diagnóstico
              </>
            )}
          </Button>
        </div>

        {diagnostics.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resultados del Diagnóstico:</h3>
            
            {diagnostics.map((result, index) => {
              const IconComponent = result.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <IconComponent className={`h-5 w-5 mt-0.5 ${getStatusColor(result.status)}`} />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{result.test}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.message}
                    </p>
                    
                    {result.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {diagnostics.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Soluciones Comunes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Error 404:</strong> Verificar que las tablas existen y tienen el nombre correcto</li>
              <li>• <strong>Error 403:</strong> Configurar políticas RLS o deshabilitar RLS temporalmente</li>
              <li>• <strong>Error de conexión:</strong> Verificar URL y clave anónima en .env</li>
              <li>• <strong>Sin datos:</strong> Insertar datos de prueba en las tablas</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseDiagnostic;
