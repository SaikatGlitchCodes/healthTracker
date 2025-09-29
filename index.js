const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).json({ message: 'app is healthy', data: true });
});

// User routes
app.use('/user', require('./app/route/user'))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});