"use strict";
var DaysPass = {
    item : [],
    size : 121,
    premium : false,
    middlePos : 484,
    level : 170,
    numberOfRewardPerPage : 10,
    middle : null,
    unique : [1,50,100,150,200,250,300],
    available : { base:[], gold:[] },
    exp : 450,
}

DaysPass.BuildView = function(middle){

    if(middle < 2){
        middle = 2
    }else if(middle > 30 - 3){
        middle = 30 - 3
    }
    this.item[middle].panel.style.position = `${this.middlePos}px 0px 0px`;
    for(let i = 1; i <= 4; i++){
        if(this.item[middle + i] != undefined)
        {
            this.item[middle + i].panel.style.position = `${this.middlePos + (this.size * i)}px 0px 0px`;
        }
        if(this.item[middle - i] != undefined)
        {
            this.item[middle - i].panel.style.position = `${this.middlePos - (this.size * i)}px 0px 0px`;
        }
    }

    for(let i = 1; i <= 30; i++){
        if(i > middle + 4){
            this.item[i].panel.style.position = `${this.middlePos + (this.size * 5)}px 0px 0px`;
        }
        if(i < middle - 4){
            this.item[i].panel.style.position = `${this.middlePos + (this.size * -5)}px 0px 0px`;
        }
    }
    this.middle = middle
}
DaysPass.wheel = function(direction){
    if(!$("#DeysRewardLine").BHasHoverStyle()){return}

    if(direction == 'up' && this.middle != 5)
    {
        DaysPass.BuildNextBigAward(this.middle - 1 + 3)
        DaysPass.BuildView(this.middle - 1)
    }
    if(direction == 'down' && this.middle <= 30-4)
    {
        DaysPass.BuildNextBigAward(this.middle + 1 + 3)
        DaysPass.BuildView(this.middle + 1)
    }
}

DaysPass.GetAward = function(number){
    if(this.level < number) return
    GameEvents.SendCustomGameEventToServer("GetReward", {
        type : "day",
        number : number,
    });
}

DaysPass.BuildAvailable = function(){
    for(let i = 1; i <= 30; i++){
        if(i <= DaysPass.level){
            this.item[i].panel.FindChildTraverse("DaysGone").visible = true
            if(DaysPass.available[i] == true){
                this.item[i].panel.FindChildTraverse("GalkaPanel").visible = false
                this.item[i].panel.FindChildTraverse("HaveAwardPanel").visible = true
            }else{
                this.item[i].panel.FindChildTraverse("GalkaPanel").visible = true
                this.item[i].panel.FindChildTraverse("HaveAwardPanel").visible = false
            }
        }else{
            this.item[i].panel.FindChildTraverse("GalkaPanel").visible = false
            this.item[i].panel.FindChildTraverse("HaveAwardPanel").visible = false
        }
    }

    $("#DayContLabel").text = "День " + DaysPass.level
}

DaysPass.BuildNextBigAward = function(position){
    if(position < 30){
        position++
        while(position % 5 != 0){
            position++
        }
    }


    const basePanel = $("#DaysNextAwardPanel")
    basePanel.FindChildTraverse("DaysAwardItemContainer").style.backgroundImage = "url('file://{resources}/images/custom_game/"+this.item[position].award.img+"')"
    basePanel.FindChildTraverse("DaysAwardItemContainer").style.backgroundSize = "contain"
    basePanel.FindChildTraverse("CounterPanelLabel").text = this.item[position].award.info.amount
    basePanel.FindChildTraverse("AwardDayCounterLabel").text = "День " + position
}

DaysPass.init = function(t){
    $.Msg(t)
    let pan2 = $("#DeysAwardLinePanel")
    pan2.RemoveAndDeleteChildren()
    for(let i = 1; i <= 30; i++){
        let pan3 = $.CreatePanel("Panel", pan2, `days_level_${i}`)
        pan3.BLoadLayoutSnippet("days_level")
        pan3.AddClass("DaysAwardContainer")
        pan3.FindChildTraverse("AwardDayCounterLabel").text = "День " + i
        pan3.FindChildTraverse("DaysAwardItemContainer").style.backgroundImage = "url('file://{resources}/images/custom_game/"+t.days[i].img+"')"
        pan3.FindChildTraverse("DaysAwardItemContainer").style.backgroundSize = "contain"
        pan3.FindChildTraverse("CounterPanelLabel").text = t.days[i].info.amount

        pan3.FindChildTraverse("DaysGone").visible = false
        pan3.SetPanelEvent("onmouseactivate", function(){
            DaysPass.GetAward(i)
        })
        DaysPass.item[i] = {}
        DaysPass.item[i].award = t.days[i]
        DaysPass.item[i].panel = pan3
    }
}

DaysPass.UpdateAvailable = function(t){
    DaysPass.level = t.day
    DaysPass.available = t.available.days
    DaysPass.BuildAvailable()
    DaysPass.BuildNextBigAward(DaysPass.level + 3 || 8)
    if(!DaysPass.firstUpdate){
        DaysPass.BuildView(DaysPass.level < 5 ? 5 :  DaysPass.level+1)
        DaysPass.firstUpdate = true
    }
}

var DotaHUD = GameUI.CustomUIConfig().DotaHUD;


function OnMouseEvent(eventName, arg) {
	if ( eventName === "wheeled" ){
        if ( arg < 0 ){
            DaysPass.wheel('down')
        }
        else if ( arg > 0 ){
            DaysPass.wheel('up')
        }
    }
}

DotaHUD.ListenToMouseEvent(OnMouseEvent);

DaysPass.init(CustomNetTables.GetTableValue("BattlePass", "reward"))

function DaysTableListener(_, key, data){
    if(key != Players.GetLocalPlayer()) return
    DaysPass.UpdateAvailable(data)
}
CustomNetTables.SubscribeNetTableListener("BattlePass", DaysTableListener)
if(CustomNetTables.GetTableValue("BattlePass", Players.GetLocalPlayer())){
    DaysPass.UpdateAvailable(CustomNetTables.GetTableValue("BattlePass", Players.GetLocalPlayer()))
}