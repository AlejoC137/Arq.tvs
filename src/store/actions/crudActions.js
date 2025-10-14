import supabase from '../../config/supabaseClient.js';
// import { createCrudActionTypes } from '../actionTypes.js';
import { getTableName } from '../../config/tableNames.js';

// ========================================
// GENERIC ACTION CREATORS FACTORY
// ========================================

/**
 * Creates a complete set of CRUD actions for any entity
 * @param {string} entityName - Name of the entity (e.g., 'projects', 'tasks')
 * @param {string} tableName - Name of the Supabase table (optional, will auto-resolve from entityName)
 * @param {object} options - Additional configuration options
 */
export const createCrudActions = (entityName, tableName = null, options = {}) => {
  // Auto-resolve table name if not provided
  const actualTableName = tableName || getTableName(entityName);
  const actionTypes = createCrudActionTypes(entityName);
  const {
    selectFields = '*',
    relationships = [],
    orderBy = 'created_at',
    orderDirection = 'desc',
    transformData = (data) => data,
  } = options;

  // Build select query with relationships
  const buildSelectQuery = (customFields = selectFields) => {
    let query = customFields;
    if (relationships.length > 0) {
      const relationshipQueries = relationships.map(rel => {
        if (typeof rel === 'string') {
          return `${rel}(*)`;
        } else if (typeof rel === 'object') {
          return `${rel.table}(${rel.fields || 'id,name'})`;
        }
        return rel;
      }).join(',');
      query = `${customFields},${relationshipQueries}`;
    }
    return query;
  };

  // ========================================
  // BASIC ACTION CREATORS
  // ========================================

  // Loading action
  const setLoading = (loading = true) => ({
    type: actionTypes[`SET_${entityName.toUpperCase()}_LOADING`],
    payload: loading,
  });

  // Error actions
  const setError = (error) => ({
    type: actionTypes[`SET_${entityName.toUpperCase()}_ERROR`],
    payload: error,
  });

  const clearError = () => ({
    type: actionTypes[`CLEAR_${entityName.toUpperCase()}_ERROR`],
  });

  // Reset state
  const resetState = () => ({
    type: actionTypes[`RESET_${entityName.toUpperCase()}_STATE`],
  });

  // ========================================
  // FETCH ACTIONS
  // ========================================

  // Fetch all records
  const fetchRequest = () => ({
    type: actionTypes[`FETCH_${entityName.toUpperCase()}_REQUEST`],
  });

  const fetchSuccess = (data) => ({
    type: actionTypes[`FETCH_${entityName.toUpperCase()}_SUCCESS`],
    payload: transformData(data),
  });

  const fetchFailure = (error) => ({
    type: actionTypes[`FETCH_${entityName.toUpperCase()}_FAILURE`],
    payload: error,
  });

  const fetchAll = (filters = {}) => {
    return async (dispatch) => {
      dispatch(fetchRequest());
      
      try {
        let query = supabase
          .from(actualTableName)
          .select(buildSelectQuery())
          .order(orderBy, { ascending: orderDirection === 'asc' });

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'string' && value.includes('%')) {
              query = query.ilike(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });

        const { data, error } = await query;

        if (error) throw error;

        dispatch(fetchSuccess(data || []));
        return { success: true, data };
      } catch (error) {
        console.error(`Error fetching ${actualTableName}:`, error);
        dispatch(fetchFailure(error.message));
        return { success: false, error: error.message };
      }
    };
  };

  // Fetch by ID
  const fetchById = (id) => {
    return async (dispatch) => {
      dispatch(setLoading(true));
      
      try {
        const { data, error } = await supabase
          .from(actualTableName)
          .select(buildSelectQuery())
          .eq('id', id)
          .single();

        if (error) throw error;

        dispatch(setLoading(false));
        return { success: true, data: transformData(data) };
      } catch (error) {
        console.error(`Error fetching ${actualTableName} by ID:`, error);
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        return { success: false, error: error.message };
      }
    };
  };

  // ========================================
  // CREATE ACTIONS
  // ========================================

  const createRequest = () => ({
    type: actionTypes[`CREATE_${entityName.toUpperCase()}_REQUEST`],
  });

  const createSuccess = (data) => ({
    type: actionTypes[`CREATE_${entityName.toUpperCase()}_SUCCESS`],
    payload: transformData(data),
  });

  const createFailure = (error) => ({
    type: actionTypes[`CREATE_${entityName.toUpperCase()}_FAILURE`],
    payload: error,
  });

  const create = (data) => {
    return async (dispatch) => {
      dispatch(createRequest());
      
      try {
        const { data: result, error } = await supabase
          .from(actualTableName)
          .insert([data])
          .select(buildSelectQuery())
          .single();

        if (error) throw error;

        dispatch(createSuccess(result));
        return { success: true, data: result };
      } catch (error) {
        console.error(`Error creating ${actualTableName}:`, error);
        dispatch(createFailure(error.message));
        return { success: false, error: error.message };
      }
    };
  };

  // ========================================
  // UPDATE ACTIONS
  // ========================================

  const updateRequest = () => ({
    type: actionTypes[`UPDATE_${entityName.toUpperCase()}_REQUEST`],
  });

  const updateSuccess = (data) => ({
    type: actionTypes[`UPDATE_${entityName.toUpperCase()}_SUCCESS`],
    payload: transformData(data),
  });

  const updateFailure = (error) => ({
    type: actionTypes[`UPDATE_${entityName.toUpperCase()}_FAILURE`],
    payload: error,
  });

  const update = (id, data) => {
    return async (dispatch) => {
      dispatch(updateRequest());
      
      try {
        const { data: result, error } = await supabase
          .from(actualTableName)
          .update(data)
          .eq('id', id)
          .select(buildSelectQuery())
          .single();

        if (error) throw error;

        dispatch(updateSuccess(result));
        return { success: true, data: result };
      } catch (error) {
        console.error(`Error updating ${actualTableName}:`, error);
        dispatch(updateFailure(error.message));
        return { success: false, error: error.message };
      }
    };
  };

  // ========================================
  // DELETE ACTIONS
  // ========================================

  const deleteRequest = () => ({
    type: actionTypes[`DELETE_${entityName.toUpperCase()}_REQUEST`],
  });

  const deleteSuccess = (id) => ({
    type: actionTypes[`DELETE_${entityName.toUpperCase()}_SUCCESS`],
    payload: id,
  });

  const deleteFailure = (error) => ({
    type: actionTypes[`DELETE_${entityName.toUpperCase()}_FAILURE`],
    payload: error,
  });

  const deleteRecord = (id) => {
    return async (dispatch) => {
      dispatch(deleteRequest());
      
      try {
        const { error } = await supabase
          .from(actualTableName)
          .delete()
          .eq('id', id);

        if (error) throw error;

        dispatch(deleteSuccess(id));
        return { success: true, id };
      } catch (error) {
        console.error(`Error deleting ${actualTableName}:`, error);
        dispatch(deleteFailure(error.message));
        return { success: false, error: error.message };
      }
    };
  };

  // ========================================
  // BULK OPERATIONS
  // ========================================

  // Bulk create
  const bulkCreate = (dataArray) => {
    return async (dispatch) => {
      dispatch({ type: actionTypes[`BULK_CREATE_${entityName.toUpperCase()}_REQUEST`] });
      
      try {
        const { data, error } = await supabase
          .from(actualTableName)
          .insert(dataArray)
          .select(buildSelectQuery());

        if (error) throw error;

        dispatch({
          type: actionTypes[`BULK_CREATE_${entityName.toUpperCase()}_SUCCESS`],
          payload: transformData(data),
        });
        return { success: true, data };
      } catch (error) {
        console.error(`Error bulk creating ${actualTableName}:`, error);
        dispatch({
          type: actionTypes[`BULK_CREATE_${entityName.toUpperCase()}_FAILURE`],
          payload: error.message,
        });
        return { success: false, error: error.message };
      }
    };
  };

  // Bulk update
  const bulkUpdate = (updates) => {
    return async (dispatch) => {
      dispatch({ type: actionTypes[`BULK_UPDATE_${entityName.toUpperCase()}_REQUEST`] });
      
      try {
        const promises = updates.map(({ id, data }) =>
          supabase
            .from(actualTableName)
            .update(data)
            .eq('id', id)
            .select(buildSelectQuery())
            .single()
        );

        const results = await Promise.all(promises);
        const data = results.map(result => result.data).filter(Boolean);

        dispatch({
          type: actionTypes[`BULK_UPDATE_${entityName.toUpperCase()}_SUCCESS`],
          payload: transformData(data),
        });
        return { success: true, data };
      } catch (error) {
        console.error(`Error bulk updating ${actualTableName}:`, error);
        dispatch({
          type: actionTypes[`BULK_UPDATE_${entityName.toUpperCase()}_FAILURE`],
          payload: error.message,
        });
        return { success: false, error: error.message };
      }
    };
  };

  // Bulk delete
  const bulkDelete = (ids) => {
    return async (dispatch) => {
      dispatch({ type: actionTypes[`BULK_DELETE_${entityName.toUpperCase()}_REQUEST`] });
      
      try {
        const { error } = await supabase
          .from(actualTableName)
          .delete()
          .in('id', ids);

        if (error) throw error;

        dispatch({
          type: actionTypes[`BULK_DELETE_${entityName.toUpperCase()}_SUCCESS`],
          payload: ids,
        });
        return { success: true, ids };
      } catch (error) {
        console.error(`Error bulk deleting ${actualTableName}:`, error);
        dispatch({
          type: actionTypes[`BULK_DELETE_${entityName.toUpperCase()}_FAILURE`],
          payload: error.message,
        });
        return { success: false, error: error.message };
      }
    };
  };

  // ========================================
  // UTILITY ACTIONS
  // ========================================

  // Count records
  const count = (filters = {}) => {
    return async (dispatch) => {
      try {
        let query = supabase
          .from(actualTableName)
          .select('*', { count: 'exact', head: true });

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            query = query.eq(key, value);
          }
        });

        const { count, error } = await query;
        if (error) throw error;

        return { success: true, count };
      } catch (error) {
        console.error(`Error counting ${actualTableName}:`, error);
        return { success: false, error: error.message };
      }
    };
  };

  // Search records
  const search = (searchTerm, searchFields = ['name']) => {
    return async (dispatch) => {
      dispatch(fetchRequest());
      
      try {
        let query = supabase
          .from(actualTableName)
          .select(buildSelectQuery());

        // Apply search to multiple fields
        if (searchTerm) {
          const searchConditions = searchFields.map(field => `${field}.ilike.%${searchTerm}%`);
          query = query.or(searchConditions.join(','));
        }

        const { data, error } = await query.order(orderBy, { ascending: orderDirection === 'asc' });

        if (error) throw error;

        dispatch(fetchSuccess(data || []));
        return { success: true, data };
      } catch (error) {
        console.error(`Error searching ${actualTableName}:`, error);
        dispatch(fetchFailure(error.message));
        return { success: false, error: error.message };
      }
    };
  };

  // ========================================
  // RETURN ALL ACTIONS
  // ========================================

  return {
    // Action creators
    setLoading,
    setError,
    clearError,
    resetState,
    
    // Basic CRUD
    fetchRequest,
    fetchSuccess,
    fetchFailure,
    fetchAll,
    fetchById,
    
    createRequest,
    createSuccess,
    createFailure,
    create,
    
    updateRequest,
    updateSuccess,
    updateFailure,
    update,
    
    deleteRequest,
    deleteSuccess,
    deleteFailure,
    delete: deleteRecord,
    
    // Bulk operations
    bulkCreate,
    bulkUpdate,
    bulkDelete,
    
    // Utilities
    count,
    search,
    
    // Action types for reference
    actionTypes,
  };
};

// ========================================
// HELPER FUNCTIONS
// ========================================

// Standard data transformers
export const transformers = {
  // Add computed fields, format dates, etc.
  addTimestamps: (data) => ({
    ...data,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }),
  
  // Format for display
  formatForDisplay: (data) => ({
    ...data,
    displayName: data.name || data.title || `${data.id}`,
  }),
  
  // Add full name for people
  addFullName: (data) => ({
    ...data,
    fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.name,
  }),
};

// Standard relationships configurations
export const relationships = {
  projects: [
    { table: 'staff', fields: 'id,name' },
    { table: 'stages', fields: 'id,name' }
  ],
  tasks: [
    { table: 'projects', fields: 'id,name' },
    { table: 'staff', fields: 'id,name' },
    { table: 'stages', fields: 'id,name' }
  ],
  staff: [],
  stages: [],
};
