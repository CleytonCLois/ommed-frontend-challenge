#!/bin/bash
# Script para gerar arquivos gRPC em ES Modules

# Verifica se protoc está instalado
if ! command -v protoc &> /dev/null; then
    echo "❌ protoc não está instalado!"
    echo "📥 Instale o Protocol Buffers Compiler:"
    echo "   Windows: https://github.com/protocolbuffers/protobuf/releases"
    echo "   macOS: brew install protobuf"
    echo "   Linux: sudo apt-get install protobuf-compiler"
    exit 1
fi

# Verifica se o plugin grpc-web está instalado
if ! command -v protoc-gen-grpc-web &> /dev/null; then
    echo "❌ protoc-gen-grpc-web não está instalado!"
    echo "📥 Instale o plugin:"
    echo "   npm install -g grpc-web"
    echo "   ou baixe de: https://github.com/grpc/grpc-web/releases"
    exit 1
fi

echo "🔄 Gerando arquivos gRPC em ES Modules..."

# Remove arquivos antigos
echo "🗑️  Removendo arquivos antigos..."
rm -f src/grpc/testF1_pb.js
rm -f src/grpc/testF1_grpc_web_pb.js

# Gera novos arquivos em ES6
protoc \
  --js_out=import_style=es6,binary:src/grpc \
  --grpc-web_out=import_style=es6,mode=grpcwebtext:src/grpc \
  testF1.proto

if [ $? -eq 0 ]; then
    echo "✅ Arquivos gerados com sucesso!"
    echo "📁 Arquivos criados em: src/grpc/"
    ls -la src/grpc/*.js
else
    echo "❌ Erro ao gerar arquivos!"
    exit 1
fi
