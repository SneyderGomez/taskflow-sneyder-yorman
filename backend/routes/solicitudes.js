import { Router } from 'express';
import * as controller from '../controllers/solicitudController.js';
import { validarSolicitud } from '../middlewares/validacion.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', validarSolicitud, controller.crear);
router.patch('/:id/activo', controller.cambiarActivo);
router.delete('/:id', controller.eliminar);

export default router;