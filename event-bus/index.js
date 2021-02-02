const express = require("express");
const app = express();
const axios = require("axios");
app.use(express.json());

let events = [];

// '/events'
// POST request

app.post("/events", async (req, res) => {
  let event = req.body;
  events.push(event);
  await axios.post("http://localhost:4000/events", event);
  await axios.post("http://localhost:4001/events", event);
  await axios.post("http://localhost:4002/events", event);
  await axios.post("http://localhost:4003/events", event);
  // await axios.post("http://posts-clusterip-srv:4000/events", event);
  // await axios.post("http://comments-srv:4001/events", event);
  // await axios.post("http://query-srv:4002/events", event);
  // await axios.post("http://moderation-srv:4003/events", event);
  res.status(200).send({ status: "OK" });
});

// Get all events ('/events)
// GET request

app.get("/events", (req, res) => {
  res.status(200).send(events);
});
app.listen(4005, () => {
  console.log("event bus is listening on port 4005");
});
