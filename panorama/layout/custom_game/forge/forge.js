var selectedItemName = ""
var gems = undefined
var viewMode = ""

function Openview(){
    const data = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer());
    if(selectedItemName != ""){
        for(let i in data){
            if(data[i].itemname == selectedItemName){
                UpdateUpgradeItemPanel(data[i])
                break
            }
        }
    }else if(data != undefined && Object.keys(data).length > 0){
        UpdateUpgradeItemPanel(data[1])
    }
}

function UpdateItemList(data){
    if(!data){
        data = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer());
    }
    $("#UpgradeItemPanel").RemoveAndDeleteChildren()
    $("#UpgradeInfoPanel").visible = false
    $("#StatusPanel").visible = true
    for(var i in data){
        $("#UpgradeInfoPanel").visible = true
        $("#StatusPanel").visible = false
        const new_panel = $.CreatePanel("Panel", $("#UpgradeItemPanel"), "", {class:"itemListPanel"})
        new_panel.BLoadLayoutSnippet("UpgradeItemSnippet")
        new_panel.FindChildTraverse("ItemIcon").itemname = data[i].itemname
        new_panel.FindChildTraverse("ItemName").text = $.Localize(`#dota_tooltip_ability_${data[i].itemname}`) 
        new_panel.SetPanelEvent("onmouseactivate", UpdateUpgradeItemPanel_Event(data[i]))
        const ItemIconPanel = new_panel.FindChildTraverse("ItemIcon")
        new_panel.FindChildTraverse("GemBuff").visible = false
        for(let i = 0; i < 5; i++){
            ItemIconPanel.GetChild(i).visible = false
        }
        if(data[i].gemType > 0){
            ItemIconPanel.GetChild(data[i].gemType-1).visible = true
            new_panel.FindChildTraverse("GemBuff").visible = false
        }
    }
}

function UpdateUpgradeTabPanel(item){
    viewMode = "upgrade"
    if(!item){
        const data = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer());
        for(let i in data){
            if(data[i].itemname == selectedItemName){
                item = data[i]
                break
            }
        }
    }
    $("#ExtensionsPanel").visible = false
    $("#UpgradeItemCostPanel").visible = true
    if(item.itemLevel >= 8){
        $("#UpgradeItemCostPanel").visible = false
        UpdateGemsTabPanel(item)
    }
}
function UpdateGemsTabPanel(item){
    if(selectedItemName == "") return
    if(!item){
        const data = CustomNetTables.GetTableValue( "forge", Players.GetLocalPlayer());
        for(let i in data){
            if(data[i].itemname == selectedItemName){
                item = data[i]
                break
            }
        }
    }
    if(item.itemLevel < 8){
        viewMode = "gems"
        $("#UpgradeItemCostPanel").visible = false
    }
    UpdateGems()
    $("#ExtensionsPanel").visible = true
    const GemsMainPanel =  $("#GemsMainContainer_Panel")
    for(let i = 0; i< 5; i++){
        GemsMainPanel.GetChild(i).GetChild(1).text = gems[i]
        GemsMainPanel.GetChild(i).GetChild(2).visible = true
        GemsMainPanel.GetChild(i).SetHasClass("Lock", true)
        if(item.gemType == 0 || item.gemType == i+1){
            GemsMainPanel.GetChild(i).GetChild(2).visible = false
            GemsMainPanel.GetChild(i).SetHasClass("Lock", false)
        }
    }
    let max_gems = item.max_gems
    // if(item.gemType > 0 && max_gems > item.gemsNumber + gems[i]){
    //     max_gems = item.gemsNumber + gems[i]
    // }
    $("#GemUpdateAmount").text = `${item.gemsNumber}/${max_gems}`
    const sliderPanel = $("#InsertingStonesSlider")
    sliderPanel.min = Number(item['gemsNumber'])
    sliderPanel.value = Number(item['gemsNumber'])
    sliderPanel.max = max_gems
    sliderPanel.SetPanelEvent("onvaluechanged", OnSliderValueChanged);
}


