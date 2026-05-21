const containerPersonagens = document.querySelector("#containerPersonagens");
const contador = document.querySelector(".contador");
const formPersonagem = document.querySelector("#formPersonagem");

let idMagoEditando = null; 

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
        const personagens = await resposta.json();
        
        containerPersonagens.innerHTML = "";
        contador.innerText = `${personagens.length} Personagem(ns)`;

        personagens.forEach((mago) => {
            let linhaEspirito = mago.nome_espirito 
            ? `<p><i class="icon">🧚‍♂️</i> <strong>Espírito:</strong> ${mago.nome_espirito}</p>` 
            : "";

            let badgeDemoniaco = mago.eh_portador_demoniaco 
                ? `<span class="badge demonio" title="Portador Demoníaco">👹</span>` 
                : "";

            let badgeNobre = mago.eh_nobre
                ? `<span class="badge nobre" title ="Nobre">NOBRE</span>`
                : `<span class="badge plebeu" title ="Nobre">PLEBEU</span>`;

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
                        ${badgeNobre}
                    </div>
                </div>
                <div class="card-body">
                    <p><i class="icon">🛡️</i> <strong>Esquadrão:</strong> ${mago.nome_esquadrao || "Nenhum"}</p>
                    <p><i class="icon">🌍</i> <strong>Origem:</strong> ${mago.nome_local}</p>
                    <p><i class="icon">🧬</i> <strong>Raça:</strong> ${mago.nome_raca}</p>
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
                document.querySelector("#nome").value = mago.nome;
                document.querySelector("#magia").value = mago.tipo_magia;
                document.querySelector("#esquadrao").value = mago.id_esquadrao || "";
                document.querySelector("#raca").value = mago.id_raca || "";
                document.querySelector("#racaSecundaria").value = mago.id_raca_secundaria || "";
                document.querySelector("#localOrigem").value = mago.id_local_origem || "";
                document.querySelector("#espirito").value = mago.id_espirito || "";
                document.querySelector("#ehNobre").checked = mago.eh_nobre;
                document.querySelector("#ehDemoniaco").checked = mago.eh_portador_demoniaco;

                idMagoEditando = mago.id;
                document.querySelector(".btn-salvar").textContent = "Atualizar Mago";
                window.scrollTo(0, 0);
            });
        });
    } catch (erro) {
        console.error("Erro ao buscar personagens:", erro);
    }
}

formPersonagem.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const magoDados = {
        nome: document.querySelector("#nome").value,
        tipo_magia: document.querySelector("#magia").value,
        id_esquadrao: document.querySelector("#esquadrao").value || null,
        id_raca: document.querySelector("#raca").value,
        id_raca_secundaria: document.querySelector("#racaSecundaria").value || null,
        id_local_origem: document.querySelector("#localOrigem").value,
        id_espirito: document.querySelector("#espirito").value || null,
        eh_nobre: document.querySelector("#ehNobre").checked,
        eh_portador_demoniaco: document.querySelector("#ehDemoniaco").checked
    };

    try {
        if (idMagoEditando === null) {
            await fetch("https://api-black-clover.onrender.com/personagens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(magoDados)
            });
        } else {
            await fetch(`https://api-black-clover.onrender.com/personagens/${idMagoEditando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(magoDados)
            });
            
            idMagoEditando = null;
            document.querySelector(".btn-salvar").textContent = "Salvar Mago";
        }

        formPersonagem.reset();
        buscarPersonagens();    
        
    } catch (erro) {
        console.error("Erro ao salvar o personagem:", erro);
    }
});

buscarPersonagens();