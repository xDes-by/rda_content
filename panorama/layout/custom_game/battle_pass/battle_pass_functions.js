function OpenButton(){
    TabChange(0);
    main_panel.style.opacity = is_open == true ? "0" : "1";
    main_panel.style.transform = is_open == true ? "translate3d(0px, 500px, 0px)" : "translate3d(0px, 0px, 0px)";
    main_panel.style.preTransformScale2d = is_open == true ? "0" : "1";
    is_open = !is_open
}
function GetItemImagePath(data){
    if(data && data.reward_type){
        return `file://{images}/custom_game/bp/items/${data.data.image ? data.data.image : IMAGE_NAME[data.reward_type]}`
    }
}
function GetItemTooltipParamsString(data, reward_type){
    if(data && data.reward_type){
        let description = $.Localize("#" + ITEM_TOOLTIP[data.reward_type].description)
        description = description.replace("##display_value##", data.data.display_value)
        description = description.replace("##price##", data.data.price)
        description = description.replace("##game_count##", data.data.game_count)
        description = description.replace("##days_count##", data.data.days_count)
        description = description.replace("##choice_count##", data.data.choice_count)
        if(reward_type == "premium"){
            const player_data = CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer())
            if(player_data.premium == 0){
                description = description + "<br><br>" + $.Localize("#BattleBase_unavailable_reward_premium")
            }
        }
        const params =
            'name=' + $.Localize("#" + ITEM_TOOLTIP[data.reward_type].name) +
            '&image_path=' + `file://{images}/custom_game/bp/items/${ITEM_TOOLTIP[data.reward_type].image}` +
            '&description=' + description +
            '&image_width=' + ITEM_TOOLTIP[data.reward_type].image_width +
            '&image_height=' + ITEM_TOOLTIP[data.reward_type].image_height;
        return params
    }
}
function GetRankImagePathByLevel(level){
    if(level >= 1 && level < 6) return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_0_png.png"
    if(level >= 6 && level < 12) return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_1_png.png"
    if(level >= 12 && level < 19) return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_2_png.png"
    if(level >= 19 && level < 25) return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_3_png.png"
    if(level >= 25 && level < 30) return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_4_png.png"
    if(level >= 30 ) return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_5_png.png"
    return "file://{images}/custom_game/bp/hero_badges/hero_badge_rank_empty_psd.png"
}
function ClickButton() {
	Game.EmitSound("General.ButtonClick");
}
function DetermineRewardDataByIndex(reward_index){
    if(reward_index <= LEVEL_MAX) return dataReward['free'][reward_index]
    return dataReward['premium'][reward_index -LEVEL_MAX]
}
function DetermineRewardIndex(number_type, number_level){
    if(number_type == 0) return number_level
    if(number_type == 1) return number_level + LEVEL_MAX
}
function DetermineRewardNumberTypeByIndex(reward_index){
    if(reward_index <= 30) return 0
    if(reward_index % 2 == 1) return 1
    if(number_type % 2 == 0) return 2
}
function DetermineRewardLevelByIndex(reward_index){
    if(reward_index <= 30) return reward_index
    return Math.ceil((reward_index-LEVEL_MAX)/2)
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
    UpdatePlayerProfilData(data)
    UpdateRewardAvailability(data)
    UpdateHeroVotePanels(data)
    UpdateShopButtons(data)
    if(projectile_particles_panels.length == Object.keys(data['projectile_particles']).length && following_particles_panels.length == Object.keys(data['following_particles']).length && model_panels.length == Object.keys(data['models']).length){
        UpdateInventory(data)
    }else{
        CreateInventory(data)
    }
}
function ClaimReward_Event(reward_level, number_type){
    return ()=>{
        if(IsRewardAvailable(reward_level, number_type)){
            ClickButton()
            ClaimReward(reward_level, number_type)
        }
    }
}
function ClaimReward(reward_level, number_type){
    const index = DetermineRewardIndex(number_type, reward_level);
    const data = DetermineRewardDataByIndex(index)
    const item_reward = CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer())
    if(CHOICE_ITEMS[data.reward_type]){
        ShowRewardSelection(reward_level, number_type, data.data.choice_count - item_reward.rewards[index].choice_count, {});
        return;
    }
    GameEvents.SendCustomGameEventToServer("BattlePassClaimReward", {reward_level:reward_level, number_type:number_type})
}
function ClaimAllRewards(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("BattlePassClaimAllRewards", {})
}
function ClaimAllChoice(t){
    if(Object.keys(t).length > 0){
        const keys = Object.keys(t)
        const index = t[keys[0]]
        delete t[keys[0]]
        const item_data = DetermineRewardDataByIndex(index)
        const player_data = CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer())
        ShowRewardSelection(DetermineRewardLevelByIndex(index), DetermineRewardNumberTypeByIndex(index), item_data.data.choice_count - player_data.rewards[index].choice_count , t)
    }
}
function SelectReward_Event(reward_level, number_type, count, choice_index, choice_list){
    return ()=>{
        ClickButton()
        SelectReward(reward_level, number_type, choice_index)
        if(count > 0){
            ShowRewardSelection(reward_level, number_type, count, choice_list)
        }else if(Object.keys(choice_list).length == 0){
            HideRewardSelection()
        }else{
            ClaimAllChoice(choice_list)
        }
    }
}
function SelectReward(reward_level, number_type, choice_index){
    GameEvents.SendCustomGameEventToServer("BattlePassSelectReward", {reward_level:reward_level, number_type:number_type, choice_index:choice_index+1})
}
function ShowRewardSelection(reward_level, number_type, count, choice_list){
    const index = DetermineRewardIndex(number_type, reward_level);
    const data = DetermineRewardDataByIndex(index)
    PANEL_BP.choice_reward_name.text = $.Localize("#"+ITEM_TOOLTIP[data.reward_type].name)
    PANEL_BP.choice_reward_count.text = $.Localize("#BattlePass_choice_count").replace("##count##", count)
    PANEL_BP.choice_reward_items_container.RemoveAndDeleteChildren()
    for(let index = 0; index < CHOICE_ITEMS[data.reward_type].images.length;index++){
        const panel = CreateChoiceItemPanel(CHOICE_ITEMS[data.reward_type], index)
        panel.SetPanelEvent("onactivate", SelectReward_Event(reward_level, number_type, count-1, index, choice_list))
    }
    for(let index = 0; index < CHOICE_ITEMS[data.reward_type].items.length;index++){
        const panel = CreateChoiceItemPanel(CHOICE_ITEMS[data.reward_type], index)
        panel.SetPanelEvent("onactivate", SelectReward_Event(reward_level, number_type, count-1, index, choice_list))
    }
    for(let index = 0; index < CHOICE_ITEMS[data.reward_type].abilities.length;index++){
        const panel = CreateChoiceItemPanel(CHOICE_ITEMS[data.reward_type], index)
        panel.SetPanelEvent("onactivate", SelectReward_Event(reward_level, number_type, count-1, index, choice_list))
    }
    PANEL_BP.choice_reward_bg.SetHasClass("hidden", false)
}
function HideRewardSelection(){
    PANEL_BP.choice_reward_bg.SetHasClass("hidden", true)
}
function IsRewardAvailable(reward_level, number_type){
    const data = CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer())
    if(reward_level > data.level) return false
    if(number_type > 0 && data.premium == false) return false
    const reward_index = DetermineRewardIndex(number_type, reward_level)
    if(data.rewards[reward_index].claimed) return false
    return true
}
function CloseWindowOnOutsideClick(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
        let cursorPos = GameUI.GetCursorPosition();
        let panelPos = main_panel.GetPositionWithinWindow();
        let width = Number(main_panel.actuallayoutwidth)
        let height = Number(main_panel.actuallayoutheight)
        if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
        {
            is_open = true
            OpenButton()
        }
    }
}
const TabChange_Event = (index)=>{
    return ()=>{
        ClickButton()
        TabChange(index)
    }
}
function TabChange(index){
    for(let obj of TABS){
        tabs_container.GetChild(obj.index).GetChild(0).SetHasClass("tab_notactive", obj.index != index)
        obj.panel_container.SetHasClass("hidden", obj.index != index)
    }
}
(()=>{
    CreateTopTabs();
    HideRewardSelection();
    CreateOpenButton()
    GenerateBattlePassContent();
    CreateHeroVotePanels();
    OpenButton();
    TabChange(0);
    UpdateTasks();
    CreateShopButtons();
    CustomNetTables.SubscribeNetTableListener( "BattlePass", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()){
            RefreshUI(data);
        }
    });
    CustomNetTables.SubscribeNetTableListener( "BattlePass", (_, key, data)=>{
        if(key == "VotingHeroesList"){
            voting_heroes_list = data
            UpdateHeroVotePanels(CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer()))
        }
    });
    CustomNetTables.SubscribeNetTableListener( "quests", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()){
            UpdateTasks(data.bp)
        }
    });
    PANEL_BP.choice_reward_bg.SetPanelEvent("onactivate", HideRewardSelection);
    RefreshUI(CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer()));
    GameEvents.Subscribe('BattlePass_ClaimAllRewards_ChoiceIndex', ClaimAllChoice);
    DotaHUD.ListenToMouseEvent(CloseWindowOnOutsideClick);
})()