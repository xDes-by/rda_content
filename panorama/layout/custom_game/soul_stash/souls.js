function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}



// var stash = FindDotaHudElement("stash")
// stash.style.marginBottom = "100px"


GameEvents.Subscribe( "updateSoulsInventory", function(t){
    var pan = $("#souls_stash")
    for(let i = 0; i < 7; i++){
        pan.GetChild(i).FindChildTraverse("label").text = t[i]
        if(t[i] == 0){
            pan.GetChild(i).visible = false
        }else{
            pan.GetChild(i).visible = true
        }
    }
})
$("#souls_stash").GetChild(0).visible = false
$("#souls_stash").GetChild(0).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_forest_soul"})
})
$("#souls_stash").GetChild(0).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_forest_soul"})
})

$("#souls_stash").GetChild(1).visible = false
$("#souls_stash").GetChild(1).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})
$("#souls_stash").GetChild(1).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})

$("#souls_stash").GetChild(2).visible = false
$("#souls_stash").GetChild(2).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_mines_soul"})
})
$("#souls_stash").GetChild(2).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})

$("#souls_stash").GetChild(3).visible = false
$("#souls_stash").GetChild(3).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_dust_soul"})
})
$("#souls_stash").GetChild(3).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})

$("#souls_stash").GetChild(4).visible = false
$("#souls_stash").GetChild(4).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_swamp_soul"})
})
$("#souls_stash").GetChild(4).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})

$("#souls_stash").GetChild(5).visible = false
$("#souls_stash").GetChild(5).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_snow_soul"})
})
$("#souls_stash").GetChild(5).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})

$("#souls_stash").GetChild(6).visible = false
$("#souls_stash").GetChild(6).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_divine_soul"})
})
$("#souls_stash").GetChild(6).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_village_soul"})
})