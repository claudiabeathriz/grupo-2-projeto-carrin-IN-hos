const API = "http://localhost:3001/carros";

/** buscar todos */
export async function buscarCarros() {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os carros.");
  }

  return await response.json();
}

/** buscar por id */
export async function buscarCarro(id) {
  return buscarCarroPorId(id);
}

export async function buscarCarroPorId(id) {
  const response = await fetch(`${API}/${id}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar o carro.");
  }

  return await response.json();
}

/** buscar somente carros disponíveis */
export async function buscarDisponiveis() {
  const carros = await buscarCarros();

  return carros.filter(
    (carro) => carro.status_disponibilidade === "disponivel",
  );
}

/** buscar por categoria */
export async function buscarPorCategoria(categoria) {
  const carros = await buscarCarros();

  return carros.filter(
    (carro) => carro.categoria?.toLowerCase() === categoria.toLowerCase(),
  );
}

/** buscar por nome */
export async function buscarPorNome(nome) {
  const carros = await buscarCarros();
  const termo = nome.toLowerCase();

  return carros.filter((carro) => carro.nome.toLowerCase().includes(termo));
}

/** reservar veículo */
export async function reservarCarro(id, locatario) {
  const carro = await buscarCarroPorId(id);

  const dadosAtualizados = {
    ...carro,
    disponivel: false,
    status_disponibilidade: "alugado",
    locatario,
  };

  return atualizarCarro(id, dadosAtualizados);
}

/** atualizar veículo */
export async function atualizarCarro(id, dados) {
  const response = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o carro.");
  }

  return await response.json();
}

/** cancelar reserva */
export async function cancelarReserva(id) {
  const carro = await buscarCarroPorId(id);

  const dadosAtualizados = {
    ...carro,
    disponivel: true,
    status_disponibilidade: "disponivel",
    locatario: null,
  };

  return atualizarCarro(id, dadosAtualizados);
}
