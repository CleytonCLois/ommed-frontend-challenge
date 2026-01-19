# Gerando Arquivos gRPC em ES Modules

## 📋 Pré-requisitos

1. **Protocol Buffers Compiler (protoc)**
   - Windows: Baixe de https://github.com/protocolbuffers/protobuf/releases
   - macOS: `brew install protobuf`
   - Linux: `sudo apt-get install protobuf-compiler`

2. **Plugin gRPC-Web**
   - Instale globalmente: `npm install -g grpc-web`
   - Ou baixe de: https://github.com/grpc/grpc-web/releases

## 🚀 Como Gerar os Arquivos

### Opção 1: Usando o Script (Recomendado)

**Windows:**
```bash
scripts\generate-grpc.bat
```

**Linux/macOS:**
```bash
chmod +x scripts/generate-grpc.sh
./scripts/generate-grpc.sh
```

### Opção 2: Comando Manual

```bash
protoc \
  --js_out=import_style=es6,binary:src/grpc \
  --grpc-web_out=import_style=es6,mode=grpcwebtext:src/grpc \
  testF1.proto
```

## ✅ Após Gerar

Os arquivos antigos serão removidos automaticamente e os novos serão gerados em:
- `src/grpc/testF1_pb.js`
- `src/grpc/testF1_grpc_web_pb.js`

## 🔄 Próximos Passos

1. Execute o script de geração
2. Reinicie o servidor de desenvolvimento: `npm run dev`
3. Os arquivos agora usam ES Modules nativamente!

## 📝 Notas

- Os arquivos gerados serão compatíveis com Vite, Vue 3 e ESM
- Não é mais necessário o plugin `viteCommonjs` para os arquivos gRPC
- O código já está atualizado para usar imports diretos
