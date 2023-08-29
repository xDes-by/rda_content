"use strict";

/* Initialisation - runs when the element is created
=========================================================================*/
(function () {
	$.Msg("Init")

	GameEvents.Subscribe("game_rules_state_change", function(params) {
		if (Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME)
		{
			if (CheckForHostPrivileges()) 
			{
				$.Msg(DATA)

				GameEvents.SendCustomGameEventToServer( "selected_game_settings", DATA)
			}
		}
	});
})();

const DIFFICULTY_BUTTONS = 
[
	$("#ComplexSettings").GetChild(0),
	$("#ComplexSettings").GetChild(1),
	$("#ComplexSettings").GetChild(2),
	$("#ComplexSettings").GetChild(3)
]

const BONUS_BUTTONS = 
[
	$("#BonusButtons").GetChild(0),
	$("#BonusButtons").GetChild(1),
	$("#BonusButtons").GetChild(2),
	$("#BonusButtons").GetChild(3),
	$("#BonusButtons").GetChild(4),
	$("#BonusButtons").GetChild(5),
	$("#BonusButtons").GetChild(6)
]

const MISC_BUTTONS = 
[
	$("#MiscButtons").GetChild(0),
	$("#MiscButtons").GetChild(1),
	$("#MiscButtons").GetChild(2)
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
	DATA[DATA_ENUM[0]] = Number(tier)

	for (let button of DIFFICULTY_BUTTONS) {
		button.SetHasClass("DifficultySelected", false)
	}

	DIFFICULTY_BUTTONS[Number(tier)].SetHasClass("DifficultySelected", true)
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
	var player_info = Game.GetLocalPlayerInfo();
	if ( !player_info ) {
		return undefined;
	} else {
		return player_info.player_has_host_privileges;
	}
}
