const containerPersonagens = document.querySelector("#containerPersonagens");
const contador = document.querySelector(".contador");

document.querySelector("#btnBuscar").addEventListener("click", () => {
    const nome = document.querySelector("#filtroNome").value;
    const magia = document.querySelector("#filtroMagia").value;
    const local = document.querySelector("#filtroLocal").value;
    const esquadrao = document.querySelector("#filtroEsquadrao").value;
    buscarPersonagens(nome, magia, local, esquadrao);
});

async function buscarPersonagens(nome = "", magia = "", local = "", esquadrao = "") {
    try {
        const params = new URLSearchParams();
        if (nome) params.append("nome", nome);
        if (magia) params.append("magia", magia);
        if (local) params.append("local", local);
        if (esquadrao) params.append("esquadrao", esquadrao);
        
        const resposta = await fetch(`https://api-black-clover.onrender.com/personagens?${params}`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        const personagens = Array.isArray(dados)
            ? dados
            : dados.personagens ?? dados.data ?? [];
        
        containerPersonagens.innerHTML = "";
        contador.innerText = `${personagens.length} Personagem(ns)`;

        if (personagens.length === 0) {
            containerPersonagens.innerHTML = `<p style="color: var(--texto-secundario); padding: 20px;">Nenhum mago encontrado.</p>`;
        }

        personagens.forEach((mago) => {
            let linhaEspirito = mago.nome_espirito 
            ? `<p><img src="./assets/espirito.png" class="icone-espirito" alt="Ícone de Espírito"> <strong>Espírito:</strong> ${mago.nome_espirito}</p>` 
            : "";

            let badgeDemoniaco = mago.eh_portador_demoniaco 
            ? `<span class="badge demonio" title="Portador Demoníaco">
                   <img src="./assets/demonio.png" alt="Demônio" class="icone-badge">
               </span>` 
            : "";

            let badgeNobre = mago.eh_nobre
                ? `<span class="badge nobre" title ="Nobre">NOBRE</span>`
                : `<span class="badge plebeu" title ="Nobre">PLEBEU</span>`;

            const novoCard = document.createElement("div");
            novoCard.className = "card-personagem";
            
            novoCard.innerHTML = `
                <div class="card-header">
                    <div class="info-principal">
                        <h3 title="${mago.nome}">${mago.nome}</h3>
                        <span class="tag-magia">${mago.tipo_magia}</span>
                    </div>
                    <div class="badges">
                        ${badgeDemoniaco}
                        ${badgeNobre}
                    </div>
                </div>
                <div class="card-body">
                    <p><img src="./assets/esquadrao.svg" class="icon" alt="Ícone de Esquadrão"> <strong>Esquadrão:</strong> ${mago.nome_esquadrao || "Nenhum"}</p>
                    <p><img src="./assets/origem.svg" class="icon" alt="Ícone de Origem"> <strong>Origem:</strong> ${mago.nome_local}</p>
                    <p><img src="./assets/raca.svg" class="icon" alt="Ícone de Raça"> <strong>Raça:</strong> ${mago.nome_raca}</p>
                    ${linhaEspirito}
                </div>
                <div class="card-footer">
                    <button class="btn-icone btn-editar">Editar</button>
                    <button class="btn-icone btn-deletar">Excluir</button>
                </div>
            `;
            containerPersonagens.append(novoCard);

            const btnDeletar = novoCard.querySelector(".btn-deletar");
            btnDeletar.addEventListener("click", async () => {
                if(confirm(`Tem certeza que deseja expulsar ${mago.nome} do grimório?`)) {
                    await fetch(`https://api-black-clover.onrender.com/personagens/${mago.id}`, { method: "DELETE" });
                    buscarPersonagens(); 
                }
            });

            const btnEditar = novoCard.querySelector(".btn-editar");
            btnEditar.addEventListener("click", () => {
                localStorage.setItem("magoEditando", JSON.stringify(mago));
                
                window.location.href = "cadastro.html";
            });
        });
    } catch (erro) {
        console.error("Erro ao buscar personagens:", erro);
        containerPersonagens.innerHTML = `<p style="color: #e74c3c; padding: 20px;">⚠️ Não foi possível conectar à API. Verifique se o servidor está ativo.</p>`;
        contador.innerText = "0 Personagem(ns)";
    }
}


buscarPersonagens();