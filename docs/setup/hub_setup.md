# Setup BY.FUST HUB

Este documento descreve como o aplicativo base `by.fust` foi gerado e configurado como ponto de entrada (hub) unificado para os módulos da plataforma (ex: `by.geotech` e `by.blocos`), sem interferir nos repositórios/código dos módulos finais.

## 1. Criação do Aplicativo Base
A aplicação Next.js foi gerada utilizando a estrutura mais recente do pacote oficial (com App Router, Tailwind v4 e suporte a import aliases):
```powershell
cd C:\BYFUST\apps
npx create-next-app@latest by.fust --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm
```

## 2. Estrutura de Diretórios Principal (`src/app`)

Como Hub central da plataforma, a hierarquia de pastas implementada segue o design do Next.js App Router, alocando sub-caminhos provisórios que atuarão via integrações futuras como âncoras para os módulos isolados. 

```text
C:\BYFUST\apps\by.fust\src\app\
├── globals.css         # Adição de design-system dark-mode padrão
├── layout.tsx          # Wrapper principal com background estético gradiente
├── page.tsx            # Home Dashboard (Ponto de entrada do painel central)
├── geotech/
│   └── page.tsx        # Placeholder para módulo BY.GEOTECH (já acessível em /geotech)
└── blocos/
    └── page.tsx        # Placeholder para módulo BY.BLOCOS (já acessível em /blocos)
```

## 3. Identidade Visual Desenvolvida
Conforme o requisito de entregar uma temática dark-friendly "premium", as seguintes abordagens foram aplicadas no boilerplate original:

- **Layout e Fundo (`layout.tsx`):**
  - Aplicação permanente da classe `dark` para renderização base sem interrupções.
  - Implementação de um background com gradiente radial/linear discreto da família Slate usando o Tailwind (`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50`).
- **Dashboard Hub (`page.tsx`):**
  - Criação de Layout em Grid centralizado com dois cartões principais (BY.GEOTECH e BY.BLOCOS).
  - Título global (`BY.FUST`) renderizado translúcido com gradiente da cor Blue para Emerald, criando um forte viés estético.
  - **Cards**: Estilizados utilizando propriedades visuais como bordas vítreas (`border-slate-700/50`), fundos foscos com efeito *backdrop blur* e animações responsivas suaves no Hover (`hover:shadow-2xl`). Cada cartão descreve sua utilidade de engenharia e abriga um botão "Abrir" dinâmico com referências a animações de ícone interativas.
- **Folhas Internas (`/geotech` e `/blocos`):**
  - Incluem um brilho etéreo abstrato rodando sobre a *main wrapper* (`blur-[150px]`).
  - Utilizam um cartão de "placeholder" que atua em simetria à paleta original da landing page para manter consistência absoluta ao clicar "Voltar à Home".

## 4. Como Executar Localmente
O aplicativo obedece inteiramente à base de scripts originais do Next.js sem depender das camadas do C++. 

Abra o prompt ou powershell, entre no app e inicialize o servidor com os seguintes comandos:
```powershell
cd C:\BYFUST\apps\by.fust
npm install
npm run dev
```
As portas serão disponibilizadas por padrão em `http://localhost:3000`. Os testes de rotas locais mostraram HTTP 200 (Success) para a raiz do painel e os dois sub-diretórios.

> *Nota: Nenhuma alteração foi realizada em `C:\BYFUST\apps\by.geotech` e não foram instanciados comandos `git commit`, conforme a regra de isolamento da entrega.*
FIM
