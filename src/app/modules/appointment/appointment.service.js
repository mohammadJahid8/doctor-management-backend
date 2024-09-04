import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Appointment } from './appointment.model.js';

import mongoose from 'mongoose';

const createAppointment = async payload => {
  const appointment = await Appointment.create(payload);

  return appointment;
};

const getAllAppointments = async () => {
  const appointments = await Appointment.find({}).populate('doctor').sort({
    createdAt: -1,
  });
  return appointments;
};

const getAppointmentById = async id => {
  const appointment = await Appointment.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
  ]);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }
  return appointment[0];
};

const updateAppointment = async (id, payload) => {
  const updatedAppointment = await Appointment.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedAppointment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Appointment not found');
  }

  return updatedAppointment;
};

const deleteAppointment = async id => {
  const isExist = await Appointment.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus[500], 'Appointment not found!');
  }

  const result = await Appointment.findByIdAndDelete(id);
  return result;
};

export const AppointmentService = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
  updateAppointment,
  getAppointmentById,
};
