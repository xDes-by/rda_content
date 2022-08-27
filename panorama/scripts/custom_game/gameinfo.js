var isOpen = false;
var tabName = '';

/*
function btn(arg){
    if(isOpen){
        if(tabName == 'mage'){
            $('#mage_desc_panel').RemoveClass('open_class')
            $('#mage_desc_panel').AddClass('close_class')
            $.Schedule(0.2, function(){
                $('#mage_desc_panel').RemoveClass('close_class')
                $('#mage_desc_panel').visible = false;
            })
        }else if(tabName == 'tank'){
            $('#tank_desc_panel').RemoveClass('open_class')
            $('#tank_desc_panel').AddClass('close_class')
            $.Schedule(0.2, function(){
                $('#tank_desc_panel').RemoveClass('close_class')
                $('#tank_desc_panel').visible = false;
            })
        }else if(tabName == 'agi'){
            $('#agi_desc_panel').RemoveClass('open_class')
            $('#agi_desc_panel').AddClass('close_class')
            $.Schedule(0.2, function(){
                $('#agi_desc_panel').RemoveClass('close_class')
                $('#agi_desc_panel').visible = false;
            })
        }
        if(tabName == arg){
            isOpen = false;
            $('#minimap').AddClass('move_map_up')
            $.Schedule(0.2, function(){
                $('#minimap').RemoveClass('move_map_up')
            })
        }else{
            $.Schedule(0.2, function(){
                if(arg == 'mage'){
                    $('#mage_desc_panel').visible = true;
                    $('#mage_desc_panel').AddClass('open_class')
                }else if(arg == 'tank'){
                    $('#tank_desc_panel').visible = true;
                    $('#tank_desc_panel').AddClass('open_class')
                }else if(arg == 'agi'){
                    $('#agi_desc_panel').visible = true;
                    $('#agi_desc_panel').AddClass('open_class')
                }
                tabName = arg;
            })
        }
    }else{
        if(arg == 'mage'){
            $('#mage_desc_panel').visible = true;
            $('#mage_desc_panel').AddClass('open_class')
        }else if(arg == 'tank'){
            $('#tank_desc_panel').visible = true;
            $('#tank_desc_panel').AddClass('open_class')
        }else if(arg == 'agi'){
            $('#agi_desc_panel').visible = true;
            $('#agi_desc_panel').AddClass('open_class')
        }
        isOpen = true;
        tabName = arg;
    }
}
*/

function opn(){
    Game.EmitSound("ui_team_select_pick_team")
    $('#page_1').visible = false;
    $('#page_2').visible = true;
}

function cls(){
    Game.EmitSound("ui_team_select_pick_team")
    $('#page_2').visible = false;
    $.Schedule(0.03, function(){
        $('#page_1').visible = true;
    })
    
    
}

function btn(arg){
    Game.EmitSound("ui_team_select_pick_team")
    if(isOpen){
        if(tabName == 'mage'){
            $('#mage_desc_panel').visible = false;
        }else if(tabName == 'tank'){
            $('#tank_desc_panel').visible = false;
        }else if(tabName == 'agi'){
            $('#agi_desc_panel').visible = false;
        }
        if(tabName == arg){
            isOpen = false;
        }else{
            if(arg == 'mage'){
                $('#mage_desc_panel').visible = true;
            }else if(arg == 'tank'){
                $('#tank_desc_panel').visible = true;
            }else if(arg == 'agi'){
                $('#agi_desc_panel').visible = true;
            }
            tabName = arg;
        }
    }else{
        if(arg == 'mage'){
            $('#mage_desc_panel').visible = true;
        }else if(arg == 'tank'){
            $('#tank_desc_panel').visible = true;
        }else if(arg == 'agi'){
            $('#agi_desc_panel').visible = true;
        }
        isOpen = true;
        tabName = arg;
    }
}


(function() {
	$('#mage_desc_panel').visible = false;
    $('#tank_desc_panel').visible = false;
    $('#agi_desc_panel').visible = false;
    $('#page_2').visible = false;
})();