function DisplayValue(panel, data){
    if(data && data['data'] && data['data']['display_value']){
        panel.GetChild(3).text = data['data']['display_value']
        panel.GetChild(3).visible = true
    }
}
function ConfigureItemAppearance(panel, data, reward_type){
    const image_path = GetItemImagePath(data)
    panel.GetChild(0).SetImage(image_path)
    panel.GetChild(0).SetHasClass("hidden", !(data.data.abilityname == undefined))
    panel.GetChild(1).SetHasClass("hidden", (data.data.abilityname == undefined))
    // panel.GetChild(0).visible = false
    DisplayValue(panel, data)
    panel.SetPanelEvent("onmouseover", ShowItemTooltip(panel, data, reward_type));
    panel.SetPanelEvent("onmouseout", HideItemTooltip(panel, data));
    panel.SetHasClass("hidden", data == undefined)
    if(data.data.abilityname){
        panel.GetChild(1).abilityname = data.data.abilityname
        panel.SetPanelEvent("onmouseover", ShowAbilityTooltip(panel, data.data.abilityname));
        panel.SetPanelEvent("onmouseout", HideAbilityTooltip());
    }
}

function CreateColumnItem(level){
    const panel = $.CreatePanel("Panel", PANEL_BP.rewards_list_panel, "")
    panel.BLoadLayoutSnippet("scroll_item_column")
    panel.GetChild(2).GetChild(0).text = level
    ConfigureItemAppearance(panel.GetChild(0), dataReward.free[level], "free")
    panel.GetChild(0).SetPanelEvent("onactivate", ClaimReward_Event(level, 0))
    ConfigureItemAppearance(panel.GetChild(1), dataReward.premium[level], "premium")
    panel.GetChild(1).SetPanelEvent("onactivate", ClaimReward_Event(level, 1))
}
function GenerateBattlePassContent(){
    PANEL_BP.rewards_list_panel.RemoveAndDeleteChildren()
    for(let level = 1; level <= LEVEL_MAX; level++){
        CreateColumnItem(level)
    }
}
function CreateChoiceItemPanel(data, index){
    const panel = $.CreatePanel("Panel", PANEL_BP.choice_reward_items_container, "")
    panel.BLoadLayoutSnippet("choice_item")
    panel.style.width = data.width
    panel.style.height = data.height
    panel.GetChild(0).SetImage(`file://{images}/custom_game/bp/items/${data.images[index]}`)
    panel.GetChild(0).SetHasClass("hidden", data.images[index] == undefined)
    panel.GetChild(1).itemname = data.items[index]
    panel.GetChild(1).SetHasClass("hidden", data.items[index] == undefined)
    panel.GetChild(2).abilityname = data.abilities[index]
    panel.GetChild(2).SetHasClass("hidden", data.abilities[index] == undefined)
    panel.GetChild(2).SetPanelEvent("onmouseover", ShowAbilityTooltip(panel.GetChild(2), data.abilities[index]))
    panel.GetChild(2).SetPanelEvent("onmouseout", HideAbilityTooltip())
    return panel
}
function CreateTopTabs(){
    tabs_container.RemoveAndDeleteChildren()
    for(let obj of TABS){
        const tab_panel = $.CreatePanel("Panel", tabs_container, "")
        tab_panel.BLoadLayoutSnippet("tab")
        tab_panel.FindChildTraverse("tab_name").text = $.Localize("#"+obj.name)
        tab_panel.SetPanelEvent("onactivate", TabChange_Event(obj.index))
    }
}
function CreateOpenButton(){
    const ButtonBar = DotaHUD.Get().FindChildTraverse("ButtonBar")
    let panel = ButtonBar.FindChildTraverse("button_bp")
    if(!panel){
        panel = $.CreatePanel('Panel', ButtonBar, "button_bp")
        panel.BLoadLayout("file://{resources}/layout/custom_game/battle_pass/battle_pass_button.xml", false, false)
    }
    panel.SetPanelEvent("onmouseactivate",()=>{
        ClickButton()
        OpenButton()
    });
    panel.SetPanelEvent("onmouseover",()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", panel, $.Localize("#open_button_battle_pass"));
    });
    panel.SetPanelEvent("onmouseout",()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    });
    panel.style.tooltipPosition = 'bottom';
}
function DisplayFreeBattlePassItem(panel, data, level, index){
    panel.SetHasClass("unavailable_reward", data.level < level)
    panel.SetHasClass("uncommon_shadow" , (data.level >= level && data.rewards[index].claimed == 0))
    panel.GetChild(2).SetHasClass("hidden", !(data.rewards[index].claimed == 1))
}
function DisplayPremiumBattlePassItem(panel, data, level, index){
    panel.SetHasClass("unavailable_reward", (data.level < level || data.premium == false))
    panel.SetHasClass("legendary_shadow" , (data.level >= level && data.rewards[index].claimed == 0 && data.premium == 1))
    panel.GetChild(2).SetHasClass("hidden", !(data.rewards[index].claimed == 1))
}
function UpdateRewardAvailability(data){
    for(let level = 1; level <= LEVEL_MAX; level++){
        const panel = PANEL_BP.rewards_list_panel.GetChild(level-1)
        // middle line
        DisplayFreeBattlePassItem( panel.GetChild(0), data, level, DetermineRewardIndex(0,level) )
        DisplayPremiumBattlePassItem( panel.GetChild(1), data, level, DetermineRewardIndex(1,level) )
        panel.GetChild(2).SetHasClass("unavailable_level", !(data.level >= level) )
        panel.GetChild(3).SetHasClass("hidden", !(data.level >= level) )
    }
}
function UpdatePlayerProfilData(data){
    PANEL_BP.battle_pass_level.text = `${$.Localize("#battle_pass_level")} ${data.level}`
    const rank_image_path = GetRankImagePathByLevel(data.level)
    PANEL_BP.battle_pass_rank_image.SetImage(rank_image_path)
    PANEL_BP.avatar_image_panel.SetHasClass("avatar_image_gray_glow", data.premium != 1)
    PANEL_BP.avatar_image_panel.SetHasClass("avatar_image_gold_glow", data.premium == 1)
    let experience = ColculateProgressBarValues(data)
    PANEL_BP.progress_bar.max = experience.max
    PANEL_BP.progress_bar.min = experience.min
    PANEL_BP.progress_bar.value = experience.value
    PANEL_BP.progress_bar_label.text = `${experience.value}/${experience.max}`
}
function ShowTooltip(message, panel){
    return ()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", panel, $.Localize("#"+message));
    }
}
function HideTooltip(){
    return ()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    }
}