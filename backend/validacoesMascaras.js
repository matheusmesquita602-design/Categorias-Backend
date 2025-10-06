// Função para exibir erro embaixo do campo
function setarErro(campoAvaliado, caixaDeErroCampo, mensagem) {
 // Se o elemento for um input ou select, adiciona a classe 'is-invalid' do Bootstrap
 if (campoAvaliado instanceof HTMLElement && (campoAvaliado.classList.contains('form-control') || campoAvaliado.classList.contains('form-select'))) {
 campoAvaliado.classList.add('is-invalid');
 }
 
 // Mostra a mensagem de erro no span
 caixaDeErroCampo.textContent = mensagem;
 caixaDeErroCampo.classList.remove('d-none');
 caixaDeErroCampo.classList.add('d-block');
}

// Função para limpar o erro (quando o campo for corrigido)
function limparErro(campoAvaliado, caixaDeErroCampo) {
 if (campoAvaliado instanceof HTMLElement && (campoAvaliado.classList.contains('form-control') || campoAvaliado.classList.contains('form-select'))) {
 campoAvaliado.classList.remove('is-invalid');
 }
 caixaDeErroCampo.textContent = '';
 caixaDeErroCampo.classList.add('d-none');  caixaDeErroCampo.classList.remove('d-block');
}

// Função utilitária para verificar se o valor está vazio
function campoVazio(value) {
 return !value || String(value).trim() === '';
}


// =================== Funções de Máscara ===================

function mascaraData(valor) {
 return valor
 .replace(/\D/g, '')
 .replace(/(\d{2})(\d)/, '$1/$2')
 .replace(/(\d{2})(\d)/, '$1/$2')
 .replace(/(\d{4})\d+?$/, '$1');
}

// ==========================================================

// Função principal de validação do formulário
function validarFormularioHtml(e) {
 e.preventDefault();

 const form = document.getElementById('categoriasForm');
 // Garante que o formulário existe, embora a função só deva ser chamada se ele existir
 if (!form) return; 

 const nome = document.getElementById('nome');
 const errNome = document.getElementById('err-nome');

 const premio = document.getElementById('premio');
 const errPremio = document.getElementById('err-premio');

 const data = document.getElementById('data');
 const errData = document.getElementById('err-data');

 const termos = document.getElementById('termos');
 const errTermos = document.getElementById('err-termos');

 let temErro = false;

 // ======== VALIDAÇÕES ========

 // Os campos 'nome', 'premio', 'data' e 'termos' precisam existir na página 
 // para que a validação não falhe. Adicionando verificações de nulidade para eles.

  // Validação Nome
 if (nome) {
      if (campoVazio(nome.value)) {
     setarErro(nome, errNome, 'Informe o nome da categoria.');
     temErro = true;
      } else {
     limparErro(nome, errNome);
      }
  } else {
      console.error("Elemento 'nome' não encontrado no formulário.");
      // Se um campo principal não existe, assumimos erro para não prosseguir
      temErro = true; 
  }
 
  // Validação Prêmio
  if (premio) {
      if (campoVazio(premio.value)) {
     setarErro(premio, errPremio, 'Informe o prêmio.');
      temErro = true;
      } else {
     limparErro(premio, errPremio);
      }
  } else {
      console.error("Elemento 'premio' não encontrado no formulário.");
      temErro = true;
  }


 // Data: valida o formato e a data
  if (data) {
     const dataPreenchida = data.value;
     const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
     if (!regexData.test(dataPreenchida)) {
     setarErro(data, errData, 'A data deve estar no formato DD/MM/AAAA.');
     temErro = true;
     } else {
     const [dia, mes, ano] = dataPreenchida.split('/').map(Number);
     const dataObj = new Date(ano, mes - 1, dia);
     const dataCorrente = new Date();
        dataCorrente.setHours(0, 0, 0, 0);

        if (dataObj.getFullYear() !== ano || dataObj.getMonth() + 1 !== mes || dataObj.getDate() !== dia) {
          setarErro(data, errData, 'Data inválida.');
          temErro = true;
        } else if (dataObj > dataCorrente) {
          setarErro(data, errData, 'A data não pode ser futura.');
          temErro = true;
        } else {
          limparErro(data, errData);
        }
      }
  } else {
      console.error("Elemento 'data' não encontrado no formulário.");
      temErro = true;
  }

  // Validação Termos
  if (termos) {
      if (!termos.checked) {
        setarErro(termos, errTermos, 'É necessário confirmar as informações.');
        temErro = true;
      } else {
        limparErro(termos, errTermos);
      }
  } else {
      // É comum que o campo 'termos' não exista, dependendo do formulário,
      // então não consideramos erro crítico, mas não podemos validá-lo.
      // Se ele for obrigatório, adicione 'temErro = true' aqui.
  }

  if (!temErro) {
    const evt = new CustomEvent('form:valido', { detail: { form } });
    form.dispatchEvent(evt);
    /*################################################################################################ */

    form.reset();
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('[id^="err-"]').forEach(span => { 
      span.textContent = ''; 
      span.classList.add('d-none'); 
      span.classList.remove('d-block'); 
    });
  }
}

