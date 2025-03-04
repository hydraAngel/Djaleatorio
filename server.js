// djaleatorio

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const { log } = console;


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

app.listen(porta, '0.0.0.0', () => {
  log(`Server aberto na porta ${porta}`);
});
