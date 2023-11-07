function GetItemImagePath(data){
    if(data && data.reward_type){
        return `file://{images}/custom_game/bp/items/${IMAGE_NAME[data.reward_type]}`
    }
}
function GetItemTooltipParamsString(data){
    if(data && data.reward_type){
        let description = $.Localize("#" + ITEM_TOOLTIP[data.reward_type].description)
        description = description.replace("##display_value##", data.data.display_value)
        description = description.replace("##price##", data.data.price)
        const params =
            'name=' + $.Localize("#" + ITEM_TOOLTIP[data.reward_type].name) +
            '&image_path=' + `file://{images}/custom_game/bp/items/${ITEM_TOOLTIP[data.reward_type].image}` +
            '&description=' + description +
            '&image_width=' + ITEM_TOOLTIP[data.reward_type].image_width +
            '&image_height=' + ITEM_TOOLTIP[data.reward_type].image_height;
        return params
    }
}
function ClickButton() {
	Game.EmitSound("General.ButtonClick");
}
function ClaimReward_Event(reward_level, number_type){
    return ()=>{
        ClickButton()
        ClaimReward(reward_level, number_type)
    }
}
function ClaimReward(reward_level, number_type){
    GameEvents.SendCustomGameEventToServer("BattlePassClaimReward", {reward_level:reward_level, number_type:number_type})
}
function DisplayFreeBattlePassItem(panel, data){

}
function DisplayPremiumBattlePassItem(panel, data){

}
function UpdateRewardAvailability(data){
    $.Msg(data)
    for(let i = 0; i < LEVEL_MAX; i++){
        const panel = PANEL_BP.scroll_panel.GetChild(i)
        // middle line
        panel.GetChild(1).SetHasClass("middle_line_unavailable", data.level <= i)
        panel.GetChild(1).SetHasClass("middle_line_available", data.level > i )
        DisplayFreeBattlePassItem(panel.GetChild(0).GetChild(0), data, index)
        // brightness
        panel.GetChild(0).GetChild(0).SetHasClass("unavailable_reward", data.level <= i)
        panel.GetChild(2).GetChild(0).SetHasClass("unavailable_reward", (data.level <= i || data.premium == false))
        panel.GetChild(2).GetChild(1).SetHasClass("unavailable_reward", (data.level <= i || data.premium == false))
        // available_reward_mark
        panel.GetChild(0).GetChild(0).GetChild(3).SetHasClass("hidden", (data.level <= i && data.list[i+1] == undefined))
        if(data.level > i && data.list[i+1] != null){
            panel.GetChild(0).GetChild(0).GetChild(3).SetHasClass("hidden", true)
            panel.GetChild(0).GetChild(0).GetChild(2).SetHasClass("hidden", false)
        }else{
            panel.GetChild(0).GetChild(0).GetChild(2).SetHasClass("hidden", true)
        }
        panel.GetChild(2).GetChild(0).GetChild(3).SetHasClass("hidden", true)
        panel.GetChild(2).GetChild(1).GetChild(3).SetHasClass("hidden", true)
    }
}
function ColculateProgressBarValues(data){
    const min = 0
    if(data.level < LEVEL_MAX){
        let max = experienceList[data.level+1] - experienceList[data.level]
        let value = (experienceList[data.level] - data.experience) * -1
        return {max:max, min:min, value:value}
    }
    let max = experienceList[data.level] - experienceList[data.level-1]
    let value = max - min
    return {max:max, min:min, value:value}
}
function RefreshUI(data){
    PANEL_BP.battle_pass_level.text = `LEVEL ${data.level}`
    let experience = ColculateProgressBarValues(data)
    PANEL_BP.progress_bar.max = experience.max
    PANEL_BP.progress_bar.min = experience.min
    PANEL_BP.progress_bar.value = experience.value
    PANEL_BP.progress_bar_label.text = `${experience.value}/${experience.max}`
    PANEL_BP.collect_all_button.GetChild(0).text = data.rewardCount > 0 ? `${$.Localize("#collect_all_rewards_button")} (${data.rewardCount})` : $.Localize("#collect_all_rewards_button")
    UpdateRewardAvailability(data)
}

(()=>{
    GenerateBattlePassContent();
    CustomNetTables.SubscribeNetTableListener( "BattlePass", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()){
            RefreshUI(data)
        }
    });
    RefreshUI(CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer()))
})()


$("#tabs_container").RemoveAndDeleteChildren()
for(let i = 0; i < 3; i++){
    $("#tabs_container").BLoadLayoutSnippet("tab")
}