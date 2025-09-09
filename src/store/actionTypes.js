// ========================================
// ACCIONES GENERALES
// ========================================
export const GET_ALL_FROM_TABLE = "GET_ALL_FROM_TABLE";
export const CREATE_IN_TABLE = "CREATE_IN_TABLE";
export const UPDATE_IN_TABLE = "UPDATE_IN_TABLE";
export const DELETE_FROM_TABLE = "DELETE_FROM_TABLE";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const UPDATE_ACTIVE_TAB = "UPDATE_ACTIVE_TAB";
export const UPDATE_CURRENT_VIEW = "UPDATE_CURRENT_VIEW";
export const GET_BY_FILTER_VALUE = "GET_BY_FILTER_VALUE";
export const TODAYS_MENU = "TODAYS_MENU";

// ========================================
// ESTADO DEL USUARIO Y SELECCIÓN
// ========================================
export const SET_USER_REG_STATE = "SET_USER_REG_STATE";
export const UPDATE_SELECTED_VALUE = "UPDATE_SELECTED_VALUE";
export const SET_SELECTED_PROVIDER_ID = "SET_SELECTED_PROVIDER_ID";
export const UPDATE_LOG_STAFF = "UPDATE_LOG_STAFF";

// ========================================
// VISTAS
// ========================================
export const HOME = "HOME";
export const SUPABASE = "SUPABASE";
export const AGENDA = "Agenda";
export const NOSOTROS = "NOSOTROS";
export const MENUVIEW = "MENUVIEW";
export const LUNCH = "LUNCH";
export const RECETAS_MENU = "Recetas";
export const RECETAS = "RECETAS";

// ========================================
// TABLAS EN SUPABASE
// ========================================
export const PROJECTS = "projects";
export const TASKS = "tasks";
export const STAFF = "staff";
export const STAGES = "stages";
export const ENTREGABLES = "entregables";

// ========================================
// ÁREAS
// ========================================
export const COCINA = 'COCINA';
export const BARRA = 'BARRA';
export const MESAS = 'MESAS';
export const LIBROS_TIENDA = 'LIBROS_TIENDA';
export const JARDINERIA = 'JARDINERIA';
export const BAÑO = 'BAÑO';
export const DESPACHO = 'DESPACHO';

export const AREAS = [
  COCINA,
  BARRA,
  MESAS,
  JARDINERIA,
  LIBROS_TIENDA,
  BAÑO,
  DESPACHO
];

// ========================================
// CATEGORÍAS (GRUPOS)
// ========================================
export const CARNICO = 'CARNICO';
export const LACTEO = 'LACTEO';
export const CAFE = 'CAFE';
export const PANADERIA = 'PANADERIA';
export const REPOSTERIA = 'REPOSTERIA';
export const VERDURAS_FRUTAS = 'VERDURAS_FRUTAS';
export const BEBIDAS = 'BEBIDAS';
export const CONDIMENTOS_ESPECIAS_ADITIVOS = 'CONDIMENTOS_ESPECIAS_ADITIVOS';
export const GUARNICION = "GUARNICION";
export const GRANOS_CEREALES = 'GRANOS_CEREALES';
export const LIMPIEZA = 'LIMPIEZA';
export const DOTACION = 'DOTACION';
export const CONCERVAS_FERMENTOS_PRECOCIDOS = 'CONCERVAS_FERMENTOS_PRECOCIDOS';
export const DESECHABLES = 'DESECHABLES';
export const ENLATADOS = 'ENLATADOS';
export const TARDEO = 'TARDEO';
export const DESAYUNO = 'DESAYUNO';
export const GRANOS = 'GRANOS';
export const HARINAS = 'HARINAS';
export const ADICIONES = 'ADICIONES';
const ARQUITECTONICO = 'ARQUITECTONICO';

