# Ommed Frontend Challenge

Aplicação Frontend desenvolvida em Vue.js 3 com integração REST API para o desafio técnico da Ommed.

## 📋 Descrição

Esta aplicação implementa uma interface completa para gerenciamento de dados pessoais e profissionais de usuários, integrando-se com uma API REST (BFF - Backend for Frontend). O projeto oferece funcionalidades de autenticação, cadastro de usuários e gerenciamento de conselhos profissionais.

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** (Composition API)
- **Vite** - Build tool e dev server
- **Vue Router** - Roteamento
- **Pinia** - Gerenciamento de estado
- **REST API** - Comunicação com backend via HTTP

## 📦 Dependências

### Principais
- `vue`: ^3.4.15
- `vue-router`: ^4.2.5
- `pinia`: ^2.1.7

### Desenvolvimento
- `@vitejs/plugin-vue`: ^5.0.3
- `vite`: ^5.0.11
- `eslint`: ^8.56.0
- `eslint-plugin-vue`: ^9.20.1

## 🛠️ Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend REST API rodando em `http://localhost:3001`

### Passos para instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd ommed-frontend-challenge
```

2. Instale as dependências:
```bash
npm install
```

## 🏃 Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

**Importante**: Certifique-se de que o backend REST API está rodando em `http://localhost:3001` antes de iniciar a aplicação.

### Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão no diretório `dist/`

### Preview do Build

```bash
npm run preview
```

## ⚙️ Configuração

### API REST (BFF)

O projeto utiliza um proxy configurado no `vite.config.js` para comunicação com a API REST:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001', // API REST (BFF)
    changeOrigin: true,
    secure: false,
  },
}
```

### Endpoint da API

O endpoint padrão está configurado em `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://localhost:3001'
  : ''
```

Para alterar o endpoint em produção, configure a variável de ambiente `VITE_API_URL` ou modifique o arquivo `src/services/api.js`.

## 📁 Estrutura do Projeto

```
ommed-frontend-challenge/
├── src/
│   ├── components/          # Componentes Vue reutilizáveis
│   │   ├── AddCouncilForm.vue  # Formulário de adicionar conselho
│   │   └── CouncilCard.vue      # Card de exibição de conselho
│   ├── router/              # Configuração do Vue Router
│   │   └── index.js
│   ├── services/            # Serviços de API
│   │   ├── api.js              # Cliente HTTP base
│   │   ├── apiService.js       # Serviço centralizado de API
│   │   └── restApiService.js   # Implementação dos serviços REST
│   ├── stores/              # Stores Pinia
│   │   ├── auth.js             # Store de autenticação
│   │   └── user.js             # Store de dados do usuário
│   ├── views/               # Views/Páginas
│   │   ├── DashboardView.vue    # Dashboard principal
│   │   ├── LoginView.vue        # Tela de login
│   │   └── RegisterView.vue     # Tela de cadastro
│   ├── assets/              # Assets estáticos
│   │   └── images/
│   │       └── Ommed.svg
│   ├── App.vue              # Componente raiz
│   ├── main.js              # Entry point
│   └── style.css            # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro de usuário (`POST /api/auth/register`)
- ✅ Login com JWT (`POST /api/auth/login`)
- ✅ Persistência de token no localStorage
- ✅ Rotas protegidas com guards
- ✅ Logout e limpeza de sessão

### Gerenciamento de Dados Pessoais
- ✅ Exibição de dados pessoais do usuário
- ✅ Edição de informações básicas (nome, sobrenome, data de nascimento)
- ✅ Gerenciamento de telefone com DDI
- ✅ Formatação automática de campos (data, telefone)

### Gerenciamento de Profissões
- ✅ Listagem de profissões disponíveis (`GET /api/professions`)
- ✅ Adição de registros profissionais (`POST /api/councils`)
- ✅ Exclusão de registros profissionais (`DELETE /api/councils/:id`)
- ✅ Listagem de conselhos do usuário (`GET /api/councils`)
- ✅ Validação de registro médico CRM (`GET /api/registry`)
- ✅ Exclusão em massa de conselhos

