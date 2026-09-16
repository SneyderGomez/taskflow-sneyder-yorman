import mongoose from 'mongoose';

export const ESTADOS = ['PENDIENTE', 'EN COLA', 'PROCESANDO', 'RESPONDIDA', 'ERROR'];

export const CATEGORIAS = ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'];

export const PRIORIDADES = ['Alta', 'Media', 'Baja'];

const solicitudSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, enum: CATEGORIAS },
    prioridad: { type: String, required: true, enum: PRIORIDADES },
    estado: { type: String, enum: ESTADOS, default: 'PENDIENTE' },
    respuesta: { type: String, default: null },
    error: { type: String, default: null },
    fechaProcesamiento: { type: Date, default: null }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

solicitudSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const Solicitud = mongoose.model('Solicitud', solicitudSchema);