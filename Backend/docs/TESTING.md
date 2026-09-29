# ServiceVoice Testing Guide

## Scope

The suite covers the requested behavior in six slices:

1. **Database**: valid services, requirements, four-language translations, and source relationships.
2. **RAG**: exact, natural-language, English/Amharic/Afaan Oromo/Tigrinya, unknown, insufficient-context, and ambiguous queries.
3. **AI**: grounded output, hallucination resistance, missing information, language propagation, and prompt-injection resistance.
4. **Chat**: valid payloads, malformed payloads, empty messages, the 10,000-character limit, and unsupported languages.
5. **Authentication**: registration, login, invalid credentials, expired access tokens, refresh tokens, and unauthorized requests.
6. **Voice**: valid audio, invalid MIME types, the 5 MB limit, STT failure, language hints, and optional TTS output.

## Step-by-step execution

From `Backend`:

```bash
npm install
npm test
npm run test:coverage
```

The test runner is `node --test`; no production PostgreSQL connection, provider account, or API key is required. The HTTP tests start an ephemeral local server and close it after each request.

## Test architecture

`src/services/repository.js` is the repository boundary. Production code can replace its in-memory implementation with a Prisma implementation without changing RAG, chat, auth, or voice services.

`src/services/providers/index.js` defines replaceable LLM, STT, and TTS interfaces. Provider-specific HTTP calls belong behind these interfaces. Tests pass mocks through `createProviderSet({ llm, stt, tts })`; no external provider is contacted.

The authoritative flow is:

```text
request -> ChatService -> RAGService -> repository -> retrieved context -> LLM provider
voice   -> VoiceService -> STT provider -> ChatService -> optional TTS provider
```

The LLM receives retrieved requirements and sources at request time. It does not become the database of record and the system does not retrain a foundation model when a service changes.

## Languages and missing translations

The supported identifiers are `en`, `am`, `om`, and `ti`. Service and requirement records carry language-aware fields, while the service slug and relationships remain language-neutral. Unsupported languages produce a controlled `400` response. A missing authoritative translation must be handled by a future translation adapter; it must not invent an official requirement.

## Provider and secret policy

Use backend-only variables such as `LLM_API_KEY`, `STT_API_KEY`, and `TTS_API_KEY` plus their provider URLs. The frontend must call ServiceVoice, never a provider directly. Keys must not appear in responses, database fixtures, logs, or Git. Provider selection should be finalized against current vendor documentation for Amharic, Afaan Oromo, Tigrinya, English, reliability, latency, and cost before enabling a production adapter.

The current suite verifies the abstraction and language propagation with mocks. It deliberately does not claim a vendor's language support without a documented provider selection.

## Adding a test

1. Add a focused `*.test.js` file under `Backend/test`.
2. Prefer service-level tests for business rules and HTTP tests for request validation/auth contracts.
3. Inject provider mocks instead of reading API keys.
4. Run `npm test` before changing unrelated application behavior.
