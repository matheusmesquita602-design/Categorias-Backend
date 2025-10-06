// detalhes.js
const API = 'http://localhost:3000/Categorias';
const u = new URLSearchParams(location.search);
const id = u.get('id');

function categoriaLabel(valor) {
  const map = { nome: 'Nome', premio: 'Prêmio', data: 'Data da premiação'};
  return map[valor] ?? valor ?? '';
}

async function consultarDetalhesProduto() {
  if (!id) {
    showToast('ID inválido.', 'danger');
    return;
  }
  try {
    const resp = await fetch(`${API}/${id}`);
    if (!resp.ok) {
      showToast('Categoria não encontrada.', 'danger');
      return;
    }
    const p = await resp.json();
    document.getElementById('p-id').textContent = p.id;
    document.getElementById('p-nome').textContent = p.nome ?? '';
    document.getElementById('p-premio').textContent = p.premio ?? '';
    document.getElementById('p-data').textContent = p.data ?? '';
    document.getElementById('btnEditar').href = `incluirAlterar.html?id=${p.id}`;
  } catch (e) {
    console.error(e);
    showToast('Erro ao consultar os detalhes do produto selecionado.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', consultarDetalhesProduto);