const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'app is healthy', data: true });
});

app.post('/user', async (req, res) => {
    const data = req.body;
    try {
        const response = await prisma.user.create({ data });
        res.status(201).json({ message: 'user created', data: response });
    } catch (err) {
        res.status(500).json({ message: 'internal server error', error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});