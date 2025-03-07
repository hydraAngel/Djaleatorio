// djaleatorio

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const { log } = console;
const https = require('https');
const fs = require("fs");
const app = express();
const porta = 3000;

const logRequest = (req, res, next) => {
  console.log(`${req.method} request from ${req.ip} to ${req.path}`);
  next();
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(logRequest);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const num = getRandomInt(1, 27);
  res.render("index", { num });
});

app.get("/generate", (req, res) => {
  fs.readdir(path.join(process.cwd(), "letras"), (err, files) => {
    let max = files.length - 1;
    let min = 0;

    let index = Math.round(Math.random() * (max - min) + min);
    let file = files[index];

    log("Random file is", file);
    var letra = fs.readFileSync(path.join(process.cwd(), "letras", file), "utf-8");
    
    letra = letra.replace(/^Album:.*$/gm, '');
    var versos = letra.split("\n");
    var versos_sem_versos_vazios = [];
    for (var i = 0; i < versos.length; i++) {
        if (versos[i].trim() != "") {
            versos_sem_versos_vazios.push(versos[i]);
        }
    }
    var verso_aleatorio = versos_sem_versos_vazios[Math.floor(Math.random() * versos_sem_versos_vazios.length)];


    res.json({ status: "ok", musica: file.replace(".txt", ""), letra: fs.readFileSync(path.join(process.cwd(), "letras", file), "utf-8"), verso: verso_aleatorio});
});
  
  
});

app.listen(porta, '0.0.0.0', () => {
  log(`Server aberto na porta ${porta}`);
});
