import httpStatus from 'http-status';
import { User } from './user.model.js';
import ApiError from '../../../errors/ApiError.js';
import { jwtHelpers } from '../../../helpers/jwtHelper.js';
import cloudinary from 'cloudinary';
import config from '../../../config/config.js';
import jwt from 'jsonwebtoken';
import { resetMail } from '../../../utils/resetMail.js';
import bcrypt from 'bcrypt';
import { Referral } from '../referral/referral.model.js';
// import Razorpay from 'razorpay';

cloudinary.v2.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

// const rp = new Razorpay({
//   key_id: config.razorPay_key_id,
//   key_secret: config.razorPay_key_secret,
// });

const createGoogleUser = async payload => {
  const { email } = payload;

  const isUserExist = await User.isUserExist(email);

  const token = jwtHelpers.createToken({
    email,
    role: 'user',
  });

  if (isUserExist) {
    return token;
  }

  await User.create(payload);
  return token;
};

// Creating user
const signup = async payload => {
  const { email } = payload;

  const isUserExist = await User.findOne({ email: payload?.email });

  if (isUserExist) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create(payload);

  const token = jwtHelpers.createToken({
    email,
    role: user.role || 'user',
  });

  return token;
};

const signin = async payload => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new ApiError(400, 'User does not exist');
  }

  const isPasswordMatch =
    isUserExist.password &&
    (await User.isPasswordMatch(password, isUserExist?.password));

  if (!isPasswordMatch) {
    throw new ApiError(400, 'Incorrect password!');
  }

  const token = jwtHelpers.createToken({
    email: email,
    role: isUserExist.role,
    id: isUserExist._id,
  });

  return token;
};

const getUserProfile = async email => {
  const result = await User.findOne({
    email,
  }).populate('referral');

  return result;
};

const getAllUsers = async role => {
  let query;
  if (role) query = { role };
  else query = {};

  const admins = await User.find(query).populate('referral');
  return admins;
};

const deleteUser = async id => {
  const isExist = await User.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus[500], 'User not found!');
  }

  const result = await User.findByIdAndDelete(id);
  return result;
};

const updateUserImage = async (id, file) => {
  let isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (!file?.path) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No image uploaded!');
  }

  const cloudRes = await cloudinary.v2.uploader.upload(file.path);
  const imageUrl = cloudRes.secure_url;

  isExist.image = imageUrl;

  const result = await isExist.save();
  return result;
};

const updateUser = async (id, payload, file) => {
  if (file?.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    const imageUrl = result.secure_url;

    payload.image = imageUrl;
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true });

  if (!updatedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  return updatedUser;
};
const activateReferral = async (email, referralCode) => {

  const referral = await Referral.findOne({ code: referralCode });

  if (!referral) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid referral code');
  }
  if (referral?.isUsed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Referral code already used');
  }

  const user = await User.findOne({ email })

  if (referral.email !== user?.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This Referral Code is not assigned to you!');
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, { referral: referral._id }, { new: true });


  // update the referral isUsed
  await Referral.findByIdAndUpdate(referral._id, { isUsed: true });

  if (!updatedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  return updatedUser;
};

const forgotPassword = async payload => {
  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(500, 'User not found');
  }

  const token = jwt.sign({ email }, 'jahidishere', {
    expiresIn: '1h',
  });
  user.resetPasswordToken = token;
  await user.save();

  await resetMail(email, token);

  return 'Mail sent';
};

const resetPassword = async payload => {
  const { newPassword, token } = payload;

  const decoded = jwtHelpers.verifyToken(token);

  const { email } = decoded;

  const user = await User.findOne({ email });

  if (!user || user.resetPasswordToken !== token) {
    throw new ApiError(500, 'Invalid token');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;

  const result = await user.save();

  return result;
};
// const createSubscription = async req => {
//   try {
//     const { planId } = req.body;

//     console.log({ planId });

//     const subscription = await rp.subscriptions.create({
//       plan_id: planId,
//       customer_notify: 1,
//       quantity: 1,
//       total_count: 1,
//     });

//     console.log({ subscription });

//     return {
//       code: 200,
//       message: 'Subscription created',
//       data: subscription.id,
//     };
//   } catch (error) {
//     if (error instanceof ApiError) {
//       // If it's an instance of ApiError, send the error response
//       return {
//         code: error.statusCode,
//         message: error.message,
//         data: null,
//       };
//     } else {
//       // For other unexpected errors, log the error and send a generic error response
//       console.error('Unexpected error:', error);
//       return {
//         code: httpStatus.INTERNAL_SERVER_ERROR,
//         message: 'Internal Server Error',
//         data: null,
//       };
//     }
//   }
// };

// const saveSubscription = async req => {
//   try {
//     const subscriptionData = req.body;

//     console.log({ subscriptionData });

//     const { email } = req.params;

//     if (!email) {
//       throw new ApiError(500, 'User email is empty');
//     }

//     if (!subscriptionData) {
//       throw new ApiError(500, 'No Subscription data!');
//     }

//     const targetUser = await User.findOne({
//       email,
//     });

//     const now = new Date();

//     const updatedSubscription = {
//       ...subscriptionData,
//       billedAt: now,
//     };

//     // Update the user's subscription data
//     const updatedUser = await User.findByIdAndUpdate(
//       targetUser._id,
//       {
//         $set: {
//           subscription: updatedSubscription,
//         },
//       },
//       { new: true },
//     );

//     return {
//       code: 200,
//       message: 'Subscription Saved',
//       data: updatedUser,
//     };
//   } catch (error) {
//     if (error instanceof ApiError) {
//       // If it's an instance of ApiError, send the error response
//       return {
//         code: error.statusCode,
//         message: error.message,
//         data: null,
//       };
//     } else {
//       // For other unexpected errors, log the error and send a generic error response
//       console.error('Unexpected error:', error);
//       return {
//         code: httpStatus.INTERNAL_SERVER_ERROR,
//         message: 'Internal Server Error',
//         data: null,
//       };
//     }
//   }
// };

export const UserService = {
  signin,
  signup,
  getUserProfile,
  getAllUsers,
  deleteUser,
  createGoogleUser,
  updateUserImage,
  updateUser,
  forgotPassword,
  resetPassword,
  activateReferral,
  // createSubscription,
  // saveSubscription,
};
