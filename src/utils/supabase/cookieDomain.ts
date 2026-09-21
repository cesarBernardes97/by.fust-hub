/**
 * cookieDomain.ts: o dominio do cookie de sessao do Supabase no hub, num lugar
 * so. Browser, server e middleware leem daqui; nenhum dos tres declara o
 * proprio valor.
 *
 * Por que existe: o server e o middleware ja gravavam o cookie em
 * ".byfust.com.br" (login central, decisoes D3 e D7: a sessao do hub vale em
 * radier.byfust.com.br, geotech e pilar), mas o cliente de BROWSER do hub nao
 * declarava dominio nenhum. O primeiro uso dele no navegador gravaria um
 * cookie host-only de byfust.com.br com o MESMO nome do compartilhado: dois
 * cookies iguais, um refresh que nao alcanca os modulos e o logout em sessao
 * longa que a auditoria ja apontava. Hoje nenhum arquivo importa o cliente de
 * browser, entao isto e armadilha desarmada antes de alguem pisar nela.
 *
 * A REGRA NAO E O NODE_ENV, e sim o host publico do hub. Na Vercel o NODE_ENV
 * vale "production" tambem nos deploys de Preview (o `next build` sempre roda
 * assim), entao decidir pelo NODE_ENV mandava o preview em "*.vercel.app"
 * gravar Domain=.byfust.com.br, que o navegador recusa, e o login entrava em
 * laco. Consequencia pratica: NEXT_PUBLIC_SITE_URL tem de estar preenchida
 * tambem no ambiente Preview da Vercel.
 */

const DOMINIO = "byfust.com.br";

/** Dominio compartilhado entre os modulos BY.FUST. */
export const SHARED_COOKIE_DOMAIN = `.${DOMINIO}`;

/** URL publica do hub, sem barra no fim. */
export function getHubSiteUrl(): string {
  const bruto = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (bruto) return bruto.replace(/\/+$/, "");
  return process.env.NODE_ENV === "production" ? `https://${DOMINIO}` : "http://localhost:3080";
}

/**
 * O dominio do cookie para a URL publica do hub: so um host de byfust.com.br
 * recebe o compartilhado. localhost, "*.vercel.app" e qualquer outro host
 * ficam sem atributo Domain, que e o unico jeito de o navegador aceitar o
 * cookie la.
 */
export function cookieDomainFor(siteUrl: string | undefined): string | undefined {
  let host: string;
  try {
    host = new URL(siteUrl ?? "").hostname.toLowerCase();
  } catch {
    return undefined;
  }
  return host === DOMINIO || host.endsWith(`.${DOMINIO}`) ? SHARED_COOKIE_DOMAIN : undefined;
}

export const COOKIE_DOMAIN: string | undefined = cookieDomainFor(getHubSiteUrl());
