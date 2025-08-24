import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Appointment } from './appointment.model.js';
import { User } from '../user/user.model.js';
import { sendWhatsAppTemplate } from '../../../utils/sendWhatsApp.js';
import { paginationHelpers } from '../../../helpers/paginationHelper.js';

import mongoose from 'mongoose';
import config from '../../../config/config.js';

const createAppointment = async payload => {
  const appointment = await Appointment.create(payload);

  return appointment;
};

const getAllAppointments = async (user, filters, paginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);
  console.log('🚀 ~ getAllAppointments ~ sortBy:', sortBy)

  // Build query based on user role and filters
  let query = {};

  // Role-based filtering
  if (user.role === 'doctor') {
    // For doctors, find the doctor by email and only show today's appointments
    const doctor = await User.findOne({ email: user.email });
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    query.createdAt = {
      $gte: startOfDay,
      $lt: endOfDay
    };
    query.doctor = doctor._id;
  }

  console.log({ filters })

  // Additional filtering for admin or specific date ranges
  if (filters.dateFilter) {
    const dateFilter = getDateFilter(filters.dateFilter);
    if (dateFilter) {
      query.createdAt = dateFilter;
    }
  }

  // Status filter
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.patientName) {
    // i dont want accurate match parital match will be fine
    query.patientName = { $regex: filters.patientName, $options: 'i' };
  }

  // Doctor filter (for admin)
  if (filters.doctorId) {
    query.doctor = filters.doctorId;
  }

  // Build sort object
  const sortOptions = {};
  if (sortBy && sortOrder) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default sort
  }

  // Execute query with pagination
  const appointments = await Appointment.find(query)
    .populate('doctor', 'name speciality hospitalName')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Appointment.countDocuments(query);

  // Add serial numbers to appointments
  const appointmentsWithSerial = appointments.map((appointment, index) => {
    const serialNumber = (page - 1) * limit + index + 1;
    return {
      ...appointment.toObject(),
      serialNumber
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: appointmentsWithSerial
  };
};

// Helper function to get date filter based on string
const getDateFilter = (dateFilterType) => {
  const now = new Date();
  let startDate, endDate;

  switch (dateFilterType) {
    case 'today': {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    }

    case 'yesterday': {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }

    case 'week': {
      // "week" means last 7 days including today
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate.setDate(startDate.getDate() - 6); // 6 days before today
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // tomorrow 00:00
      endDate.setHours(0, 0, 0, 0);
      break;
    }

    case 'month': {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    }

    case 'year': {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
      break;
    }

    default:
      return null;
  }

  return {
    $gte: startDate,
    $lt: endDate
  };
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
  const templateSid = config.twilio_template_sid; // Set this in your .env
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
