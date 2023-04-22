var ItemNumber = false;
var GameTime = false;
var SelectedStone = false;
var isOpen = false;
var stoneLock = false;
var list = null;
var playerID = Players.GetLocalPlayer();
var patron = false;

function close(){
    
    // $("#smithy_craft_button_panel").visible = false
    $('#smithy_main_window_panel').style.opacity = "0"
	$('#smithy_main_window_panel').style.preTransformScale2d = "0.8"
	$('#smithy_main_window_panel').style.transform = "translate3d(0px, 300px, 0px)"
	$.Schedule(0.3, function(){
	    $("#smithy_craft_button_panel").AddClass('brightness05')
        isOpen = false
        let a = SelectStone(-1)
        a()
        GameEvents.SendCustomGameEventToServer("select_stone_lua", {stone : -1, toggle : $("#smart_toggle").checked})
        $("#smuthy_main_item").visible = false
        $("#smithy_main_item_label").visible = false
        $("#smuthy_soul_item").visible = false
        $("#smithy_soul_item_label").visible = false
        $("#smuthy_output").visible = false
        $("#smithy_arrow_gem_image").visible = false
    
	})
}
var open = function(){
    return function(){
        if(isOpen){
            close()
            return
        }
        $('#smithy_main_window_panel').style.opacity = "1"
        $('#smithy_main_window_panel').style.preTransformScale2d = "1"
        $('#smithy_main_window_panel').style.transform = "translate3d(0px, 0px, 0px)"
        isOpen = true
        SelectedStone = false
        stoneLock = false
        clickingloop()
        Game.EmitSound("Item.LotusOrb.Activate")
    }
}

var lastLoop = false;
function clickingloop(){
    var dragg = false
	for(var i = 0; i < 9;i++){
        if(FindDotaHudElement("inventory_slot_"+i).BHasClass("dragging_from")){
            ItemNumber = i
            GameTime = Game.Time()
            // $.Msg("Catch")
            if($("#shift_toggle").checked && GameUI.IsShiftDown()){
                dragg = true
            }
        }
    }
    for(var i = 0; i < 6;i++){
        if(FindDotaHudElement("stash_row").FindChildTraverse("inventory_slot_"+i).BHasClass("dragging_from")){
            ItemNumber = 9 + i
            GameTime = Game.Time()
            // $.Msg("Catch")
            if($("#shift_toggle").checked && GameUI.IsShiftDown()){
                dragg = true
            }
        }
    }
    if(dragg != lastLoop && dragg == true){
        // $.Msg("automatic_installation_lua")
        let event = {
            slot : ItemNumber,
            toggle : $("#smart_toggle").checked,
        }
        GameEvents.SendCustomGameEventToServer("put_item_lua", event)
    }
    lastLoop = dragg
	$.Schedule(1/20,function(){
        if(isOpen){
            clickingloop()
        } 
	})
}

var OnMouseOverItem = (function(type){
    return function(){
        if(GameTime &&  Game.Time() - GameTime  < 0.25){
            $.Msg("Yes")
            let event = {
                slot : ItemNumber,
                type : type,
                toggle : $("#smart_toggle").checked,
            }
            GameEvents.SendCustomGameEventToServer("put_item_lua", event)
        }
    }
})

var ReturnItemBack = (function(type){
    
    return function(){
        $.Msg(type)
        let event = {
            type : type,
            toggle : false,
        }
        GameEvents.SendCustomGameEventToServer("return_item_lua", event)
    }
})

function return_item_js(t){
    if(t.isok == true){
        if(t.type == 'main'){
            $('#smuthy_main_item').visible = false
            $('#smithy_main_item_label').visible = false
            stoneLock = false
        }else if(t.type == 'gold'){
            $('#smuthy_gold_bar_item').visible = false 
            $('#smithy_gold_bar_label').visible = false
        }else if(t.type == 'soul'){
            $('#smuthy_soul_item').visible = false
            $('#smithy_soul_item_label').visible = false
        }
    }
}

var PickUpItem = (function(){
    return function (){
        Game.EmitSound('Shop.Available')
        GameEvents.SendCustomGameEventToServer("pick_up_item_lua", {toggle : $("#smart_toggle").checked})
    }
})

