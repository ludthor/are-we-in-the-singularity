import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${pathname}-${process.pid}-${Date.now()}-${Math.random()}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the current English dossier", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Are we living in the singularity now\?<\/title>/);
  assert.match(html, /Weekly field note/);
  assert.match(html, /This week’s verdict/);
  assert.match(html, />NO</);
  assert.match(html, /hrefLang="es"/);
  assert.match(html, /github\.com\/ludthor/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("renders the Spanish dossier and localized metadata", async () => {
  const response = await render("/es");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(
    html,
    /<title>¿Estamos viviendo ya en la singularidad\?<\/title>/,
  );
  assert.match(html, /Nota semanal/);
  assert.match(html, /Veredicto de esta semana/);
  assert.match(html, /Pruebas, no vibras/);
  assert.match(html, /hrefLang="en"/);
});
