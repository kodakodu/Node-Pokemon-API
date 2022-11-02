const express = require('express');
const morgan = require('morgan');
const { success, notsuccess, getUniqueId } = require('./helper');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
let pokemons = require('./mock-pokemon.js');
const app = express();

const port = 3000;

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Express');
});
app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);

  if (pokemon == null) {
    const message = 'Aucun pokémon a été trouvé !';
    res.json(notsuccess(message));
  } else {
    const message = 'Un pokémon a bien été trouvé';
    res.json(success(message, pokemon));
  }
});

app.get('/api/pokemons', (req, res) => {
  const message = 'La liste des pokémons a bien été recupérée';
  res.json(success(message, pokemons));
});

app.post('/api/pokemons', (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokémon ${pokemonCreated.name} a bie été ajouté au pokédex`;
  res.sendStatus(200);
  res.json(message, pokemonCreated);
});

app.put('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });
  const message = `Le pokémon ${pokemonUpdated.name} à bien été modifié`;
  res.json(success(message, pokemonUpdated));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

