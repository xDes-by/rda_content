$("#bg_victory").visible = false

function part_1_btn() {
    isopen = false
    GameEvents.SendCustomGameEventToServer("tp_check_lua", { type: "roshan" });
    Game.EmitSound("ui_select_arrow")
}

function part_2_btn() {
    GameEvents.SendCustomGameEventToServer("tp_check_lua", { type: "boss" });
    Game.EmitSound("ui_select_arrow")
}

function part_4_btn() {
    GameEvents.SendCustomGameEventToServer("tp_check_lua", { type: "traps" });
    Game.EmitSound("ui_select_arrow")
}

function part_6_btn() {
    GameEvents.SendCustomGameEventToServer("tp_check_lua", { type: "brewmaster" });
    Game.EmitSound("ui_select_arrow")
}

function part_9_btn() {
    GameEvents.SendCustomGameEventToServer("tp_check_lua", { type: "Wyvern" });
    Game.EmitSound("ui_select_arrow")
}

function part_7_btn() {
    GameEvents.SendCustomGameEventToServer("tp_check_lua", { type: "Ursa" });
    Game.EmitSound("ui_select_arrow")
}

function part_8_btn(t) {
    $.Msg("pokazat")
    $("#bg_victory").visible = true
}

function tp_check_js(t) {
    $.Msg(t)
    if (t.successfully > 0) { // оно закрывается при условии что закрывается телепорт. (successfully Возвращает состаеля или нет телепорт) Если нет предмета тогда successfully 0 и если нет предмета тп не происходит.  
        $("#bg_victory").visible = false
    }
}

function part_5_btn() {
    $("#bg_victory").visible = false
    Game.EmitSound("ui_select_arrow")
}

GameEvents.Subscribe("ivint999", part_8_btn);
GameEvents.Subscribe("tp_check_js", tp_check_js);