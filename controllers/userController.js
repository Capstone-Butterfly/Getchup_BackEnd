const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// User Registration
const createAccount = async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      session.endSession();
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save({ session });

    const newProfile = new Profile({
      user_id: savedUser._id,
      phone,
    });

    await newProfile.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Authentication failed' });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const editProfile = async (req, res) => {
  const { userId } = req.params;
  const { first_name, last_name, email, phone, music, user_type, task_reminder, movement_reminder, notification } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;

    const updatedUser = await user.save();

    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (phone) profile.phone = phone;
    if (music) profile.music = music;
    if (user_type) profile.user_type = user_type;
    if (task_reminder !== undefined) profile.task_reminder = task_reminder;
    if (movement_reminder !== undefined) profile.movement_reminder = movement_reminder;
    if (notification !== undefined) profile.notification = notification;

    await profile.save();

    res.json({ message: 'Profile updated successfully', user: updatedUser, profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    //don't include the password in the response
    const { password, ...userData } = user.toObject();
    const userProfile = profile.toObject();

    res.json({ user: userData, profile: userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createAccount, login, editProfile, getUserById };

