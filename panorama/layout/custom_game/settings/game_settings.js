"use strict";


/* Initialisation - runs when the element is created
=========================================================================*/
(function () {

	GameEvents.Subscribe("game_rules_state_change", function(params) {
		if (Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME)
		{
			if (CheckForHostPrivileges()) 
			{

				GameEvents.SendCustomGameEventToServer( "selected_game_settings", DATA)
			}
		}
	});
	$("#SettingsComplexTier1").diff_available = true
	$("#SettingsComplexTier2").diff_available = true
})();

const DIFFICULTY_PRIZE = 
[
	{name: "Turbo", mmr : 0, rp : 0, talent : 50},
	{name: "Normal", mmr : 100, rp : 100, talent : 100},
	{name: "Hard", mmr : 200, rp : 200, talent : 125},
	{name: "Ultra", mmr : 300, rp : 300, talent : 150},
	{name: "Insane", mmr : 400, rp : 400, talent : 175},
	{name: "Hell", mmr : 500, rp : 500, talent : 200},
]

const DIFFICULTY_BUTTONS = 
[
	$("#ComplexSettings").GetChild(0),
	$("#ComplexSettings").GetChild(1),
	$("#ComplexSettings").GetChild(2),
	$("#ComplexSettings").GetChild(3),
	$("#ComplexSettings").GetChild(4),
	$("#ComplexSettings").GetChild(5),
]

const BONUS_BUTTONS = 
[
	// $("#BonusButtons").GetChild(0),
	// $("#BonusButtons").GetChild(1),
	// $("#BonusButtons").GetChild(2),
	// $("#BonusButtons").GetChild(3),
	// $("#BonusButtons").GetChild(4),
	// $("#BonusButtons").GetChild(5),
	// $("#BonusButtons").GetChild(6)
]

const MISC_BUTTONS = 
[
	// $("#MiscButtons").GetChild(0),
	// $("#MiscButtons").GetChild(1),
	// $("#MiscButtons").GetChild(2)
]

const DATA_ENUM = 
{
	0: "DIFFICULTY_SETTINGS",
	1: "BONUS_SETTINGS",
	2: "MISC_SETTINGS"
}

let DATA = 
{
	"DIFFICULTY_SETTINGS": 0,
	"BONUS_SETTINGS": [],
	"MISC_SETTINGS": []
}

function OnDifficultySelected(tier)
{
	if(!DIFFICULTY_BUTTONS[Number(tier)].diff_available) return
	DATA[DATA_ENUM[0]] = Number(tier)

	for (let button of DIFFICULTY_BUTTONS) {
		button.SetHasClass("DifficultySelected", false)
	}

	DIFFICULTY_BUTTONS[Number(tier)].SetHasClass("DifficultySelected", true)
	GameEvents.SendCustomGameEventToServer("GameSettings", { mode : tier })
}

function OnBonusSettingsSelected(setting)
{
	const includes = DATA[DATA_ENUM[1]].includes(Number(setting))

	if (includes)
	{
		var index = DATA[DATA_ENUM[1]].indexOf(Number(setting));

		if (index !== -1) {
			DATA[DATA_ENUM[1]].splice(index, 1);
		}
	}
	else 
	{
		DATA[DATA_ENUM[1]].push(Number(setting))
	}

	BONUS_BUTTONS[Number(setting)].SetHasClass("BonusSelected", !includes)
}

function OnMiscSettingsSelected(setting)
{
	const includes = DATA[DATA_ENUM[2]].includes(Number(setting))

	if (includes)
	{
		var index = DATA[DATA_ENUM[2]].indexOf(Number(setting));

		if (index !== -1) {
			DATA[DATA_ENUM[2]].splice(index, 1);
		}
	}
	else 
	{
		DATA[DATA_ENUM[2]].push(Number(setting))
	}

	MISC_BUTTONS[Number(setting)].SetHasClass("MiscSelected", !includes)
}

// Checks if the local player has local privileges
function CheckForHostPrivileges() {
	return true
	var player_info = Game.GetLocalPlayerInfo();
	if ( !player_info ) {
		return undefined;
	} else {
		return player_info.player_has_host_privileges;
	}
}



CustomNetTables.SubscribeNetTableListener( "difficultyVote", function(table_name, key, data){
	let diff = [0, 0, 0, 0, 0, 0];
	let count = 0;
	for(var i = 0; i < 5; i++){
		if(data[i] != undefined){
			diff[data[i]] += 1;
			count += 1;
		}
	}
	let len = 100 / count;
	const ProgressPanel = $("#VoteProgressBar_Panel");
	let diff_index = 1;
	let vote_count = 0;
	for(let i = 0; i < 6; i++){
		ProgressPanel.GetChild(i).style.width = `${diff[i] * len}%`;
		ProgressPanel.GetChild(i).GetChild(0).text = diff[i] > 0 ? diff[i] : ""
		if(diff[i] >= vote_count && diff[i] > 0){
			diff_index = i;
			vote_count =diff[i];
		}
	}
	$("#WinPrize").GetChild(0).text = `${DIFFICULTY_PRIZE[diff_index].mmr}%\n${$.Localize("#game_settings_mmr")}`
	$("#WinPrize").GetChild(1).text = `${DIFFICULTY_PRIZE[diff_index].rp}%\n${$.Localize("#game_settings_rp")}`
	$("#WinPrize").GetChild(2).text = `${DIFFICULTY_PRIZE[diff_index].talent}%\n${$.Localize("#game_settings_talent")}`
	$("#DiffName").text = `${DIFFICULTY_PRIZE[diff_index].name}`
} );

