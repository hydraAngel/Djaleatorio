// helper genérico para crossfade de qualquer elemento
function crossfadeElement(el, updateFn) {
  // se estiver escondido, é o primeiro fade‑in
  if (el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    updateFn();                // atualiza conteúdo antes do fade‑in
    el.style.opacity = 0;      // garante começar transparente
    // força recálculo de estilo
    void el.offsetWidth;
    el.classList.add('fade-in');
    el.addEventListener('transitionend', function cleanup() {
      el.removeEventListener('transitionend', cleanup);
      el.classList.remove('fade-in');
      el.style.opacity = '';
    }, { once: true });
  } else {
    // fade‑out → trocar conteúdo → fade‑in
    el.classList.add('fade-out');
    el.addEventListener('transitionend', function handler() {
      el.removeEventListener('transitionend', handler);
      updateFn();
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
      el.addEventListener('transitionend', function cleanup() {
        el.removeEventListener('transitionend', cleanup);
        el.classList.remove('fade-in');
      }, { once: true });
    }, { once: true });
  }
}

// helper específico para a imagem (mantém seu código anterior)
function trocaImagem(novoSrc) {
  const img = document.getElementById('imagem');
  img.classList.add('fade-out');
  img.addEventListener('transitionend', function handler() {
    img.removeEventListener('transitionend', handler);
    img.src = novoSrc;
    img.classList.remove('fade-out');
    img.classList.add('fade-in');
    img.addEventListener('transitionend', function cleanup() {
      img.removeEventListener('transitionend', cleanup);
      img.classList.remove('fade-in');
    }, { once: true });
  }, { once: true });
}

// função principal
function generateVerso() {
  fetch("/generate")
    .then((response) => response.json())
    .then((data) => {
      // imagem
      trocaImagem("/assets/" + data.num_album + ".jpg");

      // verso
      const h2 = document.getElementById("versogerado");
      crossfadeElement(h2, () => {
        h2.innerHTML = '"' + data.verso + '"';
      });

      // música
      const h3 = document.getElementById("qualmusica");
      crossfadeElement(h3, () => {
        h3.innerHTML =
          "Djavan em: <b>" + data.musica.replace(".text", "") + "</b>";
      });
    });
}
