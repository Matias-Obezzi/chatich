import { PageContext } from "@/type";

const translations = {
  en: {
    title: "Chatich Documentation",
    intro: "Chatich is a web application that displays live chat messages from Twitch, Kick, and YouTube channels. It is designed for stream overlays, OBS browser sources, and custom widgets, with real-time updates and flexible styling.",
    howTo: "How to Display Chat Messages",
    twitch: "Twitch Chat",
    twitchDesc: "To display Twitch chat messages, add the",
    twitchParam: "twitch",
    twitchExample: "Example: Display chat for the Twitch channel",
    kick: "Kick Chat",
    kickDesc: "To display Kick chat messages, add the",
    kickParam: "kick",
    kickExample: "Example: Display chat for the Kick channel",
    youtube: "YouTube Chat",
    youtubeDesc: "To display YouTube live chat messages, add the",
    youtubeParam: "youtube",
    youtubeExample: "Example: Display chat for the YouTube live video with ID",
    combine: "Combining Twitch, Kick, and YouTube Chats",
    combineDesc: "You can combine Twitch, Kick, and YouTube chats into a single view by using multiple parameters in the URL. For example:",
    customize: "How to Customize the Chat Appearance",
    customizeUrl: "Using the styles URL Parameter",
    customizeUrlDesc: "You can customize the appearance of the chat by passing a",
    customizeUrlDesc2: "query parameter in the URL. The value should be a URL-encoded JSON object with any of the following keys:",
    customizeObs: "Using Custom CSS in OBS Studio",
    customizeObsDesc: "When adding Chatich as a Browser Source in OBS Studio, you can also apply your own custom CSS in the OBS settings to further style the chat overlay.",
    obsClasses: "The main container uses the class",
    obsMessage: "Each message uses the class",
    obsExample: "Example CSS for OBS:",
    troubleshooting: "Troubleshooting",
    troubleshooting1: 'If you see "Loading..." for a long time, check your network connection.',
    troubleshooting2: "Make sure the channel name or video ID in the URL is correct and the channel/video is public/live.",
    troubleshooting3: "For advanced styling, refer to the list of supported style keys above.",
    more: "More Information",
    github: "GitHub Repository",
    questions: "For questions or issues, please open an issue on GitHub.",
    styleKeys: [
      "username-color", "username-font-weight", "username-font-size", "message-background", "message-color",
      "message-font-weight", "message-font-size", "message-font-family", "message-text-decoration", "message-text-transform",
      "message-text-shadow", "message-border-radius", "message-padding", "message-margin", "message-box-shadow",
      "message-line-height", "message-letter-spacing", "message-word-spacing", "message-text-align", "message-text-overflow",
      "message-white-space", "row-background", "row-padding", "row-margin", "row-border-radius", "row-box-shadow",
      "row-text-align", "row-text-overflow", "row-white-space"
    ]
  },
  es: {
    title: "Documentación de Chatich",
    intro: "Chatich es una aplicación web que muestra mensajes de chat en vivo de canales de Twitch, Kick y YouTube. Está diseñada para overlays de stream, fuentes de navegador en OBS y widgets personalizados, con actualizaciones en tiempo real y estilos flexibles.",
    howTo: "Cómo mostrar mensajes de chat",
    twitch: "Chat de Twitch",
    twitchDesc: "Para mostrar mensajes del chat de Twitch, agrega el parámetro",
    twitchParam: "twitch",
    twitchExample: "Ejemplo: Mostrar el chat del canal de Twitch",
    kick: "Chat de Kick",
    kickDesc: "Para mostrar mensajes del chat de Kick, agrega el parámetro",
    kickParam: "kick",
    kickExample: "Ejemplo: Mostrar el chat del canal de Kick",
    youtube: "Chat de YouTube",
    youtubeDesc: "Para mostrar mensajes del chat en vivo de YouTube, agrega el parámetro",
    youtubeParam: "youtube",
    youtubeExample: "Ejemplo: Mostrar el chat del video en vivo de YouTube con ID",
    combine: "Combinar chats de Twitch, Kick y YouTube",
    combineDesc: "Puedes combinar chats de Twitch, Kick y YouTube en una sola vista usando múltiples parámetros en la URL. Por ejemplo:",
    customize: "Cómo personalizar la apariencia del chat",
    customizeUrl: "Usando el parámetro styles en la URL",
    customizeUrlDesc: "Puedes personalizar la apariencia del chat agregando el parámetro",
    customizeUrlDesc2: "en la URL. El valor debe ser un objeto JSON codificado en URL con cualquiera de las siguientes claves:",
    customizeObs: "Usando CSS personalizado en OBS Studio",
    customizeObsDesc: "Al agregar Chatich como una fuente de navegador en OBS Studio, también puedes aplicar tu propio CSS personalizado en la configuración de OBS para personalizar aún más el chat.",
    obsClasses: "El contenedor principal usa la clase",
    obsMessage: "Cada mensaje usa la clase",
    obsExample: "Ejemplo de CSS para OBS:",
    troubleshooting: "Solución de problemas",
    troubleshooting1: 'Si ves "Loading..." por mucho tiempo, revisa tu conexión a internet.',
    troubleshooting2: "Asegúrate de que el nombre del canal o ID del video en la URL sea correcto y que el canal/video sea público/en vivo.",
    troubleshooting3: "Para estilos avanzados, consulta la lista de claves de estilo arriba.",
    more: "Más información",
    github: "Repositorio en GitHub",
    questions: "Para preguntas o problemas, abre un issue en GitHub.",
    styleKeys: [
      "username-color", "username-font-weight", "username-font-size", "message-background", "message-color",
      "message-font-weight", "message-font-size", "message-font-family", "message-text-decoration", "message-text-transform",
      "message-text-shadow", "message-border-radius", "message-padding", "message-margin", "message-box-shadow",
      "message-line-height", "message-letter-spacing", "message-word-spacing", "message-text-align", "message-text-overflow",
      "message-white-space", "row-background", "row-padding", "row-margin", "row-border-radius", "row-box-shadow",
      "row-text-align", "row-text-overflow", "row-white-space"
    ]
  },
  pt: {
    title: "Documentação do Chatich",
    intro: "Chatich é uma aplicação web que exibe mensagens de chat ao vivo dos canais da Twitch, Kick e YouTube. É projetada para overlays de stream, fontes de navegador no OBS e widgets personalizados, com atualizações em tempo real e estilos flexíveis.",
    howTo: "Como exibir mensagens do chat",
    twitch: "Chat da Twitch",
    twitchDesc: "Para exibir mensagens do chat da Twitch, adicione o parâmetro",
    twitchParam: "twitch",
    twitchExample: "Exemplo: Exibir o chat do canal da Twitch",
    kick: "Chat da Kick",
    kickDesc: "Para exibir mensagens do chat da Kick, adicione o parâmetro",
    kickParam: "kick",
    kickExample: "Exemplo: Exibir o chat do canal da Kick",
    youtube: "Chat do YouTube",
    youtubeDesc: "Para exibir mensagens do chat ao vivo do YouTube, adicione o parâmetro",
    youtubeParam: "youtube",
    youtubeExample: "Exemplo: Exibir o chat do vídeo ao vivo do YouTube com ID",
    combine: "Combinando chats da Twitch, Kick e YouTube",
    combineDesc: "Você pode combinar chats da Twitch, Kick e YouTube em uma única visualização usando múltiplos parâmetros na URL. Por exemplo:",
    customize: "Como personalizar a aparência do chat",
    customizeUrl: "Usando o parâmetro styles na URL",
    customizeUrlDesc: "Você pode personalizar a aparência do chat adicionando o parâmetro",
    customizeUrlDesc2: "na URL. O valor deve ser um objeto JSON codificado na URL com qualquer uma das seguintes chaves:",
    customizeObs: "Usando CSS personalizado no OBS Studio",
    customizeObsDesc: "Ao adicionar o Chatich como uma fonte de navegador no OBS Studio, você também pode aplicar seu próprio CSS personalizado nas configurações do OBS para personalizar ainda mais o chat.",
    obsClasses: "O contêiner principal usa a classe",
    obsMessage: "Cada mensagem usa a classe",
    obsExample: "Exemplo de CSS para OBS:",
    troubleshooting: "Solução de problemas",
    troubleshooting1: 'Se você ver "Loading..." por muito tempo, verifique sua conexão de internet.',
    troubleshooting2: "Certifique-se de que o nome do canal ou ID do vídeo na URL está correto e que o canal/vídeo está público/ao vivo.",
    troubleshooting3: "Para estilos avançados, consulte a lista de chaves de estilo acima.",
    more: "Mais informações",
    github: "Repositório no GitHub",
    questions: "Para dúvidas ou problemas, abra uma issue no GitHub.",
    styleKeys: [
      "username-color", "username-font-weight", "username-font-size", "message-background", "message-color",
      "message-font-weight", "message-font-size", "message-font-family", "message-text-decoration", "message-text-transform",
      "message-text-shadow", "message-border-radius", "message-padding", "message-margin", "message-box-shadow",
      "message-line-height", "message-letter-spacing", "message-word-spacing", "message-text-align", "message-text-overflow",
      "message-white-space", "row-background", "row-padding", "row-margin", "row-border-radius", "row-box-shadow",
      "row-text-align", "row-text-overflow", "row-white-space"
    ]
  }
};

