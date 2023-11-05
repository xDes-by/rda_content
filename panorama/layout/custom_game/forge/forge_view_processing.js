"use strict"
function DisableView(){
    PANEL.items_list.visible = false
    PANEL.item_information.visible = false
    PANEL.empty.visible = true
}
function EnableView(){
    PANEL.items_list.visible = true
    PANEL.item_information.visible = true
    PANEL.empty.visible = false
}
function HighlightSelectedItem(entindex){
    let found = false
    for(let i = 0; i < PANEL.items_list.GetChildCount(); i++){
        if(PANEL.items_list.GetChild(i).entindex == entindex){
            found = true
            PANEL.items_list.GetChild(i).SetHasClass("item_list_selected_glow", true)
        }else{
            PANEL.items_list.GetChild(i).SetHasClass("item_list_selected_glow", false)
        }
    }
    if(found == false){
        PANEL.items_list.GetChild(0).SetHasClass("item_list_selected_glow", true)
    }
}
function CreateListItem(data){
    // ------------ var ---------------
    const image_path = GetItemImagePath(data)
    const displayed_item_level = data.itemLevel < MAX_LEVEL ? data.itemLevel : "MAX"
    const displayed_item_name = $.Localize(`#dota_tooltip_ability_${data.itemname}`) + " LVL " + displayed_item_level
    // ------------ panel data ---------------
    const item_panel = $.CreatePanel("Panel", PANEL.items_list, "", {class:"itemListPanel"})
    item_panel.BLoadLayoutSnippet("UpgradeItemSnippet")
    item_panel.FindChildTraverse("ItemIcon").SetImage(image_path)
    item_panel.FindChildTraverse("ItemName").text = displayed_item_name
    item_panel.FindChildTraverse("GemBuff").text = GetGemBuffDescription(data)
    item_panel.entindex = data.entindex
    // ------------ return ---------------
    return item_panel
}
function BuildListOfItems(data){
    PANEL.items_list.RemoveAndDeleteChildren()
    for(var i in data){
        // ---------- create ------------------------
        const item_panel = CreateListItem(data[i])
        // ---------- panel event -------------------
        item_panel.SetPanelEvent("onactivate", OnItemSelected_Event(data[i]))
    }
    if(data != undefined && Object.keys(data).length > 0){
        HighlightSelectedItem(itemIndex)
        EnableView()
    }else{
        DisableView()
    }
}
function DisplayItemInfo(data){
    const image_path = GetItemImagePath(data)
    const current_item_level = data.itemLevel
    const next_item_level = data.itemLevel + 1

    PANEL.display_item_icon.SetImage(image_path)
    PANEL.display_item_current_level.text = `${current_item_level} LVL`
    PANEL.display_item_next_level.text = `${next_item_level} LVL`
    PANEL.display_gems_buff_text.text = GetGemBuffDescription(data)
}
function HideStonesAndLevel(){
    PANEL.button_levelup.SetHasClass("UpdateButtonTabSelected", false)
    PANEL.button_stones.SetHasClass("UpdateButtonTabSelected", false)
    PANEL.display_item_levelup.visible = false
    PANEL.display_item_stones.visible = false
}
function DisplayLevelSection(data){
    playerDisplayMode = "levelup"
    PANEL.button_levelup.SetHasClass("UpdateButtonTabSelected", true)
    $("#GoldCostNumber").text = data.gold_cost
    $("#PointBossIcon").itemname = data.soul_name
    $("#PointBossCostNumber").text = data.soul_cost
    PANEL.display_item_levelup.visible = true
}
function DisplayStonesSection(data){
    playerDisplayMode = "stones"
    PANEL.button_stones.SetHasClass("UpdateButtonTabSelected", true)
    PANEL.display_item_stones.visible = true
    UpdatePlayerGemCount()
    DisplayGemSelectionButtons(data)
    AdjustSliderAttributes(data)
}
function DisplayGemSelectionButtons(data){
    for(let i = 0; i < GEMS_AMOUNT; i++){
        PANEL.stone_buttons_panel.GetChild(i).GetChild(1).text = gems[i]
        PANEL.stone_buttons_panel.GetChild(i).GetChild(2).visible = !CheckGemSelectionButtonAvailability(data, i+1)
        PANEL.stone_buttons_panel.GetChild(i).SetHasClass("Lock", CheckGemSelectionButtonLock(data, i+1))
        PANEL.stone_buttons_panel.GetChild(i).SetHasClass("Active", DetermineGemChoiceButtonStatus(data, i+1))
    }
}
function UpdateSliderTextField(){
    PANEL.slider_text.text = `${Math.round(PANEL.slider.value)}/${PANEL.slider.max}`
}
function AdjustSliderAttributes(data){
    PANEL.slider.min = data.gemsNumber
    PANEL.slider.value = data.gemsNumber
    PANEL.slider.max = DeterminePlayerGemLimit(data)
    UpdateSliderTextField()
}
function UpdateBonusOnSliderChange(){
    if(RetrieveSelectedGem() > 0){
        const data = {
            gemType : RetrieveSelectedGem(),
            gemsNumber : PANEL.slider.value,
        }
        PANEL.display_gems_buff_text.text = GetGemBuffDescription(data)
    }
}