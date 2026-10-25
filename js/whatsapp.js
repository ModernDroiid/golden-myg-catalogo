// Enlaces de pedido por WhatsApp e Instagram.
import { WHATSAPP_NUMBER, INSTAGRAM_USER } from './config.js';
import { formatPrice } from './utils.js';

export const hasWhatsApp = () => !!WHATSAPP_NUMBER;

/** Enlace directo a un producto (abre su detalle). */
export const productUrl = (product) => `${location.origin}${location.pathname}#producto/${product.id}`;

/** Chat de WhatsApp con el mensaje ya escrito. Sin producto = pedido general. */
export function whatsappUrl(product) {
  const text = product
    ? `Hola, quiero pedir: ${product.name}${product.price ? ` (${formatPrice(product.price)})` : ''}\n${productUrl(product)}`
    : 'Hola, quiero hacer un pedido del catálogo de Golden MYG.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Rellena los enlaces fijos de la página (encabezado, botón fijo, pie, menú). */
export function setupContactLinks() {
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    if (hasWhatsApp()) link.href = whatsappUrl(null);
    else link.hidden = true;
  });
  if (!hasWhatsApp()) document.querySelectorAll('.sticky-cta, .detail__cta').forEach((box) => { box.hidden = true; });
  document.querySelectorAll('[data-whatsapp-number]').forEach((node) => {
    node.textContent = `WhatsApp +${WHATSAPP_NUMBER}`;
  });
  document.querySelectorAll('[data-instagram]').forEach((link) => {
    link.hidden = !INSTAGRAM_USER;
    link.href = `https://instagram.com/${INSTAGRAM_USER}`;
    link.textContent = `Instagram @${INSTAGRAM_USER}`;
  });
}
