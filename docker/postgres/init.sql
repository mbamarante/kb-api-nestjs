-- Criar schemas para organização
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS accounts;
CREATE SCHEMA IF NOT EXISTS geo;

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Para UUIDs
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Para busca full-text
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Para busca sem acentos

-- Usuário de aplicação (mais seguro que usar postgres)
-- Usar DO block para evitar erro se o usuário já existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'kb_app') THEN
    CREATE USER kb_app WITH PASSWORD 'kb_app_password';
  ELSE
    ALTER USER kb_app WITH PASSWORD 'kb_app_password';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE kb TO kb_app;
GRANT USAGE ON SCHEMA core, accounts, geo TO kb_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core, accounts, geo TO kb_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA core, accounts, geo TO kb_app;

-- Garantir permissões futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO kb_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA accounts GRANT ALL ON TABLES TO kb_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA geo GRANT ALL ON TABLES TO kb_app;