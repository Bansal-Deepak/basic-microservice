const express = require("express");
const app = express();
const axios = require("axios");
app.use(express.json());

// Route '/events' from event-bus
// POST

app.post("/events", async (req, res) => {
  console.log(`event received of type ${req.body.type}`);
  let { content } = req.body.data;

  if (req.body.type == "CommentCreated") {
    //     let event = {
    //       type: "CommentModerated",
    //       data: {
    //         id,
    //       },
    //     };
    //     if (content.includes("orange")) {
    //       event.data.status = "rejected";
    //       axios.post("http://localhost:4005/events", event);
    //     } else {
    //       event.data.status = "approved";
    //       axios.post("http://localhost:4005/events", event);
    //     }

    let event = req.body;
    setTimeout(() => {
      console.log("To view the pending status");
    }, 10000);

    event.data.status = content.includes("orange") ? "rejected" : "approved";
    event.type = "CommentModerated";
    await axios.post("http://localhost:4005/events", req.body);
    // await axios.post("http://eventbus-srv:4005/events", req.body);
  }

  res.status(200).send({ status: "OK" });
});

app.listen(4003, () => {
  console.log("app is listening on port 4003");
});
