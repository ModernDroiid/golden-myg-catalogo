// Datos que se pueden cambiar sin tocar el resto del código.

/** Número de WhatsApp con código de país, solo dígitos. Vacío = se ocultan los botones de pedido. */
export const WHATSAPP_NUMBER = '573246041664';

/** Usuario de Instagram sin @. Vacío = no se muestra. */
export const INSTAGRAM_USER = '';

// Clave PÚBLICA (anon): en Supabase solo permite leer el catálogo.
// Editar requiere iniciar sesión en la app con una cuenta autorizada.
export const SUPABASE_URL = 'https://khvaqdzxotqfwqjzzbem.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodmFxZHp4b3RxZndxanp6YmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NDgxMjUsImV4cCI6MjEwODUyNDEyNX0.srgQrVOw84ACH2ZLZXlKbJRQNsnUcUdZKF8z_EQnVBo';

/** [valor guardado en la base de datos, texto que se muestra] */
export const CATEGORIES = [
  ['Todos', 'Todo'],
  ['Collar', 'Collares'],
  ['Bolso', 'Bolsos'],
  ['Otro', 'Otros'],
];

/** Para "Pedir este collar por WhatsApp". */
export const CATEGORY_SINGULAR = { Collar: 'collar', Bolso: 'bolso', Otro: 'producto' };

/** Cuántos productos recientes llevan la etiqueta NUEVO, y hasta cuántos días de antigüedad. */
export const NEW_BADGE_COUNT = 4;
export const NEW_BADGE_DAYS = 14;

/** Productos por página antes de "Ver más productos". */
export const PAGE_SIZE = 12;

export const PAGE_TITLE = 'Golden MYG · Collares y bolsos';
