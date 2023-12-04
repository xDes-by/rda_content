function OpenButton(){
    Game.EmitSound("ui_rollover_today");
    const index = GetPortraitIndex();
    const data = FindDataByIndex(index)
    if(!data) return;
    UpdateIconParam(data)
    UpdateTalentIcons(data)
    ShowHeroScenePanel(index)
    UpdateExperience(data)
    HideControlPanel()
    CloseShop()
    UpdateSecondBranchButton(data);
    PANEL.arrow_right.visible = IsPortraitLocal()
    PANEL.cheat_mode_panel.visible = data.testing == true
    PANEL.button_cheat_drop.visible = (data.testing == true && IsPortraitLocal())
    PANEL.talant_root.SetHasClass("hidden", false)
}
function CloseButton(){
    Game.EmitSound("ui_rollover_today");
    PANEL.talant_root.SetHasClass("hidden", true)
    CloseShop()
}
function ClickTalant(arg){
    return ()=>{
        Game.EmitSound("ui_team_select_shuffle");
        const index = GetPortraitIndex()
        const data = FindDataByIndex(index)
        if(data == undefined) return
        const i = arg.substring(0, 3)
        const j = arg.substring(3)
        DisplayTalentInfo(data[arg], i, j)
    }
}
function DblClickTalant(arg){
    return ()=>{
        if(IsPortraitLocal()){
            const index = GetPortraitIndex()
            const data = FindDataByIndex(index)
            if(data.testing == true){
                const i = arg.substring(0, 3)
                const j = arg.substring(3)
                Game.EmitSound("ui_rollover_today");
                explore = {i:i, j:j}
                GameEvents.SendCustomGameEventToServer("TalentsExploreDblClick", {i:i, j:j})
            }
        }
    }
}
function RightClickTalant(arg){
    return ()=>{
        if(IsPortraitLocal()){
            const index = GetPortraitIndex()
            const data = FindDataByIndex(index)
            if(data.testing == true){
                const i = arg.substring(0, 3)
                const j = arg.substring(3)
                Game.EmitSound("ui_rollover_today");
                explore = {i:i, j:j}
                GameEvents.SendCustomGameEventToServer("TalentsExploreRightClick", {i:i, j:j})
            }
        }
    }
}
function FindDataByIndex(index){
    if(Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME){
        return CustomNetTables.GetTableValue( "talants" , Game.GetLocalPlayerID())
    }
    for(let pid = 0; pid <= 4; pid++){
        const data = CustomNetTables.GetTableValue( "talants" , pid);
        if(data != undefined && data.index == index){
            return data
        }
    }
}
function IsPortraitLocal(){
    return GetPortraitIndex() == Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
}
function GetPortraitIndex(){
    return Players.GetLocalPlayerPortraitUnit()
}
function IsShowUpdateButton(i, j){
    const arg = i+j
    const pan = PANEL.talant_root.FindChildTraverse(arg)
    const index = GetPortraitIndex()
    const data = FindDataByIndex(index)
    if(pan.selected && (pan.j > 5 || pan.i == "don" || data[arg].value >= 6)) return false;
    if((i == 'don' && data['freedonpoints'] < LevelNeed(i, j)) || (i != 'don' && data['freepoints'] < LevelNeed(i, j))) return false;
    if(i == 'don' && !data.patron) return false
    if(j == 12 && !pan.available) return false
    if(!((j != 6 && j != 7 && j != 8) || (data[i+6].value + data[i+7].value + data[i+8].value == 0))) return false;
    if(!((j != 9 && j != 10 && j != 11) || ((data[i+9].value + data[i+10].value + data[i+11].value == 0) && (data[i+6].value + data[i+7].value + data[i+8].value == 0 || ((j == 9 && data[i+6].value == 1) || (j == 10 && data[i+7].value == 1) || (j == 11 && data[i+8].value == 1)))))) return false;
    let tal1 = 0
    tal1 += data["int1"].value > 0 ? 1 : 0
    tal1 += data["agi1"].value > 0 ? 1 : 0
    tal1 += data["str1"].value > 0 ? 1 : 0
    if(i != "don" && (tal1 >= data["cout"] && data[i+1].value == 0)) return false;
    if(j == 13 && data[i+12].value == 0) return false;
    if(i != 'don' && data['freepoints'] <= 0) return false
    const mode = CustomNetTables.GetTableValue( "GameInfo", "mode")
    if(j >=12 && mode.name == "Easy") return false;
    if(j >= 13 && (mode.name == "Easy" || mode.name == "Normal")) return false;
    return true;
}
function CalculateLevelFromExperience(experience){
    const talents_experience = CustomNetTables.GetTableValue( "talants" , 'talents_experience')
    for(let i = 1; i <= LEVEL_MAX; i++){
        if(experience < talents_experience[i]){
            return i-1
        }
    }
    return LEVEL_MAX
}
function ColculateExperienceCounter(experience){
    const talents_experience = CustomNetTables.GetTableValue( "talants" , 'talents_experience')
    const level = CalculateLevelFromExperience(experience)
    if(level < LEVEL_MAX){
        let max = talents_experience[level+1] - talents_experience[level]
        let value = (talents_experience[level] - experience) * -1
        return `${value.toFixed(1)}/${max}`
    }
    let max = talents_experience[level] - talents_experience[level-1]
    return `${max}/${max}`
}
function ColculateProgressLinePercentage(experience){
    const talents_experience = CustomNetTables.GetTableValue( "talants" , 'talents_experience')
    const level = CalculateLevelFromExperience(experience)
    if(level < LEVEL_MAX){
        let max = talents_experience[level+1] - talents_experience[level]
        let value = (talents_experience[level] - experience) * -1
        return value / (max / 100)
    }
    return 100
}
function LevelNeed(cat, n){
    let levelNeed = 5
    if(n < 5 ){
        levelNeed = n
    }
    if(n == 6 || n == 7 || n == 8){
        levelNeed += 1
    }
    if(n == 9 || n == 10 || n == 11){
        levelNeed += 2
    }
    if(n == 12){
        levelNeed += 3
    }
    const index = GetPortraitIndex()
    const data = FindDataByIndex(index)
    let branch_count = 0
    for(let i = 1; i <= 5; i++){
        if(data[cat+i].value > 0){
            branch_count += 1
        }
    }
    if(data[cat+6].value || data[cat+7].value || data[cat+8].value){
        branch_count += 1
    }
    if(data[cat+9].value || data[cat+10].value || data[cat+11].value){
        branch_count += 1
    }
    if(data[cat+12].value == 1){
        branch_count += 1
    }
    if(data[cat+13].value == 1){
        branch_count += 1
    }
    return  levelNeed - branch_count
}
function RemoveAllTalents(){
    Game.EmitSound("ui_rollover_today");
    GameEvents.SendCustomGameEventToServer("TalentsRemoveAllCheat", {})
}
function UpdateTalentsTable(_, key, data){
    if(data.index == GetPortraitIndex()){
        UpdateIconParam(data)
        UpdateTalentIcons(data)
        UpdateExperience(data)
        UpdateRefreshCount(data)
        UpdateSecondBranchButton(data)
        if(Object.keys(explore).length > 0){
            const arg = explore.i + explore.j
            DisplayTalentInfo(data[arg], explore.i, explore.j)
            explore = {}
        }
    }
}
function UpdateSelectedUnit(){
    if(CustomNetTables.GetTableValue( "talants" , Game.GetLocalPlayerID()).index == undefined) return
    const index = Players.GetLocalPlayerPortraitUnit()
    const data = FindDataByIndex(index)
    DotaHUD.Get().FindChildTraverse('OpenTalentsButton').visible = data != undefined
}
function UpdateExperienceMultiplier(){
    const talent_multiplier_panel = $("#exp_boost_lavel_2")
    if(!talent_multiplier_panel) return;
    const data = CustomNetTables.GetTableValue( "GameInfo", Game.GetLocalPlayerID())
    talent_multiplier_panel.text = "x" + data.talent_multiplier.multiplier
    talent_multiplier_panel.visible = data.talent_multiplier.multiplier > 1
    let multiplier_text = ""
    for(let i in data.talent_multiplier.list){
        if(i > 1){
            multiplier_text += "<br>"
        }
        multiplier_text += $.Localize("#quest_multiplier_text")
        multiplier_text = multiplier_text.replace("##multiplier##", data.talent_multiplier.list[i].multiplier)
        multiplier_text = multiplier_text.replace("##games##", data.talent_multiplier.list[i].remaining_games_count)
    }
    talent_multiplier_panel.SetPanelEvent("onmouseover",()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", talent_multiplier_panel, multiplier_text);
    });
    talent_multiplier_panel.SetPanelEvent("onmouseout",()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    });
}
function ShopRefreshButton(){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        GameEvents.SendCustomGameEventToServer("TalentsShopRefresh", {})
        PANEL.store_container.GetChild(0).FindChildTraverse("item_use_button_panel").hittest = false
        $.Schedule(0.5, ()=>{
            PANEL.store_container.GetChild(0).FindChildTraverse("item_use_button_panel").hittest = true
        })
    }
}


