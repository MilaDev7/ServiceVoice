import "dotenv/config"
import AddisAI, { fileFromPath } from "addisai";

const addis = new AddisAI({apiKey:process.env.ADDIS_API_KEY});
const response = await addis.chat.completions.create({
  messages: [{ role: "user", content: "Describe this image in Amharic." }],
  attachments: [{ file: await fileFromPath("market.jpg", "image/jpeg") }],
});

console.log(response.choices[0].message.content);