GameEvents.Subscribe('custom_loading_screen', custom_loading_screen);


function custom_loading_screen(){
    if($('#custom_loading_screen')){
        $('#custom_loading_screen').visible = false
    }
  
}