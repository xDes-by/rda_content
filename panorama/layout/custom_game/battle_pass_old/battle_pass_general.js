function OpenBattlePassWindow(){
    const Panel = $("#GameBPPanel")
    if(Panel.isOpen){
        Panel.isOpen = false
        Panel.style.opacity = "0";
        Panel.style.transform = "translate3d(0px, 300px, 0px)";
        Panel.style.preTransformScale2d = "0.8";
    }else{
        Panel.isOpen = true
        Panel.style.opacity = "1";
        Panel.style.transform = "translate3d(0px, 0px, 0px)";
        Panel.style.preTransformScale2d = "1";
    }
}
function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}
(()=>{
    const topBar = FindDotaHudElement("ButtonBar")
    if(topBar){
        let pan = $.CreatePanel('Panel', topBar, '')
        pan.BLoadLayout("file://{resources}/layout/custom_game/battle_pass/battle_pass_button.xml", false, false)
        pan.SetPanelEvent("onmouseactivate",()=>{
            Game.EmitSound("General.ButtonClick");
            OpenBattlePassWindow()
        });
        pan.SetPanelEvent("onmouseover",()=>{$.DispatchEvent( "DOTAShowTextTooltip", pan, $.Localize("#bp_button"))});
        pan.SetPanelEvent("onmouseout",()=>{$.DispatchEvent( "DOTAHideTextTooltip");});
        pan.style.tooltipPosition = 'bottom';
    }
    $("#GameBPPanel").isOpen = false
})()


var DotaHUD = GameUI.CustomUIConfig().DotaHUD;


function OnMouseEvent(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
		const Panel = $("#GameBPPanel")
		if(Panel){
			let cursorPos = GameUI.GetCursorPosition();
			let panelPos = Panel.GetPositionWithinWindow();
			let width = Number(Panel.actuallayoutwidth)
			let height = Number(Panel.actuallayoutheight)
			if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
			{
                Panel.isOpen = true
				OpenBattlePassWindow()
			}
		}
    }
}

DotaHUD.ListenToMouseEvent(OnMouseEvent);