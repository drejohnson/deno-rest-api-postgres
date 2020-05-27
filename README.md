# Deno REST API with PostgreSQL

A basic REST API boilerplate built with Deno and PostgreSQL.

### Features

- [x] [Oak](https://deno.land/x/oak) framework.
- [x] [deno-postgres](https://deno.land/x/postgres)
- [x] basic user auth and CRUD operations.

### Getting Started

```bash
git clone https://github.com/drejohnson/deno-rest-api-postgres.git

cd deno-rest-api-postgres
```

Add credentials to .env

```bash
cp .env.example .env
```

To run server

```bash
deno run --allow-net --allow-write --allow-read --allow-plugin --allow-env --unstable server.ts
```
