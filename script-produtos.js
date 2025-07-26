async function carregarProdutos() {
  const container = document.getElementById("produtos-container");

  const arquivos = ["produtos/tenis-nike.md"]; // Aqui você pode automatizar listagem futura com backend ou pré-carregados

  for (let arquivo of arquivos) {
    const res = await fetch(arquivo);
    const text = await res.text();

    const match = /---([\s\S]*?)---/.exec(text);
    if (!match) continue;
    const data = match[1];
    const produto = {};
    data.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest) {
        produto[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });

    const card = document.createElement("a");
    card.className = "product-card";
    card.href = produto.link;
    card.target = "_blank";
    card.innerHTML = `
      <button class="favorite-btn" onclick="event.preventDefault(); event.stopPropagation();">
        <img src="img/favoritar.png" alt="Favoritar" style="height: 25px;">
      </button>
      <img src="${produto.img}" alt="${produto.nome}">
      <div class="product-name">${produto.nome}<br>${produto.variacao}</div>
      <p class="price">${produto.preco}</p>
      <div class="qc-pics" onclick="event.stopPropagation(); window.open('${produto.qc}', '_blank');">QC</div>
    `;
    container.appendChild(card);
  }
}

carregarProdutos();