const express = require("express");
const shortid = require("shortid");

const server = express();
server.use(express.json());

let users = [
  {
    name: "Sevdaliza",
    bio: "Music artist",
    id: shortid.generate(),
  },
  {
    name: "Ava Duvernay",
    bio: "Film director",
    id: shortid.generate(),
  },
  {
    name: "Sean Kirkby",
    bio: "Lambda instructor",
    id: shortid.generate(),
  },
];

// POST - new user //

server.post("/api/users", (req, res) => {
  const newUser = req.body;
  newUser.id = shortid.generate();

  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    if (newUser) {
      users.push(newUser);
      res.status(201).json({ message: "Successfully created!", newUser });
    } else {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  }
});

// GET - array of all users //

server.get("/api/users", (req, res) => {
  if (!users) {
    res
      .status(500)
      .json({ errorMessage: "The user's information could not be retrieved." });
  } else {
    res.status(200).json(users);
  }
});

// GET - specific user //

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userMatch = users.find((user) => user.id === id);

  if (!userMatch) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  } else {
    if (userMatch.id !== id) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      res.status(200).json(userMatch);
    }
  }
});

// DELETE - specific user //

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const deleteUser = users.find((user) => user.id === id);

  if (!deleteUser) {
    res
      .status(404)
      .json({ message: " The user with the specified ID does not exist." });
  } else {
    if (deleteUser.id === id) {
      users = users.filter((user) => user.id !== id);
      res.status(200).json({ message: "Successfully deleted!", deleteUser });
    } else {
      res.status(500).json({ errorMessage: "The user could not be removed." });
    }
  }
});

// PUT - specific user //

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  let userIndex = users.findIndex((user) => user.id === id);

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    if (!userIndex) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      if (userIndex !== -1) {
        changes.id === id;
        users[userIndex] = changes;
        res.status(200).json(users[userIndex]);
      } else {
        res.status(500).json({
          errorMessage: "The user information could not be modified.",
        });
      }
    }
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
