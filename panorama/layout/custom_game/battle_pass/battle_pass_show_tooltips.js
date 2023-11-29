const ShowItemTooltip = function(panel, data, reward_type){
    return ()=>{
        $.DispatchEvent(
            "UIShowCustomLayoutParametersTooltip",
            panel,
            "AttackTooltip",
            "file://{resources}/layout/custom_game/battle_pass/tooltip/battle_pass_tooltip.xml",
            GetItemTooltipParamsString(data, reward_type),
        );
    }
}
const HideItemTooltip = function(panel, data){
    return ()=>{
        $.DispatchEvent("UIHideCustomLayoutTooltip", panel, "AttackTooltip");
    }
}
function ShowAbilityTooltip(panel, abilityname){
    return ()=>{
        $.DispatchEvent("DOTAShowAbilityTooltip", panel, abilityname);
    }
}
function HideAbilityTooltip(){
    return ()=>{
        $.DispatchEvent("DOTAHideAbilityTooltip");
    }
}
function ShowTooltip(message, panel){
    return ()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", panel, $.Localize("#"+message));
    }
}
function HideTooltip(){
    return ()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    }
}