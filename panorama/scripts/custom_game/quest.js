var npc,
	playerID = Players.GetLocalPlayer(),
	butupdate,
	sid = GetUniverseSteamID32( playerID ),
	base_tab = CustomNetTables.GetTableValue( "quests" , 'base'),
	options_tab = CustomNetTables.GetTableValue( "quests" , 'options'),
	reward_tab = CustomNetTables.GetTableValue( "quests" , 'reward'),
	abs_tab = CustomNetTables.GetTableValue( "quests" , 'abs'),
	kill_tab = CustomNetTables.GetTableValue( "quests" , 'kill'),
	item_tab = CustomNetTables.GetTableValue( "quests" , 'item'),
	custom_tab = CustomNetTables.GetTableValue( "quests" , 'custom'),
	giveItem_tab = CustomNetTables.GetTableValue( "quests" , 'giveItem'),
	itemsArray,
	list,
	mode,
	trialPeriod,
	subscribe

const context = $.GetContextPanel(),
	scaleX = context.actualuiscale_x,
	scaleY = context.actualuiscale_y
function load_npc(t){
	npc = t
	//$.Msg(npc)
}
function npcInfo(t){
	list = t.list
	mode = t.mode
}
function isBonusExpAvailable() {
	const player = Players.GetPlayerHeroEntityIndex(playerID);
	for (let i = 0; i < Entities.GetNumBuffs(player); i++) {
	  const modifier = Entities.GetBuff( player, i );
	  if (Buffs.GetName(player, modifier) === "modifier_don2") {
		return true;
	  }
	}
	return false;
  }



function ActivateShop(t) {
	var player_info = CustomNetTables.GetTableValue( "player_info", GetUniverseSteamID32( playerID ) )
	if(t.sound == true){
		Game.EmitSound("Item.LotusOrb.Activate")
	}
	var name = null;
	var i = 1;
	if(list){
		while(list[i]){
			if(list[i].index == t.index){
				name = list[i].name;
			}
			i++;
		}
	}
	if(name && searchQuestByName( name )){
		open_quest_window(t)
		// var availableQuest = searchQuestByName(name)
		// if(availableQuest){
		// 	butupdate = true
		// 	if($("#shopbuttonname")){
		// 		$("#shopbuttonname").text = $.Localize('#open')
		// 	}
		// 	if($('#shopbutton')){
		// 		$('#shopbutton').SetPanelEvent("onmouseactivate",showQuest(availableQuest, t))
		// 	}
		// 	if($("#shopbuttonhud")){
		// 		//$("#shopbuttonhud").text = $.Localize('open')
		// 		$('#shopbuttonhud').RemoveClass('hide_button')
		// 		$('#shopbuttonhud').AddClass('show_button')
		// 		$("#shopbuttonhud").visible = true
		// 	}
		// 	$.Msg(t.index)
		// 	//UpdateButtonInWorld(t.index)
			
		// 	//pan.style.position = uixp + '% ' + uiyp + '% 0'
			
		// }
	}
}

