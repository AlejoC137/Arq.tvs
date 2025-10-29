// src/components/Materiales.jsx
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getAllFromTable, updateRow } from '../store/actions/actions';
// Se mantiene tu import activo para updateMaterial
import { updateMaterial } from "../actions/actions";

import {
  Search, Columns, Save, Pencil, Check, X, RefreshCcw,
  ArrowUp, ArrowDown, Eye, EyeOff, Undo2
} from 'lucide-react';

const INTERNAL_KEYS = new Set([
  'id', 'created_at', 'updated_at', 'createdAt', 'updatedAt', '_id'
]);

const isNumberish = (v) => v !== null && v !== '' && !isNaN(Number(v));
const isBoolean = (v) => typeof v === 'boolean';

const Materiales = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [edits, setEdits] = useState({});      // { [rowId]: { campo: valor, ... } }
  const [dirty, setDirty] = useState(new Set()); // ids con cambios locales

  const [sort, setSort] = useState({ key: 'nombre', dir: 'asc' });
  const [colPickerOpen, setColPickerOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState({}); // { key: true/false }

  // Cargar datos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const action = await dispatch(getAllFromTable('Materiales'));
      const payload = action?.payload || [];
      const arr = Array.isArray(payload) ? payload : [];
      setRows(arr);

      // Inicializar columnas visibles: todas menos internas
      const allKeys = new Set();
      arr.forEach(r => Object.keys(r || {}).forEach(k => allKeys.add(k)));
      const initial = {};
      Array.from(allKeys).forEach(k => {
        initial[k] = !INTERNAL_KEYS.has(k);
      });
      // Si no tiene 'nombre', intenta usar la primera no-interna
      if (!('nombre' in initial) && allKeys.size > 0) {
        const first = Array.from(allKeys).find(k => !INTERNAL_KEYS.has(k));
        if (first) initial[first] = true;
      }
      setVisibleCols((prev) => Object.keys(prev).length ? prev : initial);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar los materiales.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [search]);

  // Columnas disponibles (orden estable con heurística)
  const columns = useMemo(() => {
    const keySet = new Set();
    rows.forEach(r => Object.keys(r || {}).forEach(k => keySet.add(k)));
    const keys = Array.from(keySet);

    // Heurística para ordenar: nombre, categoria, unidad, costo, precio, stock, proveedor, codigo, notas
    const pref = ['nombre', 'categoria', 'unidad', 'costo', 'precio', 'stock', 'proveedor', 'codigo', 'notas', 'imagen_url'];
    const byPref = (a, b) => {
      const ia = pref.indexOf(a); const ib = pref.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    };

    return keys.sort(byPref);
  }, [rows]);

  const activeCols = useMemo(
    () => columns.filter(k => visibleCols[k]),
    [columns, visibleCols]
  );

  // Buscar
  const filtered = useMemo(() => {
    if (!debounced) return rows;
    return rows.filter(r => {
      return columns.some(k => {
        if (!visibleCols[k]) return false; // buscar solo entre columnas activas
        const val = r?.[k];
        return String(val ?? '').toLowerCase().includes(debounced);
      });
    });
  }, [rows, columns, debounced, visibleCols]);

  // Ordenar
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (isNumberish(av) && isNumberish(bv)) {
        const na = Number(av); const nb = Number(bv);
        return dir === 'asc' ? na - nb : nb - na;
      }
      const sa = String(av ?? '').toLowerCase();
      const sb = String(bv ?? '').toLowerCase();
      if (sa < sb) return dir === 'asc' ? -1 : 1;
      if (sa > sb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  const toggleSort = (key) => {
    setSort(prev => {
      if (prev.key !== key) return { key, dir: 'asc' };
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    });
  };

  // Edición (Inputs controlados)
  const onCellChange = (rowId, key, newVal, isNumeric = false) => {
    let finalVal = newVal;
    if (isNumeric) {
      finalVal = newVal === '' ? null : Number(newVal);
    }
    
    setEdits(prev => {
      const nextRow = { ...(prev[rowId] || {}) };
      nextRow[key] = finalVal;
      return {
        ...prev,
        [rowId]: nextRow
      };
    });
    setDirty(prev => new Set(prev).add(rowId));
  };

  const revertRow = (rowId) => {
    setEdits(prev => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
    setDirty(prev => {
      const n = new Set(prev);
      n.delete(rowId);
      return n;
    });
  };

  const saveAll = async () => {
    if (dirty.size === 0) return;
    try {
      setLoading(true);
      setError(null);
      
      const savePromises = Array.from(dirty).map(async (rowId) => {
        const changes = edits[rowId];
        if (!changes || Object.keys(changes).length === 0) return;

        // Intenta updateMaterial (del import ../actions/actions)
        if (typeof updateMaterial === 'function') {
           await dispatch(updateMaterial(rowId, changes));
        }
        // Fallback a updateRow (del import ../store/actions/actions)
        else if (typeof updateRow === 'function') {
          await dispatch(updateRow('Materiales', rowId, changes));
        } else {
          // Si ninguna acción está disponible
          throw new Error('No se encontró una función de actualización (updateMaterial o updateRow).');
        }
      });

      const results = await Promise.allSettled(savePromises);
      
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        console.error('Fallaron algunas actualizaciones:', failed.map(f => f.reason));
        setError(`Error al guardar ${failed.length} fila(s). Revise la consola para más detalles.`);
        // No limpiamos el dirty state si algo falla, para que el usuario pueda reintentar
      } else {
        // Todo salió bien, refrescar y limpiar
        await fetchData();
        setEdits({});
        setDirty(new Set());
        setEditMode(false);
      }
    } catch (e) {
      console.error(e);
      setError('Error al guardar cambios.');
    } finally {
      setLoading(false);
    }
  };

  // --- Render helpers ---

  const SortIcon = ({ col }) =>
    sort.key === col ? (sort.dir === 'asc' ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />)
      : <span className="opacity-40"> </span>;

  // Hook simple de "click outside"
  const useClickOutside = (ref, callback) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref, callback]);
  };

  const ColumnPicker = () => {
    const pickerRef = useRef(null);
    useClickOutside(pickerRef, () => {
      if (colPickerOpen) {
        setColPickerOpen(false);
      }
    });

    return (
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setColPickerOpen(o => !o)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
          title="Columnas visibles"
        >
          <Columns className="w-4 h-4" />
          Columnas
        </button>
        {colPickerOpen && (
          <div className="absolute right-0 mt-2 z-20 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
            <div className="max-h-72 overflow-auto pr-1">
              {columns.map((k) => (
                <label
                  key={k}
                  className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-50 ${
                    INTERNAL_KEYS.has(k) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  title={k}
                >
                  <div className="flex items-center gap-2">
                    {visibleCols[k] ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm text-gray-800 truncate">{k}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!visibleCols[k]}
                    disabled={INTERNAL_KEYS.has(k)}
                    onChange={(e) => {
                      if (!INTERNAL_KEYS.has(k)) {
                        setVisibleCols(prev => ({ ...prev, [k]: e.target.checked }))
                      }
                    }}
                  />
                </label>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setColPickerOpen(false)}
                className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper para renderizar celdas (lectura)
  const renderCellContent = (value, key) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">N/A</span>;
    }
    if (key === 'imagen_url' && typeof value === 'string' && value.startsWith('http')) {
      return <img src={value} alt="imagen" className="w-16 h-10 object-cover rounded" />;
    }
    if (isBoolean(value)) {
      return value ? 'Sí' : 'No';
    }
    return String(value);
  };

  return (
    <div className="h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-6">
        {/* Header / Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Materiales</h1>
            <p className="text-sm text-gray-500">Lista tipo Excel desde la tabla <span className="font-semibold">Materiales</span></p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar en columnas visibles…"
                className="pl-10 pr-3 py-2 w-72 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                type="text"
              />
            </div>

            <ColumnPicker />

            <button
              onClick={() => setEditMode(m => !m)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${editMode ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              title="Habilitar edición"
            >
              <Pencil className="w-4 h-4" />
              {editMode ? 'Edición activada' : 'Habilitar edición'}
            </button>

            <button
              onClick={saveAll}
              disabled={dirty.size === 0 || loading}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${dirty.size === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} ${loading ? 'opacity-50' : ''}`}
              title="Guardar cambios"
            >
              <Save className="w-4 h-4" />
              Guardar cambios {dirty.size > 0 ? `(${dirty.size})` : ''}
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 ${loading ? 'opacity-50' : ''}`}
              title="Recargar"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Recargando...' : 'Recargar'}
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
              <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          {error && (
            <div className="p-4 text-red-600 bg-red-50 m-4 rounded-lg">{error}</div>
          )}
          
          <div className="overflow-auto h-full">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left font-semibold text-gray-600 px-3 py-3 w-28">
                    Estatus
                  </th>
                  {activeCols.map((colKey) => (
                    <th
                      key={colKey}
                      onClick={() => toggleSort(colKey)}
                      className="text-left font-semibold text-gray-600 px-3 py-3 cursor-pointer select-none whitespace-nowrap"
                      title={`Ordenar por ${colKey}`}
                    >
                      {colKey} <SortIcon col={colKey} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sorted.map((row) => {
                  
                  let rowId = row.id ?? row._id ?? row.codigo;
                  if (!rowId) {
                    console.warn('Fila sin ID estable, usando JSON.stringify como fallback. Esto es inestable.', row);
                    rowId = JSON.stringify(row);
                  }

                  const rowDirty = dirty.has(rowId);
                  
                  return (
                    <tr key={rowId} className={rowDirty ? 'bg-amber-50' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 align-top">
                        {rowDirty ? (
                          <div className="flex items-center gap-2 text-amber-700 text-xs">
                            <span className="inline-flex items-center gap-1">
                              <X className="w-3.5 h-3.5" />
                              Modificado
                            </span>
                            <button
                              onClick={() => revertRow(rowId)}
                              title="Descartar cambios en esta fila"
                              className="text-amber-600 hover:text-amber-800"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                            <Check className="w-3.5 h-3.5" />
                            OK
                          </span>
                        )}
                      </td>

                      {activeCols.map((k) => {
                        const original = row[k];
                        const local = edits[rowId]?.[k];
                        const value = local !== undefined ? local : original;

                        const isReadOnly = !editMode || INTERNAL_KEYS.has(k);
                        const isNum = isNumberish(value) || isNumberish(original);
                        
                        return (
                          <td key={k} className="px-3 py-2 align-top">
                            {isReadOnly ? (
                              <div className="min-h-[36px] flex items-center text-gray-800">
                                {renderCellContent(value, k)}
                              </div>
                            ) : isNum ? (
                              <input
                                type="number"
                                value={value ?? ''}
                                onChange={(e) => onCellChange(rowId, k, e.target.value, true)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <input
                                type="text"
                                value={value ?? ''}
                                onChange={(e) => onCellChange(rowId, k, e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {sorted.length === 0 && !loading && (
                  <tr>
                    <td colSpan={activeCols.length + 1} className="px-4 py-12 text-center text-gray-500">
                      No se encontraron materiales {debounced ? 'que coincidan con la búsqueda.' : ''}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>

        {/* Footer info */}
        <div className="text-xs text-gray-500 flex items-center gap-3">
          <span>Total materiales visibles: <span className="font-semibold text-gray-700">{sorted.length}</span></span>
          <span>•</span>
          <span>Columnas activas: <span className="font-semibold text-gray-700">{activeCols.length}</span></span>
          {dirty.size > 0 && (
            <>
              <span>•</span>
              <span className="text-amber-700">Filas con cambios: <span className="font-semibold">{dirty.size}</span></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Materiales;