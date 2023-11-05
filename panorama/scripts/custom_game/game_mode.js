"use strict";

/* Initialisation - runs when the element is created
=========================================================================*/
(function () {
	InitializeUI()
})();

function InitializeUI() {
	if (Game.GetAllPlayerIDs().length === 0) {
		$.Schedule(1, InitializeUI);
		return;
	}
	var game_options_panel = $('#game_options_container')
	game_options_panel.style.visibility = 'visible';
	game_options_panel.style.opacity = 0.0;
	AnimatePanel(game_options_panel, { "transform": "translateX(250px);", "opacity": "1;" }, 1.0, "ease-out"); 
	game_options_panel.BLoadLayout('file://{resources}/layout/custom_game/settings/game_settings.xml', false, false)
}