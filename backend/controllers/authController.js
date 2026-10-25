import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || "HOS_SECRET_KEY_FOR_LOCAL_DEV";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await db.users.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'customer',
      addresses: [],
      savedSizes: {}
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await db.users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses || [],
      savedSizes: user.savedSizes || {},
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

export const updateAddresses = async (req, res) => {
  try {
    const { addresses } = req.body;
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ message: 'Addresses must be an array' });
    }

    const user = await db.users.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format new address items with random IDs if not present
    const formattedAddresses = addresses.map(addr => ({
      id: addr.id || `addr-${Math.random().toString(36).substring(2, 9)}`,
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
      phone: addr.phone,
      isDefault: addr.isDefault || false
    }));

    await db.users.updateOne({ _id: req.user._id }, { addresses: formattedAddresses });
    res.json({ message: 'Addresses updated successfully', addresses: formattedAddresses });
  } catch (error) {
    console.error('Address update error:', error);
    res.status(500).json({ message: 'Server error updating addresses' });
  }
};

export const updateSavedSizes = async (req, res) => {
  try {
    const { savedSizes } = req.body;
    if (!savedSizes || typeof savedSizes !== 'object') {
      return res.status(400).json({ message: 'Invalid savedSizes body' });
    }

    const user = await db.users.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.users.updateOne({ _id: req.user._id }, { savedSizes });
    res.json({ message: 'Saved sizes updated successfully', savedSizes });
  } catch (error) {
    console.error('Size update error:', error);
    res.status(500).json({ message: 'Server error updating sizes' });
  }
};
