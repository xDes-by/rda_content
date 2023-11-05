const ITEMS_TO_VIEW = 
[
    "item_boss_summon",
    "item_ticket",
    "item_forever_ward",
]
const ITEMS_SCROLL =
[
    "item_armor_aura",
    "item_base_damage_aura",
    "item_expiriance_aura",
    "item_move_aura",
    "item_attack_speed_aura",
    "item_hp_aura",
]
const ITEMS_ALL = ITEMS_TO_VIEW.concat(ITEMS_SCROLL);
const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
const lower_hud = DotaHUD.Get().FindChildTraverse("lower_hud");
const MyCustomStashPanel = $("#CustomStash_Panel");
if(!lower_hud.FindChildTraverse("CustomStash_Panel")){
    MyCustomStashPanel.SetParent(lower_hud);
}

function FindItemInShop(tab, itemname){
    for(let categoryKey in tab){
        if(typeof(tab[categoryKey]) == "string") continue;
        for(let itemKey in tab[categoryKey]){
            if(typeof(tab[categoryKey][itemKey]) == "string") continue;
            if(tab[categoryKey][itemKey].itemname != undefined && tab[categoryKey][itemKey].itemname == itemname){
                return tab[categoryKey][itemKey]
            }
        }
    }
    return false
}
var number_items_first_line = 0
var number_items_second_line = 0
function InitStash(t){
    for(let itemname of ITEMS_TO_VIEW){
        const itemPanel = $.CreatePanel("Panel", MyCustomStashPanel.FindChildTraverse("CustomInventoryFirstLine"), `${itemname}_Panel`)
        itemPanel.BLoadLayout("file://{resources}/layout/custom_game/RDAshop/itemStashLayout.xml", false, false) //("CustomInventorySlot")
        itemPanel.FindChildTraverse("ItemImage").itemname = itemname
        const ItemInfo = FindItemInShop(t, itemname)
        itemPanel.SetPanelEvent("onactivate", TakeItem(itemname))
        itemPanel.SetPanelEvent("oncontextmenu", ReturnItem(itemname))
        if(!ItemInfo){
            itemPanel.FindChildTraverse("ItemCount").text = 0
        }else{
            itemPanel.FindChildTraverse("ItemCount").text = ItemInfo.now
        }
        number_items_first_line += 1
    }
    for(let itemname of ITEMS_SCROLL){
        const itemPanel = $.CreatePanel("Panel", MyCustomStashPanel.FindChildTraverse("CustomInventorySecondLine"), `${itemname}_Panel`)
        itemPanel.BLoadLayout("file://{resources}/layout/custom_game/RDAshop/itemStashLayout.xml", false, false)
        itemPanel.FindChildTraverse("ItemImage").itemname = itemname
        const ItemInfo = FindItemInShop(t, itemname)
        itemPanel.SetPanelEvent("onactivate", TakeItem(itemname))
        itemPanel.SetPanelEvent("oncontextmenu", ReturnItem(itemname))
        if(!ItemInfo){
            itemPanel.FindChildTraverse("ItemCount").text = 0
        }else{
            itemPanel.FindChildTraverse("ItemCount").text = ItemInfo.now
        }
        number_items_second_line += 1
    }
    UpdateCooldowns()
}

function TakeItem(itemname){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        const itemPanel = MyCustomStashPanel.FindChildTraverse(`${itemname}_Panel`)
        const itemCountPanel = itemPanel.FindChildTraverse("ItemCount")
        const updatedCount = Number(itemCountPanel.text) - 1
        const IsControlDown = GameUI.IsControlDown()
        if(updatedCount < 0) return
        itemCountPanel.text = updatedCount
        GameEvents.SendCustomGameEventToServer ("CustomShopStash_TakeItem",{
            itemname : itemname,
            IsControlDown : IsControlDown,
        })
    }
}

function ReturnItem(itemname){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        GameEvents.SendCustomGameEventToServer ("CustomShopStash_ReturnItem",{
            itemname : itemname,
        })
    }
}

function UpdateCooldowns(){
    const PlayerID = Players.GetLocalPlayer()
    const playerIndex = Players.GetPlayerHeroEntityIndex( PlayerID )
    for(let itemname of ITEMS_ALL){
        const itemPanel = MyCustomStashPanel.FindChildTraverse(`${itemname}_Panel`)
        itemPanel.FindChildTraverse("ItemCD").visible = false
    }
    for(let buffIndex = 0; buffIndex < Entities.GetNumBuffs( playerIndex ); buffIndex++){
        const buff = Entities.GetBuff( playerIndex, buffIndex )
        const buffName = Buffs.GetName( playerIndex, buff )
        for(let itemname of ITEMS_ALL){
            const modifierCdName = `modifier_${itemname}_cd`
            const itemPanel = MyCustomStashPanel.FindChildTraverse(`${itemname}_Panel`)
            if(buffName == modifierCdName){
                const RemainingTime = Buffs.GetRemainingTime( playerIndex, buff )
                itemPanel.FindChildTraverse("ItemCD").text = Math.floor(RemainingTime)
                itemPanel.FindChildTraverse("ItemCD").visible = true
            }
        }
    }
    $.Schedule(0.5, UpdateCooldowns); 
}

function UseAllScrollButton(){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        GameEvents.SendCustomGameEventToServer ("CustomShopStash_UseAllScroll", ITEMS_SCROLL)
    }
}
var isOpen = true
function HideStash(){
    return()=>{
        if(Game.IsHUDFlipped()){
            var scaleX = -1
        }else{
            var scaleX = 1
        }
        if(isOpen == true){
            isOpen = false
            var lines = Math.ceil(number_items_first_line / 3) + Math.ceil(number_items_second_line / 3)
            MyCustomStashPanel.style.transform = `scaleX( ${scaleX} ) translate3d(0px, ${30 + lines * 52}px, 0px)`
            MyCustomStashPanel.FindChildTraverse("CustomStashTopContainer_Panel").GetChild(0).text = $.Localize("#panorama_custon_stash_click_for_open")
        }else{
            isOpen = true
            MyCustomStashPanel.style.transform = `scaleX( ${scaleX} ) translate3d(0px, 0px, 0px)`
            MyCustomStashPanel.FindChildTraverse("CustomStashTopContainer_Panel").GetChild(0).text = "\n"+$.Localize("#panorama_custon_stash_description")+"\n"
        }
    }
}

(function(){
    GameEvents.Subscribe( "initShop", InitStash)
    GameEvents.Subscribe( "UpdateStore", (tab)=>{
        for(let i in tab){
            const itemname = tab[i].itemname
            if(!itemname || !ITEMS_ALL.includes(itemname)) continue
            const categoryKey = tab[i].categoryKey 
            const itemKey = tab[i].itemKey
            const count = tab[i].count
            const itemPanel = MyCustomStashPanel.FindChildTraverse(`${itemname}_Panel`)
            itemPanel.FindChildTraverse("ItemCount").text = count
            itemPanel.visible = true
        }
    })
    MyCustomStashPanel.FindChildTraverse("PanelForScrollButton").SetPanelEvent("onactivate", UseAllScrollButton())
    MyCustomStashPanel.SetPanelEvent("onactivate", HideStash())
    if(Game.IsHUDFlipped()){
        MyCustomStashPanel.style.transform = "scaleX(-1)"
    }else{
        MyCustomStashPanel.style.transform = "scaleX(1)"
    }
})();