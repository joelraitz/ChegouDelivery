# 🛵 ChegouDelivery — Ecossistema de Entregas Monorepo

Sistema completo para gestão e acompanhamento de pedidos de delivery em tempo real. O ecossistema abrange desde o envio do pedido pelo cliente, confirmação de pagamento simulado, gestão do restaurante, até o aceite do entregador e a linha do tempo dinâmica.

---

## 🚀 Tecnologias Utilizadas

### **Backend (`apps/api`)**
* **Node.js** com **TypeScript**
* **Fastify**: Framework web de alta performance.
* **@fastify/jwt**: Autenticação via JSON Web Tokens.
* **@fastify/cors**: Liberação de acessos do frontend.

### **Frontend (`apps/web`)**
* **Next.js 14+** (App Router)
* **React** + **TypeScript**
* **Tailwind CSS**: Estilização moderna e responsiva.
* **Lucide React**: Biblioteca de ícones.

---

## 📂 Estrutura do Monorepo

```text
chegoudelivery/
├── apps/
│   ├── api/                   # API REST desenvolvida em Fastify
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts    # Cadastro e Login (JWT)
│   │   │   │   └── orders.ts  # Criação, Pagamento e Status de Pedidos
│   │   │   └── server.ts      # Servidor Fastify e registro de rotas
│   │   └── package.json
│   │
│   └── web/                   # Aplicação Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx          # Home: Escolha de categorias e Checkout (PIX/Cartão)
│       │   │   ├── orders/page.tsx   # Linha do tempo dos pedidos do usuário
│       │   │   ├── restaurant/page.tsx # Painel de aceite e preparo do restaurante
│       │   │   ├── driver/page.tsx   # Painel de corridas para entregadores
│       │   │   ├── login/page.tsx    # Tela de Login com JWT
│       │   │   └── register/page.tsx # Tela de Cadastro
│       │   └── components/
│       │       ├── Navbar.tsx        # Navegação global com estado de login
│       │       └── ProtectedRoute.tsx # HOC/Componente de proteção de rotas
│       └── package.json
└── README.md
