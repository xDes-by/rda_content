const PANEL = {
    window : $("#window"),
    bosses_row : $("#bosses_row"),
}
function OnItemUse(t){
    const level = t.spawn_level
    ShowWindow()
    DisplayPreparation(level)
}
function DisplayPreparation(level){
    for(let i = 0; i < PANEL.bosses_row.GetChildCount(); i++){
        PANEL.bosses_row.GetChild(i).SetHasClass('unavailable', !(level >= i))
        PANEL.bosses_row.GetChild(i).SetHasClass('available', level >= i)
        PANEL.bosses_row.GetChild(i).SetPanelEvent("onactivate", Choice(i))
        PANEL.bosses_row.GetChild(i).hittest = level >= i
    }
}
function ShowWindow(){
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_furion"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_pudge"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_earth_spirit"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_nyx_assassin"})
    $.CreatePanel("MoviePanel", PANEL.bosses_row, "", {class:"boss_image",src:"s2r://panorama/videos/npc_cemetery_boss.webm",repeat:true,autoplay:"onload"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_venomancer"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_tiny"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_snapfire"})
    $.CreatePanel("DOTAHeroMovie", PANEL.bosses_row, "", {class:"boss_image",heroname:"npc_dota_hero_doom_bringer"})
    PANEL.window.style.opacity = "1";
    PANEL.window.style.transform = "translate3d(0px, 0px, 0px)";
    PANEL.window.style.preTransformScale2d = "1";
}
function HideWindow(){
    PANEL.window.style.opacity = "0";
    PANEL.window.style.transform = "translate3d(0px, 500px, 0px)";
    PANEL.window.style.preTransformScale2d = "0";
    PANEL.bosses_row.RemoveAndDeleteChildren() 
}
function Choice(index){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        GameEvents.SendCustomGameEventToServer("item_boss_summon_choice", {index : index})
        HideWindow()
    }
}   
(()=>{
    HideWindow() 
    GameEvents.Subscribe("item_boss_summon_panorama", OnItemUse);
})()