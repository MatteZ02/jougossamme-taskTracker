let loggedin = false;

function taskcomplete(taskID) {
  if (!$("#playername").val()) return alert("Et syöttänyt käyttäjänimeä!");
  if (!loggedin) return alert("Muista painaa OK käyttäjänimen vieressä!");
  $(`#${taskID}`).attr("class", "pending").text("◌").attr("onclick", "");
  const body = JSON.stringify({ username: $("#playername").val(), taskID });
  fetch(window.location.href + "api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then((res) => {
    if (res.status == 200)
      $(`#${taskID}`).attr("class", "active").text("✓").attr("onclick", "");
    else
      $(`#${taskID}`)
        .attr("class", "inactive")
        .text("X")
        .attr("onclick", `taskcomplete('${taskID}')`);
  });
}

function login() {
  const body = JSON.stringify({
    username: $("#playername").val(),
  });
  $(`#login`).attr("class", "pending").text("◌").attr("onclick", "");
  fetch(window.location.href + "api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (res) => {
    if (res.status == 200) {
      try {
        const json = await res.json();
        for (const task of json.tasks) {
          $(`#${task}`).attr("class", "active").text("✓").attr("onclick", "");
        }
      } catch (e) {}
      loggedin = true;
      fetch(window.location.href + "api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: $("#playername").val() }),
      }).then(async (res) => {
        const json = await res.json();
        if (json.role == "crewmate") {
          $("#role").text("Olet crewmate!").css("color", "blue");
        } else if (json.role == "impostor") {
          $("#role")
            .html("Olet impostor!<br>Impostorit: " + json.others.join(", "))
            .css("color", "red");
        }
      });
      $(`#login`)
        .attr("class", "active")
        .text("Kirjauduttu")
        .attr("onclick", "");
    } else
      $(`#login`)
        .attr("class", "inactive")
        .text("OK")
        .attr("onclick", `login()`);
  });
}
