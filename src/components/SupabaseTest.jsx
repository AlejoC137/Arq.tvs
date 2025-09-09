import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient.js';

// Test connection function
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count(*)', { count: 'exact' })
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist"
      throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    return { success: true, data, message: 'Connection successful' };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return {
      success: false,
      error: error?.message || 'An error occurred',
      details: error
    };
  }
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Badge } from './ui/Badge.jsx';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestTime, setLastTestTime] = useState(null);

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    const result = await testConnection();
    setConnectionStatus(result);
    setLastTestTime(new Date().toLocaleTimeString('es-CO'));
    setIsLoading(false);
  };

  useEffect(() => {
    // Test connection on component mount
    testDatabaseConnection();
  }, []);

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    
    if (!connectionStatus) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    
    return connectionStatus.success ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return <Badge variant="secondary">Probando...</Badge>;
    }
    
    if (!connectionStatus) {
      return <Badge variant="warning">Sin probar</Badge>;
    }
    
    return connectionStatus.success ? 
      <Badge variant="success">Conectado</Badge> : 
      <Badge variant="destructive">Error de conexión</Badge>;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Conexión Supabase
        </CardTitle>
        <CardDescription>
          Estado de la conexión a la base de datos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado:</span>
          {getStatusBadge()}
        </div>
        
        {lastTestTime && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Última prueba:</span>
            <span className="text-sm text-muted-foreground">{lastTestTime}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>URL:</span>
            <span className="text-muted-foreground truncate max-w-32">
              {import.meta.env.VITE_SUPABASE_URL ? 
                `${import.meta.env.VITE_SUPABASE_URL.substring(0, 20)}...` : 
                'No configurada'
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Clave anónima:</span>
            <span className="text-muted-foreground">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? 
                '✅ Configurada' : 
                '❌ Faltante'
              }
            </span>
          </div>
        </div>
        
        {connectionStatus && !connectionStatus.success && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800 font-medium">Error:</p>
            <p className="text-sm text-red-700">{connectionStatus.error}</p>
          </div>
        )}
        
        {connectionStatus && connectionStatus.success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800 font-medium">✅ Conexión exitosa</p>
            <p className="text-sm text-green-700">
              {connectionStatus.message}
            </p>
          </div>
        )}
        
        <Button
          onClick={testDatabaseConnection}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Probando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Probar Conexión
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SupabaseTest;
