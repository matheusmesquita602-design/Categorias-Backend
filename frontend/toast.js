// toast.js (clean)
// Cria e gerencia um container fixo no topo-direito; sem dependências além do Bootstrap.
(() => {
  const CONTAINER_ID = 'toastStack';

  /*function ensureContainer() {
    let el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = CONTAINER_ID;
      el.className = 'toast-container position-fixed top-0 end-0 p-3 me-4';
      el.style.zIndex = '2000';
      document.body.appendChild(el);
    } else {
      el.classList.add('position-fixed', 'top-0', 'end-0', 'p-3', 'me-4');
      el.style.zIndex = '2000';
    }
    return el;
  }
  */
 
  function ensureContainer() {
    const CONTAINER_ID = 'toastStack';
    let el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = CONTAINER_ID;
      document.body.appendChild(el);
    }

    // Força posicionamento fixo no topo-direito, com recuo visível
    el.className = 'toast-container';          // limpa classes antigas
    el.style.position = 'fixed';
    el.style.top = '5px';
    el.style.right = '200px';                    // <-- ajuste aqui p/ "mais esquerda"
    el.style.left = 'auto';
    el.style.bottom = 'auto';
    el.style.zIndex = '2000';
    el.style.pointerEvents = 'none';            // container não captura cliques

    return el;
  }

  function showToast(message, variant = 'success', title = '') {
    const container = ensureContainer();
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center border-0';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.setAttribute('aria-atomic', 'true');

    const bg = {
      success: 'text-bg-success',
      danger:  'text-bg-danger',
      warning: 'text-bg-warning',
      info:    'text-bg-info'
    }[variant] || 'text-bg-secondary';

    toastEl.classList.add(bg);
    toastEl.style.minWidth = '320px'; // evita “pontinha” cortada

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${title ? `<strong class="me-2">${title}</strong>` : ''}${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast" aria-label="Fechar"></button>
      </div>
    `;

    container.appendChild(toastEl);
    const t = new bootstrap.Toast(toastEl, { delay: 2800, autohide: true });
    t.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }  

  // API pública
  window.showToast = showToast;
  window.redirectWithToast = (url, msg, variant = 'success', title = '') => {
    sessionStorage.setItem('__toast_msg', msg || '');
    sessionStorage.setItem('__toast_var', variant || 'success');
    sessionStorage.setItem('__toast_t', title || '');
    location.href = url;
  };

  // Exibe toast pendente pós-redirect
  document.addEventListener('DOMContentLoaded', () => {
    const msg = sessionStorage.getItem('__toast_msg');
    if (msg) {
      const v = sessionStorage.getItem('__toast_var') || 'success';
      const t = sessionStorage.getItem('__toast_t') || '';
      sessionStorage.removeItem('__toast_msg');
      sessionStorage.removeItem('__toast_var');
      sessionStorage.removeItem('__toast_t');
      showToast(msg, v, t);
    }
  });
})();