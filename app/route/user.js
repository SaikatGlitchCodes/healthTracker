const express = require('express');
const Router = express().router;
const prisma = require('../../util/primaInit');
const cloudinary = require('../../util/cloudinary');
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });
const bcrypt = require('bcrypt');
const isAuthenticatedRoute = require('../middleware/auth/isAuthenticated');

Router.post('/image-upload/:id', upload.single("image"), async (req, res) => {
    console.log('Uploading files from the browser');
    const { id } = req.params;
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_profile",
        });

        const reponse =await prisma.user.update({
            where: { id: Number(id) },
            data: { profile_img: result.secure_url }
        })

        res.json({
            message: "Image uploaded successfully",
            data: reponse

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Image upload failed" });
    }
});

Router.post('/', async (req, res) => {
    const {name, email, password, age, profile_img} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const response = await prisma.user.create({data:{name, email, hashedPassword, age, profile_img}});
        res.status(201).json({ message: 'user created', data: response });
    } catch (err) {
        res.status(500).json({ message: 'internal server error', error: err.message });
    }
});

Router.get('/',isAuthenticatedRoute ,async(req, res)=>{
    try{
        const response = await prisma.user.findFirstOrThrow({where : { id: Number(req.user)}});
        res.status(200).json({ message: 'Found a user', data: response });
    }catch(err){
        res.status(500).json({ message: 'User not found', error: err.message });
    }
});

Router.patch('/:id', async(req,res)=>{
    const {id} = req.params;
    const data = req.body;
    try{
        const response = await prisma.user.update({
            where:{id: Number(id)},
            data: data
        })
        res.status(200).json({ message: 'Updated successfully', data: response });
    }catch(err){
        res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
});

Router.delete('/:id', async(req, res)=>{
    const {id} = req.params;
     try{
        const response = await prisma.user.delete({
            where:{id: Number(id)}
        })
        res.status(200).json({ message: 'Deleted successfully', data: response });
    }catch(err){
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
});

module.exports = Router;