var showQuest = (function(availableQuest, t)
{
	return function()
	{
		$("#questScrollPanel").visible = true
		$("#basepanel").visible = false
		Game.EmitSound('Shop.Available')
		/*
		base_tab = CustomNetTables.GetTableValue( "quests" , 'base'),
		options_tab = CustomNetTables.GetTableValue( "quests" , 'options'),
		reward_tab = CustomNetTables.GetTableValue( "quests" , 'reward'),
		abs_tab = CustomNetTables.GetTableValue( "quests" , 'abs'),
		kill_tab = CustomNetTables.GetTableValue( "quests" , 'kill'),
		item_tab = CustomNetTables.GetTableValue( "quests" , 'item'),
		custom_tab = CustomNetTables.GetTableValue( "quests" , 'custom'),
		*/
		//$.Msg(options_tab)
		//$.Msg(kill_tab)
		
		var type = availableQuest[0]
		var numbtype
		if(type == 'main'){
			numbtype = 0
		}else if(type == 'bonus'){
			numbtype = 1
		}else if(type == 'exchanger'){
			numbtype = 2
		}
		var number = availableQuest[1]
		var task = availableQuest[2]
		//$.Msg(availableQuest)
		var player_info = CustomNetTables.GetTableValue( "player_info", sid )
		if(task != false){
			if(player_info[sid][type][number]["tasks"][task]){
				$('#questTextDesc').text = $.Localize("#"+player_info[sid][type][number]["tasks"][task]["Desc"])
			}
			else{
				$('#questTextDesc').text = $.Localize("#last_desc")
			}
		}else{
			$('#questTextDesc').text = $.Localize("#"+type + '_desc_' + number + '_exchanger')
		}
		$('#questTaskKillLabel').visible = false
		$('#KillName').visible = false
		$('#questTaskItemLabel').visible = false
		$('#questRewardItemLabel').visible = false
		$('#GiveItemLabel').visible = false
		$('#questRewardChoosItemLabel').visible = false
		$("#questAcceptButtonPanel").visible = true;
		$('#taskItemsPanel').RemoveAndDeleteChildren()
		$('#questRewardItemPanel').RemoveAndDeleteChildren()
		$('#questRewardChoosItemPanel').RemoveAndDeleteChildren()
		$('#GiveItemPanel').RemoveAndDeleteChildren()
		
		//exchange
		has = false;
		eblan = 1
		while(base_tab[eblan]){
			if(base_tab[eblan].type == type && base_tab[eblan].number == number && base_tab[eblan][task]){
				has = true;
				break;
			}
			eblan++;
		}
		if(has == false){
			eblan = 1
			while(base_tab[eblan]){
				if(base_tab[eblan].type == type && base_tab[eblan].number == number){
					break;
				}
				eblan++;
			}
		}
		if(task == false){
			$('#questTaskItemLabel').visible = true
			var item = $.CreatePanel("Panel", $("#taskItemsPanel"),"ItemPanel")
			item.BLoadLayout("file://{resources}/layout/custom_game/questItemPanel.xml", false, false)
			if(questsTable[numbtype]['value'][number]['exchange']['HowMuch'] == 1){
				item.FindChildTraverse('ItemsNumber').text = ''
			}else{
				item.FindChildTraverse('ItemsNumber').text = 'x' + questsTable[numbtype]['value'][number]['exchange']['HowMuch']
			}
			item.FindChildTraverse('questRewardItem').itemname = questsTable[numbtype]['value'][number]['exchange']['DotaName']
			item.FindChildTraverse('ItemName').text = $.Localize("#"+questsTable[numbtype]['value'][number]['exchange']['TextName'])
		}else{
			// таски
			// predmet 
			
			if(has){
			// item
				if(base_tab[eblan].item){
					$('#questTaskItemLabel').visible = true
					var item = $.CreatePanel("Panel", $("#taskItemsPanel"),"ItemPanel")
					item.BLoadLayout("file://{resources}/layout/custom_game/questItemPanel.xml", false, false)
					if(player_info[sid][type][number]["tasks"][task]['HowMuch'] == 1){
						item.FindChildTraverse('ItemsNumber').text = ''
					}else{
						item.FindChildTraverse('ItemsNumber').text = 'x' + player_info[sid][type][number]["tasks"][task]['HowMuch']
					}
					item.FindChildTraverse('questRewardItem').itemname = player_info[sid][type][number]["tasks"][task]['DotaName']
					item.FindChildTraverse('ItemName').text = $.Localize("#"+player_info[sid][type][number]["tasks"][task]['TextName'])
					
			// kill
				}else if(base_tab[eblan].kill){
					$('#questTaskKillLabel').visible = true
					$('#KillName').visible = true
					if( player_info[sid][type][number]["tasks"][task]['HowMuch'] == 1){
						$('#KillName').text = $.Localize("#"+ player_info[sid][type][number]["tasks"][task]['TextName'])
					}else{
						$('#KillName').text = 'x' + player_info[sid][type][number]["tasks"][task]['HowMuch'] + ' ' + $.Localize("#"+player_info[sid][type][number]["tasks"][task]['TextName'])
					}
				}
			}
			// give predmet dl'a kvesta
			if(has && base_tab[eblan][task].giveItem && $('#GiveItemPanel')){
				$('#GiveItemLabel').visible = true
				var item = $.CreatePanel("Panel", $("#GiveItemPanel"),"ItemPanel")
				item.BLoadLayout("file://{resources}/layout/custom_game/questItemPanel.xml", false, false)
				if(giveItem_tab[base_tab[eblan][task].giveItem]['quantity'] == '1' || !giveItem_tab[base_tab[eblan][task].giveItem]['quantity']){
					item.FindChildTraverse('ItemsNumber').text = ''
				}else{
					item.FindChildTraverse('ItemsNumber').text = 'x' + giveItem_tab[base_tab[eblan][task].giveItem]['quantity']
				}
				item.FindChildTraverse('questRewardItem').itemname = giveItem_tab[base_tab[eblan][task].giveItem]['DotaName']
				item.FindChildTraverse('ItemName').text = $.Localize("#dota_tooltip_ability_"+giveItem_tab[base_tab[eblan][task].giveItem]['TextName'])
			}
		}
		
		if(true){
			// reward
			
			const talentExperience = player_info[sid][type][number]['talentExperience']
			$('#questGoldRewardNumber').text = player_info[sid][type][number]['gold']
			$('#questExpRewardNumber').text = player_info[sid][type][number]['experience']
			$('#questTalantRewardNumber').text = " " + isBonusExpAvailable ? Math.round(talentExperience * 1.15) : talentExperience
			if(base_tab[eblan] && base_tab[eblan].items && reward_tab[base_tab[eblan].items]['items']["1"]){
				$('#questRewardItemLabel').visible = true
				var i = 1
				while(reward_tab[base_tab[eblan].items]['items'][i]){
					var item = $.CreatePanel("Panel", $("#questRewardItemPanel"),"ItemPanel")
					item.BLoadLayout("file://{resources}/layout/custom_game/questItemPanel.xml", false, false)
					if(reward_tab[base_tab[eblan].items]['items'][i]['quantity'] == null){
						item.FindChildTraverse('ItemsNumber').text = ''
					}else{
						item.FindChildTraverse('ItemsNumber').text = 'x' + reward_tab[base_tab[eblan].items]['items'][i]['quantity']
					}
					item.FindChildTraverse('questRewardItem').itemname = reward_tab[base_tab[eblan].items]['items'][i]['DotaName']
					item.FindChildTraverse('ItemName').text = $.Localize("#"+reward_tab[base_tab[eblan].items]['items'][i]['TextName'])
					i += 1
				}
			}
			$('#questRewardChoosItemPanel').style.backgroundColor = 'rgba(255, 0, 0, 0)'
			if(base_tab[eblan].ChoosItems
			&& reward_tab[base_tab[eblan].ChoosItems]['ChoosItems']["1"]){
				itemsArray = []
				$('#questRewardChoosItemLabel').visible = true
				
				var i = 1
				while(reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]){
					//$.Msg("selectedItem",player_info[sid][type][number]['selectedItem'])
					var item = $.CreatePanel("Panel", $("#questRewardChoosItemPanel"),"ItemPanel")
					item.BLoadLayout("file://{resources}/layout/custom_game/questItemPanel.xml", false, false)
					$.Msg('quantity', reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['quantity'])
					if(!reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['quantity'] || reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['quantity'] == '1'){
						item.FindChildTraverse('ItemsNumber').text = ''
					}else{
						item.FindChildTraverse('ItemsNumber').text = 'x' + reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['quantity']
					}
					item.FindChildTraverse('questRewardItem').itemname = reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['DotaName']
					item.FindChildTraverse('ItemName').text = $.Localize("#"+reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['TextName'])
					if(player_info[sid][type][number]['lock_item_select'] == false){
						item.SetPanelEvent("onmouseactivate",selectItem(type, number, task, reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['DotaName']))
					}
					itemsArray[i] = [reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['DotaName'],item]
					
					if(player_info[sid][type][number]['selectedItem'] == reward_tab[base_tab[eblan].ChoosItems]['ChoosItems'][i]['DotaName']){
						item.style.backgroundColor = 'rgba(0, 0, 0, .5)'
					}
					i += 1
				}
			}
		}
		
		$("#questAcceptButtonPanel").SetPanelEvent("onmouseactivate",acceptButton(type, number, task, numbtype, t))
		$('#questPanel').RemoveClass('hide_quest')
		$('#questPanel').AddClass('show_quest')
		$("#questPanel").visible = true
		$("#TrialPeriod").visible = false
		$("#auto_quest_toggle").visible = false
	}
});



