"use strict";

/* Initialisation - runs when the element is created
=========================================================================*/
(function () {
	InitializeUI()
	
	// Hides battlecuck crap
	var hit_test_blocker = $.GetContextPanel().GetParent().FindChild("SidebarAndBattleCupLayoutContainer");

	if (hit_test_blocker) {
		hit_test_blocker.hittest = false;
		hit_test_blocker.hittestchildren = false;
	}
})();

function InitializeUI() {
	if (Game.GetAllPlayerIDs().length === 0) {
		$.Schedule(1, InitializeUI);
		return;
	}

	// Make the game options panel visible
	var game_options_panel = $('#game_options_container')
	game_options_panel.style.visibility = 'visible';
	// game_options_panel.RemoveAndDeleteChildren();
	// Animate it
	game_options_panel.style.opacity = 0.0;
	AnimatePanel(game_options_panel, { "transform": "translateX(250px);", "opacity": "1;" }, 1.0, "ease-out"); 

	let amount = Game.GetAllPlayerIDs().length
	$.Msg('Player counts = ' + amount)

	game_options_panel.BLoadLayout('file://{resources}/layout/custom_game/settings/game_settings.xml', false, false)

	if (!CheckForHostPrivileges())
	{
		game_options_panel.hittestchildren = false;
		game_options_panel.hittest = false;
	}
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
