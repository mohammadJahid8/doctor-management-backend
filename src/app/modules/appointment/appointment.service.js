import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Appointment } from './appointment.model.js';
import { User } from '../user/user.model.js';
import { sendWhatsAppTemplate } from '../../../utils/sendWhatsApp.js';

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

const completeAppointment = async id => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }

  if (appointment.status === 'completed') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Appointment already completed');
  }

  // Get doctor info for mapUrl
  const doctor = await User.findById(appointment.doctor);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  appointment.status = 'completed';

  // WhatsApp template variables
  const templateSid = process.env.TWILIO_TEMPLATE_SID; // Set this in your .env
  const templateParams = {
    1: appointment.patientName,
    2: appointment.doctorName,
    3: doctor.mapUrl || 'No review link available'
  };

  // Send WhatsApp template message
  const waRes = await sendWhatsAppTemplate(appointment.phone, templateSid, templateParams);

  // Optionally, save message SID and status to appointment
  appointment.whatsappMessageSid = waRes.sid;
  appointment.whatsappStatus = waRes.status;
  await appointment.save();

  return appointment;
};


export const AppointmentService = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
  updateAppointment,
  getAppointmentById,
  completeAppointment,
};
