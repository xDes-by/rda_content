const OnMouseOverHeroVotePanel = (panel)=>{
    return ()=>{
        panel.GetChild(1).SetHasClass("hidden", false)
    }
}
const OnMouseOutHeroVotePanel = (panel)=>{
    return ()=>{
        panel.GetChild(1).SetHasClass("hidden", true)
    }
}
const OnMouseActivateVoteButton = (hero_name, premium)=>{
    return ()=>{
        if(premium == 0) {
            DotaHUD.ShowError("#battle_pass_error_vote");
            return
        }
        ClickButton()
        GameEvents.SendCustomGameEventToServer("BattlePassHeroVote", {hero_name : hero_name})
    }
}
function UpdateHeroVotePanel(panel, name, premium, vote){
    panel.GetChild(0).SetHasClass("voteing_selected", (vote == name))
    panel.GetChild(1).GetChild(0).SetHasClass("hidden", !(premium == 1))
    panel.GetChild(1).GetChild(1).SetHasClass("hidden", !(premium == 0))
    panel.GetChild(2).text = voting_heroes_percentage[name] + "%"
    panel.GetChild(1).SetPanelEvent("onactivate", OnMouseActivateVoteButton(name, premium))
}
function CreateHeroVotePanel(name, premium, vote){
    const panel = $.CreatePanel("Panel", PANEL_BP.hero_selection_panel, "")
    panel.BLoadLayoutSnippet("hero_panel")
    panel.GetChild(0).heroname = name
    panel.GetChild(1).SetHasClass("hidden", true)
    panel.SetPanelEvent("onmouseover", OnMouseOverHeroVotePanel(panel))
    panel.SetPanelEvent("onmouseout", OnMouseOutHeroVotePanel(panel))
    UpdateHeroVotePanel(panel, name, premium, vote)
}
function CreateHeroVotePanels(){
    PANEL_BP.hero_selection_panel.RemoveAndDeleteChildren()
    ColculateVoteingPercantage();
    const data = CustomNetTables.GetTableValue( "BattlePass", Players.GetLocalPlayer())
    for(let name in voting_heroes_list){
        const panel = CreateHeroVotePanel(name, data.premium, data.vote)
    }
}
function ColculateVoteingPercantage(){
    let sum = 0
    for(let i in voting_heroes_list){
        $.Msg(voting_heroes_list[i])
        sum += voting_heroes_list[i];
    }
    for(let name in voting_heroes_list){
        if(sum == 0){
            voting_heroes_percentage[name] = 0
            continue
        }
        voting_heroes_percentage[name] = Math.ceil(voting_heroes_list[name] / (sum/100))
    }
}
function UpdateHeroVotePanels(data){
    ColculateVoteingPercantage();
    let i = 0
    for(let name in voting_heroes_list){
        UpdateHeroVotePanel(PANEL_BP.hero_selection_panel.GetChild(i), name, data.premium, data.vote)
        i += 1;
    }
}