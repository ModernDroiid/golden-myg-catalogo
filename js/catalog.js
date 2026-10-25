// Catálogo: filtros, orden, cuadrícula, tarjetas y portada.
import { CATEGORIES } from './config.js';
import { state } from './state.js';
import { $, el, icon, formatPrice, priceValue } from './utils.js';
import { hasWhatsApp, whatsappUrl } from './whatsapp.js';

const SORTERS = {
  new: (a, b) => b.created_at - a.created_at,
  'price-asc': (a, b) => (priceValue(a) ?? Infinity) - (priceValue(b) ?? Infinity),
  'price-desc': (a, b) => (priceValue(b) ?? -1) - (priceValue(a) ?? -1),
  name: (a, b) => a.name.localeCompare(b.name, 'es'),
};

/** Productos que coinciden con la categoría y la búsqueda, ya ordenados. */
export function visibleProducts() {
  const query = state.query.trim().toLowerCase();
  return state.products
    .filter((p) => state.category === 'Todos' || p.category === state.category)
    .filter((p) => !query || p.name.toLowerCase().includes(query) || (p.code || '').toLowerCase().includes(query))
    .sort(SORTERS[state.sort]);
}

/** Cuántas fotos de la cuadrícula se ven sin bajar la página (se cargan primero). */
const ABOVE_THE_FOLD = 4;

/** Tarjeta de producto. Se usa en la cuadrícula y en "También te puede gustar". */
export function productCard(product, index = Infinity) {
  const eager = index < ABOVE_THE_FOLD;
  const photo = product.photos?.[0]
    ? el('img', {
        className: 'card__photo',
        src: product.photos[0],
        alt: product.name,
        loading: eager ? 'eager' : 'lazy',
        fetchPriority: eager ? 'high' : 'auto',
        decoding: 'async',
      })
    : el('div', { className: 'card__photo card__photo--empty', textContent: 'Sin foto' });

  const link = el('a', { className: 'card__link', href: `#producto/${product.id}` }, [
    photo,
    el('p', { className: 'card__category label', textContent: product.category }),
    el('h3', { className: 'card__name', textContent: product.name }),
  ]);

  const foot = el('div', { className: 'card__foot' }, [
    el('span', { className: 'price', textContent: product.price ? formatPrice(product.price) : '' }),
  ]);
  if (hasWhatsApp()) {
    const order = el(
      'a',
      { className: 'btn btn--sm card__order', href: whatsappUrl(product), target: '_blank', rel: 'noopener' },
      [icon('chat'), 'Pedir']
    );
    order.setAttribute('aria-label', `Pedir ${product.name} por WhatsApp`);
    foot.append(order);
  }

  const card = el('article', { className: 'card' }, [link, foot]);
  if (state.newIds.has(product.id)) card.prepend(el('span', { className: 'card__badge', textContent: 'NUEVO' }));
  return card;
}

/** Botones de categoría (hay dos grupos: celular y computador). */
export function renderChips(onSelect) {
  document.querySelectorAll('[data-chips]').forEach((group) => {
    group.replaceChildren(
      ...CATEGORIES.map(([value, label]) => {
        const chip = el('button', { className: 'chip', type: 'button', textContent: label });
        chip.setAttribute('aria-pressed', String(value === state.category));
        chip.addEventListener('click', () => onSelect(value));
        return chip;
      })
    );
  });
}

export function renderGrid() {
  const list = visibleProducts();
  const total = state.products.length;
  const isFiltered = state.category !== 'Todos' || state.query.trim();

  $('catalog-count').textContent = isFiltered
    ? `${list.length} de ${total}`
    : `${total} ${total === 1 ? 'producto' : 'productos'}`;

  if (list.length === 0) {
    $('catalog-grid').replaceChildren(
      el('div', { className: 'empty' }, [
        el('h3', { textContent: total ? 'Nada por aquí' : 'Pronto habrá productos' }),
        el('p', { textContent: total ? 'Prueba con otra categoría o borra la búsqueda.' : 'Vuelve en un rato.' }),
      ])
    );
  } else {
    $('catalog-grid').replaceChildren(...list.slice(0, state.visibleCount).map((p, i) => productCard(p, i)));
  }
  $('catalog-more').hidden = list.length <= state.visibleCount;
}

/** Fotos y número de productos de la portada (computador). */
export function renderHero() {
  const withPhotos = state.products.filter((p) => p.photos?.length);
  [['hero-photo-main', withPhotos[0]], ['hero-photo-side', withPhotos[1]]].forEach(([id, product]) => {
    if (!product) return;
    $(id).src = product.photos[0];
    $(id).alt = product.name;
  });
  $('hero-count').textContent = state.products.length;
}

export function showLoadError() {
  $('catalog-count').textContent = 'No se pudo cargar. Revisa tu conexión y recarga.';
}
