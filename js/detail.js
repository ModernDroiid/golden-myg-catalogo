// Detalle de producto. Se abre con la dirección #producto/<id>, así cada producto tiene su enlace para compartir.
import { CATEGORY_SINGULAR, PAGE_TITLE } from './config.js';
import { state, findProduct } from './state.js';
import { $, el, formatPrice, prefersReducedMotion } from './utils.js';
import { whatsappUrl, productUrl } from './whatsapp.js';
import { productCard } from './catalog.js';

const RELATED_LIMIT = 8;
let current = null;

export const isDetailOpen = () => !$('detail').hidden;

export function openDetail(product) {
  current = product;
  renderGallery(product);

  $('detail-category').textContent = product.category;
  $('detail-name').textContent = product.name;
  $('detail-price').textContent = product.price ? formatPrice(product.price) : '';
  $('detail-desc').textContent = product.description || '';
  renderSpecs(product);

  $('detail-whatsapp').href = whatsappUrl(product);
  $('detail-whatsapp-text').textContent = `Pedir este ${CATEGORY_SINGULAR[product.category] || 'producto'} por WhatsApp`;

  const related = state.products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, RELATED_LIMIT);
  $('related').hidden = related.length === 0;
  $('related-row').replaceChildren(...related.map((p) => productCard(p)));

  $('detail').hidden = false;
  $('detail').scrollTop = 0;
  updateGalleryControls();
  document.body.classList.add('is-locked');
  document.title = `${product.name} · Golden MYG`;
}

export function closeDetail() {
  current = null;
  $('detail').hidden = true;
  document.body.classList.remove('is-locked');
  document.title = PAGE_TITLE;
}

/** Abre o cierra el detalle según la dirección actual. */
export function route() {
  const match = location.hash.match(/^#producto\/(.+)$/);
  const product = match && findProduct(decodeURIComponent(match[1]));
  if (product) openDetail(product);
  else if (isDetailOpen()) closeDetail();
}

/** Después de recargar los productos: muestra la versión nueva del que está abierto. */
export function refreshDetail() {
  if (!current) return route();
  const fresh = findProduct(current.id);
  if (fresh) openDetail(fresh);
  else closeDetail();
}

export function goBack() {
  if (history.state?.fromCatalog) history.back();
  else {
    history.replaceState(null, '', `${location.pathname}#catalogo`);
    closeDetail();
  }
}

function renderSpecs(product) {
  const specs = [
    ['Material', product.material],
    ['Medidas', product.measurements],
    ['Colores', (product.colors || []).join(', ')],
    ['Código', product.code],
  ].filter(([, value]) => value);
  $('detail-specs').replaceChildren(
    ...specs.map(([label, value]) =>
      el('div', {}, [el('dt', { className: 'label', textContent: label }), el('dd', { textContent: value })])
    )
  );
}

// ---- Galería: deslizar, flechas, puntos y teclado ----

function renderGallery(product) {
  const photos = product.photos || [];
  $('gallery-slides').replaceChildren(
    ...photos.map((src, i) =>
      el('img', {
        src,
        alt: `${product.name}, foto ${i + 1} de ${photos.length}`,
        loading: i === 0 ? 'eager' : 'lazy',
        decoding: 'async',
      })
    )
  );
  $('gallery-dots').replaceChildren(
    ...(photos.length > 1
      ? photos.map((_, i) => {
          const dot = el('button', { type: 'button' });
          dot.setAttribute('aria-label', `Ver foto ${i + 1} de ${photos.length}`);
          dot.addEventListener('click', () => goToPhoto(i));
          return dot;
        })
      : [])
  );
  $('gallery-prev').hidden = $('gallery-next').hidden = photos.length < 2;
  $('gallery-slides').scrollLeft = 0;
  updateGalleryControls();
}

const slides = () => $('gallery-slides');
// Mientras el detalle está oculto el ancho es 0: en ese caso estamos en la primera foto.
const photoIndex = () => (slides().clientWidth ? Math.round(slides().scrollLeft / slides().clientWidth) : 0);

function goToPhoto(index) {
  const last = slides().children.length - 1;
  const target = Math.max(0, Math.min(last, index));
  slides().scrollTo({ left: target * slides().clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function updateGalleryControls() {
  const index = photoIndex();
  const last = slides().children.length - 1;
  [...$('gallery-dots').children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
  $('gallery-prev').disabled = index <= 0;
  $('gallery-next').disabled = index >= last;
}

async function share() {
  if (!current) return;
  const data = { title: current.name, text: `${current.name} en Golden MYG`, url: productUrl(current) };
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {
      // la persona cerró el menú de compartir
    }
  } else {
    await navigator.clipboard?.writeText(data.url);
    $('detail-share').setAttribute('aria-label', 'Enlace copiado');
  }
}

/** Conecta los botones del detalle. Se llama una sola vez al cargar la página. */
export function initDetail() {
  $('detail-back').addEventListener('click', goBack);
  $('detail-share').addEventListener('click', share);
  $('gallery-prev').addEventListener('click', () => goToPhoto(photoIndex() - 1));
  $('gallery-next').addEventListener('click', () => goToPhoto(photoIndex() + 1));
  slides().addEventListener('scroll', updateGalleryControls, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (!isDetailOpen() || event.target.closest('input, select')) return;
    if (event.key === 'ArrowLeft') goToPhoto(photoIndex() - 1);
    if (event.key === 'ArrowRight') goToPhoto(photoIndex() + 1);
  });

  // Los enlaces a productos guardan en el historial que venimos del catálogo,
  // para que "volver" regrese al mismo lugar.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#producto/"]');
    if (!link) return;
    event.preventDefault();
    history.pushState({ fromCatalog: true }, '', link.getAttribute('href'));
    route();
  });
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);
}
