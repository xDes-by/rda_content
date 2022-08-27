function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

/*
function testsound(){
    //ui_generic_button_click
    //
    //
    //
    //
    //
    //
    //Game.EmitSound("ui_select_md")
    //
    $.Schedule(1, function(){
		$.Msg("1112212")
        testsound()
	})
}
*/

function golded(t){
    $.Msg("HEWQ")
    /*
    var but = FindDotaHudElement('ShopButton').FindChildTraverse('GoldLabel');
    $.Msg(but)
    but.text = t.money
    */
}

(function() {
    GameEvents.Subscribe( "golded ", golded );
    $.Msg("1112212")
    $.Msg("1112212")
    $.Msg("1112212")
})();