function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

function golded(t){
    var but = FindDotaHudElement('ShopButton').FindChildTraverse('GoldLabel');
    but.text = t.money
}

(function() {
    GameEvents.Subscribe('golded', golded);
    $.Msg("1112212")
    $.Msg("1112212")
    $.Msg("1112212")
})();