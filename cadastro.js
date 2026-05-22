const formPersonagem = document.querySelector("#formPersonagem");
let idMagoEditando = null;

document.addEventListener("DOMContentLoaded", () => {
    const magoGuardado = localStorage.getItem("magoEditando");
    
    if (magoGuardado) {
        const mago = JSON.parse(magoGuardado);
        
        // Preenche o formulário
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
        document.querySelector("#tituloForm").textContent = "Atualizar Catálogo";
        document.querySelector(".btn-salvar").textContent = "Atualizar Mago";
    }
});

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
            alert("Mago cadastrado com sucesso!");
        } else {
            await fetch(`https://api-black-clover.onrender.com/personagens/${idMagoEditando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(magoDados)
            });
            alert("Mago atualizado com sucesso!");
            
            localStorage.removeItem("magoEditando");
        }

        window.location.href = "index.html";
        
    } catch (erro) {
        console.error("Erro ao salvar o personagem:", erro);
        alert("Ocorreu um erro ao salvar.");
    }
});