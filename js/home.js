import { buscarCarros } from "./api.js";

function formatarValor(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

function obterLabelStatus(status) {
  const statusMap = {
    disponivel: "Disponível",
    alugado: "Alugado",
    manutencao: "Manutenção",
  };

  return statusMap[status] || "Indisponível";
}

function criarCard(carro) {
  const article = document.createElement("article");
  article.className = "vehicle-card";

  article.innerHTML = `
    <img src="${carro.url_imagem || "./assets/images/placeholder.jpg"}" alt="${carro.nome}" />
    <div class="vehicle-card__content">
      <div class="vehicle-card__top">
        <h3>${carro.nome}</h3>
        <span class="vehicle-card__badge">${obterLabelStatus(carro.status_disponibilidade)}</span>
      </div>
      <p class="vehicle-card__info">${carro.universo_origem || "Veículo icônico"}</p>
      <p class="vehicle-card__price">${formatarValor(carro.valor_aluguel_dia)} / dia</p>
    </div>
  `;

  return article;
}

function renderizarCards(container, carros) {
  if (!container) return;

  container.innerHTML = "";

  if (!carros.length) {
    container.innerHTML =
      '<p class="home__empty">Nenhum veículo encontrado no momento.</p>';
    return;
  }

  carros.forEach((carro) => {
    container.appendChild(criarCard(carro));
  });
}

async function carregarHome() {
  const heroCards = document.querySelector("#hero-cards");
  const listaDestaques = document.querySelector("#lista-destaques");

  try {
    const carros = await buscarCarros();
    const destaques = carros.slice(0, 4);

    renderizarCards(heroCards, destaques);
    renderizarCards(listaDestaques, destaques);
  } catch (error) {
    if (heroCards) {
      heroCards.innerHTML = `<p class="home__empty">${error.message}</p>`;
    }

    if (listaDestaques) {
      listaDestaques.innerHTML = `<p class="home__empty">${error.message}</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", carregarHome);
