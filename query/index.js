const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
app.use(express.json());
app.use(cors());

let posts = [];
// Route for getting posts and comments ->GET('/posts')
// GET request

function handleEvent(type, data) {
  if (type == "PostCreated") {
    posts.push({
      id: data.id,
      title: data.title,
      comments: [],
    });
  }
  if (type == "CommentCreated") {
    let { postid } = data;
    let tempcontent;
    switch (data.status) {
      case "pending":
        tempcontent = "This comment is awaiting moderation";
        break;
      case "approved":
        tempcontent = data.content;
        break;
      case "rejected":
        tempcontent = "This comment is rejected";
        break;
    }
    posts.map((p) => {
      if (p.id == postid) {
        p.comments.push({
          id: data.id,
          content: tempcontent,
        });
      }
    });
  }
  if (type == "CommentUpdated") {
    let { postid, id } = data;
    let tempcontent;
    switch (data.status) {
      case "pending":
        tempcontent = "This comment is awaiting moderation";
        break;
      case "approved":
        tempcontent = data.content;
        break;
      case "rejected":
        tempcontent = "This comment is rejected";
        break;
    }
    posts.map((p) => {
      if (p.id == postid) {
        p.comments.map((c) => {
          if (c.id == id) {
            c.content = tempcontent;
          }
        });
      }
    });
  }
}
app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

//Route for receiving events from event bus -> POST('/events')
// POST
app.post("/events", (req, res) => {
  console.log(`event received of type ${req.body.type}`);
  if (req.body.type == "PostCreated") {
    posts.push({
      id: req.body.data.id,
      title: req.body.data.title,
      comments: [],
    });
  }
  if (req.body.type == "CommentCreated") {
    let { postid } = req.body.data;
    let tempcontent;
    switch (req.body.data.status) {
      case "pending":
        tempcontent = "This comment is awaiting moderation";
        break;
      case "approved":
        tempcontent = req.body.data.content;
        break;
      case "rejected":
        tempcontent = "This comment is rejected";
        break;
    }
    posts.map((p) => {
      if (p.id == postid) {
        p.comments.push({
          id: req.body.data.id,
          content: tempcontent,
        });
      }
    });
  }
  if (req.body.type == "CommentUpdated") {
    let { postid, id } = req.body.data;
    let tempcontent;
    switch (req.body.data.status) {
      case "pending":
        tempcontent = "This comment is awaiting moderation";
        break;
      case "approved":
        tempcontent = req.body.data.content;
        break;
      case "rejected":
        tempcontent = "This comment is rejected";
        break;
    }
    posts.map((p) => {
      if (p.id == postid) {
        p.comments.map((c) => {
          if (c.id == id) {
            c.content = tempcontent;
          }
        });
      }
    });
  }

  res.status(200).send({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("query service is listening on port 4002");
  let result = await axios.get("http://localhost:4005/events");
  // let result = await axios.get("http://eventbus-srv:4005/events");
  result.data.map((e) => {
    console.log(`Processing event with type ${e.type}`);
    handleEvent(e.type, e.data);
  });
});
