const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
app.use(express.json());
app.use(cors());

let posts = ["first post"];

//Route to create posts
//Post request

app.post("/posts", async (req, res) => {
  let id = randomBytes(4).toString("hex");
  let { title } = req.body;
  let newpost = { id, title };
  posts.push(newpost);
  await axios.post("http://localhost:4005/events", {
    // await axios.post("http://eventbus-srv:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });
  res.status(201).send(newpost);
});

// Route to get all posts
// Get request

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

// Route to receive event
// POST request

app.post("/events", (req, res) => {
  console.log(`Event received of type ${req.body.type}`);
  res.status(200).send({ status: "OK" });
});

app.listen(4000, () => {
  console.log("posts service is listening on port 4000");
});

// some change
// some more change
