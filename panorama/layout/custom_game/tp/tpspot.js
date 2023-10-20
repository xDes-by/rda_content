var isopen = true
$("#bg_victory").visible = true

function part_1_btn() {
    isopen = false
    GameEvents.SendCustomGameEventToServer("tp_check_lua", {type : "roshan"});
    $("#bg_victory").visible = false
    Game.EmitSound("ui_select_arrow")
}

function part_2_btn() {
    isopen = false
    GameEvents.SendCustomGameEventToServer("tp_check_lua", {type : "boss"});
    $("#bg_victory").visible = false
    Game.EmitSound("ui_select_arrow")
}

function part_4_btn() {
    isopen = false
    GameEvents.SendCustomGameEventToServer("tp_check_lua", {type : "traps"});
    $("#bg_victory").visible = false
    Game.EmitSound("ui_select_arrow")
}


function part_3_btn(t) {
    $('#bg_victory').visible = true;
    isopen = true
}

function tp_check_js(t) {
    $.Msg(t)
}

GameEvents.Subscribe("ivint23", part_3_btn);
GameEvents.Subscribe("tp_check_js", tp_check_js);