export const CATEGORIES = [
 ARQUITECTONICO
];
// ========================================
// CATEGORÍAS TRADUCIDAS
// ========================================
export const CATEGORIES_t = {
  CAFE: { es: "Café", en: "Coffee", icon: "☕" },
  DESAYUNO: { es: "Desayuno", en: "Breakfast", icon: "🥞" },
  BEBIDAS: { es: "Bebidas", en: "Drinks", icon: "🍹" },
  PANADERIA: { es: "Panadería", en: "Bakery", icon: "🥐" },
  REPOSTERIA: { es: "Repostería", en: "Pastry", icon: "🍰" },
  TARDEO: { es: "Tardeo", en: "Afternoon Snack", icon: "🥪" },
  ADICIONES: { es: "Adiciones", en: "Add-ons", icon: "🥚" },
  CARNICO: { es: "Cárnico", en: "Meat", icon: "🥩" },
  LACTEO: { es: "Lácteo", en: "Dairy", icon: "🐄" },
  VERDURAS_FRUTAS: { es: "Verduras y Frutas", en: "Fruits and Vegetables", icon: "🍎" },
  CONDIMENTOS_ESPECIAS_ADITIVOS: { es: "Condimentos, Especias y Aditivos", en: "Condiments, Spices and Additives", icon: "🧂" },
  GRANOS_CEREALES: { es: "Granos y Cereales", en: "Grains and Cereals", icon: "🌰" },
  LIMPIEZA: { es: "Limpieza", en: "Cleaning", icon: "🧼" },
  DOTACION: { es: "Dotación", en: "Equipment", icon: "📇" },
  CONCERVAS_FERMENTOS_PRECOCIDOS: { es: "Conservas, Fermentos y Precocidos", en: "Preserves, Ferments and Precooked", icon: "🍯" },
  GUARNICION: { es: "Guarnición", en: "Side Dish", icon: "🍟" },
  DESECHABLES: { es: "Desechables", en: "Disposables", icon: "🥡" },
  ENLATADOS: { es: "Enlatados", en: "Canned Goods", icon: "🥫" },
  GRANOS: { es: "Granos", en: "Grains", icon: "🥜" },
  HARINAS: { es: "Harinas", en: "Flours", icon: "🌾" }
};

// ========================================
// SUBCATEGORÍAS
// ========================================
export const CAFE_ESPRESSO = 'CAFE_ESPRESSO';
export const CAFE_METODOS = 'CAFE_METODOS';
export const BEBIDAS_FRIAS = 'BEBIDAS_FRIAS';
export const BEBIDAS_CALIENTES = 'BEBIDAS_CALIENTES';
export const DESAYUNO_DULCE = 'DESAYUNO_DULCE';
export const DESAYUNO_SALADO = 'DESAYUNO_SALADO';
export const ADICIONES_COMIDAS = 'ADICIONES_COMIDAS';
export const ADICIONES_BEBIDAS = 'ADICIONES_BEBIDAS';
export const PANADERIA_REPOSTERIA_DULCE = 'PANADERIA_REPOSTERIA_DULCE';
export const PANADERIA_REPOSTERIA_SALADA = 'PANADERIA_REPOSTERIA_SALADA';
export const TARDEO_ALMUERZO = 'TARDEO_ALMUERZO';

export const SUB_CATEGORIES = [
  CAFE_ESPRESSO,
  CAFE_METODOS,
  TARDEO_ALMUERZO,
  BEBIDAS_FRIAS,
  BEBIDAS_CALIENTES,
  DESAYUNO_DULCE,
  DESAYUNO_SALADO,
  ADICIONES_COMIDAS,
  ADICIONES_BEBIDAS,
  PANADERIA_REPOSTERIA_DULCE,
  PANADERIA_REPOSTERIA_SALADA
];

// ========================================
// ESTADOS
// ========================================
export const PC = 'PC';
export const PP = 'PP';
export const OK = 'OK';
export const NA = 'NA';

export const ESTATUS = [PC, PP, OK, NA];

// ========================================
// UNIDADES
// ========================================
export const gr = 'gr';
export const kl = 'kl';
export const ml = 'ml';
export const li = 'li';
export const un = 'un';

export const unidades = [gr, kl, ml, li, un];

// ========================================
// TABLAS ESPECÍFICAS
// ========================================
export const ItemsAlmacen = "ItemsAlmacen";
export const ProduccionInterna = "ProduccionInterna";
export const MenuItems = "MenuItems";
export const Procedimientos = "Procedimientos";
export const WorkIsue = "WorkIsue";

