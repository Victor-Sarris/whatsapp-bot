import venom from "venom-bot";
import "dotenv/config";
import axios from "axios";

function start(client) {
  client.onMessage((message) => {
    if (!message.isGroupMsg && !message.from.includes("status@broadcast")) {
      if (message.body === "ping") {
        client.sendText(message.from, "pong");
      } else {
        const contents = [
          {
            role: "user",
            parts: [
              {
                text: "Você é um assistente de IA que está conectado no WhatsApp pelo venom-bot. O bot pertence a um corretor de imóveis e você será responsável por dizer qual link de imagem o venom deve enviar para o usuário. Você deve responder apenas com o link da imagem. Links: garagem_1quarto_1cozinha_1sala_de_estar_1banheiro_R$1000_por_mês.png,garagem_comodo_unico_mais_1banheiro_R$500_por_mes.png,modelo_para_financiamento.png, sua missão é entender que tipo de caso é melhor para o cliente de acordo com a mensagem que ele mandou. Você deve responder com o link da imagem que melhor se encaixa no caso do cliente, responda sem '\n' ou outras formatações. Se você entender que se trata de um contexto subjetivo, e que requer resposta humana, mande apenas 'Recebemos sua mensagem, em breve um corretor irá entrar em contato com você.'",
              },
            ],
          },
          {
            role: "user",
            parts: [
              {
                text: message.body,
              },
            ],
          },
        ];
        axios
          .post(
            https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY},
            { contents },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((res) => {
            const response = res.data.candidates[0].content.parts[0].text;

            if (response.includes(".png")) {
              client.sendImage(
                message.from,
                ${response.split("\n")[0]},
                "Imagem casa",
                "Aqui está uma boa opção para você."
              );
            } else {
              client.sendText(message.from, response);
            }
          })
          .catch((error) => {
            console.error("Error calling Gemini API:", error);
          });
      }
    }
  });
}

venom
  .create({
    session: process.env.SESSION_NAME,
    headless: "new",
    puppeteerOptions: { protocolTimeout: 120000 },
  })
  .then((client) => {
    console.log("Venom client created successfully!");
    start(client);
  })
  .catch((error) => {
    console.error("Error creating Venom client:", error);
  });