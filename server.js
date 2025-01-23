const express = require('express');
const app = express()
const path = require('path');
const router = require('./router')
const cors = require('cors');

const {authenticateSession} = require('./src/api/middleware/session');
const port = 9091;

app.use(express.static(path.join(__dirname, 'src')));
app.use('/index',authenticateSession);
// Configuração do motor de templates EJS
app.set('view engine', 'ejs');
// Configura o diretório onde os templates EJS serão armazenados
app.set('views', path.join(__dirname,'src','views'));
app.use(express.json());

app.use(router);

app.listen(port,()=>{
    console.log('rodando em http://localhost:9091 ');
})