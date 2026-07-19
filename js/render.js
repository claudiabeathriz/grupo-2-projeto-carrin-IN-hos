
function renderPage(car){
    if(!car) return;
    document.querySelectorAll('.car-name').forEach(k => { k.textContent = car.nome; });

    document.querySelectorAll('.car-img').forEach(k => { 
        k.src = car.url_imagem; 
        k.alt = 'foto ' + car.nome; 
    })

    /*
        apesar da data envolta por parenteses do modelo optei por traço, 
        pois parenteses já sao usados em alguns titulos de obra no json
    */

    document.querySelectorAll('.car-universe').forEach(k => { 
        k.textContent = car.universo_origem + `- ${car.ano_obra}`;
    })

    document.querySelectorAll('.car-availability').forEach(k => {
        k.textContent = car.status_disponibilidade.charAt(0).toUpperCase()+car.status_disponibilidade.slice(1);
    });

    document.querySelectorAll('.car-value').forEach(k => {k.textContent=`R$ ${car.valor_aluguel_dia}`});

    document.querySelectorAll(".car-category").forEach(k => {k.textContent = car.categoria;});

}

class CatalogueRender {

    #data
    
    #catalogueContainer = document.querySelector("#catalogue");
    #buttonPageContainer = document.querySelector("#page-buttons");

    #pageLimit = 4;
    #pageNumber = 1;

    #range = 4; 
    #currentSliceStart = 1;

    #totalPaginas;

    #isFiltered = false;
    #filterType = null;

    #searchTerm = "";


    constructor(data, catalogueContainer, buttonPageContainer, pageLimit=4, range=4) {

        this.#data = data;
        this.#catalogueContainer = document.querySelector(catalogueContainer);
        this.#buttonPageContainer = document.querySelector(buttonPageContainer);

        this.#pageLimit = pageLimit;
        this.#range = range;

        this.#totalPaginas = Math.ceil(data.length/this.#pageLimit);
    }