function incluirValidacaoOnBlur() {
  // Nota: Você está chamando 'formatarPrecoParaValidacao' e 'mascaraCNPJ' 
  // aqui e em 'inicializarMascarasManuais'. Essas funções não foram definidas 
  // no código fornecido. Presumi que elas existem em outro lugar ou no escopo global.
  
  const regrasDoOnBlur = {
    nome: valor => !campoVazio(valor),
    cnpj: valor => valor.length === 18,    
    categoria: valor => !campoVazio(valor),
    // Verifique se 'formatarPrecoParaValidacao' está definida!
    preco: valor => { /* Adicione 'formatarPrecoParaValidacao' ou remova/ajuste */ 
        if (typeof formatarPrecoParaValidacao !== 'function') return true; 
        const preco_num = parseFloat(formatarPrecoParaValidacao(valor)); 
        return !isNaN(preco_num) && preco_num > 0; 
    },
    quantidade: valor => { const quantidade_num = parseInt(valor, 10); return !isNaN(quantidade_num) && quantidade_num > 0; },
    data: valor => {
      const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!regexData.test(valor)) return false;
      const [dia, mes, ano] = valor.split('/').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      const dataCorrente = new Date();
      dataCorrente.setHours(0, 0, 0, 0);
      return dataObj.getFullYear() === ano && dataObj.getMonth() + 1 === mes && dataObj.getDate() === dia && dataObj <= dataCorrente;
    },
    descricao: valor => valor && valor.trim().length >= 10
  };

  Object.keys(regrasDoOnBlur).forEach(id => {
    const input = document.getElementById(id);
    const errSpan = document.getElementById(`err-${id}`);
    
    // Corrigido: Garante que ambos os elementos (input e span de erro) existem antes de adicionar o listener
    if (!input || !errSpan) return; 
    
    input.addEventListener('blur', () => {
      const ok = regrasDoOnBlur[id](input.value);
      if (!ok) {
        const msgs = {
          nome: 'Informe o nome da categoria.',
          data: 'Data no formato DD/MM/AAAA (não pode ser futura).',
          // Se precisar de mensagens para outros campos, adicione aqui!
        };
        // Garante que a mensagem existe antes de tentar exibi-la
        const mensagemErro = msgs[id] || 'Campo inválido.'; 
        setarErro(input, errSpan, mensagemErro);
      } else {
        limparErro(input, errSpan);
      }
    });
  });

  const statusRadios = document.querySelectorAll('input[name="status"]');
  const errStatus = document.getElementById('err-status');
  // Corrigido: Garante que os elementos existem e que há pelo menos um rádio
  if (statusRadios.length > 0 && errStatus) { 
      statusRadios.forEach(r => r.addEventListener('change', () => limparErro(statusRadios[0], errStatus)));
  }

  const termos = document.getElementById('termos');
  const errTermos = document.getElementById('err-termos');
  // Corrigido: Garante que ambos os elementos existem
  if (termos && errTermos) { 
      termos.addEventListener('change', () => termos.checked ? limparErro(termos, errTermos) : null);
  }
}

function inicializarMascarasManuais() {
  // Nota: Você está chamando 'mascaraCNPJ' e 'mascaraPreco'. Verifique se elas estão definidas!
  
  const cnpj = document.getElementById('cnpj');
  if (cnpj && typeof mascaraCNPJ === 'function') {
    cnpj.addEventListener('input', (e) => {
      e.target.value = mascaraCNPJ(e.target.value);
    });
  }
  
  const preco = document.getElementById('preco');
  if (preco && typeof mascaraPreco === 'function') {
    preco.addEventListener('input', (e) => {
      e.target.value = mascaraPreco(e.target.value);
    });
  }
  
  const data = document.getElementById('data');
  if (data) {
    data.addEventListener('input', (e) => {
      e.target.value = mascaraData(e.target.value);
    });
  }
}

// CORREÇÃO: Bloco DOMContentLoaded único e correto.
document.addEventListener('DOMContentLoaded', () => {
    
  inicializarMascarasManuais();
  
  const form = document.getElementById('categoriasForm'); // Busca o formulário
  
  // 1. Garante que o formulário exista para evitar o erro de 'addEventListener' em null
  if (form) {
      form.addEventListener('submit', validarFormularioHtml);
      
      const resetBtn = document.getElementById('resetBtn');
      // 2. Garante que o botão de reset exista
      if (resetBtn) {
          resetBtn.addEventListener('click', () => {
              document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
              document.querySelectorAll('[id^="err-"]').forEach(span => { 
                  span.textContent = ''; 
                  span.classList.add('d-none'); 
                  span.classList.remove('d-block'); 
              });    
          });
 }
 }
 
 incluirValidacaoOnBlur();
});
// FIM CORRETO DO ARQUIVO