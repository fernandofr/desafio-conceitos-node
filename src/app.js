const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repositorie ID.'})
  }

  return next();
}

function validateRepositorieExits(request, response, next) {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id = id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.'});
  }

  return next();
}

app.use('/repositories/:id', validateRepositorieId);
app.use('/repositories/:id', validateRepositorieExits);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  const data = { ...repository, title, url, techs };
  repositories.push(data);

  return response.json(data);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  }  
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);

  const data = { ...repository, likes: repository.likes += 1 };
  repositories.push(data);

  return response.json(data);
});

module.exports = app;
