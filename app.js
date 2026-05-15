const containerPersonagens = document.querySelector("#containerPersonagens");
const contador = document.querySelector(".contador");

async function buscarPersonagens() {
    try {
        const resposta = await fetch("http://127.0.0.1:5000/personagens");
        const personagens = await resposta.json();
        
        containerPersonagens.innerHTML = "";
        contador.innerText = `${personagens.length} Personagem(ns)`;

        personagens.forEach((mago) => {
            let badgeDemoniaco = mago.eh_portador_demoniaco 
                ? `<span class="badge demonio" title="Portador Demoníaco">👹 Demônio</span>` 
                : "";

            const novoCard = document.createElement("div");
            novoCard.className = "card-personagem";
            
            novoCard.innerHTML = `
                <div class="card-header">
                    <div class="info-principal">
                        <h3>${mago.nome}</h3>
                        <span class="tag-magia">${mago.tipo_magia}</span>
                    </div>
                    <div class="badges">
                        ${badgeDemoniaco}
                    </div>
                </div>
                <div class="card-body">
                    <p><i class="icon">🛡️</i> <strong>Esquadrão:</strong> ${mago.nome_esquadrao || "Nenhum"}</p>
                    <p><i class="icon">🌍</i> <strong>Origem:</strong> ${mago.nome_local}</p>
                    <p><i class="icon">🧬</i> <strong>Raça:</strong> ${mago.nome_raca}</p>
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
                    await fetch(`http://127.0.0.1:5000/personagens/${mago.id}`, {
                        method: "DELETE"
                    });
                    
                    buscarPersonagens(); 
                }
            });
        });
    } catch (erro) {
        console.error("Erro ao buscar personagens:", erro);
    }
}

buscarPersonagens();


const formPersonagem = document.querySelector("#formPersonagem");

formPersonagem.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoMago = {
        nome: document.querySelector("#nome").value,
        tipo_magia: document.querySelector("#magia").value,
        id_esquadrao: document.querySelector("#esquadrao").value || null,
        id_raca: document.querySelector("#raca").value,
        id_local_origem: document.querySelector("#localOrigem").value,
        id_espirito: document.querySelector("#espirito").value || null,
        eh_nobre: document.querySelector("#ehNobre").checked,
        eh_portador_demoniaco: document.querySelector("#ehDemoniaco").checked,
        eh_portador_atual: document.querySelector("#ehPortador").checked,
        id_raca_secundaria: document.querySelector("#raca_secundaria").value || null,
    };

    try {
        await fetch("http://127.0.0.1:5000/personagens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoMago)
        });

        formPersonagem.reset();
        buscarPersonagens();
        
    } catch (erro) {
        console.error("Erro ao salvar o personagem:", erro);
    }
});