const ColorClass = ['SelectedStonePurple','SelectedStoneBlue','SelectedStoneOrange','SelectedStoneRed','SelectedStoneGreen']
const colorNames = ['purple','blue','orange','red','green']
const SelectStone = (function(color){
    return function(){
        for(var c in colorNames ){
            if($('#smithy_gem_'+colorNames[c]+'_panel')){
                if(c == color && !stoneLock){
                    $('#smithy_gem_'+colorNames[c]+'_panel').AddClass(ColorClass[c])
                    $('#smithy_arrow_gem_image').SetImage('file://{resources}/images/custom_game/smithy/'+colorNames[c]+'_gem.png')
                    $("#smithy_arrow_gem_image").visible = true
                }else if(!stoneLock){
                    $('#smithy_gem_'+colorNames[c]+'_panel').RemoveClass(ColorClass[c])
                }
            }
        }
        if(color > -1){
            if(SelectedStone != color + 1){
                GameEvents.SendCustomGameEventToServer("select_stone_lua", {stone : color + 1, toggle : false})
            }
            SelectedStone = color + 1
        }else{
            SelectedStone = false
        }
        
    }
})

function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}
function put_item_js(t){
    // $.Msg(t)
    if(t.stuck > 0){
        if(t.slot == "main"){
            $("#smithy_main_item_label").text = t.stuck
            $("#smithy_main_item_label").visible = true
        }else if(t.slot == "gold"){
            $("#smithy_gold_bar_label").text = t.stuck
            $("#smithy_gold_bar_label").visible = true
        }else if(t.slot == "soul"){
            $("#smithy_soul_item_label").text = t.stuck
            $("#smithy_soul_item_label").visible = true
        }
    }else{
        if(t.slot == "main"){
            $("#smithy_main_item_label").visible = false
        }else if(t.slot == "gold"){
            $("#smithy_gold_bar_label").visible = false
        }else if(t.slot == "soul"){
            $("#smithy_soul_item_label").visible = false
        }
    }
    if(t.slot == "main"){
        $('#smuthy_main_item').itemname = t.item_name
        $('#smuthy_main_item').visible = true
    }else if(t.slot == "gold"){
        $('#smuthy_gold_bar_item').itemname = t.item_name
        $('#smuthy_gold_bar_item').visible = true
    }else if(t.slot == "soul"){
        $('#smuthy_soul_item').itemname = t.item_name
        $('#smuthy_soul_item').visible = true
    }
    
}
function prepare_build_js(t){
    // $.Msg(t)
    $("#smuthy_output").itemname = t.item_name
    $("#smithy_top_arrow_label").text = t.gold
    $("#smithy_down_arrow_label").text = t.gems
    if(t.panel == 'hidden'){
        $("#smuthy_output").visible = false
    }else if(t.panel == 'visible'){
        if(t.enough){
            // $("#smuthy_output").AddClass('box_shadow_result_green')
            // $("#smuthy_output").RemoveClass('box_shadow_result_red')
            $("#smithy_craft_button_panel").RemoveClass('brightness05')
        }else{
            // $("#smuthy_output").RemoveClass('box_shadow_result_green')
            // $("#smuthy_output").AddClass('box_shadow_result_red')
            $("#smithy_craft_button_panel").AddClass('brightness05')
        }
        $("#smuthy_output").visible = true
    }
    stoneLock = false
    // $.Msg('lock',t.lock)
    if(t.lock){
        SelectedStone = false
        let a = SelectStone(-1)
        a()
        stoneLock = t.lock
        SelectedStone = t.select-1
        $('#smithy_gem_'+colorNames[t.select-1]+'_panel').AddClass(ColorClass[t.select-1])
        $('#smithy_arrow_gem_image').SetImage('file://{resources}/images/custom_game/smithy/'+colorNames[t.select-1]+'_gem.png')
        $("#smithy_arrow_gem_image").visible = true
    }else if(!SelectedStone && t.valid){
        for(var i = 0; i < 5; i++){
            $('#smithy_gem_'+colorNames[i]+'_panel').AddClass(ColorClass[i])
        }
    }else if(!SelectedStone && !t.valid){
        for(var i = 0; i < 5; i++){
            $('#smithy_gem_'+colorNames[i]+'_panel').RemoveClass(ColorClass[i])
        }
    }
}
function pick_up_item_js(t){
    $.Msg(t['gold']['stuck'])
    if(t['gold']['item_name'] == false){
        $("#smuthy_gold_bar_item").visible = false
        $("#smithy_gold_bar_label").visible = false
    }else if(t['gold']['stuck'] > 0){
        $("#smithy_gold_bar_label").text = t['gold']['stuck']
    }
    if(t['main']['item_name'] == false){
        $("#smuthy_main_item").visible = false
        $("#smithy_main_item_label").visible = false
    }else if(t['main']['stuck'] > 0){
        $("#smithy_main_item_label").text = t['main']['stuck']
    }
    if(t['soul']['item_name'] == false){
        $("#smuthy_soul_item").visible = false
        $("#smithy_soul_item_label").visible = false
    }else if(t['soul']['stuck'] > 0){
        $("#smithy_soul_item_label").text = t['soul']['stuck']
    }
    $('#smithy_top_arrow_label').text = '0'
    $('#smithy_down_arrow_label').text = '0'
    close()
}

