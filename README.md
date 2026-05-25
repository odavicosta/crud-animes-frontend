# CRUD Catálogo Black Clover  - frontend
**Acesse o projeto online:** [https://catalogo-clover.vercel.app/](https://catalogo-clover.vercel.app/)

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d037afbb-9edb-4783-9e8b-46034780f8c1" />


## Sobre o Projeto
Interface gráfica responsiva criada para consumir a API REST do Catálogo Black Clover. O objetivo foi criar uma experiência visual imersiva, parecida com um grimório digital, para catalogar os cavaleiros mágicos do anime.

## Funcionalidades
* Listagem em formato de mosaico (CSS Grid responsivo).
* Busca e filtros dinâmicos integrados com o back-end.
* Formulário de cadastro modularizado usando `localStorage` para transição de estados entre páginas.
* Tratamento de erros e feedback visual para o usuário.

## Tecnologias Utilizadas
* **HTML** (Semântica)
* **CSS** (Variáveis, Flexbox, Grid, Animações e Efeitos de Hover)
* **JavaScript (Vanilla)** (Consumo de API via `fetch`, manipulação de DOM)
* **Vercel** (Hospedagem)

## Como rodar o projeto localmente
Como o projeto utiliza JavaScript Vanilla e não possui frameworks de compilação, o setup é extremamente simples
1. Clone este repositório.
2. Abra a pasta do projeto no VS Code.
3. Instale a extensão **Live Server**.
4. Clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

Caso prefira alterar a API de consumo, as URLs do fetch estão localizadas nos arquivos app.js (listagem e exclusão) e cadastro.js (criação e edição) e já apontam para:
https://api-black-clover.onrender.com
