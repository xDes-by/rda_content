"use strict";

const DOTA_HUD_ROOT = $.GetContextPanel().GetParent().GetParent();

var DotaHUD = {
    mouseCallbacks: [],
    windowControllers: {},
};

DotaHUD.Get = function() {
    return DOTA_HUD_ROOT;
};

DotaHUD.ShowError = function(message) {
    GameEvents.SendEventClientSide("dota_hud_error_message", {
        reason: 80,
        message: message
    });
};

DotaHUD.ListenToMouseEvent = function(callback) {
    try {
        if(typeof callback !== 'function') {
            throw "Expected callback as function.";
        }
    } 
    catch (err) 
    {
        $.Msg("DotaHUD.ListenToMouseEvent throws error.");
        $.Msg(err);
        $.Msg(err.stack);
        return "";
    }
    DotaHUD.mouseCallbacks.push(callback);
};

DotaHUD.IsCursorOverPanel = function(panel) {
    if(panel == null) {
        return false;
    }
    
    let cursorPos = GameUI.GetCursorPosition();

    if (cursorPos[0] < panel.actualxoffset 
        || panel.actualxoffset + panel.contentwidth < cursorPos[0] 
        || cursorPos[1] < panel.actualyoffset 
        || panel.actualyoffset + panel.contentheight < cursorPos[1]
    ) 
    {
        return true;
    }
    return false;
};

function FireMouseEvent(eventType, clickBehavior)
{
    for(let i = 0; i < DotaHUD.mouseCallbacks.length; i++) {
        if (DotaHUD.mouseCallbacks[i]) {
            try 
            {
                DotaHUD.mouseCallbacks[i](eventType, clickBehavior); 
            } 
            catch (err) 
            { 
                $.Msg("FireMouseEvent callback error.");
                $.Msg(err);
                $.Msg(err.stack);
            }
        }
    }
}

DotaHUD.WindowOpen = function(key){
    for(let i = 0; i < Object.keys(DotaHUD.windowControllers).length; i++){
        if(Object.keys(DotaHUD.windowControllers)[i] == key){
            if(DotaHUD.windowControllers[key].is_open == false){
                DotaHUD.windowControllers[key].is_open = true
                DotaHUD.windowControllers[key].open()
            }else{
                DotaHUD.WindowClose(key)
            }
        }else{
            DotaHUD.WindowClose(Object.keys(DotaHUD.windowControllers)[i])
        }
    }
}
DotaHUD.WindowClose = function(key){
    if(DotaHUD.windowControllers[key].is_open == true){
        DotaHUD.windowControllers[key].is_open = false
        DotaHUD.windowControllers[key].close()
    }
}
GameUI.CustomUIConfig().DotaHUD = DotaHUD;

function RegisterKeyBind(name, callback) {
    if (Game.Events[name] == null) {
      RegisterKeyBindHandler(name);
      var key = GetKeyBind(name);
      if (key !== '') Game.CreateCustomKeyBind(key, GetCommandName(name));
    }
  
    Game.Events[name][callback.name] = callback;
}
  
GameUI.CustomUIConfig().RegisterKeyBind = RegisterKeyBind;

function SetClasses()
{
    DOTA_HUD_ROOT.SetHasClass("ShopOpened", Game.IsShopOpen());
    DOTA_HUD_ROOT.SetHasClass("AltPressed", GameUI.IsAltDown());
    DOTA_HUD_ROOT.SetHasClass("CtrlPressed", GameUI.IsControlDown());
    DOTA_HUD_ROOT.SetHasClass("ShiftPressed", GameUI.IsShiftDown());
    DOTA_HUD_ROOT.SetHasClass("IsToolsMode", Game.IsInToolsMode());

    let selectedUnit = Players.GetLocalPlayerPortraitUnit();
    DOTA_HUD_ROOT.SetHasClass("NonHero", !Entities.IsHero(selectedUnit));
    $.Schedule(0.05, SetClasses);
}

(function() {
    GameEvents.Subscribe('mountain_dota_hud_show_hud_error', function(data) {
        DotaHUD.ShowError(data.message);
    });

    GameUI.SetMouseCallback(function(eventType, clickBehavior) {
        FireMouseEvent(eventType, clickBehavior);
        return false;
    });

	SetClasses();
})();