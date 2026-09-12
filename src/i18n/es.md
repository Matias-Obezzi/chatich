# Documentación de Chatich

Chatich es una aplicación web que muestra mensajes de chat en vivo de canales de Twitch, Kick y YouTube. Está diseñada para overlays de stream, fuentes de navegador en OBS y widgets personalizados, con actualizaciones en tiempo real y estilos flexibles.

## Cómo mostrar mensajes de chat

1. **Chat de Twitch**  
  Para mostrar mensajes del chat de Twitch, agrega el parámetro `twitch`. Ejemplo: Mostrar el chat del canal de Twitch `ninja`:
  ```
  {{PAGE}}/overlay/chat?twitch=ninja
  ```

2. **Chat de Kick**  
  Para mostrar mensajes del chat de Kick, agrega el parámetro `kick`. Ejemplo: Mostrar el chat del canal de Kick `ninja`:
  ```
  {{PAGE}}/overlay/chat?kick=ninja
  ```

3. **Chat de YouTube**  
  Para mostrar mensajes del chat en vivo de YouTube, agrega el parámetro `youtube`. Ejemplo: Mostrar el chat del video en vivo de YouTube con ID `ninja`:
  ```
  {{PAGE}}/overlay/chat?youtube=ninja
  ```

4. **Combinar chats de Twitch, Kick y YouTube**  
  Puedes combinar chats de Twitch, Kick y YouTube en una sola vista usando múltiples parámetros en la URL. Por ejemplo:
  ```
  {{PAGE}}/overlay/chat?twitch=ninja&kick=ninja&youtube=ninja
  ```

## Cómo personalizar la apariencia del chat

1. **Usando el parámetro styles en la URL**  
  Puedes personalizar la apariencia del chat agregando el parámetro `styles` en la URL. El valor debe ser un objeto JSON codificado en URL con cualquiera de las siguientes claves:

  ```
  username-color, username-font-weight, username-font-size, message-background, message-color,
  message-font-weight, message-font-size, message-font-family, message-text-decoration, message-text-transform,
  message-text-shadow, message-border-radius, message-padding, message-margin, message-box-shadow,
  message-line-height, message-letter-spacing, message-word-spacing, message-text-align, message-text-overflow,
  message-white-space, row-background, row-padding, row-margin, row-border-radius, row-box-shadow,
  row-text-align, row-text-overflow, row-white-space
  ```

  **Ejemplo:**
  ```
  {{PAGE}}/overlay/chat?twitch=ninja&styles=%7B%22message-background%22%3A%22%23f0f0f0%22%2C%22username-color%22%3A%22%23ff0000%22%7D
  ```
  (El valor de `styles` es un objeto JSON codificado en URL.)

2. **Usando CSS personalizado en OBS Studio**  
  Al agregar Chatich como una fuente de navegador en OBS Studio, también puedes aplicar tu propio CSS personalizado en la configuración de OBS para personalizar aún más el chat.

  - El contenedor principal usa la clase `.wrapper`
  - Cada mensaje usa la clase `.message`

  Ejemplo de CSS para OBS:
  ```css
  .wrapper {
    background: transparent !important;
  }
  .message {
    font-size: 1.5rem !important;
    border-radius: 12px !important;
  }
  ```

<a id="spotify-obs"></a>

## Conectar Spotify en OBS

El overlay de música muestra lo que estás escuchando en Spotify. La autorización se guarda en el navegador interno de OBS, así que **hay que hacerla desde OBS**: si iniciás sesión en Chrome no sirve, porque OBS usa su propio almacenamiento.

Se hace una sola vez:

1. Armá tu overlay en el builder de música y copiá la URL.
2. En OBS, agregá una fuente de tipo **Navegador** y pegá la URL. Poné ancho 1920 y alto 1080.
3. La fuente va a mostrar el cartel **"Spotify sin conectar"**.
4. Hacé clic derecho sobre la fuente y elegí **Interactuar**. Se abre una ventana donde podés usar el overlay como si fuera un navegador.
5. En esa ventana, tocá **Conectar con Spotify**. Se abre el login de Spotify ahí adentro.
6. Iniciá sesión y aceptá los permisos. Chatich solo pide leer qué estás escuchando.
7. Cuando aparezca "Listo", cerrá la ventana de Interactuar. El overlay ya muestra la canción.

**Cuidado con esto:** la autorización vive en la caché de esa fuente de navegador. Si hacés clic derecho y elegís "Actualizar caché de la página actual", o si borrás y volvés a crear la fuente, se pierde y hay que repetir los pasos. Mover la fuente entre escenas o reiniciar OBS no la afecta.

Si el overlay deja de mostrar la canción de golpe, lo más probable es que se haya limpiado esa caché: volvé a Interactuar y conectá de nuevo.

## Solución de problemas

- Si ves "Loading..." por mucho tiempo, revisa tu conexión a internet.
- Asegúrate de que el nombre del canal o ID del video en la URL sea correcto y que el canal/video sea público/en vivo.
- Para estilos avanzados, consulta la lista de claves de estilo arriba.

## Más información

- [Repositorio en GitHub](https://github.com/matias-obezzi/chatich)
- [¿Preguntas o problemas? Abre un issue en GitHub](https://github.com/matias-obezzi/chatich/issues/new)