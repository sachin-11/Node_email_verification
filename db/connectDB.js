const mongoose = require('mongoose');

//connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
}).then(() => console.log('DB connection establish'))
.catch(err => console.log('DB connection error', err))