(()=>{
    if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
        PANEL.talant_root.SetHasClass("hidden", true)
        const f = ()=>{
            if(CustomNetTables.GetTableValue( "talants" , Game.GetLocalPlayerID())){
                UpdateExperienceMultiplier()
                CreateOpenButton();
                CreateStore();
                CreateSecondBranch();
                CreateHeroScenePanels()
                CreateTalentIcons()
            }else $.Schedule(0.1, f)
        }
        f();
        CustomNetTables.SubscribeNetTableListener( "talants", UpdateTalentsTable );
        CustomNetTables.SubscribeNetTableListener( "GameInfo", UpdateExperienceMultiplier );
        PANEL.arrow_right.SetPanelEvent('onmouseactivate', OpenShop)
        PANEL.arrow_left.SetPanelEvent('onmouseactivate', CloseShop)
        PANEL.level_info_panel.SetPanelEvent('onmouseover', ShowHeroStateTooltip())
        PANEL.level_info_panel.SetPanelEvent('onmouseout', HideTooltip())
        GameEvents.Subscribe("dota_player_update_query_unit", UpdateSelectedUnit);
        GameEvents.Subscribe('dota_player_update_hero_selection', UpdateSelectedUnit);
        GameEvents.Subscribe('dota_player_update_selected_unit', UpdateSelectedUnit);
    }
    if(Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME || Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION){
        const f = ()=>{
            if(Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME){
                EditPregameStrategyTab()
                const data = CustomNetTables.GetTableValue( "talants" , Game.GetLocalPlayerID())
                if(data != undefined){
                    CreateTalentIcons()
                    UpdateIconParam(data)
                    UpdateTalentIcons(data)
                    PANEL.talent_level_label.text = $.Localize("#talents_strategy_level_label").replace("##1##", CalculateLevelFromExperience(data.totalexp)).replace("##2##", CalculateLevelFromExperience(data.totaldonexp))
                    PANEL.talant_root.SetHasClass("hidden", false)
                    PANEL.talant_root.SetParent(DotaHUD.Get().FindChildTraverse("StrategyTab"))
                    return
                }
            }
            $.Schedule(0.1, f)
        }
        f()
    }
})()