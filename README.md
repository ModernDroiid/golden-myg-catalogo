# Golden MYG · Catálogo web

Página pública (solo lectura) del catálogo. Los productos se editan desde la app;
esta página los lee de Supabase y se actualiza sola cuando cambian.

Publicada en GitHub Pages: https://moderndroiid.github.io/golden-myg-catalogo/

## Estructura

```
index.html        Estructura de la página (sin estilos ni código)
assets/
  icons.svg       Íconos (se usan con <use href="assets/icons.svg#nombre">)
  logo-96.png     Logo del encabezado, pie y pestaña del navegador
  logo-192.png    Ícono al guardar la página en el celular
css/
  base.css        Colores, letras, reset, botones y utilidades
  layout.css      Encabezado, menú del celular, portada, botón fijo, pie
  catalog.css     Buscador, filtros, cuadrícula y tarjetas
  detail.css      Detalle de producto y galería de fotos
js/
  config.js       Datos editables: WhatsApp, Instagram, Supabase, categorías
  api.js          Lectura de productos y aviso de cambios (Supabase)
  state.js        Estado compartido: productos, filtro, búsqueda, orden
  utils.js        Ayudantes: crear elementos, íconos, formato de precio
  whatsapp.js     Enlaces de pedido por WhatsApp e Instagram
  catalog.js      Filtros, orden, cuadrícula, tarjetas y portada
  detail.js       Detalle (#producto/<id>), galería y compartir
  main.js         Punto de entrada: conecta los controles y carga los datos
```

## Cambios comunes

- **Número de WhatsApp o Instagram:** `js/config.js`.
- **Colores o letras:** variables al inicio de `css/base.css`.
- **Textos de la portada o del pie:** `index.html`.

## Probar en el computador

Los módulos de JavaScript no funcionan abriendo el archivo directamente
(`file://`). Hay que servir la carpeta:

```
npx http-server web -p 8080
```

y abrir http://localhost:8080.
