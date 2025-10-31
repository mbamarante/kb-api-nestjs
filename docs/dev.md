# Coding...

```
# Lint and autofix with eslint
$ npm run lint

# Format with prettier
$ npm run format
```

# CLI

```
# Gerar features
nest g resource features/users --no-flat
nest g resource features/products --no-flat
nest g resource features/orders --no-flat

# Gerar componentes shared
nest g guard shared/guards/auth
nest g guard shared/guards/roles
nest g interceptor shared/interceptors/logging
nest g decorator shared/decorators/current-user

# Gerar infraestrutura
nest g module infra/database
nest g service infra/logging/logger
nest g module infra/cache
```
