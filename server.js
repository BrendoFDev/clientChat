const express = require('express');
const app = express()
const path = require('path');

const port = 9091;

app.use(express.static(path.join(__dirname, 'src')));

// Configuração do motor de templates EJS
app.set('view engine', 'ejs');
// Configura o diretório onde os templates EJS serão armazenados
app.set('views', path.join(__dirname,'src'));

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(port,()=>{
    console.log('rodando em http://localhost:9091 ');
})