
function BuildDaily(table_name, key, data){
    if(key != undefined && key != Players.GetLocalPlayer()) return
    if(!data){
        data = CustomNetTables.GetTableValue( "Daily", Players.GetLocalPlayer());
    }
    const Panel = $("#DailyQuests_Panel")
    Panel.RemoveAndDeleteChildren()
    for(let i = 0; i < 3; i++){
        const newPanel = $.CreatePanel("Panel", Panel, "", {})
        newPanel.BLoadLayoutSnippet("TaskSnippet")
        newPanel.GetChild(0).visible = false
        newPanel.GetChild(1).visible = false
        newPanel.GetChild(2).visible = false
        newPanel.GetChild(4).visible = false
        newPanel.GetChild(3).text = `${$.Localize("#DailyTaskDescription_"+data[i+1]['index'])} <font color='green'>${data[i+1]['now']}/${data[i+1]['count']}</font>`
    }
}

function BuildLine(table_name, key, data){
    const sid = GetUniverseSteamID32(Players.GetLocalPlayer())
    if(key != undefined && key != sid) return
    if(!data){
        data = CustomNetTables.GetTableValue( "player_info", sid);
    }
    const Panel = $("#MainQuests_Panel")
    Panel.RemoveAndDeleteChildren()
    for(let questType of ["main","bonus"]){
        var index = 1
        while(data[sid][questType][index]){
            if(data[sid][questType][index]['active'] == true){
                var taskNumber = 1
                while(data[sid][questType][index]['tasks'][taskNumber]){
                    if(data[sid][questType][index]['tasks'][taskNumber]['active'] == true){
                        const newPanel = $.CreatePanel("Panel", Panel, "", {})
                        newPanel.BLoadLayoutSnippet("TaskSnippet")
                        newPanel.GetChild(1).visible = false
                        newPanel.GetChild(2).visible = false
                        newPanel.GetChild(4).visible = false
                        var FullText = $.Localize(`#${data[sid][questType][index]['tasks'][taskNumber]['TextName']}`)
                        if(questType == "main"){
                            FullText += ` <font color='gold'>`
                            if(data[sid][questType][index]['tasks'][taskNumber]['have'] >= data[sid][questType][index]['tasks'][taskNumber]['HowMuch']){
                                newPanel.GetChild(0).SetImage(`file://{resources}/images/custom_game/quest/znak2.png`)
                            }else{
                                newPanel.GetChild(0).SetImage(`file://{resources}/images/custom_game/quest/znak1.png`)
                            }
                        }else if(questType == "bonus"){
                            FullText += ` <font color='blue'>`
                            if(data[sid][questType][index]['tasks'][taskNumber]['have'] >= data[sid][questType][index]['tasks'][taskNumber]['HowMuch']){
                                newPanel.GetChild(0).SetImage(`file://{resources}/images/custom_game/quest/znak4.png`)
                            }else{
                                newPanel.GetChild(0).SetImage(`file://{resources}/images/custom_game/quest/znak3.png`)
                            }
                        }
                        newPanel.GetChild(3).text = FullText + `${data[sid][questType][index]['tasks'][taskNumber]['have']}/${data[sid][questType][index]['tasks'][taskNumber]['HowMuch']}</font>`
                    }
                    taskNumber += 1
                }
            }
            index += 1
        }
    }
}

function FullBuild(){
    $("#MainPanel").RemoveAndDeleteChildren()
    $.CreatePanel("Label", $("#MainPanel"), "Main_Label", {text:$.Localize("#DailyMainLabel"), class:"DailyFont_Class"})
    BuildDaily()
    $.CreatePanel("Panel", $("#MainPanel"), "", {class:"Line_Panel"})
    BuildQuestLine()
}

function GetUniverseSteamID32(PID)
{
    var steamID64 = Game.GetPlayerInfo(PID).player_steamid,
    steamIDPart = Number(steamID64.substring(3)),
    steamID32 = String(steamIDPart - 61197960265728);

    return steamID32;
}

(function(){
    CustomNetTables.SubscribeNetTableListener( "player_info", BuildLine );
    CustomNetTables.SubscribeNetTableListener( "Daily", BuildDaily );
    $("#Main_Label").SetPanelEvent("onmouseover", ()=>{$.DispatchEvent( 'DOTAShowTextTooltip', $("#Main_Label"), $.Localize('#DailyTitleTooltip')); })
    $("#Main_Label").SetPanelEvent("onmouseout", ()=>{ $.DispatchEvent( "DOTAHideTextTooltip"); })
})()