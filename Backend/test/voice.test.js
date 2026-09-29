import test from "node:test";
import assert from "node:assert/strict";
import { createTestApp, request } from "./helpers.js";

const validAudio = { audioBase64: Buffer.from("audio-bytes").toString("base64"), mimeType: "audio/wav", transcript: "marriage certificate", language: "en" };

test("Voice: valid audio is transcribed and answered", async () => {
  const response = await request(createTestApp(), "POST", "/api/voice", validAudio);
  assert.equal(response.status, 200);
  assert.equal(response.body.data.transcript, "marriage certificate");
});

test("Voice: invalid audio is rejected", async () => {
  const response = await request(createTestApp(), "POST", "/api/voice", { audioBase64: "", mimeType: "text/plain", language: "en" });
  assert.equal(response.status, 415);
});

test("Voice: oversized audio is rejected", async () => {
  const response = await request(createTestApp(), "POST", "/api/voice", { audioBase64: Buffer.alloc(5 * 1024 * 1024 + 1).toString("base64"), mimeType: "audio/wav", transcript: "marriage certificate", language: "en" });
  assert.equal(response.status, 413);
});

test("Voice: STT failure is controlled and provider receives language hint", async () => {
  const languages = [];
  const app = createTestApp({ providers: { stt: { async transcribe({ language }) { languages.push(language); throw new Error("provider unavailable"); } } } });
  const response = await request(app, "POST", "/api/voice", validAudio);
  assert.equal(response.status, 502);
  assert.deepEqual(languages, ["en"]);
});
