export const messageJson = (params) => {
    return {code: 0, data: [], message: params}
};

export const dataJson = (params) => {
    return {code: 0, data: params, message: 'Solicitud Terminada!'}
};

export const errorJson = (err, params) => {
    return {code: err, data: [], message: params}
};