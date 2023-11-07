function HideAllOverlayIcons(panel){
    // panel.GetChild(1).visible = false
    // panel.GetChild(2).visible = false
    // panel.GetChild(3).visible = false
    panel.GetChild(4).visible = false
}
function DisplayValue(panel, data){
    if(data && data['data'] && data['data']['display_value']){
        panel.GetChild(4).text = data['data']['display_value']
        panel.GetChild(4).visible = true
    }
}
function ConfigureItemAppearance(panel, data){
    HideAllOverlayIcons(panel)
    const image_path = GetItemImagePath(data)
    panel.GetChild(0).SetImage(image_path)
    DisplayValue(panel, data)
    panel.SetPanelEvent("onmouseover", ShowItemTooltip(panel, data));
    panel.SetPanelEvent("onmouseout", HideItemTooltip(panel, data));
    if(data == undefined){
        panel.visible = false
    }else{
        panel.visible = true
    }
}
function CreateColumnItem(level){
    const panel = $.CreatePanel("Panel", PANEL_BP.scroll_panel, "")
    panel.BLoadLayoutSnippet("scroll_item_column")
    panel.FindChildTraverse("level_in_scroll_label").text = "LEVEL " + level
    ConfigureItemAppearance(panel.GetChild(0).GetChild(0), dataReward.free[level])
    panel.GetChild(0).GetChild(0).SetPanelEvent("onactivate", ClaimReward_Event(level, 0))
    ConfigureItemAppearance(panel.GetChild(2).GetChild(0), dataReward.premium[level][1])
    panel.GetChild(2).GetChild(0).SetPanelEvent("onactivate", ClaimReward_Event(level, 1))
    ConfigureItemAppearance(panel.GetChild(2).GetChild(1), dataReward.premium[level][2])
    panel.GetChild(2).GetChild(1).SetPanelEvent("onactivate", ClaimReward_Event(level, 2))
}
function GenerateBattlePassContent(){
    PANEL_BP.scroll_panel.RemoveAndDeleteChildren()
    for(let level = 1; level <= LEVEL_MAX; level++){
        CreateColumnItem(level)
    }
}

const ShowItemTooltip = function(panel, data){
    return ()=>{
        $.DispatchEvent(
            "UIShowCustomLayoutParametersTooltip",
            panel,
            "AttackTooltip",
            "file://{resources}/layout/custom_game/battle_pass/tooltip/battle_pass_tooltip.xml",
            GetItemTooltipParamsString(data),
        );
    }
}

const HideItemTooltip = function(panel, data){
    return ()=>{
        $.DispatchEvent("UIHideCustomLayoutTooltip", panel, "AttackTooltip");
    }
}
