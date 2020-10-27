const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/connectDB');



const app = express();

//import routes
const authRoute = require('./routes/auth');

app.use(express.json());
app.use(cors());

//middleware
app.use('/api', authRoute);



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is listen on port ${PORT}`);
})