// ========================================
// ACCIONES RELACIONADAS CON RECETAS
// ========================================
export const INSERT_RECETAS_SUCCESS = "INSERT_RECETAS_SUCCESS";
export const INSERT_RECETAS_FAILURE = "INSERT_RECETAS_FAILURE";
export const SET_PREPROCESS_DATA = "SET_PREPROCESS_DATA";
export const INSERT_ITEM_FAILURE = "INSERT_ITEM_FAILURE";
export const TOGGLE_SHOW_EDIT = 'TOGGLE_SHOW_EDIT';
export const SCRAP = "SCRAP";
export const RESET_EXPANDED_GROUPS = "RESET_EXPANDED_GROUPS";
export const ADD_ORDER_ITEM = 'ADD_ORDER_ITEM';

// ========================================
// BODEGAS
// ========================================
export const REFRIGERACION_COCINA = 'REFRIGERACION_COCINA';
export const CONGELACION_COCINA = 'CONGELACION_COCINA';
export const REFRIGERACION_BEBIDAS = 'REFRIGERACION_BEBIDAS';
export const REFRIGERACION_FRUTAS = 'REFRIGERACION_FRUTAS';
export const REFRIGERACION_BARRA = 'REFRIGERACION_BARRA';
export const CONGELACION_BARRA = 'CONGELACION_BARRA';
export const REFRIGERACION_PRODUCCION = 'REFRIGERACION_PRODUCCION';
export const CONGELACION_PRODUCCION = 'CONGELACION_PRODUCCION';
export const REPISA_COCINA = 'REPISA_COCINA';
export const CANASTA_INFERIOR_COCINA = 'CANASTA_INFERIOR_COCINA';
export const REPISA_EMPACADO = 'REPISA_EMPACADO';
export const CANASTA_INFERIOR_EMPACADO = 'CANASTA_INFERIOR_EMPACADO';
export const REPISA_DESPACHO = 'REPISA_DESPACHO';
export const CANASTA_INFERIOR_DESPACHO = 'CANASTA_INFERIOR_DESPACHO';
export const REPISA_BARRA = 'REPISA_BARRA';
export const CANASTA_INFERIOR_BARRA = 'CANASTA_INFERIOR_BARRA';
export const PAPELERIA = 'PAPELERIA';
export const FRUTERA = 'FRUTERA';
export const NO_APLICA = 'NO_APLICA';

export const BODEGA = [
  REFRIGERACION_COCINA,
  CONGELACION_COCINA,
  REFRIGERACION_BEBIDAS,
  REFRIGERACION_FRUTAS,
  REFRIGERACION_BARRA,
  CONGELACION_BARRA,
  REFRIGERACION_PRODUCCION,
  CONGELACION_PRODUCCION,
  REPISA_COCINA,
  CANASTA_INFERIOR_COCINA,
  REPISA_EMPACADO,
  CANASTA_INFERIOR_EMPACADO,
  REPISA_DESPACHO,
  CANASTA_INFERIOR_DESPACHO,
  REPISA_BARRA,
  CANASTA_INFERIOR_BARRA,
  PAPELERIA,
  FRUTERA,
  NO_APLICA,
];

// ========================================
// VALORES SALARIALES
// ========================================
export const SMMV_COL_2025_HORA = 6189;
export const SMMV_COL_2025_MINU = SMMV_COL_2025_HORA / 60;

// ========================================
// ROLES
// ========================================
export const BARISTA = 'BARISTA';
export const DESPACHADOR = 'DESPACHADOR';
export const AUX_PRODUCCION = 'AUX_PRODUCCION';
export const COCINERO = 'COCINERO';
export const EVENTOS = 'EVENTOS';
export const REDES = 'REDES';
export const MANAGER = 'MANAGER';

export const ROLES = [
  BARISTA,
  DESPACHADOR,
  AUX_PRODUCCION,
  COCINERO,
  EVENTOS,
  REDES,
  MANAGER
];

// ========================================
// IDIOMAS
// ========================================
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const ESP = 'ESP';
export const ENG = 'ENG';
