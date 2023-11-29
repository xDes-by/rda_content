

// function UpdateItemList(data){
//     if(!data){
//         data = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer());
//     }
//     $("#UpgradeItemPanel").RemoveAndDeleteChildren()
//     $("#UpgradeInfoPanel").visible = false
//     $("#StatusPanel").visible = true
//     for(var i in data){
//         // $.Msg(Abilities.GetAbilityTextureName( data[i]['entindex'] ))
//         $("#UpgradeInfoPanel").visible = true
//         $("#StatusPanel").visible = false
//         const new_panel = $.CreatePanel("Panel", $("#UpgradeItemPanel"), "", {class:"itemListPanel"})
//         new_panel.BLoadLayoutSnippet("UpgradeItemSnippet")
//         new_panel.FindChildTraverse("ItemIcon").itemname = data[i].itemname
//         new_panel.FindChildTraverse("ItemName").text = $.Localize(`#dota_tooltip_ability_${data[i].itemname}`) + " LVL " + data[i].itemLevel
//         new_panel.SetPanelEvent("onmouseactivate", UpdateUpgradeItemPanel_Event(data, i))
//         const ItemIconPanel = new_panel.FindChildTraverse("ItemIcon")
//         new_panel.FindChildTraverse("GemBuff").visible = false
//         for(let i = 0; i < 5; i++){
//             ItemIconPanel.GetChild(i).visible = false
//         }
//         if(data[i].gemType > 0){
//             ItemIconPanel.GetChild(data[i].gemType-1).visible = true
//             new_panel.FindChildTraverse("GemBuff").visible = false
//         }
//         if(itemIndex == data[i].entindex){
//             new_panel.SetHasClass("item_list_selected_glow", true)
//         }
//     }
// }
const OnItemSelected_Event = (data)=>{
    return ()=>{
        ClickButton()
        OnItemSelected(data)
    }
}
function OnItemSelected(data){
    itemIndex = data.entindex
    HighlightSelectedItem(itemIndex)
    DisplayItemInfo(data)
    HideStonesAndLevel()
    if(data.itemLevel >= MAX_LEVEL){
        DisplayStonesSection(data)
    }else{
        DisplayLevelSection(data)
    }
    PANEL.button.SetPanelEvent("onactivate", UpgradeItem_Event(data))
}
const UpgradeItem_Event = (data)=>{
    return ()=>{
        ClickButton()
        UpgradeItem(data)
    }
}
function UpgradeItem(data){
    if(playerDisplayMode == "levelup"){
        GameEvents.SendCustomGameEventToServer("UpdgradeButton", { entindex : data.entindex})
    }else if(playerDisplayMode == "stones"){
        GameEvents.SendCustomGameEventToServer("UpdgradeGemsButton", { 
            entindex : data.entindex,
            gemType : RetrieveSelectedGem(),
            gemsNumber : Math.round(PANEL.slider.value),
        })
    }
}
function GetItemDataByIndex(data, entindex){
    for(let i in data){
        if(data[i].entindex == entindex){
            return data[i]
        }
    }
}
function GetItemPanelByIndex(){

}
function RefreshUIOnItemUpgrade(tab){
    const data = GetItemDataByIndex(tab, itemIndex)
    if(data){
        DisplayItemInfo(data)
        HideStonesAndLevel()
        if(playerDisplayMode == "stones" || data.itemLevel >= MAX_LEVEL){
            DisplayStonesSection(data)
        }else{
            DisplayLevelSection(data)
        }
    }else if(Object.keys(tab).length > 0){
        OnItemSelected(tab[1])
    }
}
function SwitchDisplayMode(mode){
    ClickButton()
    const tab = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer());
    const data = GetItemDataByIndex(tab, itemIndex)
    if(data){
        HideStonesAndLevel()
        if(mode == "levelup" && data.itemLevel < MAX_LEVEL){
            DisplayItemInfo(data)
            DisplayLevelSection(data)
        }else{
            DisplayStonesSection(data)
        }
    }
}
function ClickButton() {
	Game.EmitSound("General.ButtonClick");
}
function CheckGemSelectionButtonAvailability(data, number){
    if(data.gemType <= 0 || data.gemType == number){
        return true
    }
    return false
}
function CheckGemSelectionButtonLock(data, number){
    if(data.gemType > 0){
        return true
    }
    return !CheckGemSelectionButtonAvailability(data, number)
}
function DetermineGemChoiceButtonStatus(data, number){
    if(data.gemType == number){
        return true
    }
    return false
}
function ProcessGemSelectionButtonPress(number){
    if(number > 0 && PANEL.stone_buttons_panel.GetChild(number-1).BHasClass("Lock")) return
    const tab = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer())
    const data = GetItemDataByIndex(tab, itemIndex)
    if(PANEL.stone_buttons_panel.GetChild(number-1).BHasClass("Active")){
        if(data.gemType == 0){
            PANEL.stone_buttons_panel.GetChild(number-1).SetHasClass("Active", false);
        }
        return
    }
    for(let i = 0; i < PANEL.stone_buttons_panel.GetChildCount(); i++){
        PANEL.stone_buttons_panel.GetChild(i).SetHasClass("Active", false);
    }
    if(number > 0){
        PANEL.stone_buttons_panel.GetChild(number-1).SetHasClass("Active", true);
        //---------- slider value
        const value = PANEL.slider.value
        AdjustSliderAttributes(data)
        PANEL.slider.value = value > PANEL.slider.max ? PANEL.slider.max : value
        // ----------------------
        if(PANEL.slider.value > 0){
            UpdateBonusOnSliderChange()
        }
    }
}
function RetrieveSelectedGem(){
    for(let i = 0; i < PANEL.stone_buttons_panel.GetChildCount(); i++){
        if(PANEL.stone_buttons_panel.GetChild(i).BHasClass("Active")){
            return i + 1
        }
    }
    return 0
}
function DeterminePlayerGemLimit(data){
    const gem_type = data.gemType > 0 ? data.gemType : RetrieveSelectedGem()
    if(gem_type == 0){
        return data.max_gems
    }
    if(data.max_gems - data.gemsNumber < gems[gem_type-1]){
        return data.max_gems
    }
    return data.gemsNumber + gems[gem_type-1]
}
function UpdatePlayerGemCount(){
    const gemsInfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer());
    gems = [
        gemsInfo['purple_gem'],
        gemsInfo['blue_gem'],
        gemsInfo['orange_gem'],
        gemsInfo['red_gem'],
        gemsInfo['green_gem'],
    ]
}
function OnSliderValueChanged(){
    UpdateSliderTextField()
    UpdateBonusOnSliderChange()
}
function CalculateGemBonuses(data){
    if(data.gemType == 1){
        return ( data.gemsNumber / 5 * 0.01 ).toFixed(1)
    }
    if(data.gemType == 2){
        return ( data.gemsNumber / 5 ).toFixed(1)
    }
    if(data.gemType == 3){
        return ( data.gemsNumber / 1.5 ).toFixed(1)
    }
    if(data.gemType == 4){
        return ( data.gemsNumber ).toFixed(1)
    }
    if(data.gemType == 5){
        return ( data.gemsNumber / 75 / 4 ).toFixed(1)
    }
}
function GetGemBuffDescription(data){
    if(data.gemType == 1){
        return `<font color='#a653ec'>+${CalculateGemBonuses(data)}% ${$.Localize("#ForgeLifesteal")}</font>`
    }
    if(data.gemType == 2){
        return `<font color='#5392ec'>+${CalculateGemBonuses(data)}% ${$.Localize("#SpellAmplify")}</font>`
    }
    if(data.gemType == 3){
        return `<font color='#ff8c00'>+${CalculateGemBonuses(data)} ${$.Localize("#ForgeStats")}</font>`
    }
    if(data.gemType == 4){
        return `<font color='#e34234'>+${CalculateGemBonuses(data)} ${$.Localize("#ForgeBaseDamage")}</font>`
    }
    if(data.gemType == 5){
        return `<font color='#53ec8c'>+${CalculateGemBonuses(data)} ${$.Localize("#ForgeRegen")}</font>`
    }
    return ""
}
function GetItemImagePath(data){
    return "file://{images}/custom_game/forge/" + data.image + ".jpg"
}
function OpenButton(){
    if($("#ShopMenuPanel").style.visibility == "collapse"){
        $("#ShopMenuPanel").style.visibility = "visible"
    }else{
        $("#ShopMenuPanel").style.visibility = "collapse"
    }
}
function OnMouseEvent(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
        let panel = $("#ShopMenuPanel")
		if(panel){
			let cursorPos = GameUI.GetCursorPosition();
			let panelPos = panel.GetPositionWithinWindow();
			let width = Number(panel.actuallayoutwidth)
			let height = Number(panel.actuallayoutheight)
			if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
			{
				$("#ShopMenuPanel").style.visibility = "collapse"
			}
		}
    }
}
function ShowGemTooltip(n){
    const Panel = $("#GemsMainContainer_Panel").GetChild(n-1)
    if(Panel.BHasClass("Lock")) return
    const message = []
    message[1] = "tooltip_purple_gem_description"
    message[2] = "tooltip_blue_gem_description"
    message[3] = "tooltip_orange_gem_description"
    message[4] = "tooltip_red_gem_description"
    message[5] = "tooltip_green_gem_description"
    $.DispatchEvent( "DOTAShowTextTooltip", Panel, $.Localize("#"+message[n]));
}
function HideGemTooltip(){
    $.DispatchEvent( "DOTAHideTextTooltip");
}
function PlayCompletionSound(){
	Game.EmitSound("DOTA_Item.MagicLamp.Cast");
}
(()=>{
    BuildListOfItems(CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer()))
    CustomNetTables.SubscribeNetTableListener( "forge", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()){
            BuildListOfItems(data)
            RefreshUIOnItemUpgrade(data)
        }
    });
    PANEL.slider.SetPanelEvent("onvaluechanged", OnSliderValueChanged);
    DotaHUD.ListenToMouseEvent(OnMouseEvent);
    $("#ShopMenuPanel").style.visibility = "collapse"
    CreateOpenButton()
})()