let impostors = []

setInterval(() => {
    fetch(window.location.href + "api").then(async res => {
        const json = await res.json()
        let tableCode = ""
        Object.entries(json).forEach(player => {
            tableCode += `<tr><td ${impostors.includes(player[0]) ? 'class="impostor"' : ""}>${player[0]}:</td><td>${player[1].length}</td><td><button class="inactive", id="disconnect_${player[0]}">Disconnect</button></td></tr>`
        });
        $("#tasksTable").html(tableCode)
        //$("#doneTasks").text()
    })
}, 4000);

function start() {
    $("#startButton").attr("class", "pending").attr("onclick", "").text("Starting...")
    fetch(window.location.href + "api/start").then(async res => {
        if (res.status == 200) $("#startButton").attr("class", "inactive").text("Stop").attr("onclick", "stop()")
        else return $("#startButton").attr("class", "active").attr("onclick", "start()")
        const json = await res.json()
        impostors = json.impostors;
    })
}

function stop() {
    $("#startButton").attr("class", "pending").attr("onclick", "").text("Stopping...")
    fetch(window.location.href + "api/stop").then(res => {
        if (res.status == 200) $("#startButton").attr("class", "active").attr("onclick", "start()").text("Start")
        else $("#startButton").attr("class", "inactive").text("Stop").attr("onclick", "stop()")
    })
}