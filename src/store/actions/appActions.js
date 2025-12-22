import supabase from '../../config/supabaseClient';

export const checkConnection = () => async (dispatch) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
        // Attempt to select from a known table (Proyectos) just to check auth/connection
        const { count, error } = await supabase
            .from('Proyectos')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Connected' });
    } catch (error) {
        console.error('Supabase Connection Error:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Error' });
    } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
    }
};

export const setSelectedAction = (action) => ({
    type: 'SET_SELECTED_ACTION',
    payload: action
});

export const setSelectedTask = (task) => ({
    type: 'SET_SELECTED_TASK',
    payload: task
});

export const initCreateAction = (initialData) => ({
    type: 'INIT_CREATE_ACTION',
    payload: initialData
});

export const initCreateTask = (initialData) => ({
    type: 'INIT_CREATE_TASK',
    payload: initialData
});

export const clearSelection = () => ({
    type: 'CLEAR_SELECTION'
});

export const setDayMode = (date) => ({
    type: 'SET_DAY_MODE',
    payload: date
});

// Navigation Actions
export const setCalendarView = (view) => ({
    type: 'SET_CALENDAR_VIEW',
    payload: view
});

export const setPropertyView = (view) => ({
    type: 'SET_PROPERTY_VIEW',
    payload: view
});

export const setActiveSpace = (spaceId) => ({
    type: 'SET_ACTIVE_SPACE',
    payload: spaceId
});

export const setActiveTeamView = (view) => ({
    type: 'SET_ACTIVE_TEAM_VIEW',
    payload: view
});

export const setActiveView = (view) => ({
    type: 'SET_ACTIVE_VIEW',
    payload: view
});
