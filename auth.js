const CHAVE_TOKEN = "adminToken";

function obterToken() {
    let token = localStorage.getItem(CHAVE_TOKEN);

    if (!token) {
        token = prompt("Digite o token de administrador:")?.trim();
        if (!token) return null;
        localStorage.setItem(CHAVE_TOKEN, token);
    }

    return token;
}

// fetch para POST/PUT/DELETE: envia o token e lança Error com mensagem legível se falhar
async function fetchAutenticado(url, opcoes = {}) {
    const token = obterToken();
    if (!token) {
        throw new Error("Operação cancelada: nenhum token informado.");
    }

    const resposta = await fetch(url, {
        ...opcoes,
        headers: { ...opcoes.headers, Authorization: `Bearer ${token}` }
    });

    if (resposta.status === 401) {
        localStorage.removeItem(CHAVE_TOKEN);
        throw new Error("Token incorreto. Tente de novo para digitar outro.");
    }

    if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        throw new Error(corpo.erro || `Erro HTTP: ${resposta.status}`);
    }

    return resposta;
}