const UpdateUpgradeItemPanel_Event = (data)=>{
    return ()=>{
        UpdateUpgradeItemPanel(data)
    }
}
function UpdateUpgradeItemPanel(t){
    selectedItemName = t.itemname
    $("#ItemIconNew").itemname = t.itemname
    $("#OldLevelItem").text = `${t.itemLevel} lvl`
    $("#NewLevelItem").text = `${t.itemLevel+1} lvl`
    $("#GoldCostNumber").text = t.gold
    $("#PointBossIcon").itemname = t.soul
    if(viewMode == "gems"){
        UpdateGemsTabPanel(t)
    }else{
        UpdateUpgradeTabPanel(t)
    }
    const ItemIconPanel = $("#ItemIconNew")
    $("#GemBuffDescription").visible = false
    for(let i = 0; i < 5; i++){
        ItemIconPanel.GetChild(i).visible = false
    }
    if(t.gemType > 0){
        ItemIconPanel.GetChild(t.gemType-1).visible = true
        $("#GemBuffDescription").visible = true
    }
}

function PressUpdgradeButton(){
    if(viewMode == "upgrade"){
        GameEvents.SendCustomGameEventToServer("UpdgradeButton", { itemname : selectedItemName})
    }else if(viewMode == "gems"){
        var gemType = 0
        const panel = $("#GemsMainContainer_Panel")
        for(let i = 0; i < 5; i++){
            if(panel.GetChild(i).BHasClass("Active")){
                gemType = i+1
                break
            }
        }
        const FieldPanel = $("#GemUpdateAmount")
        const arr = FieldPanel.text.split("/")
        GameEvents.SendCustomGameEventToServer("UpdgradeGemsButton", { 
            itemname : selectedItemName,
            gemType : gemType,
            gemsNumber : arr[0],
        })
    }
}

function OpenButton(){
    if($("#ShopMenuPanel").style.visibility == "collapse"){
        Openview()
        $("#ShopMenuPanel").style.visibility = "visible"
    }else{
        $("#ShopMenuPanel").style.visibility = "collapse"
    }
}

function UpdateGems(){
    const gemsInfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer());
    gems = [
        gemsInfo['purple_gem'],
        gemsInfo['blue_gem'],
        gemsInfo['orange_gem'],
        gemsInfo['red_gem'],
        gemsInfo['green_gem'],
    ]
}

function OnUpadteForge(_, key, data){
    if(key == Players.GetLocalPlayer()){
        UpdateGems()
		UpdateItemList(data)
        for(let i in data){
            if(data[i].itemname == selectedItemName){
                UpdateUpgradeItemPanel(data[i])
                break
            }
        }
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

function GemButton(n){
    const mainPanel = $("#GemsMainContainer_Panel")
    const active = n > 0 && mainPanel.GetChild(n-1).BHasClass("Active");
    if(n > 0 && mainPanel.GetChild(n-1).BHasClass("Lock")) return
    for(let i = 0; i < 5; i++){
        mainPanel.GetChild(i).SetHasClass("Active", false);
    }
    if(n > 0){
        mainPanel.GetChild(n-1).SetHasClass("Active", true);
    }
}

function OnSliderValueChanged(){
    const sliderPanel = $("#InsertingStonesSlider")
    UpdateSliderTextField()
}

function UpdateSliderTextField(max_gems){
    const FieldPanel = $("#GemUpdateAmount")
    const SliderPanel = $("#InsertingStonesSlider")
    if(!max_gems){
        const arr = FieldPanel.text.split("/")
        max_gems = arr[1]
    }
    
    FieldPanel.text = `${Math.round(SliderPanel.value)}/${max_gems}`

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

function CreateOpenButton(){
    const ShopPanel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("shop_launcher_block")
    const CustomButton = ShopPanel.FindChildTraverse("CustomButton")
    if(CustomButton == null){
        const NewButtonPanel = $.CreatePanel("Panel", ShopPanel, "CustomButton")
        NewButtonPanel.BLoadLayout("file://{resources}/layout/custom_game/forge/forge_button.xml", false, false)
        NewButtonPanel.style.align = "right bottom"
        NewButtonPanel.style.margin = "5px"
        NewButtonPanel.SetPanelEvent("onactivate", OpenButton)
    }else{
        CustomButton.SetPanelEvent("onactivate", OpenButton)
    }
}

(()=>{
    UpdateItemList()
    var DotaHUD = GameUI.CustomUIConfig().DotaHUD;
    DotaHUD.ListenToMouseEvent(OnMouseEvent);
    CustomNetTables.SubscribeNetTableListener( "forge", OnUpadteForge );
    $("#ShopMenuPanel").style.visibility = "collapse"
    CreateOpenButton()
})()

