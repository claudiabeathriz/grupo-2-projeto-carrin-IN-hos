document.addEventListener("DOMContentLoaded", () => {
    initialiseRentalPage();

    const diasInput = document.querySelector("#dias-aluguel");
    if (diasInput) {
        diasInput.addEventListener('input', calcularTotal);
    }
});

async function initialiseRentalPage(){
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get("id");
        if(!carId) {throw new Error("CarIdNotFound");}

        const response = await fetch(`http://localhost:3001/carros/${carId}`);
        if(!response.ok) {throw new Error("Carro não encontrado");}

        const car = await response.json();
        renderRentalPage(car);
    } catch(error) {
        console.error("Erro: ", error);
    }
}

function calcularTotal() {
    const void2Calc = document.querySelector(".calculo-carro");
    const value2Calc1 = document.querySelector("#dias-aluguel");
    const value2Calc2 = document.querySelector(".car-value");
    if (!void2Calc || !value2Calc1 || !value2Calc2) return;

    const dias = Number(value2Calc1.value);
    const preco = Number(value2Calc2.textContent.replace('R$', '').replace(',', '.').trim());
    const total = dias * preco;

    void2Calc.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function renderRentalPage(car) {
    if(!car) return;
    document.title = `${car.nome}`
    renderPage(car);
    const carNameOverlay = document.querySelector(".car-name-overlay");
    if(carNameOverlay) carNameOverlay.textContent = car.nome;
    calcularTotal();
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form-container");
    form.addEventListener("submit", handleReservaSubmit);
});

async function handleReservaSubmit(event) {
    event.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const cpf = document.querySelector("#cpf").value.trim();
    const email = document.querySelector("#email").value.trim();
    const telefone = document.querySelector("#telefone").value.trim();
    const retiradaLocal = document.querySelector("#retirada-local").value.trim();
    const retiradaData = document.querySelector("#retirada-data").value.trim();
    const devolucaoData = document.querySelector("#devolucao-data").value.trim();

    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("id");

    if (!carId) {
        console.error("Id do carro não encontrado na URL.");
        return;
    }

    const submitBtn = document.querySelector("#confirm-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Reservando...";

    try {
        const response = await fetch(`http://localhost:3001/carros/${carId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status_disponibilidade: "alugado",
                locatario: {
                    nome: nome,
                    documento: cpf,
                    data_inicio_aluguel: retiradaData,
                    data_devolucao_prevista: devolucaoData,
                    telefone: telefone
                }
            })
        });

        console.log("Status da resposta:", response.status);  // ADICIONE ISTO


        if(!response.ok) {throw new Error(`Erro ao reservar: ${response.status}`);}

        const carroAtualizado = await response.json();
        onReservaSuccess(carroAtualizado);

    } catch (error) {
        console.error("Erro ao confirmar reserva: ", error);
        submitBtn.disabled = false;
        submitBtn.textContent = "CONFIRMAR RESERVA";
    }
}

function onReservaSuccess(carro) {
    const submitBtn = document.querySelector("#confirm-btn");
    submitBtn.textContent = `Reserva confirmada para ${carro.nome}!`;
    setTimeout(() => {window.location.href = "index.html";}, 5000);
}
