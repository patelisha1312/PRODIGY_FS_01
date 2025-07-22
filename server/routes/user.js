import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';

const router = express.Router();

/* ----------  SIGN‑UP  ---------- */
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ status: false, message: 'All fields are required' });
        }

        const exists = await User.findOne({ email: email.trim().toLowerCase() });
        if (exists) {
            return res.status(409).json({ status: false, message: 'User already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);
        await new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashed,
        }).save();

        return res.status(201).json({ status: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

/* ----------  LOGIN  ---------- */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ status: false, message: 'All fields are required' });

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user)
            return res.status(404).json({ status: false, message: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ status: false, message: 'Incorrect password' });

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        res.json({ status: true, message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

/* ----------  FORGOT PASSWORD  ---------- */
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user)
            return res.status(404).json({ status: false, message: 'User not registered' });

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const link = `http://localhost:5173/resetPassword/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `Reset your password here: ${link}`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Email error:', error);
                return res.status(500).json({ status: false, message: 'Error sending email' });
            }
            res.json({ status: true, message: 'Email sent' });
        });
    } catch (err) {
        console.error('Forgot‑password error:', err);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

/* ----------  RESET PASSWORD  ---------- */
router.post('/resetPassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const hashed = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(decoded.id, { password: hashed });
        res.json({ status: true, message: 'Password updated' });
    } catch (err) {
        console.error('Reset‑password error:', err);
        res.status(400).json({ status: false, message: 'Invalid or expired token' });
    }
});
/* ----------  VERIFY TOKEN  ---------- */
const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(401).json({ status: false, message: 'Invalid or expired token' });
  }
};

router.get('/verify', verifyUser, (req, res) => {
  return res.json({ status: true, message: 'Authorized' });
});
router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({status:true})
})

export { router as UserRouter };
