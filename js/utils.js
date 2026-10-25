// Ayudantes pequeños para crear elementos y dar formato.

export const $ = (id) => document.getElementById(id);

/** Crea un elemento con propiedades e hijos. Usa textContent, nunca innerHTML, para no ejecutar texto de los productos. */
export function el(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Ícono del sprite assets/icons.svg. */
export function icon(name, className = 'icon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `assets/icons.svg#${name}`);
  svg.append(use);
  return svg;
}

/** Igual que src/utils/format.ts de la app: "20000" → "$20.000". Si no es solo un número, lo deja tal cual. */
export function formatPrice(raw) {
  const text = String(raw).trim().replace(/^\$\s*/, '');
  const digits = text.replace(/\./g, '');
  return /^\d+$/.test(digits) ? `$${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : `$${text}`;
}

/** Precio como número para ordenar; los productos sin precio van al final. */
export function priceValue(product) {
  return Number(String(product.price || '').replace(/\D/g, '')) || null;
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
