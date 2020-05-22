$(document).ready(function() {
    var breakLength = 0,
        staticWorkLength = 0,
        workLength = 0,
        pausedWorkLength = 0,
        objInterval = 0,
        titleTimer = 0,
        tester = 30,
        pauseCount = 0,
        breakCount = 0;

    $("#tooltip").slider({
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 60,
        value: 30,
    });

    //CHIME AT THE END OF A COUNTDOWN
    function chime() {
        document.getElementById('chime').play();
    }

    //CLOCK MADE HUMAN READY
    function millisToMinutesAndSeconds(secs) {
        var minutes = 0;
        var seconds = 0;
        minutes = Math.floor(secs / 60);
        seconds = (secs % 60).toFixed(0);
        $("#tooltip").slider({
            step: 1,
            value: minutes
        });
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    //RUNS showcountdown EVERY SECOND
    function startcountdown(cat) {
        clearInterval(objInterval);
        objInterval = setInterval(function() {
            showcountdown(cat);
        }, 1000);
        breakCount += 1;
    }

    //COUNT DOWN & POST TO SCREEN
    function showcountdown(him) {
        if (him !== workLength) {
            him = workLength;
        }
        //CHANGE THE RAW MILLISECOND TIME TO HUMAN READABLE
        titleTimer = millisToMinutesAndSeconds(him);
        //POST HUMAN READABLE TO THE SCREEN
        document.getElementById("screen").innerHTML = titleTimer;
        document.getElementById("timer").innerHTML = titleTimer + " Pomodoro";
        //BREAK TIME
        if (him < 1) {
            chime();
            clearInterval(objInterval);
            if (breakCount % 2 === 0) {
                workLength = staticWorkLength;
                startcountdown(workLength);
            } else {
                workLength = breakLength;
                startcountdown(breakLength);
            }
        } else {
            him--;
            workLength--;
        }
    }

    //PAUSE LOGIC
    function pushPend(wo) {
        $("#screen").html(":");
        if (wo === "pause") {
            if (breakCount % 2 === 0) {
                pausedWorkLength = breakLength;
            } else {
                pausedWorkLength = workLength;
            }
            pauseCount += 1;
            $("#pause").html("");
            //UNPAUSE
            if (pauseCount % 2 === 0) {
                $("#pause").html("PAUSE");
                if (breakCount % 2 === 0) {
                    breakLength = pausedWorkLength;
                    breakCount -= 1;
                    startcountdown(breakLength);
                } else {
                    workLength = pausedWorkLength;
                    breakCount -= 1;
                    startcountdown(workLength);
                }
                //PAUSE
            } else {
                $("#pause").html("PAUSED");
                clearInterval(objInterval);
            }
        }
    }

    //STARTS HERE WITH THE INPUTS
    $("button").click(function() {
        switch (this.id) {
            case "pause":
                pushPend("pause");
                break;
            case "work":
                staticWorkLength = $("#tooltip").slider("option", "value") * 60;
                workLength = staticWorkLength;
                breakLength = staticWorkLength / 6;
                pauseCount = 0;
                breakCount = 0;
                $("#pause").html("PAUSE");
                startcountdown(workLength);
                break;
        }
    });
});
