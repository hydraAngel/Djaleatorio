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
  fs.readdir(path.join(process.cwd(), "letras_agrupadas"), (err, files) => {
    if (err) {
      console.error('Erro ao ler diretório:', err);
      return res.status(500).json({ status: "error", message: "Erro ao ler arquivos" });
    }

    const index = Math.floor(Math.random() * files.length);
    const file = files[index];

    try {
      // Lê o arquivo JSON com os versos agrupados
      const conteudoJson = fs.readFileSync(path.join(process.cwd(), "letras_agrupadas", file), "utf-8");
      const dados = JSON.parse(conteudoJson);
      
      // Obtém o álbum do arquivo JSON
      const album = dados.album;
      
      // Seleciona um grupo aleatório de versos
      const grupos = dados.grupos_versos;
      const grupoAleatorio = grupos[Math.floor(Math.random() * grupos.length)];
      
      // Garante que temos pelo menos dois versos para retornar
      let versosParaRetornar = grupoAleatorio;
      if (grupoAleatorio.length === 1) {
        // Se o grupo tiver apenas um verso, adiciona um verso de outro grupo
        const outroGrupoIndex = (Math.floor(Math.random() * grupos.length) + 1) % grupos.length;
        const outroGrupo = grupos[outroGrupoIndex];
        versosParaRetornar = [grupoAleatorio[0], outroGrupo[0]];
      }
      
      // Limita a dois versos se houver mais
      if (versosParaRetornar.length > 2) {
        versosParaRetornar = versosParaRetornar.slice(0, 2);
      }
      
      // Junta os versos selecionados com um ponto e vírgula (;) entre eles
      const versoAleatorio = versosParaRetornar.join("; ");
      
      // Reconstrói a letra completa para manter compatibilidade com a resposta original
      const letraSemAlbum = grupos.flat().join("\n");
      
      // Obtém informações do álbum do arquivo JSON externo
      const jsondata = JSON.parse(fs.readFileSync('./assets/test1.json', 'utf8'));
      const albums = jsondata['letras'].reverse();
      const albumInfo = albums.find(item => item.name === album);
      const numAlbum = albumInfo?.num || null;

      // Retorna o mesmo formato de resposta que a função original
      res.json({
        status: "ok",
        musica: file.replace(".json", ""),
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
