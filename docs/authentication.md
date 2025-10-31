# Autenticação da API

O sistema de autenticação utiliza **JWT (JSON Web Tokens)** com **Passport.js** para proteger os endpoints da API.

## Configuração

### Variáveis de Ambiente

No arquivo `.development.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### CORS

O CORS está habilitado para permitir requisições do frontend. Por padrão, aceita requisições de `http://localhost:5173`. Configure `FRONTEND_URL` no `.development.env` se necessário.

## Endpoints

### POST `/auth/login`

Autentica um usuário e retorna um token JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros:**
- `401 Unauthorized`: Credenciais inválidas

### GET `/auth/me`

Retorna informações do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "username": "User Name",
  "full_name": "User Name",
  "disabled": false
}
```

**Erros:**
- `401 Unauthorized`: Token inválido ou expirado

## Como Usar em Outros Controllers

### Proteger um Endpoint

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { User } from '@features/accounts/users/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard) // Protege todas as rotas do controller
export class UsersController {
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

### Proteger uma Rota Específica

```typescript
@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard) // Apenas esta rota é protegida
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

## Compatibilidade com Frontend

O sistema foi implementado para ser compatível com o frontend existente (`kb-web`):

- **Login endpoint**: `POST /auth/login` ✅
- **Me endpoint**: `GET /auth/me` ✅
- **Token format**: `{ access_token: string }` ✅
- **Authorization header**: `Bearer <token>` ✅
- **Response format**: Compatível com o que o frontend espera ✅

## Segurança das Senhas

As senhas devem estar armazenadas usando **bcrypt** no banco de dados. Se você migrou dados do MySQL antigo, as senhas podem estar em texto plano. Nesse caso, você precisará:

1. Criar um script para fazer hash das senhas existentes
2. Ou atualizar manualmente as senhas através da aplicação

## Estrutura de Arquivos

```
src/features/auth/
├── auth.module.ts          # Módulo de autenticação
├── auth.service.ts         # Lógica de autenticação
├── auth.controller.ts     # Endpoints de autenticação
├── dto/
│   ├── login.dto.ts        # DTO para login
│   ├── auth-response.dto.ts # DTO de resposta de login
│   └── me-response.dto.ts  # DTO de resposta do /me
└── strategies/
    ├── jwt.strategy.ts     # Estratégia JWT do Passport
    └── local.strategy.ts  # Estratégia Local do Passport

src/shared/
├── guards/
│   ├── jwt-auth.guard.ts   # Guard para proteger rotas (reutilizável)
│   └── local-auth.guard.ts # Guard para login (não usado diretamente)
└── decorators/
    └── current-user.decorator.ts # Decorator para obter usuário atual (reutilizável)
```

## Próximos Passos

- [ ] Implementar refresh tokens
- [ ] Adicionar roles/permissões (se necessário)
- [ ] Implementar rate limiting no endpoint de login
- [ ] Adicionar logs de tentativas de login falhadas

