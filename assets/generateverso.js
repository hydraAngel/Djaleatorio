async function generateVerso2() {
  const response = await fetch("/generate");
  const data = await response.json();
  return data;
}

function generateVerso() {
  fetch("/generate")
    .then((response) => response.json())
    .then((data) => {
      const imagem = document.getElementById("imagem");
      imagem.src = "/assets/" + data["num_album"] + ".jpg";
      const h2verso = document.getElementById("versogerado");
      h2verso.innerHTML = '"' + data["verso"] + '"';
      h2verso.classList.remove("hidden");
      const h3musica = document.getElementById("qualmusica");
      h3musica.innerHTML =
        "Djavan em: <b>" + data["musica"].replace(".text", "") + "</b>";
      h3musica.classList.remove("hidden");
    });
}