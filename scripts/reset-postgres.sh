#!/bin/bash

# Script para resetar o PostgreSQL e forçar execução do init.sql

echo "🛑 Parando containers..."
docker compose down

echo "🗑️  Removendo volume do PostgreSQL..."
docker volume rm kb-api-nestjs_postgres_data 2>/dev/null || docker volume rm kb_postgres_data 2>/dev/null || echo "Volume não encontrado (já foi removido ou não existe)"

echo "🚀 Iniciando containers novamente..."
docker compose up -d

echo "⏳ Aguardando PostgreSQL iniciar..."
sleep 5

echo "📊 Verificando logs..."
docker compose logs postgres --tail 20

echo ""
echo "✅ Pronto! Teste a conexão com:"
echo "   docker compose exec postgres psql -U postgres -d kb"
echo ""
echo "   Ou use o usuário kb_app:"
echo "   docker compose exec postgres psql -U kb_app -d kb"

