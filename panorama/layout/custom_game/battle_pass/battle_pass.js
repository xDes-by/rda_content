"use strict";
var BattlePass = {
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

BattlePass.BuildView = function(middle){
    if(middle < 2){
        middle = 2
    }else if(middle > 50 - 3){
        middle = 50 - 3
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

    for(let i = 1; i <= 50; i++){
        if(i > middle + 4){
            this.item[i].panel.style.position = `${this.middlePos + (this.size * 5)}px 0px 0px`;
        }
        if(i < middle - 4){
            this.item[i].panel.style.position = `${this.middlePos + (this.size * -5)}px 0px 0px`;
        }
    }
    this.middle = middle
}
BattlePass.wheel = function(direction){
    if(!$("#BPCallAwardPanel").BHasHoverStyle()){return}

    if(direction == 'up' && this.middle != 5)
    {
        BattlePass.BuildNextBigAward(this.middle - 1 + 3)
        BattlePass.BuildView(this.middle - 1)
    }
    if(direction == 'down' && this.middle <= 50-4)
    {
        BattlePass.BuildNextBigAward(this.middle + 1 + 3)
        BattlePass.BuildView(this.middle + 1)
    }
}


BattlePass.GetAward = function(type, number, gn){
    if(this.level < number) return
    GameEvents.SendCustomGameEventToServer("GetReward", {
        type : type,
        number : number,
        layer : gn,
    });
}
BattlePass.GetAll = function(){
    GameEvents.SendCustomGameEventToServer("GetAllReward", {});
    BattlePass.BuildAvailable()
}
BattlePass.BuildAvailable = function(){
    for(let i = 1; i <= 50; i++){
        if(i <= BattlePass.level){
            
            this.item[i].panel.FindChildTraverse("LevelsGone").visible = true
        }
        const basePanel = this.item[i].panel.FindChildTraverse("RewardPositionBase")
        const goldPanel = this.item[i].panel.FindChildTraverse("RewardPositionGold")
        if(BattlePass.available.base[i] == true){
            basePanel.FindChildTraverse("GalkaPanel").visible = false
            basePanel.FindChildTraverse("HaveAwardPanel").visible = true
        }else if(BattlePass.available.base[i] == false){
            basePanel.FindChildTraverse("GalkaPanel").visible = true
            basePanel.FindChildTraverse("HaveAwardPanel").visible = false
        }else if(BattlePass.available.base[i] == null){
            basePanel.FindChildTraverse("GalkaPanel").visible = false
            basePanel.FindChildTraverse("HaveAwardPanel").visible = false
        }
        if(BattlePass.available.gold[i] != null && BattlePass.available.gold[i][1] == true && BattlePass.premium){
            goldPanel.GetChild(0).FindChildTraverse("GalkaPanel").visible = false
            goldPanel.GetChild(0).FindChildTraverse("HaveAwardPanel").visible = true
        }else if(BattlePass.available.gold[i] != null && BattlePass.available.gold[i][1] == false && BattlePass.premium){
            goldPanel.GetChild(0).FindChildTraverse("GalkaPanel").visible = true
            goldPanel.GetChild(0).FindChildTraverse("HaveAwardPanel").visible = false
        }else{
            goldPanel.GetChild(0).FindChildTraverse("GalkaPanel").visible = false
            goldPanel.GetChild(0).FindChildTraverse("HaveAwardPanel").visible = false
        }
        if(BattlePass.available.gold[i] != null && BattlePass.available.gold[i][2] == true && BattlePass.premium){
            goldPanel.GetChild(1).FindChildTraverse("GalkaPanel").visible = false
            goldPanel.GetChild(1).FindChildTraverse("HaveAwardPanel").visible = true
        }else if(BattlePass.available.gold[i] != null && BattlePass.available.gold[i][2] == false && BattlePass.premium){
            goldPanel.GetChild(1).FindChildTraverse("GalkaPanel").visible = true
            goldPanel.GetChild(1).FindChildTraverse("HaveAwardPanel").visible = false
        }else{
            goldPanel.GetChild(1).FindChildTraverse("GalkaPanel").visible = false
            goldPanel.GetChild(1).FindChildTraverse("HaveAwardPanel").visible = false
        }
    }
    $("#BPLevelLabel").text = BattlePass.level + " Уровень"
    $("#BPExpCounterLabel").text = `${BattlePass.exp} / ${BattlePass.ExpToLevelUp[BattlePass.level + 1]}`
    $("#BPLevelProgressBar").value = BattlePass.exp
}

BattlePass.BuildNextBigAward = function(position){
    if(position < 50){
        position++
        while(position % 5 != 0){
            position++
        }
    }

    const basePanel = $("#BPNextBigBaseAward").GetChild(0)
    basePanel.style.backgroundImage = "url('file://{resources}/images/custom_game/"+this.item[position].rewardBase.img+"')"
    basePanel.style.backgroundSize = "contain"
    basePanel.FindChildTraverse("CounterPanelLabel").text = this.item[position].rewardBase.info.amount

    let goldAwardPanel = $("#BPNextBigGoldAward").FindChildTraverse("RewardPositionGold").GetChild(0)
    goldAwardPanel.style.backgroundImage = "url('file://{resources}/images/custom_game/"+this.item[position].rewardGold[1].img+"')"
    goldAwardPanel.style.backgroundSize = "contain"
    goldAwardPanel.FindChildTraverse("CounterPanelLabel").text = this.item[position].rewardGold[1].info.amount
    if(this.item[position].rewardGold[2] != null){
        goldAwardPanel = $("#BPNextBigGoldAward").FindChildTraverse("RewardPositionGold").GetChild(1)
        goldAwardPanel.style.backgroundImage = "url('file://{resources}/images/custom_game/"+this.item[position].rewardGold[2].img+"')"
        goldAwardPanel.style.backgroundSize = "contain"
        goldAwardPanel.FindChildTraverse("CounterPanelLabel").text = this.item[position].rewardGold[2].info.amount
    }else{
        $("#BPNextBigGoldAward").FindChildTraverse("RewardPositionGold").GetChild(0).style.verticalAlign = "center"
        $("#BPNextBigGoldAward").FindChildTraverse("RewardPositionGold").GetChild(1).visible = false
    }
    $("#BPNextBigGoldAward").FindChildTraverse("LevelCounterLabel").text = "Ур. " + position
}

BattlePass.init = ()=>{
    $("#BPGetAllPanel").SetPanelEvent("onmouseactivate", ()=>{BattlePass.GetAll()})
    BattlePass.ExpToLevelUp = CustomNetTables.GetTableValue("BattlePass", "ExpToLevelUp")
    let t = CustomNetTables.GetTableValue("BattlePass", "reward")
    let pan2 = $("#BPCallAwardPanel")
    pan2.RemoveAndDeleteChildren()
    for(let i = 1; i <= 50; i++){
        let pan3 = $.CreatePanel("Panel", pan2, `bp_level_${i}`)
        pan3.BLoadLayoutSnippet("bp_level_line_1")
        pan3.AddClass("AwardPanel")
        pan3.FindChildTraverse("LevelCounterLabel").text = "Ур. " + i
        const basePanel = pan3.FindChildTraverse("RewardPositionBase")
        basePanel.style.backgroundImage = "url('file://{resources}/images/custom_game/"+t.base[i].img+"')"
        basePanel.style.backgroundSize = "contain"
        basePanel.FindChildTraverse("CounterPanelLabel").text = t.base[i].info.amount

        let goldAwardPanel = pan3.FindChildTraverse("RewardPositionGold").GetChild(0)
        goldAwardPanel.style.backgroundImage = "url('file://{resources}/images/custom_game/"+t.gold[i][1].img+"')"
        goldAwardPanel.style.backgroundSize = "contain"
        goldAwardPanel.FindChildTraverse("CounterPanelLabel").text = t.gold[i][1].info.amount
        if(t.gold[i][2] != null){
            goldAwardPanel = pan3.FindChildTraverse("RewardPositionGold").GetChild(1)
            goldAwardPanel.style.backgroundImage = "url('file://{resources}/images/custom_game/"+t.gold[i][2].img+"')"
            goldAwardPanel.style.backgroundSize = "contain"
            goldAwardPanel.FindChildTraverse("CounterPanelLabel").text = t.gold[i][2].info.amount
        }else{
            pan3.FindChildTraverse("RewardPositionGold").GetChild(0).style.verticalAlign = "center"
            pan3.FindChildTraverse("RewardPositionGold").GetChild(1).visible = false
        }
        pan3.FindChildTraverse("LevelsGone").visible = false

        basePanel.SetPanelEvent("onmouseactivate", function(){
            BattlePass.GetAward('base', i)
        })
        pan3.FindChildTraverse("RewardPositionGold").GetChild(0).SetPanelEvent("onmouseactivate", function(){
            BattlePass.GetAward('gold', i, 1)
        })
        pan3.FindChildTraverse("RewardPositionGold").GetChild(1).SetPanelEvent("onmouseactivate", function(){
            BattlePass.GetAward('gold', i, 2)
        })
        BattlePass.item[i] = {}
        BattlePass.item[i].rewardBase = t.base[i]
        BattlePass.item[i].rewardGold = t.gold[i]
        BattlePass.item[i].panel = pan3
    }
}

BattlePass.UpdateAvailable = (t)=>{
    BattlePass.level = t.level
    BattlePass.exp = t.exp
    BattlePass.premium = t.premium
    BattlePass.available = t.available
    BattlePass.BuildAvailable()
    if(!BattlePass.firstUpdate){
        BattlePass.BuildView(BattlePass.level < 5 ? 5 :  BattlePass.level+1)
        BattlePass.firstUpdate = true
    }
    
    BattlePass.BuildNextBigAward(BattlePass.level + 3 || 8)
}

var DotaHUD = GameUI.CustomUIConfig().DotaHUD;


function OnMouseEvent(eventName, arg) {
	if ( eventName === "wheeled" ){
        if ( arg < 0 ){
            BattlePass.wheel('down')
        }
        else if ( arg > 0 ){
            BattlePass.wheel('up')
        }
    }
}

DotaHUD.ListenToMouseEvent(OnMouseEvent);

function BPTableListener(_, key, data){
    if(key != Players.GetLocalPlayer()) return
    BattlePass.UpdateAvailable(data)
}


BattlePass.init()

CustomNetTables.SubscribeNetTableListener("BattlePass", BPTableListener)

if(CustomNetTables.GetTableValue("BattlePass", Players.GetLocalPlayer())){
    BattlePass.UpdateAvailable(CustomNetTables.GetTableValue("BattlePass", Players.GetLocalPlayer()))
}