function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}
var dummy_index = null

function open_quest_window(){
    var unit = Players.GetLocalPlayerPortraitUnit()
    if(Number(unit) == Number(dummy_index)){
        FindDotaHudElement("center_bg").FindChildTraverse("dummy").style.visibility = "visible"
    }else{
        FindDotaHudElement("center_bg").FindChildTraverse("dummy").style.visibility = "collapse"
    }
}


GameEvents.Subscribe("dota_player_update_query_unit", open_quest_window)
GameEvents.Subscribe('dota_player_update_hero_selection', open_quest_window);
GameEvents.Subscribe('dota_player_update_selected_unit', open_quest_window);
GameEvents.Subscribe('open_quest_window', open_quest_window);
GameEvents.Subscribe('DummyPanoramaInit', function(t){
    dummy_index = t.index
    let MainPanel = $.CreatePanelWithProperties("Panel", FindDotaHudElement("center_bg"), "dummy", {})
    MainPanel.BLoadLayout("file://{resources}/layout/custom_game/dummy/dummy.xml", false, false)
    MainPanel.style.visibility = "collapse"
    MainPanel.FindChildTraverse("Arrmor").GetChild(0).text = "+10 " + $.Localize("#Arrmor")
    MainPanel.FindChildTraverse("Arrmor").GetChild(0).SetPanelEvent("onmouseactivate", function(){
        GameEvents.SendCustomGameEventToServer("DummyButtons", {type:"Arrmor", value : 10})
    })
    MainPanel.FindChildTraverse("Arrmor").GetChild(1).text = "-10 " + $.Localize("#Arrmor")
    MainPanel.FindChildTraverse("Arrmor").GetChild(1).SetPanelEvent("onmouseactivate", function(){
        GameEvents.SendCustomGameEventToServer("DummyButtons", {type:"Arrmor", value : -10})
    })
    MainPanel.FindChildTraverse("MagicResistance").GetChild(0).text = "+5 " + $.Localize("#MagicResistance")
    MainPanel.FindChildTraverse("MagicResistance").GetChild(0).SetPanelEvent("onmouseactivate", function(){
        GameEvents.SendCustomGameEventToServer("DummyButtons", {type:"MagicResistance", value : 5})
    })
    MainPanel.FindChildTraverse("MagicResistance").GetChild(1).text = "-5 " + $.Localize("#MagicResistance")
    MainPanel.FindChildTraverse("MagicResistance").GetChild(1).SetPanelEvent("onmouseactivate", function(){
        GameEvents.SendCustomGameEventToServer("DummyButtons", {type:"MagicResistance", value : -5})
    })
});