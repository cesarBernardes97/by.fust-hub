# Hub Module Links — BY.FUST

## Objetivo
Configurar botões "Abrir Módulo" no Hub para abrir cada módulo via URL controlada por variável de ambiente, com fallback desabilitado quando a URL não estiver definida.

## Arquivos Alterados

| Arquivo | Tipo de alteração |
|---|---|
| `src/app/page.tsx` | `<Link>` → `<a target="_blank">` driven por env var, disabled state |
| `.env.local` | Criado com valores de dev local |

## Variáveis de Ambiente Utilizadas

```env
NEXT_PUBLIC_GEOTECH_URL=http://localhost:3002
NEXT_PUBLIC_BLOCOS_URL=http://localhost:3001
```

**Regra de comportamento:**
- URL definida → botão ativo, abre em nova aba (`target="_blank" rel="noreferrer"`)
- URL vazia/nula → botão substituído por `<span>` desabilitado (`opacity-50`, `cursor-not-allowed`) com `title="URL não configurada"`

## Como Testar Localmente

```bash
# Hub na porta 3000
cd C:\BYFUST\apps\by.fust
npm run dev

# BY.BLOCOS na porta 3001
cd C:\BYFUST\apps\by.blocos
npm run dev -- -p 3001

# BY.GEOTECH frontend (se disponível) na porta 3002
cd C:\BYFUST\apps\by.geotech\frontend
npm run dev -- -p 3002
```

Acesse `http://localhost:3000` → clicar em "Abrir Módulo" de cada card abrirá a URL correspondente em nova aba.
