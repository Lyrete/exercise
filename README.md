# HedgehogMap

Might be online at [https://hedgehogmap.lyrete.dev](hedgehogmap.lyrete.dev)

## Sovelluksen osat

Sovellus koostuu kolmesta komponentista: serveri/api-rajapinta (Node.js / Fastify), tietokanta (PostgreSQL / PostGIS) sekä käyttöliittymä (React, MUI, OpenLayers).

## Sovelluksen käynnistäminen

Buildaa sovellus dockerilla (komentoriviltä ajettaessa)

```
docker compose build
```

Käynnistä sovellus:

```
docker compose up -d
```

Näiden jälkeen tulisi olla kullekin sovelluksen komponentille (server, client, db) oma docker-kontti ajossa. Käyttöliittymän voi nyt avata osoitteesta [http://localhost:8080](http://localhost:8080).

Yksittäisen kontin saa käynnistettyä uudelleen komennolla. Esimerkiksi serverin tapauksessa:

```
docker compose restart server
```

Sovelluksen ollessa käynnissä, voidaan tietokantamigraatiot ajaa komennolla:

```
docker compose exec server npm run db-migrate
```

Ajettavat migraatiot löytyvät kansiosta `/server/db_migrations`. Mikäli teet muutoksia tietokantaan, tee se luomalla uusi migraatiotiedosto johon sisällytät SQL-koodit, jonka jälkeen voit ajaa ylläolevan migraatioajon uudelleen.

Konttien logeja voi seurailla ajamalla komennon:

```
docker compose logs -f <kontin nimi>
```

## Uuden riippuvuuden lisääminen

Jos haluat lisätä uuden riippuvuuden, se pitää viedä myös kontin sisälle buildaamalla kontit uudestaan:

```sh
# Asennetaan uusi riippuvuus client/server/shared-kansiossa
npm i <uusi riippuvuus>

# Buildataan kontit uudestaan (muuttumattomat kontit tulevat cachesta)
docker compose build

# Ajetaan sovellus uudestaan ylös, samalla luoden nimeämättömät (node_modules) voluumit uudestaan
docker compose up -d -V
```

## TODO
- Define infra in tofu
- Update last remaining libraries
- Use faker to create fake hedgehogs for testing
- Add tests
- Add all hedgehogs to map and show info on hover (change to use features throughout app)
- Map controls
- Enable giving same hedgehog multiple locations, kind of a timeseries
- Enable deleting hedgehogs?
- Non full year ages?
- Move DB to AWS too, i just didnt wanna bother
