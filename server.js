require("dotenv").config();
const express = require("express");
const { addEvents, findEvents } = require("./src/events");

const app = express();
app.use(express.json());

const PORT = 10001;

app.post("/events", addEvents);

app.get("/events/find", findEvents);

app.listen(PORT, () => {
    console.log(`The app is running on http://localhost:${PORT}`);
})