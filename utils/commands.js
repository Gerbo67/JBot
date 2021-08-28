const firstCommand = {
    name: 'recordatorio',
    description: 'Agregar un recordatorio por fecha',
    options: [{
        name: 'fecha',
        description: 'DD/MM/YY',
        type: 'STRING',
        required: 'true'
    }, {
        name: 'titulo',
        description: 'Un titulo para el recordatorio',
        type: 'STRING',
        required: 'true'
    }, {
        name: 'cuerpo',
        description: 'Una descripcion para el recordatorio',
        type: 'STRING',
        required: 'true'
    }, {
        name: 'pie',
        description: 'Un pie de pagina para el recordatorio',
        type: 'STRING',
        required: 'false'
    }]
};

const secondCommand = {
    name: 'eliminar-recordatorio',
    description: 'Eliminar recordatorio por ID',
    options: [{
        name: 'id',
        description: 'El id se proporciona cuando se crea el recordatorio',
        type: 'STRING',
        required: 'true'
    }]
};

module.exports = {firstCommand, secondCommand};