# Documentación de Chatich

Chatich es una aplicación web que muestra mensajes de chat en vivo de canales de Twitch, Kick y YouTube. Está diseñada para overlays de stream, fuentes de navegador en OBS y widgets personalizados, con actualizaciones en tiempo real y estilos flexibles.

## Cómo mostrar mensajes de chat

1. **Chat de Twitch**  
  Para mostrar mensajes del chat de Twitch, agrega el parámetro `twitch`. Ejemplo: Mostrar el chat del canal de Twitch `ninja`:
  ```
  {{PAGE}}/chat?twitch=ninja
  ```

2. **Chat de Kick**  
  Para mostrar mensajes del chat de Kick, agrega el parámetro `kick`. Ejemplo: Mostrar el chat del canal de Kick `ninja`:
  ```
  {{PAGE}}/chat?kick=ninja
  ```

3. **Chat de YouTube**  
  Para mostrar mensajes del chat en vivo de YouTube, agrega el parámetro `youtube`. Ejemplo: Mostrar el chat del video en vivo de YouTube con ID `ninja`:
  ```
  {{PAGE}}/chat?youtube=ninja
  ```

4. **Combinar chats de Twitch, Kick y YouTube**  
  Puedes combinar chats de Twitch, Kick y YouTube en una sola vista usando múltiples parámetros en la URL. Por ejemplo:
  ```
  {{PAGE}}/chat?twitch=ninja&kick=ninja&youtube=ninja
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
  {{PAGE}}/chat?twitch=ninja&styles=%7B%22message-background%22%3A%22%23f0f0f0%22%2C%22username-color%22%3A%22%23ff0000%22%7D
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

## Solución de problemas

- Si ves "Loading..." por mucho tiempo, revisa tu conexión a internet.
- Asegúrate de que el nombre del canal o ID del video en la URL sea correcto y que el canal/video sea público/en vivo.
- Para estilos avanzados, consulta la lista de claves de estilo arriba.

## Más información

- [Repositorio en GitHub](https://github.com/matias-obezzi/chatich)
- [¿Preguntas o problemas? Abre un issue en GitHub](https://github.com/matias-obezzi/chatich/issues/new)