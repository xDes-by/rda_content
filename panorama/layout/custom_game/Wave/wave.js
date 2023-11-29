let Button = {}
Button.Action = ()=>{
    return ()=>{
        if(Button.isOpen == true || Button.isOpen == null){
            Button.Close()
        }else{
            Button.Open()
        }
    }
}
$("#hide_button_container").SetPanelEvent("onmouseactivate", Button.Action())
$("#rdandom_wave_panel").visible = false
Button.Open = ()=>{
    Button.isOpen = true
    $("#hide_button").style.backgroundImage = 'url("s2r://panorama/images/control_icons/arrow_min_left_psd.vtex")'
    $("#waveNotificationPanel").style.transitionDuration = "0.2s"
    $("#waveNotificationPanel").style.position = "0px 0 0";
}
Button.Close = ()=>{
    Button.isOpen = false
    $("#hide_button").style.backgroundImage = 'url("s2r://panorama/images/control_icons/arrow_min_right_psd.vtex")'
    $("#waveNotificationPanel").style.transitionDuration = "0.2s"
    $("#waveNotificationPanel").style.position = "-620px 0 0";
}
let WaveNotification = {}

WaveNotification.SetValue = (t)=>{
    $("#waveButtonPanel").FindChildTraverse("waveNumber").text = t.number
    $("#waveNotificationPanel").FindChildTraverse("WaveNameLabel").text = $.Localize("#wave_" + t.name)
    $("#waveNotificationPanel").FindChildTraverse("WaveDescriptionLabel").text = $.Localize("#description_" + t.description)
    $("#waveNotificationPanel").FindChildTraverse("waveImg_1").style.backgroundImage = "url('file://{resources}/images"+ t.img + "')"
}

WaveNotification.Show = ()=>{
    $("#waveNotificationPanel").style.transitionDuration = "0.0s"
    $("#waveNotificationPanel").style.position = "0 -220px 0"
    $("#waveNotificationPanel").style.opacity = "1"

    $("#waveNotificationPanel").style.transitionDuration = "1.5s"
    $("#waveNotificationPanel").style.position = "0 0 0"
    
    $.Schedule(5, ()=>{
        if(Button.isOpen == false){
            Button.Close()
        }
    })
}

WaveNotification.Hide = ()=>{
    $("#waveNotificationPanel").style.transitionDuration = "3s"
    $("#waveNotificationPanel").style.opacity = "0"
}

WaveNotification.Hide()

GameEvents.Subscribe( "WaveNotification", function(t){
    WaveNotification.SetValue(t)
    WaveNotification.Show()
    if(Button.isOpen == true){
        Game.EmitSound("MegaCreeps.Dire")
    }
})

var Counter = {}

Counter.Build = ()=>{
    $("#waveCreep").text = Counter.count + "/" + Counter.need
}

GameEvents.Subscribe( "updateWaveCounter", function(t){
    Counter.need = t.need
    Counter.count = t.count
    Counter.Build()
})

GameEvents.Subscribe( "RandomWaveNoification", function(t){
    if(Button.isOpen == true){
        $("#rdandom_wave_panel").visible = true
        Game.EmitSound("MegaCreeps.Dire")
    }
    $.Schedule(15, ()=>{
        $("#rdandom_wave_panel").visible = false
    })
})