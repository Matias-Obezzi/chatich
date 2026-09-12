# Documentação do Chatich

Chatich é uma aplicação web que exibe mensagens de chat ao vivo dos canais da Twitch, Kick e YouTube. É projetada para overlays de stream, fontes de navegador no OBS e widgets personalizados, com atualizações em tempo real e estilos flexíveis.

## Como exibir mensagens do chat

1. **Chat da Twitch**  
  Para exibir mensagens do chat da Twitch, adicione o parâmetro `twitch`. Exemplo: Exibir o chat do canal da Twitch `ninja`:
  ```
  {{PAGE}}/overlay/chat?twitch=ninja
  ```

2. **Chat da Kick**  
  Para exibir mensagens do chat da Kick, adicione o parâmetro `kick`. Exemplo: Exibir o chat do canal da Kick `ninja`:
  ```
  {{PAGE}}/overlay/chat?kick=ninja
  ```

3. **Chat do YouTube**  
  Para exibir mensagens do chat ao vivo do YouTube, adicione o parâmetro `youtube`. Exemplo: Exibir o chat do vídeo ao vivo do YouTube com ID `ninja`:
  ```
  {{PAGE}}/overlay/chat?youtube=ninja
  ```

4. **Combinando chats da Twitch, Kick e YouTube**  
  Você pode combinar chats da Twitch, Kick e YouTube em uma única visualização usando múltiplos parâmetros na URL. Por exemplo:
  ```
  {{PAGE}}/overlay/chat?twitch=ninja&kick=ninja&youtube=ninja
  ```

## Como personalizar a aparência do chat

1. **Usando o parâmetro styles na URL**  
  Você pode personalizar a aparência do chat adicionando o parâmetro `styles` na URL. O valor deve ser um objeto JSON codificado na URL com qualquer uma das seguintes chaves:

  ```
  username-color, username-font-weight, username-font-size, message-background, message-color,
  message-font-weight, message-font-size, message-font-family, message-text-decoration, message-text-transform,
  message-text-shadow, message-border-radius, message-padding, message-margin, message-box-shadow,
  message-line-height, message-letter-spacing, message-word-spacing, message-text-align, message-text-overflow,
  message-white-space, row-background, row-padding, row-margin, row-border-radius, row-box-shadow,
  row-text-align, row-text-overflow, row-white-space
  ```

  **Exemplo:**
  ```
  {{PAGE}}/overlay/chat?twitch=ninja&styles=%7B%22message-background%22%3A%22%23f0f0f0%22%2C%22username-color%22%3A%22%23ff0000%22%7D
  ```
  (O valor de `styles` é um objeto JSON codificado na URL.)

2. **Usando CSS personalizado no OBS Studio**  
  Ao adicionar o Chatich como uma fonte de navegador no OBS Studio, você também pode aplicar seu próprio CSS personalizado nas configurações do OBS para personalizar ainda mais o chat.

  - O contêiner principal usa a classe `.wrapper`
  - Cada mensagem usa a classe `.message`

  Exemplo de CSS para OBS:
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

## Conectar o Spotify no OBS

O overlay de música mostra o que você está ouvindo no Spotify. A autorização fica guardada no navegador interno do OBS, então **é preciso fazê-la pelo OBS**: entrar pelo Chrome não funciona, porque o OBS usa o próprio armazenamento.

Só precisa ser feito uma vez:

1. Monte seu overlay no builder de música e copie a URL.
2. No OBS, adicione uma fonte do tipo **Navegador** e cole a URL. Defina largura 1920 e altura 1080.
3. A fonte vai mostrar o aviso **"Spotify sin conectar"**.
4. Clique com o botão direito na fonte e escolha **Interagir**. Abre uma janela onde você pode usar o overlay como se fosse um navegador.
5. Nessa janela, clique em **Conectar con Spotify**. O login do Spotify abre ali dentro.
6. Faça login e aceite as permissões. O Chatich só pede para ler o que você está ouvindo.
7. Quando aparecer a confirmação, feche a janela de Interagir. O overlay já mostra a música.

**Atenção:** a autorização vive no cache dessa fonte de navegador. Se você clicar com o botão direito e escolher "Atualizar cache da página atual", ou se apagar e recriar a fonte, ela se perde e é preciso repetir os passos. Mover a fonte entre cenas ou reiniciar o OBS não afeta.

Se o overlay parar de mostrar a música de repente, o mais provável é que esse cache tenha sido limpo: abra Interagir de novo e reconecte.

## Solução de problemas

- Se você ver "Loading..." por muito tempo, verifique sua conexão de internet.
- Certifique-se de que o nome do canal ou ID do vídeo na URL está correto e que o canal/vídeo está público/ao vivo.
- Para estilos avançados, consulte a lista de chaves de estilo acima.

## Mais informações

- [Repositório no GitHub](https://github.com/matias-obezzi/chatich)
- [Dúvidas ou problemas? Abra uma issue no GitHub](https://github.com/matias-obezzi/chatich/issues/new)