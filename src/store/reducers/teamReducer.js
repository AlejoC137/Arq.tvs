const initialState = {
  members: [
    { id: 1, name: 'Alejandro', role: 'Coordinador Técnico y de Desarrollo', avatar: 'A' },
    { id: 2, name: 'Laura', role: 'Encargada de Obra (Casa 4 y 5)', avatar: 'L' },
    { id: 3, name: 'Francisco', role: 'Encargado de Obra (Casa 2)', avatar: 'F' },
    { id: 4, name: 'Santiago', role: 'Encargado de Obra (Casa 7 y Parqueadero Lote 6), Paisajismo', avatar: 'S' },
    { id: 5, name: 'Manuela', role: 'Diseño e Interiorismo Básico', avatar: 'M' },
    { id: 6, name: 'Miguel', role: 'Búsqueda de Materiales, Ayudante de Ronald', avatar: 'Mi' },
    { id: 7, name: 'David', role: 'Desarrollo Técnico de Mobiliario Fijo', avatar: 'D' },
  ],
  loading: false,
  error: null,
};

const teamReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TEAM_SUCCESS':
      return {
        ...state,
        members: action.payload,
        loading: false,
      };
    
    case 'ADD_TEAM_MEMBER':
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    
    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.memberId
            ? { ...member, ...action.payload.updates }
            : member
        ),
      };
    
    case 'DELETE_TEAM_MEMBER':
      return {
        ...state,
        members: state.members.filter(member => member.id !== action.payload),
      };
    
    default:
      return state;
  }
};

export default teamReducer;
