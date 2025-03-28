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

app.get("/game", (req, res) => {
  const num = getRandomInt(1, 27);
  res.render("game", { num });
});

app.get("/generate", (req, res) => {
  fs.readdir(path.join(process.cwd(), "letras"), (err, files) => {
    if (err) {
      console.error('Erro ao ler diretório:', err);
      return res.status(500).json({ status: "error", message: "Erro ao ler arquivos" });
    }

    const index = Math.floor(Math.random() * files.length);
    const file = files[index];

    try {
      const letra = fs.readFileSync(path.join(process.cwd(), "letras", file), "utf-8");
      const album = letra.split("\n").pop().replace('Album: ', '');
      const letraSemAlbum = letra.replace(/^Album:.*$/gm, '');
      
      const versos = letraSemAlbum
        .split("\n")
        .filter(verso => verso.trim() !== "");
      
      const versoAleatorio = versos[Math.floor(Math.random() * versos.length)];
      
      const jsondata = JSON.parse(fs.readFileSync('./assets/test1.json', 'utf8'));
      const albums = jsondata['letras'].reverse();
      const albumInfo = albums.find(item => item.name === album);
      const numAlbum = albumInfo?.num || null;

      res.json({
        status: "ok",
        musica: file.replace(".txt", ""),
        letra: letraSemAlbum,
        verso: versoAleatorio,
        num_album: numAlbum
      });

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      res.status(500).json({ status: "error", message: "Erro ao processar arquivo" });
    }
});
  
  
});

app.listen(porta, '0.0.0.0', () => {
  log(`Server aberto na porta ${porta}`);
});
