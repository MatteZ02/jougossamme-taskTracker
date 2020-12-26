let impostors = [];

setInterval(() => {
  fetch(window.location.href + "api").then(async (res) => {
    const json = await res.json();
    let tableCode = "";
    Object.entries(json).forEach((player) => {
      tableCode += `<tr><td ${
        impostors.includes(player[0]) ? 'class="impostor"' : ""
      }>${player[0]}:</td><td>${
        player[1].length
      }</td><td><button class="inactive" onclick="disconnect('${
        player[0]
      }')" id="disconnect_${player[0]}">Disconnect</button></td></tr>`;
    });
    $("#tasksTable").html(tableCode);
    const crewmates = Object.entries(json).filter(
      (x) => !impostors.includes(x[0])
    );
    const doneTasks = crewmates
      .map((x) => x[1].length)
      .reduce((a, b) => a + b, 0);

    $("#doneTasks").text(`${doneTasks}/${crewmates.length * 9}`);
  });
}, 4000);

function start() {
  $("#startButton")
    .attr("class", "pending")
    .attr("onclick", "")
    .text("Starting...");
  fetch(window.location.href + "api/start").then(async (res) => {
    if (res.status == 200)
      $("#startButton")
        .attr("class", "inactive")
        .text("Stop")
        .attr("onclick", "stop()");
    else
      return $("#startButton")
        .attr("class", "active")
        .attr("onclick", "start()");
    const json = await res.json();
    impostors = json.impostors;
  });
}

function stop() {
  $("#startButton")
    .attr("class", "pending")
    .attr("onclick", "")
    .text("Stopping...");
  fetch(window.location.href + "api/stop").then((res) => {
    if (res.status == 200)
      $("#startButton")
        .attr("class", "active")
        .attr("onclick", "start()")
        .text("Start");
    else
      $("#startButton")
        .attr("class", "inactive")
        .text("Stop")
        .attr("onclick", "stop()");
  });
}

function disconnect(playername) {
  fetch(window.location.href + "api/disconnect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playername }),
  });
  $(`#disconnect_${playername}`).attr("class", "pending");
}
