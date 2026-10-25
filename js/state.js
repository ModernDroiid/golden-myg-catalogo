// Estado compartido de la página: los productos y lo que la persona eligió ver.
import { PAGE_SIZE, NEW_BADGE_COUNT, NEW_BADGE_DAYS } from './config.js';

export const state = {
  products: [],
  category: 'Todos',
  query: '',
  sort: 'new',
  visibleCount: PAGE_SIZE,
  newIds: new Set(),
};

export function setProducts(products) {
  state.products = products;
  // NUEVO: solo los más recientes, y solo si se agregaron hace pocos días.
  const maxAge = NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;
  state.newIds = new Set(
    products
      .slice(0, NEW_BADGE_COUNT)
      .filter((p) => Date.now() - Number(p.created_at) < maxAge)
      .map((p) => p.id)
  );
}

export const findProduct = (id) => state.products.find((p) => p.id === id);
