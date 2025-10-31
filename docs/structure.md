src/
├── features/ # Funcionalidades de negócio
│ ├── users/
│ │ ├── users.module.ts
│ │ ├── users.controller.ts
│ │ ├── users.service.ts
│ │ ├── users.repository.ts
│ │ ├── dto/
│ │ │ ├── create-user.dto.ts
│ │ │ └── update-user.dto.ts
│ │ ├── entities/
│ │ │ └── user.entity.ts
│ │ └── **tests**/
│ ├── products/
│ ├── orders/
│ └── auth/
├── shared/ # Código reutilizável
│ ├── guards/
│ │ ├── auth.guard.ts
│ │ └── roles.guard.ts
│ ├── interceptors/
│ │ ├── logging.interceptor.ts
│ │ └── transform.interceptor.ts
│ ├── decorators/
│ │ ├── current-user.decorator.ts
│ │ └── roles.decorator.ts
│ ├── pipes/
│ │ └── validation.pipe.ts
│ ├── filters/
│ │ └── http-exception.filter.ts
│ └── dto/
│ ├── pagination.dto.ts
│ └── response.dto.ts
├── infrastructure/ # Detalhes técnicos
│ ├── database/
│ │ ├── database.module.ts
│ │ └── database.providers.ts
│ ├── cache/
│ │ ├── cache.module.ts
│ │ └── cache.service.ts
│ ├── queue/
│ │ └── queue.module.ts
│ ├── logging/
│ │ ├── logger.module.ts
│ │ └── logger.service.ts
│ └── messaging/
│ └── messaging.module.ts
├── config/ # Configurações
│ ├── database.config.ts
│ ├── app.config.ts
│ ├── jwt.config.ts
│ └── env.validation.ts
├── app.module.ts
└── main.ts

```
features/           | Lógica de negócio
infrastructure/     | Infraestrutura essencial
shared/             | Código reutilizável
config/             | Configurações
```
