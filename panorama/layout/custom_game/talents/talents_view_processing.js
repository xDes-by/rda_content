function ShowHeroStateTooltip(){
    return ()=>{
        const index = GetPortraitIndex();
        const data = FindDataByIndex(index);
        const text = `
            ${$.Localize("#talant_normal_exp_label")}: ${data.totalexp}<br>
            ${$.Localize("#talant_don_exp_label")}: ${data.totaldonexp}<br>
            ${$.Localize("#talant_game_cout_label")}: ${data.gamecout}<br>
            ${$.Localize("#talant_game_time_label")}: ${Math.ceil(data.gametime/60)}<br>
            ${$.Localize("#talant_reincarnation_label")}: ${data.reincarnation}
        ` 
        $.DispatchEvent( "DOTAShowTextTooltip", PANEL.level_info_panel, text);
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
function ShowMoneyTooltip(panel, currency){
    return ()=>{
        const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer());
        let message = ""
        if(currency == 'rp'){
            message = $.Localize("#talents_rp_tooltip").replace("##count##", shopinfo.mmrpoints)
        }
        if(currency == 'don'){
            message = $.Localize("#talents_don_tooltip").replace("##count##", shopinfo.coins)
        }
        $.DispatchEvent( "DOTAShowTextTooltip", panel, message);
    }
}
function CreateTalentIcon(arg){
    const panel = $.CreatePanel("Panel", PANEL.talant_tree_images_panel, arg)
    for(var class_name of classes[arg]){
        panel.SetHasClass(class_name, true)
    }
    panel.SetPanelEvent("onmouseover",OnMouseOverTalentCircle(arg));
    panel.SetPanelEvent("onmouseout",OnMouseOutTalentCircle(arg));
    if(Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
        panel.SetPanelEvent("onmouseactivate",ClickTalant(arg));
        panel.SetPanelEvent("ondblclick", DblClickTalant(arg));
        panel.SetPanelEvent("oncontextmenu", RightClickTalant(arg));
    }
    $.CreatePanel("Image", panel, "img"+arg);
    $.CreatePanel("Label", panel,"Level_Label", {text:"", class:"talentTreeIconLevel_Label"})
    return panel
}
function CreateTalentIcons(){
    PANEL.talant_tree_images_panel.RemoveAndDeleteChildren()
    for(var i of ["str","agi","int","don"]){
        for(var j = 1; j <= 13; j++){
            const panel = CreateTalentIcon(i + j);
            panel.SetHasClass(classes[i][0], true);
            panel.i = i;
            panel.j = j;
        }
    }
}
function CreateHeroScenePanels(){
    for(let pid = 0; pid <= 4; pid++){
        const data = CustomNetTables.GetTableValue( "talants", pid )
        if(data != undefined && $("#"+data.hero_name) == undefined){
            const panel = $.CreatePanel("DOTAScenePanel", PANEL.talant_root, data.hero_name, {class:"HeroScenePanel", style:"width:800px;height:800px;margin-right:10px;", unit:data.hero_name, particleonly:false, allowrotation:true})
        }
    }
}
var OnMouseOverTalentCircle = (function(arg)
{
	return function()
	{
        Game.EmitSound("ui_select_arrow")
        var pan = PANEL.talant_root.FindChildTraverse(arg);
        if(pan.available || pan.selected){
            pan.RemoveClass("selected");
            pan.AddClass("brightness25");
        }else{
            pan.AddClass("brightness5");
        }
        const index = GetPortraitIndex();
        const data = FindDataByIndex(index);
        const i = arg.substring(0, 3)
        const j = arg.substring(3)
        var message = TalentDescriptionString(data[arg], i, j)
        $.DispatchEvent( "DOTAShowTextTooltip", pan, $.Localize(message));
	}
});
var OnMouseOutTalentCircle = (function(arg)
{
	return function()
	{
        var pan = PANEL.talant_root.FindChildTraverse(arg);
        pan.RemoveClass("brightness15");
        pan.RemoveClass("brightness5");
        pan.RemoveClass("brightness25");
        if(pan.selected){
            pan.AddClass("selected");
        }
        $.DispatchEvent( "DOTAHideTextTooltip");
	}
});
function ShowHeroScenePanel(index){
    for(let pid = 0; pid <= 4; pid++){
        const data = CustomNetTables.GetTableValue( "talants" , pid);
        if(data != undefined){
            const panel = PANEL.talant_root.FindChildTraverse(data.hero_name)
            if(panel){
                panel.visible = data.index == index
            }
        }
    }
}
function CreateOpenButton(){
    DotaHUD.Get().FindChildTraverse('StatBranch').visible = false
    DotaHUD.Get().FindChildTraverse('level_stats_frame').visible = false
    DotaHUD.Get().FindChildTraverse('AghsStatusContainer').visible = false
    const tree = DotaHUD.Get().FindChildTraverse('StatBranch').GetParent()
    tree.style.marginRight = "60px";
    let panel = DotaHUD.Get().FindChildTraverse('OpenTalentsButton')
    if(panel == undefined){
        panel = $.CreatePanel('Button',tree.GetParent(),'OpenTalentsButton')
        panel.BLoadLayout("file://{resources}layout/custom_game/talents/talents_button.xml", false, false)
    }
    panel.FindChildTraverse("icon_bg").SetPanelEvent("onmouseactivate",OpenButton);
}
function ShowControlPanel(){
    PANEL.talant_img_description.visible = true
    PANEL.talant_name_label.visible = true
    PANEL.talant_description_buff_label.visible = true
    PANEL.players_have.visible = true
}
function HideControlPanel(){
    PANEL.talant_img_description.visible = false
    PANEL.talant_name_label.visible = false
    PANEL.talant_description_buff_label.visible = false
    PANEL.button.visible = false
    PANEL.talant_description_label.visible = false
    PANEL.players_have.visible = false
    PANEL.talant_description_scale_label.visible = false
    PANEL.InfoIcon.visible = false
}
function InfoTooltip(name){
    if($.Localize(`#${name}_tooltip`) != `#${name}_tooltip`){
        PANEL.InfoIcon.SetPanelEvent("onmouseover",()=>{
            $.DispatchEvent( "DOTAShowTextTooltip", PANEL.InfoIcon, $.Localize(`#${name}_tooltip`));
        });
        PANEL.InfoIcon.SetPanelEvent("onmouseout",()=>{
            $.DispatchEvent( "DOTAHideTitleTextTooltip");
            $.DispatchEvent( "DOTAHideTextTooltip");
        });
        return true
    }
    return false
}
function TalentLevelScale(data, i, j){
    if(i != 'don' && j < 6){
        let updateValuesText = ""
        for(let f = 0; f < 6; f++){
            if(data.value == f+1){
                updateValuesText += `<font color='red'>${EnhancedTalentValues[i+j][f]}</font>`
            }else{
                updateValuesText += EnhancedTalentValues[i+j][f]
            } 
            if(f < 5){
                updateValuesText += "/"
            }
        }
        PANEL.talant_description_scale_label.text = updateValuesText
        return true
    }
    return false
}
function TalentLevel30Lable(j){
    if(j == 12){
        PANEL.talant_description_label.text = $.Localize("#tooltip_talant_30_level")
        return true
    }
    if(j == 13){
        PANEL.talant_description_label.text = $.Localize("#tooltip_talant_50_level")
        return true
    }
    return false
}
function TalentDescriptionString(data, i, j){
    const mode = CustomNetTables.GetTableValue( "GameInfo", "mode")
    if(j >= 12 && mode.name == "Easy"){
        return $.Localize(`#${data.name}_description`) + $.Localize("#talents_unavailible_turbo");
    }
    if(j >= 13 && mode.name == "Normal"){
        return $.Localize(`#${data.name}_description`) + $.Localize("#talents_unavailible_normal");
    }
    if(j >= 13 && mode.name == "Hard"){
        return $.Localize(`#${data.name}_description`) + $.Localize("#talents_unavailible_hard");
    }
    if(i != 'don'){
        return $.Localize(`#${data.name}_description`);
    }
    const index = GetPortraitIndex()
    const d = FindDataByIndex(index)
    if(d.patron || !IsPortraitLocal()){
        return $.Localize(`#${data.name}_description`);
    }
    return $.Localize(`#${data.name}_description`) + $.Localize("#talents_only_patron");
}
function DisplayTalentInfo(data, i, j){
    ShowControlPanel()
    CloseShop()
    PANEL.talant_img_description.SetImage("file://{resources}/images/custom_game/talants/img" + data.url);
    PANEL.talant_name_label.text = $.Localize("#"+data.name);
    PANEL.talant_description_buff_label.text = TalentDescriptionString(data, i, j) 
    PANEL.InfoIcon.visible = InfoTooltip(data.name)
    PANEL.talant_description_scale_label.visible = TalentLevelScale(data, i, j)
    PANEL.button.visible = IsShowUpdateButton(i, j)
    PANEL.talant_description_label.visible = TalentLevel30Lable(j)
    PANEL.button_label_count.text =  LevelNeed(i, j) > 1 ? ` (${LevelNeed(i, j)})` : ""
    PANEL.button_label.text = (j <= 5 && data.value > 0) ? $.Localize("#talant_button_update") : $.Localize("#talant_button_examine")
    PANEL.button.SetPanelEvent('onmouseactivate', ()=>{
        Game.EmitSound("ui_generic_button_click")
        explore = {i:i, j:j}
        GameEvents.SendCustomGameEventToServer("TalentsExplore", { i:i, j:j })
    })
    PANEL.players_have.text = $.Localize("#talent_count")
    if(data.explored){
        PANEL.players_have.text = $.Localize("#players_have_label").replace("##count##", data.explored)
    }
    PANEL.players_have.SetPanelEvent('onmouseactivate', ()=>{
        const index = GetPortraitIndex()
        const data = FindDataByIndex(index)
        PANEL.players_have.text = $.Localize('#talents_loading')
        explore = {i:i, j:j}
        GameEvents.SendCustomGameEventToServer("TalentExploreAmount", {i:i, j:j, hero_name:data.hero_name})
    })

}
function UpdateExperience(data){
    PANEL.RDA_level_label.text = $.Localize('#talent_level_label')+CalculateLevelFromExperience(data.totalexp)+(data.freepoints > 0 ? `(${data.freepoints})` : "")
    PANEL.normal_level_label.text = $.Localize('#talent_level_label')+CalculateLevelFromExperience(data.totaldonexp)+(data.freedonpoints > 0 ? `(${data.freedonpoints})` : "")
    PANEL.blue_line_label.text = ColculateExperienceCounter(data.totalexp)
    PANEL.red_line_label.text = ColculateExperienceCounter(data.totaldonexp)
    PANEL.blue_line_panel.style.width = ColculateProgressLinePercentage(data.totalexp) + "%"
    PANEL.red_line_panel.style.width = ColculateProgressLinePercentage(data.totaldonexp) + "%"
    PANEL.blue_line_label_gain.text = (data.gain != undefined && data.gain != 0) ? `+${data.gain.toFixed(1)}` : ""
    PANEL.red_line_label_gain.text = (data.gain != undefined && data.gain != 0 && data.patron) ? `+${data.gain.toFixed(1)}` : ""
}
function OpenShop(){
    PANEL.shop.style.position = "0 0 0"
    PANEL.description_gradient_border_out.style.position = "400px 0 0"
}
function CloseShop(){
    PANEL.shop.style.position = "-400px 0 0"
    PANEL.description_gradient_border_out.style.position = "0 0 0"
}
function CreateStore(){
    PANEL.store_container.RemoveAndDeleteChildren()
    for(let i in store){
        const panel = $.CreatePanel("Panel", PANEL.store_container, "")
        panel.BLoadLayoutSnippet("item_Panel")
        panel.FindChildTraverse('item_name').text = $.Localize('#'+store[i].name)
        panel.FindChildTraverse('item_image').SetImage('file://{resources}/'+store[i].image)
        panel.FindChildTraverse('item_image').SetPanelEvent("onmouseover",ShowTooltip(store[i].description, panel.FindChildTraverse('item_image')));
        panel.FindChildTraverse('item_image').SetPanelEvent("onmouseout",HideTooltip());
        if(store[i].name == "talant_shop_refresh"){
            panel.AddClass('store_refresh')
        }
        panel.FindChildTraverse("don_button").visible = false
        panel.FindChildTraverse("rp_button").visible = false
        if(store[i].price.don != undefined){
            panel.FindChildTraverse("don_button").visible = true
            panel.FindChildTraverse("don_label").text = store[i].price.don
            panel.FindChildTraverse("don_button").SetPanelEvent('onmouseactivate', BuyButton_Event( store[i].name, 'don', store[i].price.don, true, store[i].value, "TalentsBuy"))
            panel.FindChildTraverse("don_button").SetPanelEvent('onmouseover', ShowMoneyTooltip(panel.FindChildTraverse("don_button"), 'don'))
            panel.FindChildTraverse("don_button").SetPanelEvent('onmouseout', HideTooltip())
            
        }
        if(store[i].price.rp != undefined){
            panel.FindChildTraverse("rp_button").visible = true
            panel.FindChildTraverse("rp_label").text = store[i].price.rp
            panel.FindChildTraverse("rp_button").SetPanelEvent('onmouseactivate', BuyButton_Event( store[i].name, 'rp', store[i].price.rp, true, store[i].value, "TalentsBuy"))
            panel.FindChildTraverse("rp_button").SetPanelEvent('onmouseover', ShowMoneyTooltip(panel.FindChildTraverse("rp_button"), 'rp'))
            panel.FindChildTraverse("rp_button").SetPanelEvent('onmouseout', HideTooltip())
        }
    }
    PANEL.store_container.GetChild(0).FindChildTraverse("item_use_button_panel").SetPanelEvent('onmouseactivate', ShopRefreshButton())
}
function UpdateRefreshCount(data){
    const panel = PANEL.store_container.GetChild(0).FindChildTraverse("item_count")
    panel.text = (data.shop_refresh_count + data.hero_refresh_count) + $.Localize("#pet_pieces") + "."
    panel.SetPanelEvent("onmouseover",()=>{
        const text = `
            ${$.Localize("#talents_hero_refresh_count")}: ${data.hero_refresh_count}<br>
            ${$.Localize("#talents_shop_refresh_count")}: ${data.shop_refresh_count}
            `
        $.DispatchEvent( "DOTAShowTextTooltip", panel, text);
    })
    panel.SetPanelEvent("onmouseout",HideTooltip());
}
function CreateSecondBranch(){
    const data = CustomNetTables.GetTableValue( "talants" , Game.GetLocalPlayerID())
    for(let i in second_branch){
        if(second_branch[i].hero_name == data.hero_name){
            PANEL.activate_second_branch_button_don.FindChildTraverse("don_label").text = second_branch[i].price.don
            PANEL.activate_second_branch_button_don.SetPanelEvent('onmouseactivate', BuyButton_Event( i, 'don', second_branch[i].price.don, false, 1, "TalentsBuySecondBranch"))
            PANEL.activate_second_branch_button_don.SetPanelEvent('onmouseover', ShowMoneyTooltip(PANEL.activate_second_branch_button_don, 'don'))
            PANEL.activate_second_branch_button_don.SetPanelEvent('onmouseout', HideTooltip())

            PANEL.activate_second_branch_button_rp.FindChildTraverse("rp_label").text = second_branch[i].price.rp
            PANEL.activate_second_branch_button_rp.SetPanelEvent('onmouseactivate', BuyButton_Event( i, 'rp', second_branch[i].price.rp, false, 1, "TalentsBuySecondBranch"))
            PANEL.activate_second_branch_button_rp.SetPanelEvent('onmouseover', ShowMoneyTooltip(PANEL.activate_second_branch_button_rp, 'rp'))
            PANEL.activate_second_branch_button_rp.SetPanelEvent('onmouseout', HideTooltip())
            break;
        }
    }
}
function UpdateSecondBranchButton(data){
    PANEL.activate_second_branch_panel.SetHasClass('hidden', true);
    if(!IsPortraitLocal()) return
    if(data.cout > 1) return
    if(data.level >= 7){
        PANEL.activate_second_branch_panel.SetHasClass('hidden', false);
        for(let i in second_branch){
            if(second_branch[i].hero_name == data.hero_name){
                PANEL.activate_second_branch_button_background.SetHasClass('hidden', false);
                PANEL.activate_second_branch_label.text = $.Localize("#talents_activate_second_branch")
                return
            }
        }
        PANEL.activate_second_branch_button_background.SetHasClass('hidden', true);
        PANEL.activate_second_branch_label.text = $.Localize("#talents_activate_second_branch_error")
    }
}