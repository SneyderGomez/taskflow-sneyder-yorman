export const CATEGORIAS = ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'];

export const PRIORIDADES = ['Alta', 'Media', 'Baja'];

export function validarSolicitud({ titulo, descripcion, categoria, prioridad }) {
  const errores = [];

  if (!titulo || titulo.trim().length < 3) {
    errores.push('El título debe tener al menos 3 caracteres.');
  }

  if (!descripcion || descripcion.trim().length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres.');
  }

  if (!CATEGORIAS.includes(categoria)) {
    errores.push('Debes seleccionar una categoría válida.');
  }

  if (!PRIORIDADES.includes(prioridad)) {
    errores.push('Debes seleccionar una prioridad válida.');
  }

  return errores;
}