# WebSocket / Socket.IO - Realtime

O sistema utiliza **Socket.IO** para comunicação em tempo real entre o frontend e o backend.

## Configuração

### Backend (NestJS)

O WebSocket Gateway está localizado em `src/infra/realtime/realtime.gateway.ts` e está configurado para:

- Aceitar conexões do frontend configurado em `FRONTEND_URL` (padrão: `http://localhost:5173`)
- Autenticar conexões via JWT no handshake (`socket.auth.token`)
- Permitir conexões anônimas para eventos públicos (ping/pong)

### Frontend (React)

O frontend já está configurado para usar Socket.IO:

- Cliente em `src/realtime/socket.ts`
- Provider em `src/context/realtime-provider.tsx`
- Proxy do Vite configurado para `/socket.io` → `http://localhost:3000`

## Eventos Disponíveis

### Eventos Públicos (não requerem autenticação)

#### `realtime:ping`

**Cliente → Servidor:**

```typescript
socket.emit('realtime:ping', { hello: 'world' })
```

**Servidor → Cliente:**

```typescript
{
  event: 'realtime:pong',
  data: { message: 'pong', received: { hello: 'world' } }
}
```

### Eventos Autenticados (requerem JWT)

#### `realtime:secure-echo`

**Cliente → Servidor:**

```typescript
socket.emit('realtime:secure-echo', { text: 'hi' })
```

**Servidor → Cliente:**

```typescript
{
  event: 'realtime:secure-echo-response',
  data: {
    message: 'echo',
    received: { text: 'hi' },
    user: { id: 1, email: 'user@example.com', name: 'User Name' }
  }
}
```

#### `realtime:message`

**Cliente → Servidor:**

```typescript
socket.emit('realtime:message', { content: 'Hello everyone!' })
```

**Servidor → Todos os clientes:**

```typescript
socket.on('realtime:message', (data) => {
  // data = {
  //   from: 'user@example.com' | 'anonymous',
  //   message: { content: 'Hello everyone!' },
  //   timestamp: '2024-01-01T00:00:00.000Z'
  // }
})
```

**Confirmação → Cliente que enviou:**

```typescript
{
  event: 'realtime:message-sent',
  data: { success: true }
}
```

### Eventos do Sistema

#### `realtime:users`

**Servidor → Todos os clientes:**

Broadcast automático com a contagem de usuários conectados.

```typescript
socket.on('realtime:users', (data) => {
  // data = { count: 5 }
})
```

#### `connect` / `disconnect`

Eventos padrão do Socket.IO:

```typescript
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})
```

## Autenticação

O token JWT é enviado automaticamente no handshake da conexão:

```typescript
socket = io(url, {
  auth: {
    token: authStore.accessToken
  }
})
```

O servidor valida o token e anexa os dados do usuário ao socket:

```typescript
socket.user = {
  id: 1,
  email: 'user@example.com',
  name: 'User Name'
}
```

## Uso no Frontend

### Provider

O `RealtimeProvider` já está configurado e fornece:

```typescript
const { connected, usersCount } = useRealtime()
```

### Acesso Direto ao Socket

```typescript
import { getSocket } from '@/realtime/socket'

const socket = getSocket()

// Ouvir eventos
socket.on('realtime:message', (data) => {
  console.log('Message received:', data)
})

// Emitir eventos
socket.emit('realtime:ping', { hello: 'world' })
```

## Uso no Backend

### Emitir Eventos

```typescript
// No Gateway ou em outro serviço injetado

constructor(private realtimeGateway: RealtimeGateway) {}

// Broadcast para todos
this.realtimeGateway.broadcast('custom:event', { data: 'value' })

// Broadcast apenas para usuários autenticados
this.realtimeGateway.broadcastToAuthenticated('custom:event', { data: 'value' })
```

### Exemplo: Emitir ao criar um campeonato

```typescript
@Injectable()
export class ChampionshipsService {
  constructor(
    @InjectRepository(Championship)
    private championshipRepository: Repository<Championship>,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async create(createChampionshipDto: CreateChampionshipDto) {
    const championship = await this.championshipRepository.save(
      createChampionshipDto,
    )

    // Notificar todos os clientes conectados
    this.realtimeGateway.broadcast('championship:created', {
      championship,
      timestamp: new Date().toISOString(),
    })

    return championship
  }
}
```

## Estrutura de Arquivos

```
src/infra/realtime/
├── realtime.gateway.ts    # Gateway WebSocket principal
└── realtime.module.ts     # Módulo do Realtime
```

## Configuração do Proxy (Desenvolvimento)

O Vite já está configurado para fazer proxy do WebSocket:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/socket.io': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      ws: true,
    },
  },
}
```

## Produção

Em produção, certifique-se de:

1. Configurar o proxy reverso (Nginx/Apache) para WebSocket
2. Definir `FRONTEND_URL` nas variáveis de ambiente
3. Configurar SSL/TLS para WebSocket seguro (WSS)

### Exemplo Nginx

```nginx
location /socket.io {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

