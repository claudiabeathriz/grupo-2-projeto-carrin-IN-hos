import { buscarCarros } from "./api.js";

function formatarValor(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

function criarReservaCard(carro) {
  const li = document.createElement("li");
  li.className = "info-card";

  li.innerHTML = `
    <img class="car-img" src="${carro.url_imagem || "https://via.placeholder.com/260x160?text=Imagem"}" alt="${carro.nome}" />
    <div class="reserve-card-content">
      <div>
        <h2 class="car-name">${carro.nome}</h2>
        <span class="car-activity">${carro.categoria ? carro.categoria.charAt(0).toUpperCase() + carro.categoria.slice(1) : "Veículo"}</span>
      </div>
      <p class="reserve-card-meta">
        <span class="car-id">#${carro.id}</span> •
        <span class="car-days">${carro.locatario?.data_inicio_aluguel || "N/A"} → ${carro.locatario?.data_devolucao_prevista || "N/A"}</span> •
        <strong class="car-price">${formatarValor(carro.valor_aluguel_dia)}</strong>
      </p>
      <p class="car-dates">Retirada: ${carro.locatario?.data_inicio_aluguel || "—"} | Devolução: ${carro.locatario?.data_devolucao_prevista || "—"}</p>
    </div>
    <div class="card-actions">
      <a href="detalhes.html?id=${carro.id}" class="btn-details">Ver Detalhes</a>
      <button type="button" class="btn-cancel" disabled>Cancelar</button>
    </div>
  `;

  return li;
}

function renderReservas(reservas) {
  const list = document.querySelector("#reserve-list");
  if (!list) return;

  list.innerHTML = "";

  if (!reservas.length) {
    list.innerHTML = `<p class="home__empty">Nenhuma reserva encontrada no momento.</p>`;
    return;
  }

  reservas.forEach((carro) => list.appendChild(criarReservaCard(carro)));
}

async function carregarReservas() {
  try {
    const carros = await buscarCarros();
    const reservas = carros.filter(
      (carro) => carro.status_disponibilidade?.toLowerCase() === "alugado",
    );
    renderReservas(reservas);
  } catch (error) {
    const list = document.querySelector("#reserve-list");
    if (list) {
      list.innerHTML = `<p class="home__empty">Erro ao carregar reservas: ${error.message}</p>`;
    }
    console.error("Erro ao carregar reservas:", error);
  }
}

document.addEventListener("DOMContentLoaded", carregarReservas);
