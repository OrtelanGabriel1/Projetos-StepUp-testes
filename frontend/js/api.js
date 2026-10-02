/* ===================== CONFIGURAÇÃO ===================== */
const API_BASE = 'http://localhost:3000';

/* ===================== HTTP HELPER ===================== */
async function request(method, path, body = null) {
  const token = localStorage.getItem('stepup_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (res.status === 401) {
    localStorage.removeItem('stepup_token');
    localStorage.removeItem('stepup_user');
    window.location.href = '../index.html';
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.mensagem || `Erro ${res.status}`);
  }
  return data;
}

const api = {
  /* AUTH */
  login: (email, senha) => request('POST', '/auth/login', { email, senha }),

  /* PRODUTO */
  produtos: {
    listar:    ()       => request('GET',    '/produto'),
    buscar:    (id)     => request('GET',    `/produto/${id}`),
    cadastrar: (data)   => request('POST',   '/produto', data),
    atualizar: (id, d)  => request('PUT',    `/produto/${id}`, d),
    deletar:   (id)     => request('DELETE', `/produto/${id}`),
  },

  /* CATEGORIA */
  categorias: {
    listar:    ()       => request('GET',    '/categoria'),
    buscar:    (id)     => request('GET',    `/categoria/${id}`),
    cadastrar: (data)   => request('POST',   '/categoria', data),
    atualizar: (id, d)  => request('PUT',    `/categoria/${id}`, d),
    deletar:   (id)     => request('DELETE', `/categoria/${id}`),
  },

  /* ESTOQUE */
  estoque: {
    listar:      ()     => request('GET',    '/estoque'),
    baixo:       ()     => request('GET',    '/estoque/alerta/baixo'),
    buscar:      (id)   => request('GET',    `/estoque/${id}`),
    cadastrar:   (data) => request('POST',   '/estoque', data),
    atualizar:   (id,d) => request('PUT',    `/estoque/${id}`, d),
    deletar:     (id)   => request('DELETE', `/estoque/${id}`),
  },

  /* FUNCIONARIO */
  funcionarios: {
    listar:    ()       => request('GET',    '/funcionario'),
    buscar:    (id)     => request('GET',    `/funcionario/${id}`),
    cadastrar: (data)   => request('POST',   '/funcionario', data),
    atualizar: (id, d)  => request('PUT',    `/funcionario/${id}`, d),
    deletar:   (id)     => request('DELETE', `/funcionario/${id}`),
  },

  /* HISTORICO DE PREÇO */
  historicoPreco: {
    listar:         ()           => request('GET',  '/historico-preco'),
    buscarPorProduto:(id_produto)=> request('GET',  `/historico-preco/produto/${id_produto}`),
    registrar:      (data)       => request('POST', '/historico-preco', data),
  },

  /* VENDA */
  vendas: {
    listar:    ()     => request('GET',    '/venda'),
    buscar:    (id)   => request('GET',    `/venda/${id}`),
    registrar: (data) => request('POST',   '/venda', data),
    cancelar:  (id)   => request('PATCH',  `/venda/${id}/cancelar`),
  },

  /* MOVIMENTAÇÃO DE ESTOQUE */
  movimentacoes: {
    listar:    (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request('GET', `/movimentacao-estoque${q ? '?' + q : ''}`);
    },
    buscar:    (id)   => request('GET',  `/movimentacao-estoque/${id}`),
    historico: (id_p) => request('GET',  `/movimentacao-estoque/produto/${id_p}`),
    registrar: (data) => request('POST', '/movimentacao-estoque', data),
  },
};
