// Acceso a los datos en Supabase (solo lectura).
// `supabase` es la librería global que carga index.html desde el CDN.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

/** Todos los productos, del más reciente al más antiguo. */
export async function fetchProducts() {
  const { data, error } = await db.from('productos').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Llama a `onChange` cada vez que alguien crea, edita o borra un producto desde la app. */
export function onProductsChange(onChange) {
  db.channel('catalogo-web')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, onChange)
    .subscribe();
}
