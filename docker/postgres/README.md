# PostgreSQL Setup

## Problema: "role does not exist"

Se você está vendo erros como `role "postgres" does not exist` ou `role "kb_app" does not exist`, isso geralmente significa que:

1. O volume do PostgreSQL já existia de uma configuração anterior
2. O script `init.sql` não foi executado porque o volume já estava inicializado

## Solução: Resetar o Volume

Para forçar a execução do script de inicialização novamente, você precisa remover o volume:

```bash
# Parar os containers
docker compose down

# Remover o volume do PostgreSQL
docker volume rm kb-api-nestjs_postgres_data

# Ou remover todos os volumes relacionados
docker compose down -v

# Iniciar novamente (o init.sql será executado)
docker compose up -d
```

## Verificar se funcionou

```bash
# Verificar logs
docker compose logs postgres

# Conectar ao banco
docker compose exec postgres psql -U postgres -d kb

# Ou testar com o usuário kb_app
docker compose exec postgres psql -U kb_app -d kb
```

## Usuários e Senhas

- **postgres** / postgres (usuário administrador padrão)
- **kb_app** / kb_app_password (usuário da aplicação)

Você pode usar qualquer um dos dois no `.development.env`:

```env
# Opção 1: Usar postgres (mais simples)
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Opção 2: Usar kb_app (mais seguro em produção)
DB_USERNAME=kb_app
DB_PASSWORD=kb_app_password
```