var selectItem = (function(type, number, task, itemname)
{
	return function()
	{
		var i = 1
		$('#questRewardChoosItemPanel').style.backgroundColor = 'rgba(255, 0, 0, 0)'
		while(itemsArray[i]){
			if(itemsArray[i][0] == itemname){
				itemsArray[i][1].style.backgroundColor = 'rgba(0, 0, 0, .5)'
			}else{
				itemsArray[i][1].style.backgroundColor = 'rgba(0, 0, 0, 0)'
			}
			i++
		}
		GameEvents.SendCustomGameEventToServer("selectItem", {type:type, number:number, task:task, pid:playerID, itemname:itemname})
		//$.Msg('selectItem')
	}
});

var acceptButton = (function(type, number, task, numbtype, t)
{
	return function()
	{
		var player_info = CustomNetTables.GetTableValue( "player_info", sid ) 
		eblan = 1;
		while(base_tab[eblan]){
			if(base_tab[eblan].type == type && base_tab[eblan].number == number){
				break;
			}
			eblan++;
		}
		if(base_tab[eblan].ChoosItems && reward_tab[base_tab[eblan].reward]['ChoosItems']
		&&reward_tab[base_tab[eblan].reward]['ChoosItems']["1"]
		&& player_info[sid][type][number]['selectedItem'] == false
		&& base_tab[eblan][task] == null){
			if($('#questRewardChoosItemPanel')){
				$('#questRewardChoosItemPanel').style.backgroundColor = 'rgba(255, 0, 0, .5)'
			}
		}else{
			$("#questAcceptButtonPanel").visible = false;
			$("#questScrollPanel").visible = false;
			GameEvents.SendCustomGameEventToServer("acceptButton", {type:type, number:number, task:task, pid:playerID, index:t})
		}
	}
});

