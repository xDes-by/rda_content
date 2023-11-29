function UpdateAbilityPoints(){
    let abilitiesPanel =  DotaHUD.Get().FindChildTraverse("abilities")
    for(let i = 0; i < abilitiesPanel.GetChildCount(); i++){
        let AbilityLevelContainer = abilitiesPanel.GetChild(i).GetChild(0).FindChildTraverse("AbilityLevelContainer")
        const childCount =  AbilityLevelContainer.GetChildCount()
        for(let j = 0; j < childCount; j++){
            if(AbilityLevelContainer.GetChild(j) && childCount == 10){
                AbilityLevelContainer.GetChild(j).style.width = "4px"
                AbilityLevelContainer.GetChild(j).style.margin = "2px 1px 2px 1px"
            }else if(AbilityLevelContainer.GetChild(j) && childCount > 10){
                AbilityLevelContainer.GetChild(j).style.width = "3px"
                AbilityLevelContainer.GetChild(j).style.margin = "2px 0px 2px 1px"
            }
        }
    }
}
function EditPregameStrategyTab(){
    const strategy_tab_button = DotaHUD.Get().FindChildTraverse("StrategyTabButton")
    strategy_tab_button.GetChild(0).text = $.Localize("#talents_strategy_tab_name_label")
    const strategy_tab = DotaHUD.Get().FindChildTraverse("StrategyTab")
    for(let i = 0; i < strategy_tab.GetChildCount(); i++){
        strategy_tab.GetChild(i).visible = false
    }
}
(()=>{
    GameEvents.Subscribe("dota_player_update_query_unit", UpdateAbilityPoints);
    GameEvents.Subscribe('dota_player_update_hero_selection', UpdateAbilityPoints);
    GameEvents.Subscribe('dota_player_update_selected_unit', UpdateAbilityPoints);
})()
