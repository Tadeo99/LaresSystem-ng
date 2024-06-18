
export const MIN_CHARACTERS_SEARCH = 3;

export const BASE_DATE_FORMAT = 'DD/MM/YYYY';
export const BASE_DATE_FORMAT_API = 'DD-MM-YYYY';

export const TIMER_REQUEST = 50000;

export const PATH_IP_SERVICE = 'https://api.ipify.org/?format=json';

export const PATH_SERVICE: Array<string> = [
    'rol',
    'items/comun/',
    'perfil',//2
    '/correo',
    /** bandeja-trama ***/

];

export const PATH_URL_DATA: Array<string> = [
    '',
    'login',//1
    'read', //2
    'registro', //3
    'inicio/:tipoDocumento/:numDocumento', //4
    'change-password/:tipoDocumento/:numDocumento', //5
    'mensaje-component', //
    'error-general'//
];


export const MESSAGE_ROUTE: Array<any> = [
    {
        path: 'mensaje',
        data: {
            title: 'Título de mensaje',
            message: 'Texto de mensaje'
        }
    },
];


export const ERROR_ROUTE: Array<any> = [
    {
        path: 'error',
        data: {
            title: 'Error',
            message: 'Ocurrió un problema interno de la aplicación'
        }
    }
];

export enum ALERT_TYPE {
    search = 1,
    custom = 2,
    error = 3,
    success = 4
};

export enum MODULES {
    INICIO = 'INICIO',
    PAGOS = 'PAGOS',
    INMUEBLES = 'INMUEBLES',
    PREGUNTAS_FRECUENTES = 'PREGUNTAS'
}

export enum PROYECTO {
    COSTA_MORENA = 'CM',
    EL_MIRADOR_DE_LA_PLANICIE = 'PLA',
    ALTOS_DEL_VALLE = 'ADV',
    VILLA_EL_ENCANTO = 'VE',
    LOS_ROSALES_DE_MANCHAY = 'RM',
    LA_CAPILLA = 'CAP',
    TERRAZAS_DEL_VALLE = 'TDV',
    EL_ENCANTO_DE_PARACAS = 'EP'
}

export const ALERT_MESSAGES : Array<any> = [
    {
        title: 'Aviso',
        message: 'No se encontraron resultados para la búsqueda',
        type: 1
    },
    {
        title: '',
        message: '',
        type: 2
    },
    {
        title: 'Error',
        message: 'Hubo un error en su consulta, inténtelo nuevamente.',
        type: 3
    },
    {
        title: 'Éxito',
        message: 'La operación se ha realizado con éxito',
        type: 4
    },
    {
        title: 'Error',
        message: 'Error al acceder al sistema.',
        type: 5
    }
];