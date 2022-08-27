function OnClickEasy() {
	$.Msg("easy");
	
	var panel = $('#defselect'); 
	panel.SetHasClass('Visible', !panel.BHasClass('Visible'))
	GameEvents.SendCustomGameEventToServer( "defselecteasy", {} );
}

function OnClickMedium() {
	$.Msg("medium");
	
	var panel = $('#defselect'); 
	panel.SetHasClass('Visible', !panel.BHasClass('Visible'))	
	
	GameEvents.SendCustomGameEventToServer( "defselectmed", {} );
}

function OnClickHard() {
	$.Msg("hard");
	
	var panel = $('#defselect'); 
	panel.SetHasClass('Visible', !panel.BHasClass('Visible'))	
	
	GameEvents.SendCustomGameEventToServer( "defselecthard", {} );
} 

function closeVote() {
	$.Msg("close");
	var panel = $('#defselect'); 
	panel.SetHasClass('Vis', !panel.BHasClass('Vis'))	
}
function Init() {
	GameEvents.Subscribe( "donevote", closeVote );
}

Init()