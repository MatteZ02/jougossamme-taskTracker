const express = require("express");
const eventEmitter = require("events");
const app = express();
const port = 3000;

const tasks = new Map();
const game = new eventEmitter();
let impostors = [];

tasks.set("yes1", ["1", "2"]);
tasks.set("yes2", ["3", "4"]);
tasks.set("yes3", ["5", "6"]);
tasks.set("yes4", ["7", "8", "9"]);

app.use(express.static("public"));
app.use(express.json());

app.listen(port, () => console.log("App is ready on port " + port));

app.post("/api", (req, res) => {
  if (!req.body.username) return res.sendStatus(400);
  if (impostors.length == 0) return res.sendStatus(400);
  if (!tasks.has(req.body.username.toLowerCase())) return res.sendStatus(400);
  if (tasks.get(req.body.username.toLowerCase()).includes(req.body.taskID))
    return res.sendStatus(400);
  const array = tasks.get(req.body.username.toLowerCase());
  array.push(req.body.taskID);
  tasks.set(req.body.username.toLowerCase(), array.sort());
  res.sendStatus(200);
});


app.post("/api/login", (req, res) => {
  if (!req.body.username) return res.sendStatus(400);
  if (!tasks.has(req.body.username.toLowerCase())) {
    tasks.set(req.body.username.toLowerCase(), []);
    res.sendStatus(200);
  } else
    res.status(200).json({ tasks: tasks.get(req.body.username.toLowerCase()) });
});

app.post("/api/role", (req, res) => {
  if (impostors.length > 0) {
    if (impostors.includes(req.body.username.toLowerCase()))
      res.json({ role: "impostor", others: impostors }).status(200);
    else res.json({ role: "crewmate" }).status(200);
  } else
    game.on("start", () => {
      if (impostors.includes(req.body.username.toLowerCase()))
        res.json({ role: "impostor", others: impostors }).status(200);
      else res.json({ role: "crewmate" }).status(200);
    });
});

app.get("/admin/api", (req, res) =>
  res.json(Object.fromEntries(tasks)).status(200)
);

app.post("/admin/api/disconnect", (req, res) => {
  tasks.delete(req.body.playername);
  res.sendStatus(200);
});

app.get("/admin/api/start", (req, res) => {
  while (impostors.length < parseInt(process.argv[2])) {
    const rand = Math.floor(Math.random() * Array.from(tasks.keys()).length);
    const imp = Array.from(tasks.keys())[rand];
    if (!impostors.includes(imp)) impostors.push(imp);
  }
  res.json({ impostors }).status(200);
  game.emit("start");
});

app.get("/admin/api/stop", (req, res) => {
  game.removeAllListeners("start");
  tasks.clear();
  impostors = [];
  res.sendStatus(200);
});
