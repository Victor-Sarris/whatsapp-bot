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
                text: "",
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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((res) => {
            const response = res.data.candidates[0].content.parts[0].text;
            const teste = response.split("\n")[0];

            if (response.includes(".png")) {
              client.sendImage(
                message.from,
                teste,
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