var minimapEvent = (function(type, number, task)
{
	return function()
	{
		
		GameEvents.SendCustomGameEventToServer("minimapEvent", {type:type, number:number, task:task, pid:playerID})
	}
});


function searchQuestByName( unitname ){
	var player_info = CustomNetTables.GetTableValue( "player_info", sid )
	var name = ['main','bonus']
	var arr = []
	for(var g = 0; g < 2; g++){
		var i = 1
		while(player_info[sid][name[g]][i]){
			if(player_info[sid][name[g]][i]["complete"] == false){
				if(player_info[sid][name[g]][i]["available"] == true && player_info[sid][name[g]][i]["UnitName"] == unitname){
					arr.push([name[g],i,1])
				}
				var task = 1
				while(player_info[sid][name[g]][i]['tasks'][task]){
					if(player_info[sid][name[g]][i]["tasks"][task]['have'] == player_info[sid][name[g]][i]["tasks"][task]['HowMuch']
					&& player_info[sid][name[g]][i]["tasks"][task]['UnitName'] == unitname && player_info[sid][name[g]][i]["tasks"][task]['complete'] == false){
						arr.push([name[g],i,task+1])
					}
					task += 1
				}
			}
			i++
		}
	}
	var i = 1
	while(player_info[sid]['exchanger'][i]){
		if(player_info[sid]['exchanger'][i]["available"] == true && player_info[sid]['exchanger'][i]["UnitName"] == unitname){
			return ['exchanger',i,false]
		}
		i++
	}
	if(arr[0]){
		//$.Msg(arr)
		return arr;
	}else{
		return false;
	}
}

function DeactivateShop(xml) {
	butupdate = false
	if($("#questPanel")){
		
		$('#questPanel').RemoveClass('show_quest')
		$('#questPanel').AddClass('hide_quest')
		$.Schedule(0.5, function(){
			$('#questPanel').RemoveClass('hide_quest')
			$("#questPanel").visible = false
		})
	}
	
}

function GetUniverseSteamID32(PID)
{
    var steamID64 = Game.GetPlayerInfo(PID).player_steamid,
    steamIDPart = Number(steamID64.substring(3)),
    steamID32 = String(steamIDPart - 61197960265728);

    return steamID32;
}
var textColor = (function(panel, color)
{
	return function()
	{	
		panel.style.color = color;
	}
});

