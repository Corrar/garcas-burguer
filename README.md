<div align="center">

# 🍔 Garça's Burguer

Sistema de pedidos da Garça's Burguer: **cardápio digital para o cliente** (delivery,
retirada ou mesa) e **painel do restaurante** com pedidos, cozinha, cardápio e relatórios.

[![Demo](https://img.shields.io/badge/demo-garca--burguer.vercel.app-22c55e?style=flat-square&logo=vercel)](https://garca-burguer.vercel.app)
![React](https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=flat-square&logo=prisma)

</div>

## ✨ Funcionalidades

### Para o cliente

| Tela | O que faz |
|---|---|
| **Cardápio** (`/`) | Produtos por categoria, personalização (tirar ingredientes, adicionais pagos) e sacola salva no aparelho |
| **Tipo de pedido** | Delivery, retirada ou consumo na mesa. A mesa vem pelo link (`?mesa=`) ou pela leitura do QR code com a câmera |
| **Localização** | Usa o GPS para preencher o endereço de entrega (OpenStreetMap) |
| **Pagamento** | Escolha entre Pix ou cartão pelo app, ou dinheiro/cartão na entrega, com troco |
| **Meus pedidos** | Acompanha o status com barra de progresso e permite avaliar o pedido |
| **Busca** | Encontra produtos com filtro por categoria |
| **Totem** (`/kiosk`) | Fluxo de autoatendimento, com QR code de acesso em `/qrcode` |
| **WhatsApp** | Monta a mensagem do pedido e abre a conversa com a loja |

### Para o restaurante (`/admin`)

| Tela | O que faz |
|---|---|
| **Relatórios** | Vendas, pedidos e ticket médio do dia, totais por forma de pagamento, mais vendidos e média das avaliações |
| **Pedidos** | Lista com filtro por status |
| **Cozinha** | Cards dos pedidos com avanço de status (pendente → preparando → pronto → entregue), atualizados a cada 10 segundos |
| **Produtos** | Cadastro, edição e remoção do cardápio |
| **Banners** | Promoções exibidas no cardápio |
| **Configurações** | Loja aberta/fechada, prazo, taxa de entrega e pedido mínimo |

## 🛠️ Tecnologias

| | |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind + shadcn/ui, React Router, TanStack Query, React Hook Form + Zod, GSAP, `qrcode.react` e leitor de QR pela câmera |
| **Backend** (`server/`) | Node.js, Express 5, Prisma e PostgreSQL (Neon) |
| **Deploy** | Vercel (frontend) e Render (API) |

## 🚀 Como rodar

### API

```bash
cd server
npm install
# crie server/.env com:
#   DATABASE_URL=postgresql://...   (seu PostgreSQL)
#   ADMIN_TOKEN=um-token-secreto    (protege as rotas do painel)
#   PORT=3001                       (opcional)
npx prisma db push                  # cria as tabelas a partir do schema
node prisma/seed.js                 # opcional: dados de exemplo
npm run dev                         # http://localhost:3001
```

### Frontend

```bash
npm install
echo "VITE_API_URL=http://localhost:3001/api" > .env
npm run dev                         # http://localhost:8080
```

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento (porta 8080) |
| `npm run build` | build de produção |
| `npm run preview` | serve o build localmente |
| `npm run lint` | ESLint |
| `npm test` | testes (Vitest) |

O painel `/admin` envia o `ADMIN_TOKEN` no cabeçalho `x-admin-token` em cada alteração.

## 🔌 API

Todas as rotas começam com `/api`:

| Recurso | Rotas |
|---|---|
| Saúde | `GET /health` |
| Produtos | `GET/POST /products` · `PATCH/DELETE /products/:id` |
| Pedidos | `GET /orders` · `GET /orders/today` · `POST /orders` · `PATCH /orders/:id/status` · `/payment` · `/rating` |
| Configurações | `GET/PATCH /settings` |
| Banners | `GET/POST /banners` · `PATCH/DELETE /banners/:id` |

## 📁 Estrutura

```
src/
├── pages/            # telas do cliente e do painel (pages/admin)
├── components/       # pdv/ (cardápio e sacola), admin/ e ui/ (shadcn)
├── context/          # StoreContext: sacola, pedidos e configurações da loja
├── services/api.ts   # cliente da API (VITE_API_URL)
├── lib/              # utilitários, incluindo a mensagem do WhatsApp
└── types/            # tipos TypeScript
server/
├── routes/ · controllers/ · middlewares/
└── prisma/           # schema.prisma e seed.js
```
