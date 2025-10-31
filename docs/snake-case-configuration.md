# Configuração Snake_Case no PostgreSQL

O projeto está configurado para usar **snake_case** no PostgreSQL, igual ao MySQL, através da `SnakeNamingStrategy` do TypeORM.

## O que foi configurado:

### 1. Naming Strategy no TypeORM

No arquivo `src/config/database.config.ts`:

```typescript
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('database', () => ({
  // ...
  namingStrategy: new SnakeNamingStrategy(),
}));
```

### 2. Como funciona:

A `SnakeNamingStrategy` converte **automaticamente** camelCase para snake_case:

- `emailVerifiedAt` → `email_verified_at` ✅
- `createdAt` → `created_at` ✅
- `updatedAt` → `updated_at` ✅
- `isAdmin` → `is_admin` ✅
- `promoterId` → `promoter_id` ✅
- `championshipId` → `championship_id` ✅

## Benefícios:

1. **Compatibilidade com MySQL**: Mantém os mesmos nomes de colunas
2. **Migração simplificada**: O script de migração não precisa mapear nomes
3. **Código TypeScript limpo**: Usa camelCase no código, snake_case no banco
4. **Menos configuração**: Não precisa especificar `name` em cada `@Column`

## Exemplo:

### Antes (sem naming strategy):
```typescript
@Column({ name: 'email_verified_at' })
emailVerifiedAt: Date | null;

@Column({ name: 'created_at' })
createdAt: Date;
```

### Depois (com SnakeNamingStrategy):
```typescript
@Column({ type: 'timestamp', nullable: true })
emailVerifiedAt: Date | null;

@CreateDateColumn({ type: 'timestamp' })
createdAt: Date;
```

## Nota importante:

Se você **precisar** usar um nome de coluna diferente da conversão automática (ex: `last_championship_id` ao invés de `championship_id`), ainda pode usar `name` explícito:

```typescript
@Column({ name: 'last_championship_id' })
lastChampionshipId: number;
```

Mas na maioria dos casos, a strategy cuida automaticamente!

## Script de Geração:

O script `generate-resource.ts` foi atualizado para **não gerar** `name` explícito quando não necessário, deixando a strategy fazer a conversão.

## Migração de Dados:

Com snake_case configurado, o script de migração (`migrate-data.ts`) agora encontra as colunas automaticamente, já que os nomes são idênticos entre MySQL e PostgreSQL.

