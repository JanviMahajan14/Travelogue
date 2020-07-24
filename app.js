const express = require('express');
const mongoose = require('mongoose');
const {MONGO_URI} = require('./config/keys');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(MONGO_URI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
});

mongoose.connection.on('connected',()=>{
    console.log("Mongodb is connected!");
})

app.use(cors());
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/people'));

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(port,()=>{
    console.log("Server is running on port ",port);
})