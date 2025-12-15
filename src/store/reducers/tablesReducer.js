
import { GET_ALL_FROM_TABLE } from '../actionTypes';

const initialState = {};

const tablesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_FROM_TABLE:
            return {
                ...state,
                [action.path]: action.payload
            };
        case 'CREATE_IN_TABLE':
            return {
                ...state,
                [action.path]: [...(state[action.path] || []), action.payload]
            };
        case 'UPDATE_IN_TABLE': // Updated content matches action payload
            return {
                ...state,
                [action.path]: (state[action.path] || []).map(item =>
                    item.id === action.payload.id ? action.payload : item
                )
            };
        case 'DELETE_FROM_TABLE': // Payload is ID
            return {
                ...state,
                [action.path]: (state[action.path] || []).filter(item =>
                    item.id !== action.payload
                )
            };
        default:
            return state;
    }
};

export default tablesReducer;
