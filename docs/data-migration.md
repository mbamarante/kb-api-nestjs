# Migração de Dados MySQL → PostgreSQL

Este script migra dados do banco MySQL legado para o PostgreSQL, respeitando relacionamentos e tipos de dados.

## Pré-requisitos

1. **Tabelas já criadas no PostgreSQL**: As tabelas devem existir no PostgreSQL antes de migrar os dados. Use o TypeORM com `synchronize: true` ou crie manualmente as tabelas.

2. **Variáveis de ambiente configuradas** no `.development.env`:

   ```env
   # MySQL (fonte)
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=sua_senha
   MYSQL_DATABASE=ktb

   # PostgreSQL (destino)
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=kb
   ```

## Uso

### Migrar Todas as Tabelas

```bash
npm run migrate:data
```

O script automaticamente:

- Detecta todas as tabelas no MySQL
- Ordena as tabelas por dependências (foreign keys)
- Migra os dados respeitando a ordem correta

### Migrar Tabelas Específicas

```bash
npm run migrate:data -- users championships promoters
```

### Especificar Schemas

Se suas tabelas estão em schemas diferentes no PostgreSQL:

```bash
npm run migrate:data -- users championships --schema=users:accounts --schema=championships:core
```

Exemplo completo:

```bash
npm run migrate:data -- users championships promoters --schema=users:accounts --schema=championships:core --schema=promoters:core
```

## Como Funciona

1. **Detecção de Dependências**: O script analisa foreign keys para determinar a ordem correta de migração
2. **Conversão de Tipos**: Converte automaticamente:
   - `TINYINT(1)` → `boolean`
   - `DATETIME`/`TIMESTAMP` → `timestamp`
   - `JSON` → `jsonb` (parse automático)
   - Strings de data para objetos Date
3. **Processamento em Lotes**: Migra dados em lotes de 100 registros por vez
4. **Tratamento de Conflitos**: Usa `ON CONFLICT DO NOTHING` para evitar duplicatas
5. **Respeita Auto-increment**: Campos auto-increment são ignorados (PostgreSQL gerencia automaticamente)

## Exemplo de Saída

```
🚀 Starting data migration
   Source: MySQL (ktb)
   Target: PostgreSQL (kb)
   Tables: 15

📊 Migrating table: promoters (→ core.promoters)
  📦 Found 10 rows
  ⏳ Progress: 10/10 rows processed
  ✅ Completed: 10 inserted, 0 errors

📊 Migrating table: championships (→ core.championships)
  📦 Found 25 rows
  ⏳ Progress: 25/25 rows processed
  ✅ Completed: 25 inserted, 0 errors

📊 Migrating table: users (→ accounts.users)
  📦 Found 150 rows
  ⏳ Progress: 150/150 rows processed
  ✅ Completed: 150 inserted, 0 errors

✨ Migration completed!
   Total rows inserted: 185
```

## Tratamento de Erros

- **Tabelas não existentes**: O script pula tabelas que não existem no PostgreSQL
- **Duplicatas**: Usa `ON CONFLICT DO NOTHING` para evitar erros
- **Tipos incompatíveis**: Tenta converter automaticamente, mostra erros para os primeiros 5 registros problemáticos
- **Dependências circulares**: Detecta e avisa sobre dependências circulares

## Dicas

1. **Faça backup**: Sempre faça backup do PostgreSQL antes de migrar
2. **Teste em desenvolvimento**: Teste primeiro com uma tabela pequena
3. **Verifique integridade**: Após migrar, verifique se os dados estão corretos
4. **Migre em etapas**: Para bases grandes, considere migrar por categorias:

   ```bash
   # Primeiro, migrar tabelas independentes
   npm run migrate:data -- promoters categories

   # Depois, tabelas que dependem delas
   npm run migrate:data -- championships products

   # Por último, tabelas com mais dependências
   npm run migrate:data -- users orders
   ```

## Limitações

- Não migra triggers, stored procedures ou views (apenas dados)
- Não migra índices customizados (use TypeORM migrations)
- Campos auto-increment: IDs podem ser diferentes (use `ON CONFLICT` se precisar manter IDs originais)
- Grandes volumes: Para milhões de registros, considere usar ferramentas como `pg_dump`/`pg_restore`

## Troubleshooting

### "Table does not exist in PostgreSQL"

- Certifique-se de que as tabelas foram criadas (via TypeORM ou manualmente)
- Verifique o schema correto

### "Foreign key constraint violation"

- O script ordena por dependências, mas se ainda houver erro, verifique se todas as tabelas referenciadas foram migradas
- Migre manualmente na ordem correta

### "Data type conversion error"

- Verifique os tipos de dados nas entidades TypeORM
- Alguns campos podem precisar de ajuste manual após a migração
