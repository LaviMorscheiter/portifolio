let zAtual = 10

function trazerParaFrente(janelaElement){
  zAtual++
  janelaElement.style.zIndex = zAtual
}

async function abrirJanela(id, titulo) {
  const idCompleto = `#janela-${id}`;

  if (document.querySelector(idCompleto)) {
    document.querySelector(idCompleto).style.display = 'flex';
    return;
  }

  const janela = document.createElement('div');
  janela.className = 'window';
  janela.id = `janela-${id}`;
  janela.style.display = 'flex';
  janela.innerHTML = `
    <div class="window-titlebar">
      <span>${titulo}</span>
      <button>[X]</button>
    </div>
    <div class="window-content"></div>
  `;
  document.body.appendChild(janela);
  trazerParaFrente(janela);

  const resposta = await fetch(`windows/${id}.html`);
  janela.querySelector('.window-content').innerHTML = await resposta.text();

  tornarArrastavel(janela);
  janela
    .querySelector('.window-titlebar button')
    .addEventListener('click', () => {
      janela.style.display = 'none';
    });
}

function tornarArrastavel(janelaElement) {
  let arrastando = false;
  let offsetX = 0;
  let offsetY = 0;

  const titlebar = janelaElement.querySelector('.window-titlebar');

  titlebar.addEventListener('mousedown', function (e) {
    trazerParaFrente(janelaElement);
    arrastando = true;
    offsetX = e.clientX - janelaElement.getBoundingClientRect().left;
    offsetY = e.clientY - janelaElement.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', function (e) {
    if (arrastando) {
      let novoX = e.clientX - offsetX;
      let novoY = e.clientY - offsetY;

      novoX = Math.max(0,Math.min(novoX,window.innerWidth - janelaElement.offsetWidth));
      novoY = Math.max(0, Math.min(novoY, window.innerHeight - janelaElement.offsetHeight));

      janelaElement.style.left = `${novoX}px`;
      janelaElement.style.top = `${novoY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    arrastando = false;
  });
}
