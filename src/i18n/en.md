# Chatich Documentation

Chatich is a web application that displays live chat messages from Twitch, Kick, and YouTube channels. It is designed for stream overlays, OBS browser sources, and custom widgets, with real-time updates and flexible styling.

## How to Display Chat Messages

1. **Twitch Chat**  
  To display Twitch chat messages, add the `twitch` parameter. Example: Display chat for the Twitch channel `ninja`:
  ```
  {{PAGE}}/overlay/chat?twitch=ninja
  ```

2. **Kick Chat**  
  To display Kick chat messages, add the `kick` parameter. Example: Display chat for the Kick channel `ninja`:
  ```
  {{PAGE}}/overlay/chat?kick=ninja
  ```

3. **YouTube Chat**  
  To display YouTube live chat messages, add the `youtube` parameter. Example: Display chat for the YouTube live video with ID `ninja`:
  ```
  {{PAGE}}/overlay/chat?youtube=ninja
  ```

4. **Combining Twitch, Kick, and YouTube Chats**  
  You can combine Twitch, Kick, and YouTube chats into a single view by using multiple parameters in the URL. For example:
  ```
  {{PAGE}}/overlay/chat?twitch=ninja&kick=ninja&youtube=ninja
  ```

## How to Customize the Chat Appearance

1. **Using the styles URL Parameter**  
  You can customize the appearance of the chat by passing a `styles` query parameter in the URL. The value should be a URL-encoded JSON object with any of the following keys:

  ```
  username-color, username-font-weight, username-font-size, message-background, message-color,
  message-font-weight, message-font-size, message-font-family, message-text-decoration, message-text-transform,
  message-text-shadow, message-border-radius, message-padding, message-margin, message-box-shadow,
  message-line-height, message-letter-spacing, message-word-spacing, message-text-align, message-text-overflow,
  message-white-space, row-background, row-padding, row-margin, row-border-radius, row-box-shadow,
  row-text-align, row-text-overflow, row-white-space
  ```

  **Example:**
  ```
  {{PAGE}}/overlay/chat?twitch=ninja&styles=%7B%22message-background%22%3A%22%23f0f0f0%22%2C%22username-color%22%3A%22%23ff0000%22%7D
  ```
  (The `styles` value is a URL-encoded JSON object.)

2. **Using Custom CSS in OBS Studio**  
  When adding Chatich as a Browser Source in OBS Studio, you can also apply your own custom CSS in the OBS settings to further style the chat overlay.

  - The main container uses the class `.wrapper`
  - Each message uses the class `.message`

  Example CSS for OBS:
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

## Connecting Spotify in OBS

The music overlay shows what you are listening to on Spotify. The authorisation is stored in the browser inside OBS, so **you have to do it from OBS**: signing in from Chrome will not work, because OBS uses its own storage.

You only need to do this once:

1. Build your overlay in the music builder and copy the URL.
2. In OBS, add a **Browser** source and paste the URL. Set width to 1920 and height to 1080.
3. The source will show a **"Spotify sin conectar"** notice.
4. Right click the source and choose **Interact**. This opens a window where you can use the overlay like a browser.
5. In that window, click **Conectar con Spotify**. The Spotify login opens inside it.
6. Sign in and accept the permissions. Chatich only asks to read what you are listening to.
7. Once it says done, close the Interact window. The overlay will start showing the track.

**Watch out for this:** the authorisation lives in that browser source's cache. If you right click and choose "Refresh cache of current page", or if you delete and recreate the source, it is lost and you have to repeat the steps. Moving the source between scenes or restarting OBS does not affect it.

If the overlay suddenly stops showing the track, that cache was most likely cleared: open Interact again and reconnect.

## Troubleshooting

- If you see "Loading..." for a long time, check your network connection.
- Make sure the channel name or video ID in the URL is correct and the channel/video is public/live.
- For advanced styling, refer to the list of supported style keys above.

## More Information

- [GitHub Repository](https://github.com/matias-obezzi/chatich)
- [Questions or Issues? Open an Issue on GitHub](https://github.com/matias-obezzi/chatich/issues/new)