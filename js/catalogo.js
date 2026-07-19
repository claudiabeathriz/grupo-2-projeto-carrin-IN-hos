async function fetchCarrinhos(){
    try {
        const response =  await fetch(
            "http://localhost:3001/carros"
        )

        if (!response.ok) { throw new Error(`Erro na requisição: ${response.status}`); }

        const text = await response.text();
        const data = JSON.parse(text);
        return data;

    } catch(error){
        console.error("Erro!: ", error);
    }
}

async function init(){
    const carros = await fetchCarrinhos();
    if (!carros) {
        console.error("Não foi possível carregar os veículos.");
        return;
    }
    const catalogRender = new CatalogueRender(carros, "#catalogue", "#page-buttons");
    catalogRender.init();
}

init();


