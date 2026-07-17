const API = "http://localhost:3001/carros";

/** função para buscar todos */
export async function buscarCarros() {
  const response = await fetch(API);

  return await response.json();
}

/** função para buscar por id */
export async function buscarCarro(id) {
  const response = await fetch(`${API}/${id}`);

  return await response.json();
}

export async function atualizarCarro(id, dados) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(dados),
  });
}