function update_gems_js(t){
    $.Msg(t)
    $('#smithy_purple_label').text = t[1]
    $('#smithy_blue_label').text = t[2]
    $('#smithy_orange_label').text = t[3]
    $('#smithy_red_label').text = t[4]
    $('#smithy_green_label').text = t[5]
}

function init(t){
    patron = t.patron
    load_npc_js(t.npc)
}

var TipsOver = (function(message, pos)
{
	return function()
	{
        $.DispatchEvent( "DOTAShowTextTooltip", pos, $.Localize("#"+message));
	}
});

var TipsOut = (function()
{
	return function()
	{
        $.DispatchEvent( "DOTAHideTitleTextTooltip");
        $.DispatchEvent( "DOTAHideTextTooltip");
	}
});

function load_npc_js(t){
	list = t
}
function open_quest_window(index){
    // $.Msg('open_quest_window')
	var unit = Players.GetLocalPlayerPortraitUnit(),
		vecunit = Entities.GetAbsOrigin(unit),
		hero = Players.GetPlayerHeroEntityIndex(playerID),
		vechero = Entities.GetAbsOrigin(hero),
		length = Game.Length2D(vecunit,vechero),
		name = null,
		i = 1
	
	if(unit != hero){
		$("#openRating").visible = false
	}else{
        $("#openRating").visible = true
    }
}
    
function DeactivateShop(t){
    // close();
}

var TipsOver2 = (function(message, pos)
{
	return function()
	{
        $.DispatchEvent( "DOTAShowTextTooltip", pos, $.Localize("#"+message));
	}
});

var TipsOut2 = (function()
{
	return function()
	{
        $.DispatchEvent( "DOTAHideTitleTextTooltip");
        $.DispatchEvent( "DOTAHideTextTooltip");
	}
});

(()=>{
    $.RegisterForUnhandledEvent('Cancelled',() => {
        close()
    })
})();

