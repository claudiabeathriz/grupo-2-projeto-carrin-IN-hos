document.addEventListener("DOMContentLoaded", () => {initialiseDetailsPage();})

async function initialiseDetailsPage(){
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get("id");
        if(!carId) {throw new Error("CarIdNotFound");}

        const response = await fetch(`http://localhost:3001/carros/${carId}`);
        if(!response.ok) {throw new Error("Carro não encontrado");}

        const car = await response.json();
        renderDetailsPage(car);
    } catch(error) {
        console.error("Erro: ", error);
    }
}

function renderDetailsPage(car) {
    if(!car) return;
    document.title = `${car.nome}`
    renderPage(car);
    configureReservarBtn(car);
    document.querySelectorAll('.car-availability').forEach(k => {matchBackColour(k, car)});
}

function matchBackColour(el, car) {
    if(car.status_disponibilidade !== "disponivel"){
        el.style.backgroundColor = "#4e0606";
        el.style.color = "#ef4444";
    }
}

function configureReservarBtn(car) {
    const reservarBtn = document.querySelector("#reserve-btn");
    if (!reservarBtn) return;
    let disabledAttr;
    

    if(car.status_disponibilidade.toLowerCase() === "disponivel"){
        reservarBtn.disabled=false;
    } else {
        reservarBtn.disabled=true;
    }

    reservarBtn.addEventListener('click', () => {window.location.href = `reserva.html?id=${car.id}`;});
}

