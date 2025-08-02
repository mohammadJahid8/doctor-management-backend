/* eslint-disable no-prototype-builtins */

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { AppointmentService } from './appointment.service.js';

const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentService.createAppointment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment created successfully',
    data: result,
  });
});

const getAllAppointments = catchAsync(async (req, res) => {
  const result = await AppointmentService.getAllAppointments(
    req.query.user,
    req.query.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Appointments got!',
    data: result,
  });
});
const getAppointmentById = catchAsync(async (req, res) => {
  const result = await AppointmentService.getAppointmentById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Appointment got!',
    data: result,
  });
});

const updateAppointment = catchAsync(async (req, res) => {
  const id = req.params.id;
  let updatedData = req.body;

  const result = await AppointmentService.updateAppointment(id, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment updated successfully!',
    data: result,
  });
});

const deleteAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentService.deleteAppointment(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment deleted successfully!',
    data: result,
  });
});

const completeAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentService.completeAppointment(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment marked as completed and WhatsApp message sent',
    data: result,
  });
});


export const AppointmentController = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
  updateAppointment,
  getAppointmentById,
  completeAppointment,
};
