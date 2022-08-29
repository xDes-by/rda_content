function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}
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
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_mines_soul"})
})

$("#souls_stash").GetChild(3).visible = false
$("#souls_stash").GetChild(3).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_dust_soul"})
})
$("#souls_stash").GetChild(3).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_dust_soul"})
})

$("#souls_stash").GetChild(4).visible = false
$("#souls_stash").GetChild(4).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_swamp_soul"})
})
$("#souls_stash").GetChild(4).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_swamp_soul"})
})

$("#souls_stash").GetChild(5).visible = false
$("#souls_stash").GetChild(5).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_snow_soul"})
})
$("#souls_stash").GetChild(5).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_snow_soul"})
})

$("#souls_stash").GetChild(6).visible = false
$("#souls_stash").GetChild(6).SetPanelEvent("onmouseactivate", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_divine_soul"})
})
$("#souls_stash").GetChild(6).SetPanelEvent("oncontextmenu", function(){
    GameEvents.SendCustomGameEventToServer("GetSoul", {name:"item_divine_soul"})
})
var isOpen = true
function ActionButton(){
    return function(){
        if(isOpen){
            $.Msg(111)
            isOpen = false
            $("#souls_stash_panel").visible = false
            $("#hide_button").style.backgroundImage = 'url("s2r://panorama/images/control_icons/arrow_min_left_psd.vtex")'
            // $("#arrow_button").visible = true
        }else{
            $.Msg(222)
            isOpen = true
            $("#souls_stash_panel").visible = true
            $("#hide_button").style.backgroundImage = 'url("s2r://panorama/images/control_icons/arrow_min_right_psd.vtex")'
            // $("#arrow_button").visible = false
        }
    }
}
$("#arrow_button").SetPanelEvent("onmouseactivate", ActionButton())
// $("#arrow_button").visible = false
// $("#souls_main").SetPanelEvent("onmouseover", function(){
//     $("#arrow_button").visible = true
// })
// $("#souls_main").SetPanelEvent("onmouseout", function(){
//     $("#arrow_button").visible = false
// })