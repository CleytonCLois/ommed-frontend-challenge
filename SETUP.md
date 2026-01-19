# Guia de Configuração Rápida

## 🚀 Início Rápido

### 1. Instalação

```bash
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 3. Build para Produção

```bash
npm run build
```

## 📋 Checklist de Verificação

Antes de executar, certifique-se de que:

- [ ] Node.js instalado (versão 16+)
- [ ] Arquivos gRPC estão em `src/grpc/`:
  - [ ] `testF1_grpc_web_pb.js`
  - [ ] `testF1_pb.js`
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor gRPC está acessível em `https://development-api.beta.ommed.tech:50051`

## 🔧 Configuração de Fase

Para alternar entre Fase 1 e Fase 2, edite `src/views/DashboardView.vue`:

```javascript
// Linha ~30
const usePhase2 = ref(false) // false = Fase 1, true = Fase 2
```

## 🐛 Problemas Comuns

### Erro: "Cannot find module 'grpc-web'"

**Solução**: Execute `npm install` novamente.

### Erro: "Failed to load gRPC files"

**Solução**: Verifique se os arquivos estão em `src/grpc/`:
- `testF1_grpc_web_pb.js`
- `testF1_pb.js`

### Erro de CORS

**Solução**: O proxy está configurado no `vite.config.js`. Certifique-se de que o servidor de desenvolvimento está rodando.

### Token não persiste após login

**Solução**: Verifique se o localStorage está habilitado no navegador.

## 📞 Suporte

Consulte o `README.md` para mais detalhes.