$("#VoteProgressBar_Panel").GetChild(1).style.width = "100%"
$("#WinPrize").GetChild(0).text = `${DIFFICULTY_PRIZE[1].mmr}%\n${$.Localize("#game_settings_mmr")}`
$("#WinPrize").GetChild(1).text = `${DIFFICULTY_PRIZE[1].rp}%\n${$.Localize("#game_settings_rp")}`
$("#WinPrize").GetChild(2).text = `${DIFFICULTY_PRIZE[1].talent}%\n${$.Localize("#game_settings_talent")}`
$("#DiffName").text = `${DIFFICULTY_PRIZE[1].name}`

GameEvents.SendCustomGameEventToServer("GameSettingsInit", {})
GameEvents.Subscribe("GameSettingsMaxDifficulty", function(params) {
	$("#SettingsComplexTier1").SetPanelEvent("onmouseover", ()=>{
		$("#SettingsComplexTier1").FindChildTraverse("diff_toggle_1").SetHasClass("Hidden", false)
	})
	$("#SettingsComplexTier1").SetPanelEvent("onmouseout", ()=>{
		if($("#SettingsComplexTier1").FindChildTraverse("diff_toggle_1").checked == false){
			$("#SettingsComplexTier1").FindChildTraverse("diff_toggle_1").SetHasClass("Hidden", true)
		}
	})
	$("#SettingsComplexTier2").SetPanelEvent("onmouseover", ()=>{
		$("#SettingsComplexTier2").FindChildTraverse("diff_toggle_2").SetHasClass("Hidden", false)
	})
	$("#SettingsComplexTier2").SetPanelEvent("onmouseout", ()=>{
		if($("#SettingsComplexTier2").FindChildTraverse("diff_toggle_2").checked == false){
			$("#SettingsComplexTier2").FindChildTraverse("diff_toggle_2").SetHasClass("Hidden", true)
		}
	})
	if(params.maximum_passed_difficulty >= 1){
		$("#SettingsComplexTier3").diff_available = true
		$("#SettingsComplexTier3").GetChild(1).visible = false
		$("#SettingsComplexTier3").SetPanelEvent("onmouseover", ()=>{
			$("#SettingsComplexTier3").FindChildTraverse("diff_toggle_3").SetHasClass("Hidden", false)
		})
		$("#SettingsComplexTier3").SetPanelEvent("onmouseout", ()=>{
			if($("#SettingsComplexTier3").FindChildTraverse("diff_toggle_3").checked == false){
				$("#SettingsComplexTier3").FindChildTraverse("diff_toggle_3").SetHasClass("Hidden", true)
			}
		})
	}
	if(params.maximum_passed_difficulty >= 2){
		$("#SettingsComplexTier4").diff_available = true
		$("#SettingsComplexTier4").GetChild(1).visible = false
		$("#SettingsComplexTier4").SetPanelEvent("onmouseover", ()=>{
			$("#SettingsComplexTier4").FindChildTraverse("diff_toggle_4").SetHasClass("Hidden", false)
		})
		$("#SettingsComplexTier4").SetPanelEvent("onmouseout", ()=>{
			if($("#SettingsComplexTier4").FindChildTraverse("diff_toggle_4").checked == false){
				$("#SettingsComplexTier4").FindChildTraverse("diff_toggle_4").SetHasClass("Hidden", true)
			}
		})
	}
	if(params.maximum_passed_difficulty >= 3){
		$("#SettingsComplexTier5").diff_available = true
		$("#SettingsComplexTier5").GetChild(1).visible = false
		$("#SettingsComplexTier5").SetPanelEvent("onmouseover", ()=>{
			$("#SettingsComplexTier5").FindChildTraverse("diff_toggle_5").SetHasClass("Hidden", false)
		})
		$("#SettingsComplexTier5").SetPanelEvent("onmouseout", ()=>{
			if($("#SettingsComplexTier5").FindChildTraverse("diff_toggle_5").checked == false){
				$("#SettingsComplexTier5").FindChildTraverse("diff_toggle_5").SetHasClass("Hidden", true)
			}
		})
	}
	if(params.maximum_passed_difficulty >= 4){
		$("#SettingsComplexTier6").diff_available = true
		$("#SettingsComplexTier6").GetChild(1).visible = false
		$("#SettingsComplexTier6").SetPanelEvent("onmouseover", ()=>{
			$("#SettingsComplexTier6").FindChildTraverse("diff_toggle_6").SetHasClass("Hidden", false)
		})
		$("#SettingsComplexTier6").SetPanelEvent("onmouseout", ()=>{
			if($("#SettingsComplexTier6").FindChildTraverse("diff_toggle_6").checked == false){
				$("#SettingsComplexTier6").FindChildTraverse("diff_toggle_6").SetHasClass("Hidden", true)
			}
		})
	}
	let found = false
	for(let i = 1; i <= 6; i++){
		if(params.diff_toggle == 'diff_toggle_' + i){
			found = true
			$("#diff_toggle_"+i).SetSelected(true)
			$("#diff_toggle_"+i).SetHasClass("Hidden", false)
			OnDifficultySelected(i-1)
		}
	}
	if(found == false){
		OnDifficultySelected(1)
	}
})
$("#SettingsComplexTier1").SetPanelEvent("onmouseover", ()=>{
	$.Msg("12334333")
})
function Toggle(id){
	GameEvents.SendCustomGameEventToServer("GameSettingsToggle", {id: id, toggle: $("#"+id).checked})
	if($("#"+id).checked == true){
		for(let i = 1; i <= 6; i++){
			if("diff_toggle_"+i != id){
				$("#diff_toggle_"+i).SetSelected(false)
				$("#diff_toggle_"+i).SetHasClass("Hidden", true)
			}
		}
	}
}