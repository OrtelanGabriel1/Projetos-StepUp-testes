/* ===================== TOAST ===================== */
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const wrap = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

/* ===================== MODAL ===================== */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
// Close on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===================== LOADING ===================== */
function setLoading(container, msg = 'Carregando...') {
  container.innerHTML = `<div class="loading-overlay"><div class="spinner"></div></div>`;
}

/* ===================== EMPTY STATE ===================== */
function emptyState(container, { icon = '📦', title = 'Nenhum item encontrado', desc = '' } = {}) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="es-icon">${icon}</div>
      <h3>${title}</h3>
      ${desc ? `<p>${desc}</p>` : ''}
    </div>`;
}

/* ===================== MONEY FORMAT ===================== */
const brl = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
const dateStr = v => v ? new Date(v).toLocaleDateString('pt-BR') : '-';
const dateTimeStr = v => v ? new Date(v).toLocaleString('pt-BR') : '-';

/* ===================== CONFIRM ===================== */
function confirm(msg, onConfirm) {
  const overlay = document.getElementById('confirm-overlay');
  const text = document.getElementById('confirm-text');
  const btnOk = document.getElementById('confirm-ok');

  if (!overlay) return;
  text.textContent = msg;
  overlay.classList.add('open');

  const handler = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    btnOk.removeEventListener('click', handler);
    onConfirm();
  };
  btnOk.addEventListener('click', handler);
}

/* ===================== AUTH CHECK ===================== */
function checkAuth() {
  const token = localStorage.getItem('stepup_token');
  if (!token) {
    window.location.href = '../index.html';
    return null;
  }
  try {
    const user = JSON.parse(localStorage.getItem('stepup_user') || '{}');
    return user;
  } catch { return {}; }
}

/* ===================== SIDEBAR MOBILE ===================== */
function initSidebar() {
  const btn = document.getElementById('btn-menu');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('open');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

/* ===================== LOGOUT ===================== */
function logout() {
  localStorage.removeItem('stepup_token');
  localStorage.removeItem('stepup_user');
  window.location.href = '../index.html';
}

/* ===================== ACTIVE NAV ===================== */
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    const page = item.dataset.page;
    if (path.includes(page)) item.classList.add('active');
    else item.classList.remove('active');
  });
}

/* ===================== POPULATE USER ===================== */
function populateUser(user) {
  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role');
  const avatarEl = document.getElementById('user-avatar');
  if (nameEl) nameEl.textContent = user.nome || user.email || 'Usuário';
  if (roleEl) roleEl.textContent = user.cargo || 'Funcionário';
  if (avatarEl) avatarEl.textContent = (user.nome || 'U')[0].toUpperCase();
}

/* ===================== PAGINATION ===================== */
function paginate(items, page, perPage = 10) {
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), total: items.length, pages: Math.ceil(items.length / perPage) };
}

function renderPagination(container, { total, page, pages, onPage }) {
  if (pages <= 1) { container.innerHTML = ''; return; }
  container.innerHTML = `
    <div class="pagination">
      <span>Mostrando página ${page} de ${pages} (${total} registros)</span>
      <div class="pagination-btns">
        <button class="page-btn" onclick="(${onPage.toString()})(${page - 1})" ${page <= 1 ? 'disabled' : ''}>‹ Anterior</button>
        ${Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = i + 1;
          return `<button class="page-btn ${p === page ? 'active' : ''}" onclick="(${onPage.toString()})(${p})">${p}</button>`;
        }).join('')}
        <button class="page-btn" onclick="(${onPage.toString()})(${page + 1})" ${page >= pages ? 'disabled' : ''}>Próximo ›</button>
      </div>
    </div>`;
}

/* ===================== SHARED LAYOUT SNIPPETS ===================== */
function buildSidebar(activePage) {
  return `
  <div class="sidebar-overlay" id="sidebar-overlay"></div>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">👟</div>
      <h1>Step<span>Up</span></h1>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      <a href="dashboard.html" class="nav-item ${activePage==='dashboard'?'active':''}" data-page="dashboard">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </a>
      <div class="nav-section-label">Catálogo</div>
      <a href="produtos.html" class="nav-item ${activePage==='produtos'?'active':''}" data-page="produtos">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        Produtos
      </a>
      <a href="categorias.html" class="nav-item ${activePage==='categorias'?'active':''}" data-page="categorias">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        Categorias
      </a>
      <div class="nav-section-label">Operações</div>
      <a href="estoque.html" class="nav-item ${activePage==='estoque'?'active':''}" data-page="estoque">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        Estoque
      </a>
      <a href="movimentacoes.html" class="nav-item ${activePage==='movimentacoes'?'active':''}" data-page="movimentacoes">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
        Movimentações
      </a>
      <a href="vendas.html" class="nav-item ${activePage==='vendas'?'active':''}" data-page="vendas">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Vendas
      </a>
      <a href="historico-preco.html" class="nav-item ${activePage==='historico'?'active':''}" data-page="historico">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Histórico de Preço
      </a>
      <div class="nav-section-label">Pessoas</div>
      <a href="funcionarios.html" class="nav-item ${activePage==='funcionarios'?'active':''}" data-page="funcionarios">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Funcionários
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar" id="user-avatar">U</div>
        <div class="user-info">
          <div class="user-name" id="user-name">Carregando...</div>
          <div class="user-role" id="user-role"></div>
        </div>
        <button class="btn-logout" onclick="logout()" title="Sair">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  </aside>`;
}

function buildTopbar(title) {
  return `
  <header class="topbar">
    <div class="topbar-left">
      <button class="btn-menu-mobile btn-icon" id="btn-menu">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="topbar-title">${title}</span>
    </div>
    <div class="topbar-right">
      <div class="topbar-search">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="global-search" placeholder="Buscar...">
      </div>
    </div>
  </header>`;
}

function buildConfirmModal() {
  return `
  <div class="modal-overlay" id="confirm-overlay">
    <div class="modal" style="max-width:400px">
      <div class="modal-body" style="text-align:center;padding:32px 24px">
        <div class="confirm-icon">🗑️</div>
        <div class="confirm-text">
          <strong>Confirmar exclusão</strong>
          <span id="confirm-text">Tem certeza que deseja excluir este item?</span>
        </div>
      </div>
      <div class="modal-footer" style="justify-content:center">
        <button class="btn btn-outline" onclick="closeModal('confirm-overlay')">Cancelar</button>
        <button class="btn btn-danger" id="confirm-ok">Excluir</button>
      </div>
    </div>
  </div>`;
}
