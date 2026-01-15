// Caminho para o JSON de produtos
const DATA_URL = 'data/produtos.json';

// Utilitários
function getCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Carregar produtos na lista
async function carregarProdutos() {
  const res = await fetch(DATA_URL);
  const produtos = await res.json();
  const container = document.getElementById('lista-produtos');

  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="imagens/${prod.imagem}" alt="${prod.nome}">
      <h4>${prod.nome}</h4>
      <p>${prod.preco} kz</p>
      <a href="produto.html?id=${prod.id}" class="btn">Ver Detalhes</a>
      <button onclick="adicionarAoCarrinho('${prod.id}') "class="btc">Adicionar ao Carrinho</button>
    `;
    container.appendChild(div);
  });

  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Página de detalhes
async function carregarProdutoDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const produto = produtos.find(p => p.id === id);

  if (!produto) return;

  const container = document.getElementById('produto-detalhe');
  container.innerHTML = `
    <div class="produto-detalhado">
      <img src="imagens/${produto.imagem}" alt="${produto.nome}">
      <div>
        <h2>${produto.nome}</h2>
        <p>${produto.descricao}</p>
        <p><strong>Preço:</strong> ${produto.preco} kz</p>
        <p><strong>Tamanhos:</strong> ${produto.tamanhos.join(', ')}</p>
        <p><strong>Cores:</strong> ${produto.cores.join(', ')}</p>
        <button onclick="adicionarAoCarrinho('${produto.id}')" class="btc2">Adicionar ao Carrinho</button>
      </div>
    </div>
  `;
}

// Adicionar ao carrinho
function adicionarAoCarrinho(id) {
  const carrinho = getCarrinho();
  const item = carrinho.find(p => p.id === id);
  if (item) {
    item.qtd += 1;
  } else {
    carrinho.push({ id, qtd: 1 });
  }
  salvarCarrinho(carrinho);
  alert('Produto adicionado ao carrinho!');
}

// Exibir carrinho
async function carregarCarrinho() {
  const carrinho = getCarrinho();
  const produtos = JSON.parse(localStorage.getItem('produtos')) || await (await fetch(DATA_URL)).json();
  const container = document.getElementById('itens-carrinho');
  const totalEl = document.getElementById('total-carrinho');
  container.innerHTML = '';
  let total = 0;

  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    const subtotal = produto.preco * item.qtd;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'item-carrinho';
    div.innerHTML = `
      <img src="imagens/${produto.imagem}" alt="${produto.nome}">
      <div>
        <h4>${produto.nome}</h4>
        <p>Preço: ${produto.preco} kz</p>
        <p>Quantidade: 
          <input type="number" min="1" value="${item.qtd}" onchange="atualizarQuantidade('${item.id}', this.value)">
        </p>
        <p>Subtotal: ${subtotal} kz</p>
        <button onclick="removerDoCarrinho('${item.id}')">Remover</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `${total} kz`;
}

// Atualizar quantidade
function atualizarQuantidade(id, novaQtd) {
  const carrinho = getCarrinho();
  const item = carrinho.find(p => p.id === id);
  if (item) {
    item.qtd = parseInt(novaQtd);
    salvarCarrinho(carrinho);
    carregarCarrinho();
  }
}

// Remover item
function removerDoCarrinho(id) {
  let carrinho = getCarrinho();
  carrinho = carrinho.filter(p => p.id !== id);
  salvarCarrinho(carrinho);
  carregarCarrinho();
}

// Checkout
function configurarCheckout() {
  const form = document.getElementById('form-checkout');
  const pagamento = form.pagamento;
  const detalhes = document.getElementById('detalhes-pagamento');

  pagamento.addEventListener('change', () => {
    detalhes.innerHTML = '';
    if (pagamento.value === 'cartao') {
      detalhes.innerHTML = `
        <input type="text" placeholder="Número do Cartão" required />
        <input type="text" placeholder="Validade (MM/AA)" required />
        <input type="text" placeholder="CVV" required />
      `;
    } else if (pagamento.value === 'multicaixa') {
      const ref = Math.floor(100000 + Math.random() * 900000);
      detalhes.innerHTML = `<p>Referência Multicaixa: <strong>${ref}</strong></p>`;
    } else if (pagamento.value === 'paypal') {
      detalhes.innerHTML = `<p>Será redirecionado para o PayPal após confirmar.</p>`;
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Pedido confirmado! Obrigado por comprar na DRESS CHIQUE.');
    localStorage.removeItem('carrinho');
    window.location.href = 'index.html';
  });
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('lista-produtos')) carregarProdutos();
  if (document.getElementById('produto-detalhe')) carregarProdutoDetalhe();
  if (document.getElementById('itens-carrinho')) carregarCarrinho();
  if (document.getElementById('form-checkout')) configurarCheckout();
});
function removerDoCarrinho(id) {
  let carrinho = getCarrinho();
  carrinho = carrinho.filter(p => p.id !== id);
  salvarCarrinho(carrinho);
  carregarCarrinho();
}
