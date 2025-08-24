import express from 'express';
import { AppointmentController } from './appointment.controller.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

router.post('/create', auth('doctor', 'admin'), AppointmentController.createAppointment);
router.get('/single/:id', auth('doctor', 'admin'), AppointmentController.getAppointmentById);
router.get('/', auth('doctor', 'admin'), AppointmentController.getAllAppointments);

router.patch('/update/:id', auth('doctor', 'admin'), AppointmentController.updateAppointment);
router.patch('/complete/:id', auth('doctor', 'admin'), AppointmentController.completeAppointment);
router.delete('/delete/:id', auth('doctor', 'admin'), AppointmentController.deleteAppointment);

export const AppointmentRoutes = router;
