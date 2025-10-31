# Geração Automática de Resources

Este projeto inclui uma ferramenta para gerar automaticamente entidades, DTOs, controllers, services e modules do NestJS a partir das tabelas do seu banco de dados MySQL **legado**.

## ⚠️ Importante

**O script lê a estrutura do MySQL (sistema antigo), mas gera código TypeORM compatível com PostgreSQL** que será usado no NestJS.

Os tipos MySQL são automaticamente convertidos para tipos PostgreSQL/TypeORM:

- `TINYINT(1)` → `boolean` (PostgreSQL)
- `TEXT` → `text` (PostgreSQL)
- `JSON` → `jsonb` (PostgreSQL - melhor performance)
- `FLOAT` → `real` (PostgreSQL)
- `DOUBLE` → `double precision` (PostgreSQL)
- `DATETIME`/`TIMESTAMP` → `timestamp` (PostgreSQL)
- E outros ajustes automáticos

## Pré-requisitos

1. Configure as variáveis de ambiente para conectar ao **MySQL legado**:

   Você pode usar variáveis específicas do MySQL (recomendado):

   ```
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=sua_senha
   MYSQL_DATABASE=nome_do_banco_mysql
   ```

   Ou usar as variáveis genéricas (se não houver conflito):

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=sua_senha
   DB_DATABASE=nome_do_banco
   ```

2. Instale as dependências necessárias (se ainda não tiver):
   ```bash
   pnpm add class-validator class-transformer
   ```

## Uso

### Listar Tabelas Disponíveis

Antes de gerar resources, você pode listar todas as tabelas do seu banco:

```bash
npm run list:tables
```

Isso mostrará todas as tabelas disponíveis no banco de dados configurado.

### Geração Básica

Para gerar resources para uma ou mais tabelas:

```bash
npm run generate:resource -- nome_da_tabela
```

Exemplo:

```bash
npm run generate:resource -- users products orders
```

### Com Categoria

Para organizar os resources em uma categoria (como `core`, `accounts`, etc.):

```bash
npm run generate:resource -- users --category=core
```

Isso criará os arquivos em `src/features/core/users/` ao invés de `src/features/users/`.

### Com Caminho Customizado

Para especificar um caminho completo diferente:

```bash
npm run generate:resource -- users --feature-path=src/features/accounts
```

Isso criará os arquivos em `src/features/accounts/users/`.

### Exemplo Combinado

```bash
npm run generate:resource -- championships promoters --category=core
```

## O que é Gerado

Para cada tabela, o script gera:

1. **Entity** (`entities/[nome].entity.ts`)
   - Entidade TypeORM **compatível com PostgreSQL**
   - Baseada na estrutura da tabela MySQL, mas com tipos ajustados para PostgreSQL
   - Mapeia colunas para propriedades TypeScript
   - Detecta tipos, chaves primárias, auto-increment (convertido para SERIAL), valores padrão, etc.
   - Tipos MySQL são convertidos automaticamente para equivalentes PostgreSQL

2. **DTOs** (`dto/create-[nome].dto.ts` e `dto/update-[nome].dto.ts`)
   - `CreateDto`: Campos obrigatórios para criação (sem auto-increment)
   - `UpdateDto`: Extends `PartialType(CreateDto)` para atualizações parciais
   - Validações com `class-validator`

3. **Service** (`[nome].service.ts`)
   - Serviço com métodos CRUD completos
   - Usa repositório TypeORM
   - Métodos: `create`, `findAll`, `findOne`, `update`, `remove`

4. **Controller** (`[nome].controller.ts`)
   - Controller RESTful completo
   - Rotas: `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

5. **Module** (`[nome].module.ts`)
   - Module do NestJS
   - Importa `TypeOrmModule.forFeature([Entity])`
   - Registra Controller e Service

## Após a Geração

1. **Revisar os arquivos gerados**
   - Verificar se os tipos PostgreSQL estão corretos (especialmente booleanos e JSON)
   - Adicionar validações customizadas nos DTOs
   - Configurar relacionamentos entre entidades (@OneToMany, @ManyToOne, etc.)
   - Ajustar tipos específicos se necessário (ex: jsonb vs json)

2. **Atualizar a configuração do banco para PostgreSQL**

   Edite `src/config/database.config.ts`:

   ```typescript
   export default registerAs('database', () => ({
     type: 'postgres' as const, // Mudar de 'mariadb' para 'postgres'
     host: process.env.PG_HOST || 'localhost',
     port: parseInt(process.env.PG_PORT ?? '5432', 10),
     username: process.env.PG_USERNAME,
     password: process.env.PG_PASSWORD,
     database: process.env.PG_DATABASE,
     // ... resto da config
   }));
   ```

3. **Registrar o Module no AppModule**

   Edite `src/app.module.ts`:

   ```typescript
   import { UsersModule } from './features/accounts/users/users.module';

   @Module({
     imports: [
       // ... outros imports
       UsersModule,
     ],
   })
   ```

4. **Instalar dependências** (se necessário):
   ```bash
   pnpm add class-validator class-transformer
   ```

## Convenções de Nomenclatura

- **Tabelas**: Nomes de tabela em snake_case ou plural
- **Entidades**: PascalCase singular (ex: `users` → `User`)
- **Módulos/Services/Controllers**: PascalCase singular + sufixo (ex: `UserService`)
- **DTOs**: PascalCase + tipo (ex: `CreateUserDto`)
- **Rotas**: kebab-case plural (ex: `/users`)

## Limitações e Ajustes Manuais

O gerador faz suposições razoáveis, mas você pode precisar ajustar:

- **Relacionamentos**: Adicione `@OneToMany`, `@ManyToOne`, `@ManyToMany`, etc.
- **Validações complexas**: Adicione validadores customizados nos DTOs
- **Lógica de negócio**: Adicione métodos customizados nos Services
- **Middleware/Guards**: Adicione guards nos Controllers conforme necessário
- **Soft Delete**: Se usar soft delete, ajuste o método `remove` no Service

## Exemplo Completo

```bash
# Gerar resources para várias tabelas em categorias diferentes
npm run generate:resource -- users roles --category=accounts
npm run generate:resource -- products categories --category=core
npm run generate:resource -- orders order-items --category=sales

# Depois, registre todos no app.module.ts
```
