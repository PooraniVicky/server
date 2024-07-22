import express from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();
const userRouter = express.Router();

// Register user
userRouter.post('/register', async (req, res) => {
    
    const { firstName, lastName, email, password , role } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword, role });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }

});

// Login user
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.json({ message: error.message });
    console.error("Error:", error);
  }
});
// Update user details
userRouter.put('/users/:userId', authenticate, async (req, res) => {
  try {
      const { userId } = req.params;
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
  }
});
// Delete user
userRouter.delete('/users/:userId', authenticate, async (req, res) => {
  try {
      const { userId } = req.params;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
  }
});
// // Get all users
userRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send();
    }
});

// Get user by ID
userRouter.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});



// Get user details
userRouter.get('/user/details', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ firstName: user.firstName, lastName: user.lastName, role: user.role, userId: user._id, enrollStatus: user.enrollStatus, email: user.email });
  console.log("user:", user)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user role = instructor
userRouter.get('/user/instructor', authenticate, async (req, res) => {
  try {
    const instructors = await User.find({role: 'instructor'});
    if (!instructors) {
      return res.status(404).json({ message: 'instructor not found' });
    }
    res.json( instructors );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user details
userRouter.put('/user/update', authenticate, async (req, res) => {
  const userId = req.userId
  const updatedDetails = req.body;

  try {
      // Find the user by ID and update the details
      const user = await User.findByIdAndUpdate(userId, updatedDetails, { new: true });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ message: 'Server error' });
  }
});

// forgot-password route 
userRouter.post('/forgot-password', async (req, res) => {

    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not registered' });
      }
  //generating token
      const token = crypto.randomBytes(20).toString('hex');
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.DEMO_EMAIL,
          pass: process.env.DEMO_PASSWORD
      },
        tls: { rejectUnauthorized: false },
      });
  
      const mailOptions = {
        from: process.env.DEMO_EMAIL,
        to: email,
        subject: 'Reset Password',
        text: `Click the following link to reset your password: http://localhost:5173/reset-password/${token}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Failed to send password reset email' });
        } else {
          // console.log('Password reset email sent:', info.response);
          return res.status(200).json({ message: 'reset link sent to your email successfully' });
        }
      });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  // reset-password route
userRouter.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    try {
        const user = await User.findOne({
          resetToken: token,
          resetTokenExpiry: { $gt: Date.now() }
        });
   
        if (!user) {
          return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
    
        return res.status(200).json({ status: true, message: 'Password reset successfully.' });
      } catch (error) {
        console.error('Error occurred while resetting password:', error);
        return res.status(500).json({ status: false, message: 'Failed to reset password. Please try again later.' });
      }
    });

export default userRouter;
