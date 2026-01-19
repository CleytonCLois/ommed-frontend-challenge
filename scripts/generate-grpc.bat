@echo off
REM Script para gerar arquivos gRPC em ES Modules (Windows)

echo Verificando protoc...
where protoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ protoc não está instalado!
    echo 📥 Instale o Protocol Buffers Compiler:
    echo    https://github.com/protocolbuffers/protobuf/releases
    exit /b 1
)

echo Verificando protoc-gen-grpc-web...
where protoc-gen-grpc-web >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ protoc-gen-grpc-web não está instalado!
    echo 📥 Instale o plugin:
    echo    npm install -g grpc-web
    exit /b 1
)

echo 🔄 Gerando arquivos gRPC em ES Modules...

REM Remove arquivos antigos
echo 🗑️  Removendo arquivos antigos...
if exist src\grpc\testF1_pb.js del src\grpc\testF1_pb.js
if exist src\grpc\testF1_grpc_web_pb.js del src\grpc\testF1_grpc_web_pb.js

REM Gera novos arquivos em ES6
protoc --js_out=import_style=es6,binary:src/grpc --grpc-web_out=import_style=es6,mode=grpcwebtext:src/grpc testF1.proto

if %ERRORLEVEL% EQU 0 (
    echo ✅ Arquivos gerados com sucesso!
    echo 📁 Arquivos criados em: src\grpc\
    dir src\grpc\*.js
) else (
    echo ❌ Erro ao gerar arquivos!
    exit /b 1
)
