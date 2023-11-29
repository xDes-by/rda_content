const PANEL = {
    window : $("#window"),
    bosses_row : $("#bosses_row"),
}
function OnItemUse(t){
    const level = t.spawn_level
    DisplayPreparation(level)
    ShowWindow()
}
function DisplayPreparation(level){
    for(let i = 0; i < PANEL.bosses_row.GetChildCount(); i++){
        PANEL.bosses_row.GetChild(i).SetHasClass('unavailable', !(level >= i))
        PANEL.bosses_row.GetChild(i).SetHasClass('available', level >= i)
        PANEL.bosses_row.GetChild(i).hittest = level >= i
    }
}
function ShowWindow(){
    PANEL.window.style.opacity = "1";
    PANEL.window.style.transform = "translate3d(0px, 0px, 0px)";
    PANEL.window.style.preTransformScale2d = "1";
}
function HideWindow(){
    PANEL.window.style.opacity = "0";
    PANEL.window.style.transform = "translate3d(0px, 500px, 0px)";
    PANEL.window.style.preTransformScale2d = "0";
}
function Choice(index){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        GameEvents.SendCustomGameEventToServer("item_boss_summon_choice", {index : index})
        HideWindow()
    }
}
function init(){
    for(let i = 0; i < PANEL.bosses_row.GetChildCount(); i++){
        PANEL.bosses_row.GetChild(i).SetPanelEvent("onactivate", Choice(i))
    }
}
(()=>{
    init()
    HideWindow()
    GameEvents.Subscribe("item_boss_summon_panorama", OnItemUse);
})()