function changeHudPanel(table_name, key, data){
	if(key == sid){
		var mainPanel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("questInfoBarPanel");
		//var mainPanel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("shop");
		var i = 0;  
		if(mainPanel){
			while (i < mainPanel.GetChildCount()) {
				mainPanel.GetChild(i).RemoveAndDeleteChildren();
				i++;
			}
		}
		player_info = data;
		var name = ['main','bonus']
		
		if(player_info){
			var cislo = 1
			for(var g = 0; g < 2; g++){
				var i = 1
				while(player_info[sid][name[g]][i]){
					if(player_info[sid][name[g]][i]['active'] == true){
						var task = 1
						while(player_info[sid][name[g]][i]['tasks'][task]){
							if(player_info[sid][name[g]][i]['tasks'][task]['active'] == true && mainPanel){
								
								let cont_panel = $.CreatePanel("Panel", mainPanel, "InfoBarPanel_" + cislo)
								let questInfoBarLabel_3 = $.CreatePanel("Label",cont_panel, "questInfoBarLabel_3")
								questInfoBarLabel_3.AddClass("questInfoBarLabel_3")
								questInfoBarLabel_3.text = "!"
								let questInfoBarLabel_1 = $.CreatePanel("Label",cont_panel, "questInfoBarLabel_1")
								questInfoBarLabel_1.AddClass("questInfoBarLabel_1")
								questInfoBarLabel_1.text = $.Localize("#"+player_info[sid][name[g]][i]['tasks'][task]['TextName'])
								let questInfoBarLabel_2 = $.CreatePanel("Label",cont_panel, "questInfoBarLabel_2")
								questInfoBarLabel_2.AddClass("questInfoBarLabel_2")
								questInfoBarLabel_2.text = player_info[sid][name[g]][i]['tasks'][task]['have'] + '/' + player_info[sid][name[g]][i]['tasks'][task]['HowMuch']
								cont_panel.style.horizontalAlign = "right";
								cont_panel.style.flowChildren = "right";
								questInfoBarLabel_1.style.fontSize = "17px";
								questInfoBarLabel_1.style.marginRight = "10px";
								questInfoBarLabel_1.style.color = "white";
								questInfoBarLabel_1.style.textShadow = "2px 2px 8px 3.0 #000000";
								questInfoBarLabel_1.SetPanelEvent("onmouseover",textColor(questInfoBarLabel_1, "gray"));
								questInfoBarLabel_1.SetPanelEvent("onmouseout",textColor(questInfoBarLabel_1, "white"));
								questInfoBarLabel_1.SetPanelEvent("onmouseactivate",minimapEvent(name[g], i, task))
								questInfoBarLabel_2.style.fontSize = "17px";
								questInfoBarLabel_2.style.marginRight = "10px";
								questInfoBarLabel_2.style.color = "gold";
								questInfoBarLabel_2.style.textShadow = "2px 2px 8px 3.0 #000000";
								questInfoBarLabel_3.style.fontSize = "20px";
								questInfoBarLabel_3.style.color = "gold";
								questInfoBarLabel_3.style.textShadow = "2px 2px 8px 3.0 #000000";
								questInfoBarLabel_3.style.fontWeight = "bold";
								questInfoBarLabel_3.style.marginRight = "5px";
								if(name[g] == 'bonus'){
									questInfoBarLabel_3.style.color = '#0084ff'
								}
								cislo += 1
								break
							}
							task++
						}
					}
					i++
				}
			}
		}
	}
} 

function open_quest_window(index){
	var unit = Players.GetLocalPlayerPortraitUnit(),
		vecunit = Entities.GetAbsOrigin(unit),
		hero = Players.GetPlayerHeroEntityIndex(playerID),
		vechero = Entities.GetAbsOrigin(hero),
		length = Game.Length2D(vecunit,vechero),
		name = null,
		i = 1
	
	if(index.index){
		//$.Msg(index)
		unit = Number(index.index)
		vecunit = Entities.GetAbsOrigin(unit)
		if(index.sound == true){
			Game.EmitSound("Item.LotusOrb.Activate")
		}
	}
	if(unit != hero){
		//$.Msg('unit')
		if(list){
			while(list[i]){
				if(list[i].index == unit){
					name = list[i].name;
				}
				i++;
			}
		}
		if(name && Players.GetLocalPlayerPortraitUnit() != Players.GetPlayerHeroEntityIndex(playerID)){
			GameUI.SelectUnit(hero, false)
		}
		if(name && length < 350){
			$('#questPanel').RemoveClass('hide_quest');
			$('#questPanel').AddClass('show_quest');
			$("#questPanel").visible = true;
			$("#basepanel").visible = true;
			$("#questAcceptButtonPanel").visible = false;
			$("#questScrollPanel").visible = false;
			$("#tasks_nichego_net").visible = true;
			$("#basepanel_working_space").RemoveAndDeleteChildren();
			$.Schedule(0.2, function(){
				$("#basepanel_working_space").RemoveAndDeleteChildren();
				open_base_panel(name, unit);
			})
		}else if(name){
			$.Schedule(1, function(){
				open_quest_window(index);
			})
		}
	}
}

