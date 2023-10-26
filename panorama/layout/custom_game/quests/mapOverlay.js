const DotaHUD = GameUI.CustomUIConfig().DotaHUD;

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
    
    
    // const questOverlay = $.CreatePanel("Image", miniMapPanel, "", {style:"height:100%;width:100%;align:center center;opacity:0.2;", src:"file://{images}/custom_game/quest/map_overlay/1.png", hittest:false})
    // MinimapEvent(DOTATeam_t.DOTA_TEAM_GOODGUYS, getPlayerHero() as CBaseEntity, -1329, 2425.698730, DOTAMinimapEvent_t.DOTA_MINIMAP_EVENT_TUTORIAL_TASK_FINISHED, 0.1);
    // Entities.SetMinimapIcon( 614, 'minimap_sword' )
    // CustomNetTables.SubscribeNetTableListener( "player_info", OnQuestDataChange );
})()