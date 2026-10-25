// Punto de entrada: conecta los controles de la página y carga el catálogo.
import { PAGE_SIZE } from './config.js';
import { fetchProducts, onProductsChange } from './api.js';
import { state, setProducts } from './state.js';
import { $ } from './utils.js';
import { setupContactLinks } from './whatsapp.js';
import { renderChips, renderGrid, renderHero, showLoadError } from './catalog.js';
import { initDetail, isDetailOpen, closeDetail, goBack, refreshDetail } from './detail.js';

function selectCategory(category) {
  state.category = category;
  state.visibleCount = PAGE_SIZE;
  renderChips(selectCategory);
  renderGrid();
}

// ---- Menú del celular ----
const openDrawer = () => { $('drawer').hidden = false; };
const closeDrawer = () => { $('drawer').hidden = true; };

function initDrawer() {
  $('drawer-open').addEventListener('click', openDrawer);
  $('drawer-close').addEventListener('click', closeDrawer);
  $('drawer').addEventListener('click', (event) => {
    if (event.target === $('drawer')) closeDrawer();
  });
}

// ---- Búsqueda, orden y "ver más" ----
function initCatalogControls() {
  const searchInputs = document.querySelectorAll('[data-search]');
  searchInputs.forEach((input) => {
    input.addEventListener('input', () => {
      state.query = input.value;
      state.visibleCount = PAGE_SIZE;
      searchInputs.forEach((other) => { if (other !== input) other.value = input.value; });
      renderGrid();
    });
  });

  $('search-jump').addEventListener('click', () => {
    $('catalogo').scrollIntoView();
    $('search-desktop').focus({ preventScroll: true });
  });

  $('sort').addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderGrid();
  });

  $('catalog-more-btn').addEventListener('click', () => {
    state.visibleCount += PAGE_SIZE;
    renderGrid();
  });

  // Enlaces de categoría en el menú, encabezado, portada y pie (data-category="Collar", etc.)
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]');
    if (!link) return;
    selectCategory(link.dataset.category);
    closeDrawer();
    if (isDetailOpen()) closeDetail();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!$('drawer').hidden) closeDrawer();
    else if (isDetailOpen()) goBack();
  });
}

async function loadProducts() {
  try {
    setProducts(await fetchProducts());
  } catch {
    showLoadError();
    return;
  }
  renderHero();
  renderGrid();
  refreshDetail();
}

setupContactLinks();
renderChips(selectCategory);
initDrawer();
initCatalogControls();
initDetail();
$('year').textContent = new Date().getFullYear();

loadProducts();
// Cuando alguien edita desde la app, la página se actualiza sola.
onProductsChange(loadProducts);