    init(){
        this.#renderCatalog();

        this.#buttonPageContainer.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.page-btn');
            if (!clickedButton || clickedButton.disabled) return;

            const btnText = clickedButton.textContent.trim();

            let maxSliceStart = this.#totalPaginas - this.#range + 1;

            if (btnText === '<') {
                if (this.#currentSliceStart > 1) {
                    this.#currentSliceStart--;
                }
                this.#renderBtns(); 
            } else if (btnText === '>') {
                if (this.#currentSliceStart < maxSliceStart) {
                    this.#currentSliceStart++;    
                }
                this.#renderBtns();
            } else {
                this.#pageNumber = parseInt(btnText);
                this.#renderCatalog(this.#isFiltered, this.#filterType);
            }
        });

    
        this.#configureFilterBtns();
    }

    #configureFilterBtns(){
        //má prática, mas farei por falta de tempo.
        //filtros nome, disponivel, !dis, filme, serie, desenho
        const filterBtns = document.querySelectorAll(".filter-button");
        filterBtns.forEach((btn) =>{
            btn.addEventListener('click', (e) => {
                this.#pageNumber = 1;
                this.#currentSliceStart = 1;
                //"""parser"""
                let value = btn.textContent.trim();
                switch (value) {
                    case "Todos":
                        this.#isFiltered = false;
                        this.#filterType = null;
                        this.#renderCatalog();
                        break;
            
                    case "Disponivel":
                        this.#isFiltered = true;
                        this.#filterType = this.#matchDisponibilidade("disponivel");
                        this.#renderCatalog();
                        break;

                    case "Indisponivel":
                        this.#isFiltered = true;
                        this.#filterType = this.#matchIndisponibilidade("disponivel");
                        this.#renderCatalog();
                        break;          
                        
                    case "Filme":
                        this.#isFiltered = true;
                        this.#filterType = this.#matchCategoria("filme");
                        this.#renderCatalog();
                        break;

                    case "Série":
                        this.#isFiltered = true;
                        this.#filterType = this.#matchCategoria("série");
                        this.#renderCatalog();
                        break;

                    case "Desenho":
                        this.#isFiltered = true;
                        this.#filterType = this.#matchCategoria("desenho");
                        this.#renderCatalog();
                        break;

                    default:
                        break;
                }
            });
        })

        const searchInput = document.querySelector("#search-input");
            searchInput.addEventListener('input', (e) => {
                this.#pageNumber = 1;
                this.#currentSliceStart = 1;
                this.#searchTerm = e.target.value;
                this.#renderCatalog();
        });
    }

    #matchNome(nome){
        let t = nome.trim().toLowerCase();
        return (carro) => carro.nome.toLowerCase().includes(t) || carro.universo_origem.toLowerCase().includes(t);
    }

    #matchCategoria(categoria){
        return (carro) => carro.categoria.toLowerCase() === categoria.trim().toLowerCase();
    }

    #matchDisponibilidade(status){
        return (carro) => carro.status_disponibilidade.toLowerCase() === status.trim().toLowerCase();
    }

    #matchIndisponibilidade(){
        return (carro) => carro.status_disponibilidade.toLowerCase() !== "disponivel";
    }

    #renderCatalog(){
        this.#catalogueContainer.innerHTML = "";

        let actualData;

        if (this.#isFiltered) {
        actualData = this.#data.filter(this.#filterType);
        } else {
            actualData = this.#data;
        }

        if (this.#searchTerm.trim() !== "") {
            actualData = actualData.filter(this.#matchNome(this.#searchTerm));
        }

        this.#totalPaginas = Math.max(1, Math.ceil(actualData.length / this.#pageLimit));

        let startIdx = (this.#pageNumber - 1) * this.#pageLimit;
        let endIdx = startIdx + this.#pageLimit;

        const slicedCars = actualData.slice(startIdx, endIdx);

        slicedCars.forEach(carro => {

            let btnText;

            if (carro.status_disponibilidade === "alugado") {
                btnText = "Alugado";
            }
            else if (carro.status_disponibilidade === "manutencao") {
                btnText = "Manutenção";
            } else {
                btnText = "Alugar";
            }



            const cardHTML = `
                <li class="card-catalogo"">
                    <div class="img-wrapper">
                        <img src="${carro.url_imagem}" alt="${carro.nome}">
                        <span class="tag-tipo">${carro.categoria}</span>
                        <span class="tag-status ${carro.status_disponibilidade}">${carro.status_disponibilidade.toLowerCase()}</span>
                    </div>
                    <h3>${carro.nome}</h3>
                    <p class="obra">${carro.universo_origem} - ${carro.ano_obra}</p>
                    <p class="meta-preco">por dia</p>
                    <p class="preco">R$ ${carro.valor_aluguel_dia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    
                    <div class="card-footer">
                        <!--outra má prática injetada no html, mas a explicação é a mesma-->
                        <button class="btn-alugar" onclick="window.location.href='detalhes.html?id=${carro.id}'">Ver Mais Detalhes</button>
                        <button class="btn-agenda" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                            </svg>
                        </button>
                    </div>
                </li>
            `;

            this.#catalogueContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        this.#renderBtns();
    }

    #renderBtns() {
        this.#buttonPageContainer.innerHTML = "";

        let htmlBtns = "";

        htmlBtns += `<button class="page-btn arrow" type="button" ${this.#pageNumber === 1 ? 'disabled' : ''}><</button>`;
        
        for (let i = 1; i <= this.#totalPaginas; i++) {
            htmlBtns += `<button class="page-btn ${i === this.#pageNumber ? 'active' : ''} hidden" type="button">${i}</button>`;
        }

        htmlBtns += `<button class="page-btn arrow" type="button" ${this.#pageNumber === this.#totalPaginas ? 'disabled' : ''}>></button>`;

        this.#buttonPageContainer.insertAdjacentHTML('beforeend', htmlBtns);
        this.#renderBtnLimit();
    }


    #renderBtnLimit(){
        const btns = this.#buttonPageContainer.querySelectorAll("button:not(.arrow)");
        const arrowBtns = this.#buttonPageContainer.querySelectorAll("button.arrow");

        btns.forEach(btn => btn.classList.add("hidden"));

        let startIdx = this.#currentSliceStart;
        let endIdx = startIdx + this.#range - 1;

        this.#showBtns(btns, startIdx, endIdx);

        let maxSliceStart = this.#totalPaginas - this.#range + 1;

        if (startIdx <= 1) {
            arrowBtns[0].disabled = true;
        } else {
            arrowBtns[0].disabled = false;
        }

        if (endIdx >= this.#totalPaginas || this.#totalPaginas <= this.#range) {
            arrowBtns[1].disabled = true;
        } else {
            arrowBtns[1].disabled = false;
        }

        btns[this.#pageNumber - 1].disabled = true;
    }


    #showBtns(btns, startIdx, endIdx){    
        for (const btn of btns) {
            let btnValue = Number(btn.textContent);
            if (btnValue >= startIdx && btnValue <= endIdx) {
                btn.classList.remove('hidden');
            }
        }
    }

}