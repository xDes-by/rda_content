function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}
function ClickButton() {
	Game.EmitSound("General.ButtonClick");
}
function ChangeGold(amount){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelChangeGold", { amount : amount })
}
function DropItems(level){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelDropItems", { level : level })
}
function GiveSouls(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelGiveSouls", {  })
}
function GiveBooks(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelGiveBooks", {  })
}
function Talents(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelTalents", {  })
}
function TalentsDrop(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelTalentsDrop", {  })
}
function ChangeLevel(amount){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelHeroLevel", { amount : amount })
}
function ChangeGems(amount){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelChangeGems", { amount : amount })
}
function BattlePassAddExperience(amount){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelBattlePassAddExperience", { amount : amount })
}
function BattlePassDrop(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelBattlePassDrop", {})
}
function BattlePassPremium(){
    ClickButton()
    GameEvents.SendCustomGameEventToServer("AdminPanelBattlePassPremium", {})
}

(()=>{
    const topBar = FindDotaHudElement("ButtonBar")
    var admin_button_layout = FindDotaHudElement("admin_button_layout")
    if(!admin_button_layout && topBar){
        admin_button_layout = $.CreatePanel('Panel', topBar, 'admin_button_layout')
        admin_button_layout.BLoadLayout("file://{resources}/layout/custom_game/admin/admin_button.xml", false, false)
    }
    if(admin_button_layout){
        admin_button_layout.SetPanelEvent("onmouseactivate", ()=>{
            if($("#main_panel").visible == false){
                $("#main_panel").visible = true
            }else{
                $("#main_panel").visible = false
            }
        })
        admin_button_layout.SetPanelEvent("onmouseover",()=>{$.DispatchEvent( "DOTAShowTextTooltip", admin_button_layout, $.Localize("#cheat_button_tooltip"))});
        admin_button_layout.SetPanelEvent("onmouseout",()=>{$.DispatchEvent( "DOTAHideTextTooltip");});
        admin_button_layout.style.tooltipPosition = 'bottom';
    }
    $("#main_panel").visible = false
})()


const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
function OnMouseEvent(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
		const Panel = $("#main_panel")
		if(Panel){
			let cursorPos = GameUI.GetCursorPosition();
			let panelPos = Panel.GetPositionWithinWindow();
			let width = Number(Panel.actuallayoutwidth)
			let height = Number(Panel.actuallayoutheight)
			if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
			{
                if($("#main_panel").visible == true){
                    $("#main_panel").visible = false
                }
			}
		}
    }
}

DotaHUD.ListenToMouseEvent(OnMouseEvent);