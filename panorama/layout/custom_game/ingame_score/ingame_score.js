const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
DotaHUD.Get().FindChildTraverse("TopBarDireTeam").visible = false
DotaHUD.Get().FindChildTraverse("TopBarRadiantScore").visible = false
DotaHUD.Get().FindChildTraverse("TopBarRadiantTeam").GetChild(0).style.width = "300px"
$("#score_panel").SetParent(DotaHUD.Get().FindChildTraverse("TopBarDireTeamContainer"));

var for_victory = 0
var reliable = 0
var mode_name = ""
var scale = 0
var player_mmr = 0

const winning = CustomNetTables.GetTableValue( "GameInfo", "winning")
const mode = CustomNetTables.GetTableValue( "GameInfo", "mode")
const local_player = CustomNetTables.GetTableValue( "GameInfo", Game.GetLocalPlayerID())

if(winning != undefined){
    for_victory = winning["for_victory"] || 0
    reliable = winning["reliable"] || 0
}
if(mode != undefined){
    mode_name = mode["name"] || ""
    scale = mode["scale"] || 1
}
if(local_player != undefined){
    player_mmr = local_player["mmr"] || ""
}
function UpdateScore(){
    DotaHUD.Get().FindChildTraverse("information_block_first").GetChild(0).text = for_victory
    DotaHUD.Get().FindChildTraverse("information_block_second").GetChild(0).text = reliable > 0 ? reliable : -25 * scale
    DotaHUD.Get().FindChildTraverse("information_block_difficulty").GetChild(0).text = mode_name
    DotaHUD.Get().FindChildTraverse("local_player_mmr").text = Number(player_mmr) + Number(for_victory)
    if(Number(for_victory) > 0){
        DotaHUD.Get().FindChildTraverse("rating_arrowup").visible = true
    }else{
        DotaHUD.Get().FindChildTraverse("rating_arrowup").visible = false
    }
}
UpdateScore()
function NetTableListener(table_name, key, data){
    if(key == "mode"){
        mode_name = data["name"] || ""
        scale = data["scale"] || 1
    }
    if(key == "winning"){
        for_victory = data["for_victory"] || 0
        reliable = data["reliable"] || 0
    }
    if(key == Game.GetLocalPlayerID()){
        player_mmr = data["mmr"] || ""
    }
    UpdateScore()
}

CustomNetTables.SubscribeNetTableListener( "GameInfo", NetTableListener);