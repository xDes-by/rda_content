
function UpdateDaily(data){
	$.Msg(data)
    if(!data){
        data = CustomNetTables.GetTableValue( "quests", Players.GetLocalPlayer());
        data = data.daily
    }
    const Panel = DotaHUD.Get().FindChildTraverse("DailyQuests_Panel")
    Panel.RemoveAndDeleteChildren()
    for(let i = 0; i < Object.keys(data).length; i++){
        const qData = data[i+1]
        const newPanel = $.CreatePanel("Panel", Panel, "", {})
        newPanel.BLoadLayout("file://{resources}/layout/custom_game/quests/tasksSnippet.xml", false, false)
		$.Msg(newPanel.GetChild(2))
        newPanel.GetChild(0).visible = false
        newPanel.GetChild(1).visible = false
        newPanel.GetChild(2).visible = false
        newPanel.GetChild(4).visible = false
        newPanel.GetChild(3).text = `${$.Localize("#DailyTaskDescription_"+qData['index'])} <font color='green'>${qData['now']}/${qData['count']}</font>`
        if(qData['now'] >= qData['count'] && qData['received'] == false){
            newPanel.GetChild(2).visible = true
            newPanel.GetChild(2).SetPanelEvent("onactivate", DailyRewardButton(qData['index']))
        }
        if(qData['received'] == true){
            newPanel.GetChild(1).visible = true
        }
        newPanel.GetChild(3).SetPanelEvent("onmouseover", ShowTooltip("DailyTitleTooltip", newPanel))
        newPanel.GetChild(3).SetPanelEvent("onmouseout", HideTooltip())
        newPanel.style.tooltipPosition = "left"
    }
}
function UpdateBp(data){
    if(!data){
        data = CustomNetTables.GetTableValue( "quests", Players.GetLocalPlayer());
        data = data.bp
    }
    const Panel = DotaHUD.Get().FindChildTraverse("BPQuests_Panel")
    Panel.RemoveAndDeleteChildren()
    for(let i = 0; i < Object.keys(data).length; i++){
        const qData = data[i+1]
        const newPanel = $.CreatePanel("Panel", Panel, "", {})
        newPanel.BLoadLayout("file://{resources}/layout/custom_game/quests/tasksSnippet.xml", false, false)
        newPanel.GetChild(0).visible = false
        newPanel.GetChild(1).visible = false
        newPanel.GetChild(2).visible = false
        newPanel.GetChild(4).visible = false
        if(qData['now'] >= qData['count'] && qData['received'] == false){
            newPanel.GetChild(2).visible = true
            newPanel.GetChild(2).SetPanelEvent("onactivate", BpRewardButton(qData['index']))
        }
        if(qData['received'] == true){
            newPanel.GetChild(1).visible = true
        }
        newPanel.GetChild(3).text = `${$.Localize("#BpTaskDescription_"+qData['index'])} <font color='OrangeRed'>${qData['now']}/${qData['count']}</font>`
        newPanel.GetChild(3).SetPanelEvent("onmouseover", ShowTooltip("battle_pass_task_description", newPanel))
        newPanel.GetChild(3).SetPanelEvent("onmouseout", HideTooltip())
        newPanel.style.tooltipPosition = "left"
    }
}
function BuildLine(table_name, key, data){
    const sid = GetUniverseSteamID32(Players.GetLocalPlayer())
    if(key != undefined && key != sid) return
    if(!data){
        data = CustomNetTables.GetTableValue( "player_info", sid);
    }
    UpdateMinimapNpcIcons(data[sid])
    UpdateMinimapOverlay(data[sid])
    const Panel = DotaHUD.Get().FindChildTraverse("MainQuests_Panel")
    Panel.RemoveAndDeleteChildren()
    for(let questType of ["main","bonus"]){
        var index = 1
        while(data[sid][questType][index]){
            if(data[sid][questType][index]['active'] == true){
                var taskNumber = 1
                while(data[sid][questType][index]['tasks'][taskNumber]){
                    if(data[sid][questType][index]['tasks'][taskNumber]['active'] == true){
                        const newPanel = $.CreatePanel("Panel", Panel, "", {})
                        newPanel.BLoadLayout("file://{resources}/layout/custom_game/quests/tasksSnippet.xml", false, false)
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
                            FullText += ` <font color='RoyalBlue'>`
                            if(data[sid][questType][index]['tasks'][taskNumber]['have'] >= data[sid][questType][index]['tasks'][taskNumber]['HowMuch']){
                                newPanel.GetChild(0).SetImage(`file://{resources}/images/custom_game/quest/znak4.png`)
                            }else{
                                newPanel.GetChild(0).SetImage(`file://{resources}/images/custom_game/quest/znak3.png`)
                            }
                        }
                        newPanel. GetChild(3).text = FullText + `${data[sid][questType][index]['tasks'][taskNumber]['have']}/${data[sid][questType][index]['tasks'][taskNumber]['HowMuch']}</font>`
                    }
                    taskNumber += 1
                }
            }
            index += 1
        }
    }
}

function FullBuild(){
    DotaHUD.Get().FindChildTraverse("TasksPanel").RemoveAndDeleteChildren()
    $.CreatePanel("Label", DotaHUD.Get().FindChildTraverse("TasksPanel"), "Main_Label", {text:$.Localize("#DailyMainLabel"), class:"DailyFont_Class"})
    BuildDaily()
    $.CreatePanel("Panel", DotaHUD.Get().FindChildTraverse("TasksPanel"), "", {class:"Line_Panel"})
    BuildQuestLine()
}

function GetUniverseSteamID32(PID)
{
    var steamID64 = Game.GetPlayerInfo(PID).player_steamid,
    steamIDPart = Number(steamID64.substring(3)),
    steamID32 = String(steamIDPart - 61197960265728);

    return steamID32;
}

function DailyRewardButton(index){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        GameEvents.SendCustomGameEventToServer("GetDailyAwardButton", { index : index})
    }
}
function BpRewardButton(index){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        Game.EmitSound("Quickbuy.Confirmation");
        GameEvents.SendCustomGameEventToServer("GetBpAwardButton", { index : index})
    }
}
function ShowTooltip(message, panel){
    return ()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", panel, $.Localize("#"+message));
    }
}
function HideTooltip(){
    return ()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    }
}

(function(){
    const createdPanel = $.CreatePanel("Panel", DotaHUD.Get().FindChildTraverse("HUDElements"), "", {style:"height:100%;width:100%;", hittest:false})
    createdPanel.BLoadLayout("file://{resources}/layout/custom_game/quests/tasks.xml", false, false)
    CustomNetTables.SubscribeNetTableListener( "player_info", BuildLine );
    CustomNetTables.SubscribeNetTableListener( "quests", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()){
            UpdateDaily(data.daily)
            UpdateBp(data.bp)
        }
    });
    DotaHUD.Get().FindChildTraverse("Main_Label").SetPanelEvent("onmouseover", ()=>{$.DispatchEvent( 'DOTAShowTextTooltip', DotaHUD.Get().FindChildTraverse("Main_Label"), $.Localize('#quest_title_description')); })
    DotaHUD.Get().FindChildTraverse("Main_Label").SetPanelEvent("onmouseout", ()=>{ $.DispatchEvent( "DOTAHideTextTooltip"); })
    UpdateDaily()
    UpdateBp()
})()