function global_event_warlock_show(){
	$('#notipanel_1').visible = true;
	$('#notipanel_1').AddClass('show');
	$.Schedule(5,function(){
		$('#notipanel_1').RemoveClass('show')
		$('#notipanel_1').AddClass('hide')
		$.Schedule(2,function(){
			$('#notipanel_1').RemoveClass('hide')
			$('#notipanel_1').visible = false;
		});
	});
}

function global_event_dragon_show(){
	$('#notipanel_2').visible = true;
	$('#notipanel_2').AddClass('show');
	$.Schedule(5,function(){
		$('#notipanel_2').RemoveClass('show')
		$('#notipanel_2').AddClass('hide')
		$.Schedule(2,function(){
			$('#notipanel_2').RemoveClass('hide')
			$('#notipanel_2').visible = false;
		});
	});
}


function global_event_roshan_show(){
	$('#notipanel_3').visible = true;
	$('#notipanel_3').AddClass('show');
	$.Schedule(5,function(){
		$('#notipanel_3').RemoveClass('show')
		$('#notipanel_3').AddClass('hide')
		$.Schedule(2,function(){
			$('#notipanel_3').RemoveClass('hide')
			$('#notipanel_3').visible = false;
		});
	});
}

 
(function() {
	$("#notipanel_1").visible = false;
	$("#notipanel_2").visible = false; 
	$("#notipanel_3").visible = false; 
	GameEvents.Subscribe('global_event_warlock_show', global_event_warlock_show);
	GameEvents.Subscribe('global_event_dragon_show', global_event_dragon_show);
	GameEvents.Subscribe('global_event_roshan_show', global_event_roshan_show);
})();
