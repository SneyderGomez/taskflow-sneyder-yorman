const REGLAS = {
  'Información': 'Gracias por tu solicitud de información. Según nuestro reglamento, la información general solicitada se responderá en un plazo de 24 horas hábiles.',
  'Soporte': 'Hemos registrado tu reporte de soporte. Nuestro equipo de asistencia técnica revisará el problema y te contactará en el menor tiempo posible. Si el problema persiste, reinicia el servicio e inténtalo nuevamente.',
  'Documento': 'Tu solicitud de documento ha sido recibida. El documento solicitado será emitido y estará disponible para descarga en un plazo de 3 días hábiles.',
  'Consulta': 'Tu consulta sobre el estado del proceso ha sido recibida. El estado actual de tu trámite será informado por los canales oficiales en un plazo de 24 horas.',
  'Actualización': 'Tu solicitud de actualización de información ha sido registrada. Los cambios solicitados serán revisados y aplicados si cumplen los requisitos establecidos.'
};

const RESPUESTA_GENERICA = 'Hemos recibido tu solicitud. Lamentablemente no coincidió con ninguna categoría específica, por lo que fue derivada para revisión manual por parte de nuestro equipo.';

export function generarRespuesta(categoria) {
  return REGLAS[categoria] || RESPUESTA_GENERICA;
}