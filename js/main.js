// js/main.js - centralizado e organizado para Tá Na Mão

/* UTILIDADES GERAIS */

// Função de busca principal
function buscar() {
  const campo = document.getElementById('campoBusca');
  const texto = (campo ? campo.value : '').trim().toLowerCase();

  if (!texto) {
    alert('Digite algo para buscar.');
    return;
  }

  const carros = ["carro","carros","veículo","veiculos","veículos","ônibus","van"];
  const casas  = ["casa","casas","residência","residencias","apartamento","apto","aluguel"];

  if (carros.some(k => texto.includes(k))) {
    window.location.href = 'veiculos.html';
    return;
  }

  if (casas.some(k => texto.includes(k))) {
    window.location.href = 'residencias.html';
    return;
  }

  alert(`Busca simulada: você procurou por "${texto}".`);
}

// Define automaticamente o link ativo do navbar
function setupNavActive() {
  const links = document.querySelectorAll('.nav-link');
  const page = location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.split('/').pop();
    link.classList.toggle('active', linkPage === page);
  });
}

/* Configuração do que acontecer na página inicial */

function setupHomeSearch() {
  const btn = document.getElementById('btnBuscarHome');
  const campo = document.getElementById('campoBusca');

  if (btn) btn.addEventListener('click', buscar);

  if (campo) {
    campo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        buscar();
      }
    });
  }
}

/* RESIDÊNCIAS */
/* Controlar os filtros e reservas da parte das residências */
function setupResidenciasPage() {
  const btnFilter = document.getElementById('btnFilter');
  if (!btnFilter) return;

  btnFilter.addEventListener('click', () => {
    const city   = (filterCity.value || '').toLowerCase();
    const guests = Number(filterGuests.value) || 0;
    const price  = filterPrice.value || '';

    document.querySelectorAll('.house-card').forEach(card => {
      let visible = true;

      if (city && !card.dataset.city.toLowerCase().includes(city)) visible = false;
      if (guests && Number(card.dataset.guests) < guests) visible = false;
      if (price && card.dataset.price !== price) visible = false;

      card.style.display = visible ? '' : 'none';
    });
  });

  document.querySelectorAll('.btn-reservar').forEach(btn => {
    btn.addEventListener('click', () => abrirModalReserva(btn.dataset.item || 'Item'));
  });
}

/* VEÍCULOS */
/* de mesmo funcionamento da aba das residências, mesma lógica mas com outra coisa para alugar */
function setupVeiculosPage() {
  const btnFilter = document.getElementById('btnFilterCars');
  if (!btnFilter) return;

  btnFilter.addEventListener('click', () => {
    const type  = filterType.value;
    const trans = filterTrans.value;
    const price = filterCarPrice.value;

    document.querySelectorAll('.vehicle-card').forEach(card => {
      let visible = true;

      if (type && card.dataset.type !== type) visible = false;
      if (trans && card.dataset.trans !== trans) visible = false;
      if (price && card.dataset.price !== price) visible = false;

      card.style.display = visible ? '' : 'none';
    });
  });

  document.querySelectorAll('.btn-reservar-veiculo').forEach(btn => {
    btn.addEventListener('click', () => abrirModalReserva(btn.dataset.item || 'Veículo'));
  });
}

/* MODAL / RESERVA */
/* Abrir o modal do bootstrap */
function abrirModalReserva(item) {
  const modalEl = document.getElementById('rentModal');
  if (!modalEl) return;

  rentItemName.textContent = item;
  rentForm.reset();
  rentForm.querySelectorAll('.is-invalid').forEach(i => i.classList.remove('is-invalid'));

  new bootstrap.Modal(modalEl).show();
}

/* Organiza o envio das reservas, através dos formulários */
function setupRentForm() {
  const form = document.getElementById('rentForm');
  if (!form) return;

  const cleanForm = form.cloneNode(true);
  form.replaceWith(cleanForm);

  cleanForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = renterName.value.trim();
    const email = renterEmail.value.trim();
    const phone = renterPhone.value.trim();
    const start = startDate.value;
    const end   = endDate.value;

    if (!name || !email || !phone || !start || !end) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (new Date(end) <= new Date(start)) {
      alert('Data final deve ser posterior à inicial.');
      return;
    }

    const reserva = {
      id: Date.now(),
      item: rentItemName.textContent,
      name,
      email,
      phone,
      cpf: renterCPF.value || '',
      start,
      end
    };

    const arr = JSON.parse(localStorage.getItem('tnm_reservations') || '[]');
    arr.unshift(reserva);
    localStorage.setItem('tnm_reservations', JSON.stringify(arr));

    alert('Reserva realizada com sucesso!');
    bootstrap.Modal.getInstance(document.getElementById('rentModal')).hide();
    cleanForm.reset();
  });
}

/* NAVBAR / LOGIN */
/* Define o que deve aparecer na aba de navegação (o navbar) ao ser feito o login) */
function setupNavbarLoginState() {
  const logged = localStorage.getItem('usuarioLogado') === 'true';

  ['navResidencias','navVeiculos','navReservas','navSobre','navLogout']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('d-none', !logged);
    });

  const navLogin = document.getElementById('navLogin');
  if (navLogin) navLogin.classList.toggle('d-none', logged);

  const linkLogout = document.getElementById('linkLogout');
  if (linkLogout) {
    linkLogout.onclick = (e) => {
      e.preventDefault();
      if (!confirm('Deseja sair da sua conta?')) return;

      localStorage.clear();
      window.location.href = 'index.html';
    };
  }
}

/* BOTÃO "ALUGUE JÁ" */
/* Define que o botão só aparece quando o login não foi efetuado */
function setupAlugueJaButton() {
  const btn = document.getElementById('btnAlugueJa');
  if (!btn) return;

  const logged = localStorage.getItem('usuarioLogado') === 'true';
  btn.classList.toggle('d-none', logged);
}

/* INICIALIZAÇÃO ÚNICA */
/* Garantir que os códigos, principalmente o html rode normal e automaticamente */

document.addEventListener('DOMContentLoaded', () => {
  setupNavActive();
  setupHomeSearch();
  setupResidenciasPage();
  setupVeiculosPage();
  setupRentForm();
  setupNavbarLoginState();
  setupAlugueJaButton();
});