### Validação de Registro Médico
Ao adicionar uma profissão do tipo **Médico (CRM)**, o sistema:
1. Valida automaticamente o registro quando o número e estado são preenchidos
2. Consulta o endpoint de validação para verificar se o registro está ativo
3. Preenche automaticamente os campos `subscription_type` e `status`
4. Carrega as especialidades médicas disponíveis
5. Exibe mensagem de erro se o registro não estiver ativo

## 🎨 Design

O design da aplicação segue as especificações do Figma fornecido:

- **Figma**: Disponível na pasta `Figma/` do projeto

### Cores Principais
- **Primária**: #FF7043 (Laranja)
- **Background**: #FFFFFF (Branco)
- **Texto**: #2C2C2C (Cinza escuro)
- **Bordas**: #F0F0F0 (Cinza claro)

## 🔐 Autenticação

O token JWT retornado pelo endpoint de login é armazenado no `localStorage` e automaticamente incluído nas requisições subsequentes como header:

```javascript
{
  Authorization: `Bearer ${token}`
}
```

### Fluxo de Autenticação

1. Usuário faz login ou cadastro
2. Token JWT é recebido e armazenado
3. Token é incluído automaticamente em todas as requisições autenticadas
4. Em caso de erro 401, o token é limpo e o usuário é redirecionado para login

## 📝 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar novo usuário
- `POST /api/auth/login` - Autenticar e obter token

### Usuário
- `GET /api/user/basic-information` - Obter informações básicas do usuário
- `GET /api/user/full-information` - Obter informações completas do usuário

### Profissões
- `GET /api/professions` - Listar profissões disponíveis
- `GET /api/councils` - Listar conselhos do usuário
- `POST /api/councils` - Adicionar conselho profissional
- `DELETE /api/councils/:id` - Remover conselho profissional
- `GET /api/registry` - Validar registro médico (CRM)

## 🏗️ Arquitetura

### Serviços

A aplicação utiliza uma arquitetura em camadas:

1. **api.js**: Cliente HTTP base com tratamento de erros e gerenciamento de tokens
2. **restApiService.js**: Implementação dos serviços REST específicos
3. **apiService.js**: Camada de abstração que exporta os serviços padronizados

### Stores (Pinia)

- **auth.js**: Gerencia autenticação, token e estado de login
- **user.js**: Gerencia dados do usuário, profissões e conselhos

### Componentes

- **AddCouncilForm.vue**: Formulário completo para adicionar conselho profissional
- **CouncilCard.vue**: Card de exibição de conselho com opção de exclusão

## 🐛 Tratamento de Erros

A aplicação implementa tratamento de erros em todos os pontos de integração:

- ✅ Validação de formulários no frontend
- ✅ Mensagens de erro amigáveis do backend
- ✅ Loading states durante requisições
- ✅ Feedback visual para ações do usuário
- ✅ Tratamento de erros HTTP (401, 404, 500, etc.)
- ✅ Redirecionamento automático em caso de token inválido

## 📱 Responsividade

A aplicação é totalmente responsiva e adapta-se a diferentes tamanhos de tela:

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Layout adaptado com colunas reduzidas
- **Mobile**: Layout em coluna única

Utiliza CSS Grid e Flexbox para layouts flexíveis.

## 🌍 Internacionalização

A aplicação suporta seleção de idioma (interface preparada para múltiplos idiomas):

- PT-BR (padrão)
- Interface preparada para expansão

## 🔍 Linting

Execute o linter para verificar o código:

```bash
npm run lint
```

O projeto utiliza ESLint com plugin Vue para manter a qualidade do código.

## 🧪 Testes

Para testar a aplicação:

1. Certifique-se de que o backend está rodando
2. Execute `npm run dev`
3. Acesse `http://localhost:5173`
4. Teste os fluxos de:
   - Cadastro de usuário
   - Login
   - Visualização de dados
   - Adição de conselho profissional
   - Exclusão de conselho

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