function open_base_panel(name, unit){
	var availableQuest = searchQuestByName(name)
	if(availableQuest){
		$("#tasks_nichego_net").visible = false
		$.Msg('print_1')
		var player_info = CustomNetTables.GetTableValue( "player_info", sid );
		var i = 0;
		while(availableQuest[i]){
			var type = availableQuest[i][0],
				number = availableQuest[i][1],
				task = availableQuest[i][2]
			let start_panel = $.CreatePanel("Panel", $("#basepanel_working_space"), "task_" + i)
			start_panel.AddClass("task")
			if(player_info[sid][type][number]['tasks'][task] == null){
				let line_1 = $.CreatePanel("Label", start_panel, "task_znak")
				line_1.AddClass("task_znak")
				line_1.text = "?"
			}else{
				let line_1 = $.CreatePanel("Label", start_panel, "task_znak")
				line_1.AddClass("task_znak")
				line_1.text = "!"
			}
			let line_2 = $.CreatePanel("Label", start_panel, "task_label")
			line_2.AddClass("task_label")
			line_2.text = $.Localize('#zadanie_label')
			if(type != 'main'){
				$("#task_" + i).FindChildTraverse('task_znak').style.color = "#0084ff";
			}
			$("#task_" + i).SetPanelEvent("onmouseactivate",showQuest(availableQuest[i], unit))
			i++;
		}
		
	}
	$("#auto_quest_toggle").visible = true
	if(trialPeriod > 0 && !subscribe)
		$("#TrialPeriod").visible = true
}




(function(){
	
	if($("#questPanel") != null)
		$("#questPanel").visible = false  
	if($("#questPanel") != null)
		$("#shopbuttonhud").visible = false
	GameEvents.Subscribe("load_npc",load_npc)
	GameEvents.Subscribe("ActivateQuestAura",ActivateShop)
	GameEvents.Subscribe("DeactivateQuestAura",DeactivateShop)
	GameEvents.Subscribe("npcInfo",npcInfo)
	GameEvents.Subscribe("dota_player_update_query_unit", open_quest_window)
	GameEvents.Subscribe('dota_player_update_hero_selection', open_quest_window);
	GameEvents.Subscribe('dota_player_update_selected_unit', open_quest_window);
	GameEvents.Subscribe('open_quest_window', open_quest_window);
	CustomNetTables.SubscribeNetTableListener( "player_info", changeHudPanel );
	if($.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("HUDElements")){
		$.CreatePanel("Panel", $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("HUDElements"), 'questInfoBarPanel')
	}
	var mainPanel = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("questInfoBarPanel")
	if(mainPanel){
		mainPanel.style.flowChildren = "down";
		mainPanel.style.horizontalAlign = "right";
		mainPanel.style.marginTop = "35%";
	}
	if($("#auto_quest_toggle"))
		$("#auto_quest_toggle").SetPanelEvent("onmouseactivate", ()=>{
			GameEvents.SendCustomGameEventToServer( "auto_quest_toggle", {toggle_state : $("#auto_quest_toggle").checked} )
		})
	GameEvents.Subscribe( "change_auto_quest_toggle_state", (t)=>{
		if($("#auto_quest_toggle"))
			$("#auto_quest_toggle").SetSelected(t.toggle_state)
		trialPeriod = t.count
		subscribe = t.subscribe
		$("#TrialPeriod").text = $.Localize("#quest_trial_period").replace("##count##", trialPeriod);
		if(subscribe)
			$("#TrialPeriod").visible = false
	})
	GameEvents.Subscribe( "QuestEmitSound", (t)=>{
		Game.EmitSound("Item.LotusOrb.Activate")
	})

})();


