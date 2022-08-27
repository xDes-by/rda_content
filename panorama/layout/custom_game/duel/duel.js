var isopen = false
$("#bg_victory").visible = false

function part_1_btn() {
    $.Msg("net")
    $("#bg_victory").visible = false
    isopen = false
    GameEvents.SendCustomGameEventToServer( "no_net", {caster : caster, target : target} );
    Game.EmitSound("ui_select_arrow")
}

function part_2_btn() {
    $.Msg("da")
    isopen = false
	GameEvents.SendCustomGameEventToServer( "yes_da", {caster : caster, target : target} );
    $("#bg_victory").visible = false
    Game.EmitSound("ui_select_arrow")
}

function part_3_btn(t) {
    $('#bg_victory').visible = true;
    $.Msg("pokazat")
    isopen = true
    rekurzia(t.time, t.time) //
	caster = t.caster
	target = t.target
}

GameEvents.Subscribe("ivint23", part_3_btn);

function rekurzia(i, v) {
	$.Msg(i)
    if (i > 0 && isopen == true) {
        $('#polosk2').style.width = (100 / v * i) + '%'
    } if (i == 0 ) {
        part_1_btn()
        return
    }
	if ( isopen == false ) {
        return
    }
    i--;
    $.Schedule(0.034, function() {
        rekurzia(i, v)
    });
}