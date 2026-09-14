const Gasto = require("../models/Gasto")
const Detalle_gasto = require("../models/Detalle_gasto.js")
const s = require('../db.js')

async function procesarYCrearGasto(idGrupo, arrayParticipantes, monto, idPagador, descripPago) {
    const t = await s.transaction();
    try {
        const nuevoGasto = await Gasto.create({
            monto: monto, descripcion: descripPago, idCreadorGasto: idPagador, idGrupo: idGrupo
        },
            { transaction: t }
        );

        const montoCentavos = Math.round(monto * 100); //Pasar monto a centavos para manejar redondeos
        const cuotaBase = Math.floor(montoCentavos / arrayParticipantes.length);
        let cuotaRestante = montoCentavos % arrayParticipantes.length;

        const arrayRepartoParticipantes = [];
        for (let participante of arrayParticipantes) {
            if (cuotaRestante) {
                arrayRepartoParticipantes.push({ monto: (cuotaBase + 1) / 100, idGasto: nuevoGasto.id, idParticipante: participante.id })
                cuotaRestante--;
            } else
                arrayRepartoParticipantes.push({ monto: cuotaBase / 100, idGasto: nuevoGasto.id, idParticipante: participante.id })
        }

        const reparto = await Detalle_gasto.bulkCreate(arrayRepartoParticipantes, { transaction: t })
        await t.commit();
        return reparto;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = { procesarYCrearGasto };

/*
Crear el gasto con fk a pagador
    -fk a pagador
    -fk a idgrupo
    -monto
    -descripcion
Dividir el monto total entre los participantes (incluye al pagador)
Crear una transaccion que inserte en detalle_gasto
    -fk a idGasto
    -fk a idParticipante
    -Monto correspondiente

*/


