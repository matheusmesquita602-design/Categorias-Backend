const API = 'http://localhost:3000/Categorias';

//Função para converter o formato da data
function converterParaBD(data_input) {
    if (!data_input) return null;
    //Assumir que o formato de entrada da data é: DD/MM/AAAA
    const [dia, mes, ano] = data_input.split('/');
    // Retorna AAAA-MM-DD
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`; 
}

//Função para converter o formato timestamp (AAAA-MM-DDT[hh][mm][ss]) para formato de data brasileiro (DD/MM/AAAA)
function converterParaVisualizacao(data_bd) {
    if (!data_bd) return '';
    const dataPart = data_bd.split('T')[0];
    const [ano, mes, dia] = dataPart.split('-');
    return `${dia}/${mes}/${ano}`; 
}

function serializeForm(form) {
  const get = (id) => (document.getElementById(id)?.value ?? '').trim();
  const getRadio = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  };
  return {
    nome: get('nome'),
    premio: get('premio'),
    data: converterParaBD(get('data'))

  };
}

async function carregarParaEdicao(id) {
  try {
    const resp = await fetch(`${API}/${id}`);
    if (!resp.ok) throw new Error('not found');
    const a = await resp.json();

    document.getElementById('nome').value = a.nome ?? '';
    document.getElementById('premio').value = a.premio ?? '';
    document.getElementById('data').value = converterParaVisualizacao(a.data ?? '');

  } catch (e) {
    console.error(e);
    showToast('Categoria não encontrada para edição.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('CategoriasForm');
  const u = new URLSearchParams(location.search);
  const id = u.get('id');


  if (id) carregarParaEdicao(id);

  form.addEventListener('form:valido', async () => {
    const dados = serializeForm(form);
    try {
      if (id) {
        const resp = await fetch(`${API}/${id}`, {
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...dados, id: Number(id) })
        });
        
        if (!resp.ok) throw new Error('PUT failed');
        redirectWithToast('index.html', 'Categoria atualizada com sucesso.', 'success');
      } else {
        const resp = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        if (!resp.ok) throw new Error('POST failed');
        redirectWithToast('index.html', 'Categoria incluída com sucesso.', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Falha ao salvar a Categoria. Tente novamente.', 'danger');
    }
  });
});