(function(){
    
    if($("#smithy_main_item_panel")){
        $("#smithy_main_item_panel").SetPanelEvent("onmouseover", OnMouseOverItem("main"))
        $("#smithy_main_item_panel").SetPanelEvent("onmouseactivate", ReturnItemBack('main'))
    }
    if($("#smithy_gold_bar_panel")){
        $("#smithy_gold_bar_panel").SetPanelEvent("onmouseover", OnMouseOverItem("gold"))
        $("#smithy_gold_bar_panel").SetPanelEvent("onmouseactivate", ReturnItemBack('gold'))
    }
    if($("#smithy_soul_panel")){
        $("#smithy_soul_panel").SetPanelEvent("onmouseover", OnMouseOverItem("soul"))
        $("#smithy_soul_panel").SetPanelEvent("onmouseactivate", ReturnItemBack('soul'))
    }
    if($("#smithy_craft_button_panel")){
        $("#smithy_craft_button_panel").SetPanelEvent("onmouseactivate", PickUpItem())
    }

    if($('#smithy_gem_purple_panel')){
        $("#smithy_gem_purple_panel").SetPanelEvent("onmouseactivate", SelectStone(0))
        $("#smithy_gem_purple_panel").SetPanelEvent("onmouseover", TipsOver('tooltip_purple_gem_description', $("#smithy_gem_purple_panel")))
        $("#smithy_gem_purple_panel").SetPanelEvent("onmouseout", TipsOut())
    }
    if($('#smithy_gem_blue_panel')){
        $("#smithy_gem_blue_panel").SetPanelEvent("onmouseactivate", SelectStone(1))
        $("#smithy_gem_blue_panel").SetPanelEvent("onmouseover", TipsOver('tooltip_blue_gem_description', $("#smithy_gem_blue_panel")))
        $("#smithy_gem_blue_panel").SetPanelEvent("onmouseout", TipsOut())
    }
    if($('#smithy_gem_orange_panel')){
        $("#smithy_gem_orange_panel").SetPanelEvent("onmouseactivate", SelectStone(2))
        $("#smithy_gem_orange_panel").SetPanelEvent("onmouseover", TipsOver('tooltip_orange_gem_description', $("#smithy_gem_orange_panel")))
        $("#smithy_gem_orange_panel").SetPanelEvent("onmouseout", TipsOut())
    }
    if($('#smithy_gem_red_panel')){
        $("#smithy_gem_red_panel").SetPanelEvent("onmouseactivate", SelectStone(3))
        $("#smithy_gem_red_panel").SetPanelEvent("onmouseover", TipsOver('tooltip_red_gem_description', $("#smithy_gem_red_panel")))
        $("#smithy_gem_red_panel").SetPanelEvent("onmouseout", TipsOut())
    }
    if($('#smithy_gem_green_panel')){
        $("#smithy_gem_green_panel").SetPanelEvent("onmouseactivate", SelectStone(4))
        $("#smithy_gem_green_panel").SetPanelEvent("onmouseover", TipsOver('tooltip_green_gem_description', $("#smithy_gem_green_panel")))
        $("#smithy_gem_green_panel").SetPanelEvent("onmouseout", TipsOut())
    }
    
    if($("#openRating")){
        $("#openRating").SetPanelEvent("onmouseover", TipsOver('smithy', $("#openRating")))
        $("#openRating").SetPanelEvent("onmouseout", TipsOut())
        $("#openRating").visible = false
        $.Schedule(3,function(){
            $("#openRating").visible = true
        })
    }
    $("#smuthy_gold_bar_item").visible = false
    $("#smuthy_main_item").visible = false
    $("#smuthy_soul_item").visible = false
    $("#smuthy_output").visible = false
    $("#smithy_craft_button_panel").visible = true
    $("#smithy_arrow_gem_image").visible = false
    $("#shift_toggle").SetPanelEvent("onmouseover", TipsOver('tooltip_shift_mode',  $("#shift_toggle")))
    $("#shift_toggle").SetPanelEvent("onmouseout", TipsOut())
    $("#smart_toggle").SetPanelEvent("onmouseover", TipsOver('tooltip_smart_mode',  $("#smart_toggle")))
    $("#smart_toggle").SetPanelEvent("onmouseout", TipsOut())
    $("#smithy_close_button").SetPanelEvent("onmouseover", TipsOver('close',  $("#smithy_close_button")))
    $("#smithy_close_button").SetPanelEvent("onmouseout", TipsOut())
    $("#smithy_vopros_img").SetPanelEvent("onmouseover", TipsOver('smithy_tooltip_vopros',  $("#smithy_vopros_img")))
    $("#smithy_vopros_img").SetPanelEvent("onmouseout", TipsOut())
    GameEvents.Subscribe( "init", init )
    GameEvents.Subscribe( "put_item_js", put_item_js )
    GameEvents.Subscribe( "prepare_build_js", prepare_build_js )
    GameEvents.Subscribe( "pick_up_item_js", pick_up_item_js )
    GameEvents.Subscribe( "update_gems_js", update_gems_js )
    GameEvents.Subscribe( "return_item_js", return_item_js )
	GameEvents.Subscribe( "DeactivateShop",DeactivateShop )
	GameEvents.Subscribe("dota_player_update_query_unit", open_quest_window);
	// // GameEvents.Subscribe('dota_player_update_selected_unit', open_quest_window);
	GameEvents.Subscribe('open_quest_window', open_quest_window);
    
})();

