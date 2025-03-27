## Installation

```bash
$ npm install
```

O arquivo .env pode ser criado igual ao .env.example

## Running the app

Com o docker rodano, basta rodar os seguintes comandos.

```bash
# docker
$ docker compose up -d

# migrations
$ npm run migration:run

# run application
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```

## Api Documentation

Ex: localhost:3000/api

## Observações

Durante os testes, algumas vezes ocorreram de o numero de visitantes não alterar, caso isso aconteça, certificar de que o navegador não "casheou" a chamada da api. Caso tenha feito, ele redireciona sem passar por ela.

## Pontos interessantes de melhoria:

1: Paginação nos links do usuário.

2: Logout

3: Refresh token