const HomePage = async ({ context } : { context: PageContext }) => {
  if (!context) {
    context = {
      url: "",
      pathname: "",
      search: "",
      lang: "en",
    }
  }
  const t = translations[context.lang as keyof typeof translations] || translations.en;
  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
      <p className="mb-6">{t.intro}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t.howTo}</h2>
      <ol className="list-decimal list-inside space-y-6">
        <li>
          <b>{t.twitch}</b>
          <p>
            {t.twitchDesc} <code className="bg-gray-100 px-2 py-1 rounded">{t.twitchParam}</code> {t.twitchExample} <code className="bg-gray-100 px-2 py-1 rounded">ninja</code>:
          </p>
          <code className="bg-gray-100 px-2 py-1 rounded block mt-1">
            {context.url}?twitch=ninja
          </code>
        </li>
        <li>
          <b>{t.kick}</b>
          <p>
            {t.kickDesc} <code className="bg-gray-100 px-2 py-1 rounded">{t.kickParam}</code> {t.kickExample} <code className="bg-gray-100 px-2 py-1 rounded">ninja</code>:
          </p>
          <code className="bg-gray-100 px-2 py-1 rounded block mt-1">
            {context.url}?kick=ninja
          </code>
        </li>
        <li>
          <b>{t.youtube}</b>
          <p>
            {t.youtubeDesc} <code className="bg-gray-100 px-2 py-1 rounded">{t.youtubeParam}</code> {t.youtubeExample} <code className="bg-gray-100 px-2 py-1 rounded">ninja</code>:
          </p>
          <code className="bg-gray-100 px-2 py-1 rounded block mt-1">
            {context.url}?youtube=ninja
          </code>
        </li>
        <li>
          <b>{t.combine}</b>
          <p>
            {t.combineDesc} <code className="bg-gray-100 px-2 py-1 rounded">{t.twitchParam}</code>, <code className="bg-gray-100 px-2 py-1 rounded">{t.kickParam}</code>, and <code className="bg-gray-100 px-2 py-1 rounded">{t.youtubeParam}</code>:
          </p>
          <code className="bg-gray-100 px-2 py-1 rounded block mt-1">
            {context.url}?twitch=ninja&kick=ninja&youtube=ninja
          </code>
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t.customize}</h2>
      <ol className="list-decimal list-inside space-y-6">
        <li>
          <b>{t.customizeUrl}</b>
          <p>
            {t.customizeUrlDesc} <code className="bg-gray-100 px-2 py-1 rounded">styles</code> {t.customizeUrlDesc2}
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
            {t.styleKeys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
          <p className="mt-2">
            <b>Example:</b>
            <br />
            <code className="bg-gray-100 px-2 py-1 rounded break-all block mt-1">
              {context.url}?twitch=ninja&amp;styles=%7B%22message-background%22%3A%22%23f0f0f0%22%2C%22username-color%22%3A%22%23ff0000%22%7D
            </code>
            <span className="text-xs text-gray-500">
              (The <code>styles</code> value is a URL-encoded JSON object.)
            </span>
          </p>
        </li>
        <li>
          <b>{t.customizeObs}</b>
          <p>{t.customizeObsDesc}</p>
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>
              {t.obsClasses} <code className="bg-gray-100 px-2 py-1 rounded">.wrapper</code>
            </li>
            <li>
              {t.obsMessage} <code className="bg-gray-100 px-2 py-1 rounded">.message</code>
            </li>
          </ul>
          <p className="mt-2">{t.obsExample}</p>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
{`.wrapper {
  background: transparent !important;
}
.message {
  font-size: 1.5rem !important;
  border-radius: 12px !important;
}`}
          </pre>
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t.troubleshooting}</h2>
      <ul className="list-disc list-inside ml-6 space-y-1">
        <li>{t.troubleshooting1}</li>
        <li>{t.troubleshooting2}</li>
        <li>{t.troubleshooting3}</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">{t.more}</h2>
      <ul className="list-disc list-inside ml-6 space-y-1">
        <li>
          <a href="https://github.com/matias-obezzi/chatich" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            {t.github}
          </a>
        </li>
        <li>
          <a href="https://github.com/matias-obezzi/chatich/issues/new" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            {t.questions}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;