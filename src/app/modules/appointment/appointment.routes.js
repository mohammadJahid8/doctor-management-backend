import express from 'express';
import { AppointmentController } from './appointment.controller.js';

const router = express.Router();

router.post('/create', AppointmentController.createAppointment);
router.get('/single/:id', AppointmentController.getAppointmentById);
router.get('/', AppointmentController.getAllAppointments);

router.patch('/update/:id', AppointmentController.updateAppointment);
router.patch('/complete/:id', AppointmentController.completeAppointment);
router.delete('/delete/:id', AppointmentController.deleteAppointment);

export const AppointmentRoutes = router;
