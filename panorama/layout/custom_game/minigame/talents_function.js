const blue_line_panel = $("#blue_line_panel");
const red_line_panel = $("#red_line_panel");
const LevelContainer = $("#LevelContainer");
function DisplayCurrentExp(level, totalexp){
    let text, next_lvl, lvlup, intnow, percent
    if(EXPERIENCE_FOR_LEVELS[level+1]){
        var this_lvl = 0
        for(var i = 1; i <= level;i++){
            this_lvl = this_lvl + EXPERIENCE_FOR_LEVELS[i];
        }
        next_lvl = this_lvl + EXPERIENCE_FOR_LEVELS[level + 1];
        lvlup = EXPERIENCE_FOR_LEVELS[level+1];
        intnow = next_lvl - totalexp;
        intnow = lvlup - intnow;
        percent = ( intnow / lvlup ) * 100;
        percent = parseFloat(Math.ceil( percent * 10 ) / 10).toFixed(1)
        text = (Math.ceil( Number(intnow) * 10 ) / 10).toFixed(1) + " / " + lvlup;
    }else{
        percent = 100;
        text = EXPERIENCE_FOR_LEVELS[level] + " / " + EXPERIENCE_FOR_LEVELS[level];
    }
    return [text, percent]
}

function talantsUpdate(table_name, key, data){
    if(key != Players.GetLocalPlayer() && EXPERIENCE_FOR_LEVELS) return;
    $.Msg(data["totalexp"])
    LevelContainer.GetChild(0).text = "LEVEL " + data["level"]
    LevelContainer.GetChild(1).text = "LEVEL " + data["donlevel"]

    const normal = DisplayCurrentExp(Number(data["level"]), Number(data["totalexp"]));
    blue_line_panel.GetChild(2).text = normal[0]
    blue_line_panel.GetChild(0).style.width = normal[1] + "%"
    blue_line_panel.GetChild(1).style.width = normal[1] + "%"
    blue_line_panel.GetChild(3).text = Math.ceil(Number(data["gave_exp"]));

    const donate = DisplayCurrentExp(Number(data["donlevel"]), Number(data["totaldonexp"]));
    red_line_panel.GetChild(2).text = donate[0]
    red_line_panel.GetChild(0).style.width = donate[1] + "%"
    red_line_panel.GetChild(1).style.width = donate[1] + "%"
    red_line_panel.GetChild(3).text = Math.ceil(Number(data["gave_exp"]));
    
    const PlayerID = Players.GetLocalPlayer()
    const HeroIndex = Players.GetPlayerHeroEntityIndex( PlayerID )
    const UnitName = Entities.GetUnitName( HeroIndex )
    $("#heroIcon").heroname = UnitName
}   
(()=>{
    CustomNetTables.SubscribeNetTableListener( "talants", talantsUpdate );
})()