import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  MoreHorizontal 
} from 'lucide-react';

import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card.jsx';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/Table.jsx';

const DataTable = ({ 
  title, 
  description,
  data = [], 
  columns = [], 
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay datos para mostrar"
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const filteredData = searchTerm && !onSearch 
    ? data.filter(item => 
        columns.some(column => 
          String(item[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {onAdd && (
            <Button onClick={onAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          )}
        </div>
        
        {(onSearch || searchTerm !== undefined) && (
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {filteredData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.title}
                  </TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <motion.tr
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render 
                        ? column.render(item[column.key], item, index)
                        : item[column.key]
                      }
                    </TableCell>
                  ))}
                  
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">
              <MoreHorizontal className="h-12 w-12 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {emptyMessage}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'Comienza agregando un nuevo elemento.'}
            </p>
            {onAdd && !searchTerm && (
              <Button onClick={onAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Primer Elemento
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { DataTable };
