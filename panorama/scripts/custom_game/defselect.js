function OnClickEasy() {
	
	var panel = $('#defselect'); 
	panel.SetHasClass('Visible', !panel.BHasClass('Visible'))
	GameEvents.SendCustomGameEventToServer( "defselecteasy", {} );
}

function OnClickMedium() {
	
	var panel = $('#defselect'); 
	panel.SetHasClass('Visible', !panel.BHasClass('Visible'))	
	
	GameEvents.SendCustomGameEventToServer( "defselectmed", {} );
}

function OnClickHard() {
	
	var panel = $('#defselect'); 
	panel.SetHasClass('Visible', !panel.BHasClass('Visible'))	
	
	GameEvents.SendCustomGameEventToServer( "defselecthard", {} );
} 

function closeVote() {
	var panel = $('#defselect'); 
	panel.SetHasClass('Vis', !panel.BHasClass('Vis'))	
}
function Init() {
	GameEvents.Subscribe( "donevote", closeVote );
}

Init()