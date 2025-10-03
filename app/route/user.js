const express = require('express');
const Router = express.Router();
const prisma = require('../../util/primaInit');
const cloudinary = require('../../util/cloudinary');
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });
const bcrypt = require('bcrypt');
const isAuthenticatedRoute = require('../middleware/auth/isAuthenticated');

Router.post('/image-upload', isAuthenticatedRoute, upload.single("image"), async (req, res) => {
    console.log('Uploading files from the browser');
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_profile",
        });

        const response = await prisma.user.update({
            where: { id: Number(req.user.id) },
            data: { profile_img: result.secure_url }
        });

        res.json({
            message: "Image uploaded successfully",
            data: response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Image upload failed" });
    }
});

// Register a new user
Router.post('/register', async (req, res) => {
    const {name, email, password, age, profile_img} = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                age,
                profile_img
            }
        });

        // Create session for the new user
        req.user.id = user.id;
        
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                profile_img: user.profile_img
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
});

// Logout user
Router.post('/logout', isAuthenticatedRoute, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err.message });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

Router.get('/', isAuthenticatedRoute, async(req, res) => {
    try {
        const response = await prisma.user.findFirstOrThrow({
            where: { id: Number(req.user.id) }
        });
        res.status(200).json({ message: 'Found a user', data: response });
    } catch(err) {
        res.status(500).json({ message: 'User not found', error: err.message });
    }
});

Router.patch('/', isAuthenticatedRoute, async(req, res) => {
    const userId = req.user.id;
    const data = req.body;
    try {
        const response = await prisma.user.update({
            where: { id: Number(userId) },
            data: data
        });
        res.status(200).json({ message: 'Updated successfully', data: response });
    } catch(err) {
        res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
});

Router.delete('/', isAuthenticatedRoute, async(req, res) => {
    try {
        const response = await prisma.user.delete({
            where: { id: Number(req.user.id) }
        });
        // Destroy the session after deleting the user
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });
        res.status(200).json({ message: 'User deleted successfully', data: response });
    } catch(err) {
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
});

module.exports = Router;
