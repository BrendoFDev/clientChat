const express = require('express');
const app = express()
const path = require('path');
const router = require('./router')
const cors = require('cors');
const axios = require('axios');

const {authenticateSession} = require('./src/api/middleware/session');
const port = 9091;

app.use(express.static(path.join(__dirname, 'src')));

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'src','views'));
app.use(express.json());

// app.use('/index',authenticateSession)
app.use((req, res, next) => {
    axios.defaults.baseURL = 'http://localhost:3001';
    next();
});

app.use(cors({
    origin: ['http://localhost:3001','http://localhost:3000'], 
    credentials: true,
}));

app.use(router);

app.listen(port,()=>{
    console.log('rodando em http://localhost:9091 ');
})