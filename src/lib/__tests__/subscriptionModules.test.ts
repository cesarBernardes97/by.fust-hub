/* eslint-disable @typescript-eslint/no-require-imports -- o hub nao tem runner
   de teste instalado: estes testes rodam no runner do proprio Node, e o
   require com extensao .ts e o unico jeito que roda no Node e passa no tsc. */
/**
 * subscriptionModules.test.ts: decisao de modulo do webhook do Stripe
 * (auditoria de go-live, item I-04).
 *
 * Prova: assinatura sem metadata e assinatura com metadata desconhecida nao
 * gravam linha nenhuma (antes viravam "blocos"); `module = radier` e
 * reconhecido mas nao e gravado pelo hub, porque o radier tem webhook proprio
 * e esta em beta fechado; produto antigo so e mapeado quando o id esta em
 * STRIPE_LEGACY_PRODUCT_MODULES.
 *
 * O hub ainda nao tem runner de teste (sem vitest no package.json), entao
 * este arquivo roda no runner do proprio Node, sem instalar nada:
 *
 *   node --test src/lib/__tests__/*.test.ts
 *
 * O `require` com extensao .ts e de proposito: e o que o Node resolve e, ao
 * mesmo tempo, passa no `tsc --noEmit` do app (que nao liga
 * allowImportingTsExtensions).
 */

import type * as Subscription from "../subscription";

const { describe, it, before, after }: typeof import("node:test") = require("node:test");
const assert: typeof import("node:assert/strict") = require("node:assert/strict");
const {
  eventoEhAntigo,
  moduleFromSubscription,
  modulesToPersist,
  normalizeModule,
  ALL_MODULES,
  KNOWN_MODULES,
}: typeof Subscription = require("../subscription.ts");

type Assinatura = Parameters<typeof moduleFromSubscription>[0];

/** Assinatura do Stripe reduzida ao que a decisao le. */
function assinatura(
  produto: string | { id?: string; metadata?: Record<string, string> | null } | null,
  metadataDaAssinatura: Record<string, string> | null = null,
): Assinatura {
  return {
    metadata: metadataDaAssinatura,
    items: { data: [{ price: { product: produto } }] },
  };
}

describe("moduleFromSubscription", () => {
  it("nao chuta modulo quando o produto nao tem metadata", () => {
    const sub = assinatura({ id: "prod_sem_metadata", metadata: {} });
    assert.equal(moduleFromSubscription(sub), null);
    assert.deepEqual(modulesToPersist(moduleFromSubscription(sub)), []);
  });

  it("nao chuta modulo quando a assinatura vem sem item nenhum", () => {
    assert.equal(moduleFromSubscription({ items: { data: [] } }), null);
    assert.equal(moduleFromSubscription(null), null);
  });

  it("ignora metadata desconhecida, inclusive 'linha', que nao entrou na CHECK", () => {
    for (const desconhecido of ["linha", "zzz", "BLOCO", " "]) {
      const sub = assinatura({ id: "prod_x", metadata: { module: desconhecido } });
      assert.equal(moduleFromSubscription(sub), null, `modulo ${desconhecido}`);
      assert.deepEqual(modulesToPersist(moduleFromSubscription(sub)), []);
    }
  });

  it("reconhece module = radier e mesmo assim nao grava (webhook proprio)", () => {
    const sub = assinatura({ id: "prod_radier", metadata: { module: "radier" } });
    assert.equal(moduleFromSubscription(sub), "radier");
    assert.deepEqual(modulesToPersist("radier"), []);
  });

  it("grava o modulo quando a metadata do produto diz qual e", () => {
    const sub = assinatura({ id: "prod_blocos", metadata: { module: " Blocos " } });
    assert.equal(moduleFromSubscription(sub), "blocos");
    assert.deepEqual(modulesToPersist(moduleFromSubscription(sub)), ["blocos"]);
  });

  it("aceita a metadata da assinatura quando o produto nao tem", () => {
    const sub = assinatura({ id: "prod_x", metadata: null }, { module: "geotech" });
    assert.equal(moduleFromSubscription(sub), "geotech");
  });

  it("o plano 'all' abre os modulos vendidos, sem o radier", () => {
    const sub = assinatura({ id: "prod_all", metadata: { module: "all" } });
    assert.equal(moduleFromSubscription(sub), "all");
    assert.deepEqual(modulesToPersist("all"), [...ALL_MODULES]);
    assert.equal(modulesToPersist("all").includes("radier"), false);
  });
});

describe("produto antigo sem metadata", () => {
  const anterior = process.env.STRIPE_LEGACY_PRODUCT_MODULES;

  before(() => {
    process.env.STRIPE_LEGACY_PRODUCT_MODULES = "prod_antigo:blocos, prod_outro:geotech";
  });

  after(() => {
    if (anterior === undefined) delete process.env.STRIPE_LEGACY_PRODUCT_MODULES;
    else process.env.STRIPE_LEGACY_PRODUCT_MODULES = anterior;
  });

  it("so e mapeado quando o id esta na variavel de ambiente", () => {
    assert.equal(moduleFromSubscription(assinatura("prod_antigo")), "blocos");
    assert.equal(moduleFromSubscription(assinatura("prod_outro")), "geotech");
    assert.equal(moduleFromSubscription(assinatura("prod_nao_listado")), null);
  });
});

describe("normalizeModule", () => {
  it("aceita so o que a CHECK do banco aceita", () => {
    for (const mod of KNOWN_MODULES) {
      assert.equal(normalizeModule(mod.toUpperCase()), mod);
    }
    assert.equal(normalizeModule("all"), "all");
    assert.equal(normalizeModule(null), null);
    assert.equal(normalizeModule(undefined), null);
    assert.equal(normalizeModule(""), null);
  });
});

describe("eventoEhAntigo (I-03: reenvio fora de ordem)", () => {
  it("o evento atrasado nao regrava por cima do mais novo", () => {
    // Cenario do Stripe: um `deleted` de created=2000 ja gravado e, depois,
    // um `updated` atrasado de created=1000 com status active. Sem a guarda,
    // o upsert devolvia plan_type "pro" a quem cancelou.
    assert.equal(eventoEhAntigo(2000, 1000), true);
  });

  it("o evento novo e o repetido passam", () => {
    assert.equal(eventoEhAntigo(1000, 2000), false);
    // Repeticao exata do mesmo evento: regravar o mesmo estado e inofensivo.
    assert.equal(eventoEhAntigo(2000, 2000), false);
  });

  it("linha sem carimbo gravado nunca e antiga", () => {
    for (const gravado of [null, undefined, "2000", NaN]) {
      assert.equal(eventoEhAntigo(gravado, 1000), false, `gravado ${String(gravado)}`);
    }
  });
});
