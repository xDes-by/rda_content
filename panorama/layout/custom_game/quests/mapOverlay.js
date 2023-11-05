const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
var map_hints = true
function FindUnitIndexByName(name){
    for(let i in list){
        if(list[i]['name'] == name){
            return i
        }
    }
    return false
}

function RemoveNpcIcon(questType, listIndex){
    if(questType == "bonus" && (list[listIndex]['icon'] == 'minimap_yellow_exclamation' || list[listIndex]['icon'] == 'minimap_yellow_question')) return
    Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_empty' )
    list[listIndex]['icon'] = "minimap_empty"
}

function UpdateMinimapNpcIcons(data){
    for(let i in list){
        Entities.SetMinimapIcon( list[i]['index'], 'minimap_empty' )
        list[i]['icon'] = 'minimap_empty'
    }
    for(let mainIndex in data['main']){
        if(data['main'][mainIndex]['available'] == 0 && data['main'][mainIndex]['active'] == 0 && data['main'][mainIndex]['complete'] == 0){
            break
        }
        let listIndex = FindUnitIndexByName(data['main'][mainIndex]['UnitName'])
        // if(data['main'][mainIndex]['complete'] == 1 && list[listIndex]['icon'] != "minimap_empty"){
        //     RemoveNpcIcon('main', listIndex)
        // }
        if(data['main'][mainIndex]["available"] == 1 && data['main'][mainIndex]["active"] == 0){
            $.Msg("wtf")
            Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_yellow_exclamation' )
            list[listIndex]['icon'] = "minimap_yellow_exclamation"
            $.Msg(list[listIndex]['icon'])

        }
        for(let taskIndex in data['main'][mainIndex]['tasks']){
            $.Msg("mapoverlay:",data['main'][mainIndex]['tasks'][taskIndex]['mapoverlay'])
            listIndex = FindUnitIndexByName(data['main'][mainIndex]['tasks'][taskIndex]['UnitName'])
            if(data['main'][mainIndex]['tasks'][taskIndex]['HowMuch'] == data['main'][mainIndex]['tasks'][taskIndex]['have'] && data['main'][mainIndex]['tasks'][taskIndex]['complete'] == 0){
                if(data['main'][mainIndex]['tasks'][taskIndex]['complete'] == 0){
                    if(data['main'][mainIndex]['tasks'][Number(taskIndex)+1] == undefined){
                        Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_yellow_question' )
                        list[listIndex]['icon'] = "minimap_yellow_question"
                    }else{
                        Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_yellow_exclamation' )
                        list[listIndex]['icon'] = "minimap_yellow_exclamation"
                    }
                }
            }
        }
    }
    for(let bonusIndex in data['bonus']){
        let listIndex = FindUnitIndexByName(data['bonus'][bonusIndex]['UnitName'])
        if(data['bonus'][bonusIndex]['available'] == 1 && data['bonus'][bonusIndex]['active'] == 0 && list[listIndex]['icon'] == "minimap_empty"){
            Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_blue_exclamation' )
            list[listIndex]['icon'] = "minimap_blue_exclamation"
        }
        for(let taskIndex in data['bonus'][bonusIndex]['tasks']){
            listIndex = FindUnitIndexByName(data['bonus'][bonusIndex]['tasks'][taskIndex]['UnitName'])
            if(data['bonus'][bonusIndex]['tasks'][taskIndex]['HowMuch'] == data['bonus'][bonusIndex]['tasks'][taskIndex]['have'] && data['bonus'][bonusIndex]['tasks'][taskIndex]['complete'] == 0){
                if(data['bonus'][bonusIndex]['tasks'][taskIndex]['complete'] == 0 && 
                (list[listIndex]['icon'] == "minimap_empty" || list[listIndex]['icon'] == "minimap_blue_exclamation")){
                    if(data['bonus'][bonusIndex]['tasks'][Number(taskIndex)+1] == undefined){
                        Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_blue_question' )
                        list[listIndex]['icon'] = "minimap_blue_question"
                    }else{
                        Entities.SetMinimapIcon( list[listIndex]['index'], 'minimap_blue_exclamation' )
                        list[listIndex]['icon'] = "minimap_blue_exclamation"
                    }
                }
            }
        }
    }
}

function UpdateMinimapOverlay(data){
    const minimapPanel = DotaHUD.Get().FindChildTraverse("minimap")
    minimapPanel.RemoveAndDeleteChildren()
    if(!map_hints.FindChildTraverse("maptogglebutton").checked) return
    for(let typeIndex of ['main', 'bonus']){
        for(let questNumber in data[typeIndex]){
            if(data[typeIndex][questNumber]['active']){
                for(let taskIndex in data[typeIndex][questNumber]['tasks']){
                    if(data[typeIndex][questNumber]['tasks'][taskIndex]['active'] == 1 && data[typeIndex][questNumber]['tasks'][taskIndex]['mapoverlay']){
                        const src = `file://{images}/custom_game/quest/map_overlay/${data[typeIndex][questNumber]['tasks'][taskIndex]['mapoverlay']}.png`
                        const createdPanel = $.CreatePanel("Panel", minimapPanel, "")
                        createdPanel.BLoadLayout("file://{resources}/layout/custom_game/quests/mapOverlayTemplate.xml", false, false)
                        createdPanel.GetChild(0).SetImage(src)
                    }
                }
            }
        }
    }
}

(()=>{
    map_hints = $.CreatePanel("Panel", DotaHUD.Get().FindChildTraverse("minimap_container"), "", {style:"z-index:-10;"})
    map_hints.BLoadLayout("file://{resources}/layout/custom_game/quests/mapToggleButton.xml", false, false)
    if(Game.IsHUDFlipped()){
        map_hints.style.transform = "scaleX(-1)"
    }else{
        map_hints.style.transform = "scaleX(1)"
    }
    const GameInfo = CustomNetTables.GetTableValue( "GameInfo", Game.GetLocalPlayerID())
    map_hints.FindChildTraverse("maptogglebutton").SetSelected(GameInfo["map_hints"])
    map_hints.FindChildTraverse("maptogglebutton").SetPanelEvent("onactivate", ()=>{
        if(map_hints.FindChildTraverse("maptogglebutton").checked){
            const sid = GetUniverseSteamID32(Players.GetLocalPlayer())
            const player_info = CustomNetTables.GetTableValue( "player_info", sid);
            UpdateMinimapOverlay(player_info[sid])
        }else{
            const minimapPanel = DotaHUD.Get().FindChildTraverse("minimap")
            minimapPanel.RemoveAndDeleteChildren()
        }
        GameEvents.SendCustomGameEventToServer ("MapOverlay_Hints", {
            hints : map_hints.FindChildTraverse("maptogglebutton").checked
        })
    })
})()