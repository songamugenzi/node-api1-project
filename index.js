const express = require("express");
const shortid = require("shortid");

const server = express();
server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: "Nick M",
    bio: "Lambda School student",
  },
  {
    id: shortid.generate(),
    name: "Jerry M",
    bio: "Tom's frenemy",
  },
  {
    id: shortid.generate(),
    name: "Luis H",
    bio: "Lambda School instructor",
  },
];

// POST //

server.post("/api/users", (req, res) => {
  const newUser = req.body;
  newUser.id = shortid.generate();

  if (!newUser.name) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (!newUser.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    if (newUser) {
      users.push(newUser);
      res.status(201).json(newUser);
    } else {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  }
});

// GET //

server.get("/api/users", (req, res) => {
  if (!users) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  } else {
    res.status(200).json(users);
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const singleUser = users.find((user) => user.id === id);
  // if user is NOT found in the database, status: 500
  if (!singleUser) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  } else {
    // if user found DOESN'T match specific id, status: 404
    if (singleUser.id !== id) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      // if user found matches specific id, status: 200
      res.status(200).json(singleUser);
    }
  }
});

// DELETE //

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = users.find((user) => user.id === id);

  if (!deleted) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    if (deleted.id === id) {
      users = users.filter((user) => user.id !== id);
      res.status(200).json(deleted);
    } else {
      res.status(500).json({ errorMessage: "The user could not be removed" });
    }
  }
});

// PUT //

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  // if missing name/bio in changes(req.body)
  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    // find user matching specific id
    let updateUser = users.find((user) => user.id === id);
    if (!updateUser) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      // add changes to updateUser
      Object.assign(updateUser, changes);
      if (updateUser.name === changes.name && updateUser.bio === changes.bio) {
        res.status(200).json(updateUser);
      } else {
        res.status(500).json({
          errorMessage: "The user information could not be modified.",
        });
      }
    }
  }
});

const PORT = 8000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
