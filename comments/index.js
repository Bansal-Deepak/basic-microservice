const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
app.use(express.json());
app.use(cors());

let comments = [];

// create comment for a specific post
// post request
app.post("/posts/:id/comments", async (req, res) => {
  let id = randomBytes(4).toString("hex");
  let { content } = req.body;
  let { id: postid } = req.params;
  let newcomment = { postid, content, id, status: "pending" };
  comments.push(newcomment);
  await axios.post("http://localhost:4005/events", {
    // await axios.post("http://eventbus-srv:4005/events", {
    type: "CommentCreated",
    data: { postid, content, id, status: "pending" },
  });
  res.status(201).send(newcomment);
});

// get all comments for a specific post
// get request

app.get("/posts/:id/comments", (req, res) => {
  let { id } = req.params;

  let comm = comments.filter((c) => {
    return c.postid == id;
  });
  res.status(200).send(comm);
});

// Route to receive event
// POST request

app.post("/events", async (req, res) => {
  let { type, data } = req.body;
  console.log(`Event received of type ${type}`);
  if (type == "CommentModerated") {
    comments.map((c) => {
      if (c.id == data.id) {
        c.status = data.status;
      }
    });
    let event = req.body;
    event.type = "CommentUpdated";
    await axios.post("http://localhost:4005/events", event);
    // await axios.post("http://eventbus-srv:4005/events", event);
  }

  res.status(200).send({ status: "OK" });
});

app.listen(4001, () => {
  console.log("comments service is listening on port 4001");
});
