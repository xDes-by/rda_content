
function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

//$.DispatchEvent( "DOTAGlobalSceneFireEntityInput", "HeroScenePanel", "sven", "SetAnimation", "death" );

var asssd = false;
var isOpen = false;
var talant_shop = null;
var isShop = false;
var talantpanel = $("#talant_root");
var portID = null, portIndex, portName;
var imbalist = {

    "int" : ["border_blue"],//border_red
    //6 9 / 7 10/ 8 11
    "int1" : ["talant_icon_6_panel","talant_icon_panel_size_3"],//6
    "int2" : ["talant_icon_5_panel","talant_icon_panel_size_2"],//5
    "int3" : ["talant_icon_11_panel","talant_icon_panel_size_1"],//11
    "int4" : ["talant_icon_10_panel","talant_icon_panel_size_1"],//10
    "int5" : ["talant_icon_9_panel","talant_icon_panel_size_1"],//9
    "int6" : ["talant_icon_2_panel","talant_icon_panel_size_1"],//2
    "int9" : ["talant_icon_1_panel","talant_icon_panel_size_1"],//1
    "int7" : ["talant_icon_8_panel","talant_icon_panel_size_1"],//8
    "int10" : ["talant_icon_7_panel","talant_icon_panel_size_1"],//7  
    "int8" : ["talant_icon_3_panel","talant_icon_panel_size_1"],//3
    "int11" : ["talant_icon_4_panel","talant_icon_panel_size_1"],//4 
    "int12" : ["talant_icon_45_panel","talant_icon_panel_size_3"],//4 

    "str" : ["border_red"],//border_green

    "str1" : ["talant_icon_13_panel","talant_icon_panel_size_3"],//13
    "str2" : ["talant_icon_22_panel","talant_icon_panel_size_2"],//22
    "str3" : ["talant_icon_18_panel","talant_icon_panel_size_1"],//18
    "str4" : ["talant_icon_17_panel","talant_icon_panel_size_1"],//17
    "str5" : ["talant_icon_19_panel","talant_icon_panel_size_1"],//19
    "str6" : ["talant_icon_16_panel","talant_icon_panel_size_1"],//16
    "str9" : ["talant_icon_12_panel","talant_icon_panel_size_1"],//12
    "str7" : ["talant_icon_15_panel","talant_icon_panel_size_1"],//15
    "str10" : ["talant_icon_14_panel","talant_icon_panel_size_1"],//14
    "str8" : ["talant_icon_21_panel","talant_icon_panel_size_1"],//21
    "str11" : ["talant_icon_20_panel","talant_icon_panel_size_1"],//20
    "str12" : ["talant_icon_46_panel","talant_icon_panel_size_3"],//4 

    "don" : ["border_gold"],//border_blue
    
    "don1" : ["talant_icon_33_panel","talant_icon_panel_size_3"],//33
    "don2" : ["talant_icon_32_panel","talant_icon_panel_size_2"],//32
    "don3" : ["talant_icon_31_panel","talant_icon_panel_size_1"],//31
    "don4" : ["talant_icon_30_panel","talant_icon_panel_size_1"],//30
    "don5" : ["talant_icon_29_panel","talant_icon_panel_size_1"],//29
    "don6" : ["talant_icon_23_panel","talant_icon_panel_size_1"],//23
    "don9" : ["talant_icon_26_panel","talant_icon_panel_size_1"],//26
    "don7" : ["talant_icon_28_panel","talant_icon_panel_size_1"],//28
    "don10" : ["talant_icon_27_panel","talant_icon_panel_size_1"],//27
    "don8" : ["talant_icon_25_panel","talant_icon_panel_size_1"],//25
    "don11" : ["talant_icon_24_panel","talant_icon_panel_size_1"],//24
    "don12" : ["talant_icon_47_panel","talant_icon_panel_size_3"],//4 

    "agi" : ["border_green"],//border_gold

    "agi1" : ["talant_icon_34_panel","talant_icon_panel_size_3"],//34
    "agi2" : ["talant_icon_35_panel","talant_icon_panel_size_2"],//35
    "agi3" : ["talant_icon_39_panel","talant_icon_panel_size_1"],//39
    "agi4" : ["talant_icon_40_panel","talant_icon_panel_size_1"],//40
    "agi5" : ["talant_icon_41_panel","talant_icon_panel_size_1"],//41
    "agi6" : ["talant_icon_38_panel","talant_icon_panel_size_1"],//38
    "agi9" : ["talant_icon_44_panel","talant_icon_panel_size_1"],//44
    "agi7" : ["talant_icon_42_panel","talant_icon_panel_size_1"],//42
    "agi10" : ["talant_icon_43_panel","talant_icon_panel_size_1"],//43
    "agi8" : ["talant_icon_37_panel","talant_icon_panel_size_1"],//37
    "agi11" : ["talant_icon_36_panel","talant_icon_panel_size_1"],//36
    "agi12" : ["talant_icon_48_panel","talant_icon_panel_size_3"],//4 

};
var heroes, pInfo, lvls;

var talantbtn;
function buildTree(){
    FindDotaHudElement("StatBranch").visible = false;
    FindDotaHudElement("level_stats_frame").visible = false;
    FindDotaHudElement("AghsStatusContainer").visible = false;
    var tree = FindDotaHudElement("StatBranch").GetParent();
    tree.style.marginRight = "60px";
    talantbtn = $.CreatePanel('Button',tree.GetParent(),'BtnStartingItems')  
    talantbtn.BLoadLayout("file://{resources}layout/custom_game/talants/hud/talant_tree.xml", false, false)
    talantbtn.FindChildTraverse("icon_bg").SetPanelEvent("onmouseactivate",function(){
        open();
    });
    
}
/*
{"lvls":{"0":0,"1":1000,"2":2500,"3":5000,"4":8000,"5":12000,"6":18000,"7":22000,"8":25000,"9":30000,"10":35000,"11":40000,"12":45000,"13":50000,"14":60000},
"info":{"npc_dota_hero_axe":{"int":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/don/don-talant-","buff":"Talant_npc_dota_hero_axe_INT_buff_","name":"Talant_npc_dota_hero_axe_INT_name_","description":"Talant_npc_dota_hero_axe_INT_text_"},"agi":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/str/str-talant-","buff":"Talant_npc_dota_hero_axe_AGI_buff_","name":"Talant_npc_dota_hero_axe_AGI_name_","description":"Talant_npc_dota_hero_axe_AGI_text_"},"don":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/int/int-talant-","buff":"Talant_npc_dota_hero_axe_DON_buff_","name":"Talant_npc_dota_hero_axe_DON_name_","description":"Talant_npc_dota_hero_axe_DON_text_"},"str":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/agi/agi-talant-","buff":"Talant_npc_dota_hero_axe_STR_buff_","name":"Talant_npc_dota_hero_axe_STR_name_","description":"Talant_npc_dota_hero_axe_STR_text_"}},"npc_dota_hero_naga_siren":{"int":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/int/int-talant-","buff":"Talant_npc_dota_hero_naga_siren_INT_buff_","name":"Talant_npc_dota_hero_naga_siren_INT_name_","description":"Talant_npc_dota_hero_naga_siren_INT_text_"},"agi":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/agi/agi-talant-","buff":"Talant_npc_dota_hero_naga_siren_AGI_buff_","name":"Talant_npc_dota_hero_naga_siren_AGI_name_","description":"Talant_npc_dota_hero_naga_siren_AGI_text_"},"don":{"startnumber":1,"form":".png","url":"/images/custom_game/talants/img/npc_dota_hero_naga_siren/don/don-talant-","buff":"Talant_npc_dota_hero_naga_siren_DON_buff_","name":"Talant_npc_dota_hero_naga_siren_DON_name_",
"description":"Talant_{"0":{"1":"npc_dota_hero_naga_siren","2":1262},"1":{"1":"npc_dota_hero_axe","2":891}}
*/
var lastdata;
var heroname, progress, herotalant = [];
function pickInit(tab){
    $.Msg("pickInit")
    // $.Msg(tab)
    var pid = Players.GetLocalPlayer();
    portID = pid;
    FindDotaHudElement("RightContainerMain").visible = false;
    var RightContainer = FindDotaHudElement("StrategyScreen");
    talantpanel = $.CreatePanel('Panel',RightContainer,'talantpanel')
    talantpanel.BLoadLayout("file://{resources}layout/custom_game/talants/hud/talant_tree_heroselection.xml", false, false);
    heroname = tab.heroname;
    herotalant[pid] = tab.herotalant;
    progress = tab.progress;

    var arr = {"str":{},"int":{},"agi":{},"don":{}};
    for(var skill in herotalant[pid]){
        var url = herotalant[pid][skill].url;
        var name = herotalant[pid][skill].name;
        var description = herotalant[pid][skill].description;
        var buff = herotalant[pid][skill].buff;

        for(var i in herotalant[pid][skill]['place']){
            var str = herotalant[pid][skill]['place'][i]
            var placearr = str.split(' ')
            var type = placearr[0];
            var number = Number(placearr[1]);
            arr[type][number] = {
                url : url,
                name : name,
                description : description,
                buff : buff
            }
        }
    }
    herotalant[pid] = arr;
    

    for(var i in cat = ["str","agi","int","don"]){
        for(var j = 1; j <= 12; j++){
            var arg = cat[i] + j;
            var container = talantpanel.FindChildTraverse("talant_tree_images_panel");
            var pan = $.CreatePanel("Panel", container, arg) 
            for(var k in imbalist[arg]){
                pan.AddClass(imbalist[arg][k])
            }
            pan.AddClass(imbalist[cat[i]][0])
            pan.SetPanelEvent("onmouseover",prepareDescription(arg));
            pan.SetPanelEvent("onmouseout",hiddeDescription(arg));
            // pan.SetPanelEvent("onmouseactivate",selectTalant(arg));
            pan.SetPanelEvent("ondblclick", ()=>{
                $.Msg("selectTalantButton")
                // Game.EmitSound("ui_team_select_shuffle")
                // let selectTalantButton = selectTalantButton(
                //     talantpanel.FindChildTraverse(arg))
                // selectTalantButton()
                
            });
            pan.i = cat[i];
            pan.j = j;
            
            var img = $.CreatePanel("Image", pan, "img"+arg);
        }
    }
    for(var i in herotalant[pid]){
        for(var j in herotalant[pid][i]){
            var arg = i + j;
            var img = talantpanel.FindChildTraverse("img"+arg);
            if(img){
                img.SetImage("file://{resources}" + herotalant[pid][i][j]["url"])
            }
        }
    }
    var data = progress;
    lastdata = data;
    setIconParam(data);
    if(talantpanel.FindChildTraverse("button"))
        talantpanel.FindChildTraverse("button").visible = false;
}

function ChangeHero(){
    var RightContainer = FindDotaHudElement("StrategyScreen");
    RightContainer.FindChildTraverse()
}
function talant_replace_hero(t){
    $.Msg("talant_replace_hero")
    if($("#talant_root")){
        $("#talant_root").FindChildTraverse(t.hero_name).visible = false
    }
}
function ChangeHeroLoadTree(tab){
    $.Msg("ChangeHeroLoadTree")
    // buildTree();
    PlayerID = tab.PlayerID;
    herotalant[PlayerID] = tab.info[PlayerID];
    pInfo[PlayerID] = tab.players[PlayerID];
    lvls = tab.lvls;
    talant_shop = tab.talant_shop;
    var pid = Players.GetLocalPlayer();
    // let scenpanel = $.CreatePanel("DOTAScenePanel", $("#talant_root"), pInfo[PlayerID][1])
    let scenpanel = $.CreatePanel("DOTAScenePanel", $("#talant_root"), pInfo[PlayerID][1], {class:"HeroScenePanel", style:"width:800px;height:800px;margin-right:10px;", unit:pInfo[PlayerID][1], particleonly:false, allowrotation:true})
    // scenpanel
    // scenpanel.style.width = "800px"
    // scenpanel.style.height = "800px"
    // scenpanel.style.marginRight = "10px"
    // scenpanel.SetUnit(pInfo[PlayerID][1], "", true)
    // scenpanel.unit = pInfo[PlayerID][1]
    // scenpanel.particleonly = false
    // scenpanel.allowrotation = true
    // scenpanel.AddClass("HeroScenePanel")// scenpanel.SpawnHeroInScenePanelByPlayerSlotWithFullBodyView(tab.match ,PlayerID)
    scenpanel.visible = false;
    if(PlayerID == pid){
        portID = PlayerID;
        portIndex = pInfo[PlayerID][2];
        portName = pInfo[PlayerID][1];
        buildTree();
    }
    var arr = {"str":{},"int":{},"agi":{},"don":{}};
    for(var skill in herotalant[PlayerID]){
        var url = herotalant[PlayerID][skill].url;
        var name = herotalant[PlayerID][skill].name;
        var description = herotalant[PlayerID][skill].description;
        var buff = herotalant[PlayerID][skill].buff;

        for(var i in herotalant[PlayerID][skill]['place']){
            var str = herotalant[PlayerID][skill]['place'][i]
            var placearr = str.split(' ')
            var type = placearr[0];
            var number = Number(placearr[1]);
            arr[type][number] = {
                url : url,
                name : name,
                description : description,
                buff : buff
            }
        }
    }
    herotalant[PlayerID] = arr;
}
function talantTreeInit(tab){
    
    buildTree();

    herotalant = tab.info;
    pInfo = tab.players;
    lvls = tab.lvls;
    talant_shop = tab.talant_shop;
    var pid = Players.GetLocalPlayer();
    // $.Msg("talantTreeInit")
    for(var i in pInfo){
        var heroname = pInfo[i][1]
        // $.Msg(heroname)
        let scenpanel = $.CreatePanel("DOTAScenePanel", $("#talant_root"), heroname, {class:"HeroScenePanel", style:"width:800px;height:800px;margin-right:10px;", unit:heroname, particleonly:false, allowrotation:true})
        // scenpanel.AddClass("HeroScenePanel")
        // scenpanel.style.width = "800px"
        // scenpanel.style.height = "800px"
        // scenpanel.style.marginRight = "10px"
        // scenpanel.SetUnit(heroname, "", true)
        // // scenpanel.unit = heroname
        // scenpanel.particleonly = false
        // scenpanel.allowrotation = true
        // const scenpanel = $.CreatePanel("Panel", $("#talant_root"), heroname)
        // scenpanel.AddClass("HeroScenePanel")
        // scenpanel.BLoadLayoutSnippet("heroModel")
        // scenpanel.GetChild(0).SetUnit(heroname, "", false)
        scenpanel.visible = false;
        if(i == pid){
            portID = i;
            portIndex = pInfo[i][2];
            portName = pInfo[i][1];
        }
    }
    
    var container = $("#talant_tree_images_panel")

    for(var id in herotalant){
        var arr = {"str":{},"int":{},"agi":{},"don":{}};
        for(var skill in herotalant[id]){
            var url = herotalant[id][skill].url;
            var name = herotalant[id][skill].name;
            var description = herotalant[id][skill].description;
            var buff = herotalant[id][skill].buff;
            var tooltip = herotalant[id][skill].tooltip;

            for(var i in herotalant[id][skill]['place']){
                var str = herotalant[id][skill]['place'][i]
                var placearr = str.split(' ')
                var type = placearr[0];
                var number = Number(placearr[1]);
                arr[type][number] = {
                    url : url,
                    name : name,
                    description : description,
                    buff : buff,
                    tooltip : tooltip,
                }
            }
        }
        herotalant[id] = arr;
    }
    for(var i in cat = ["str","agi","int","don"]){
        for(var j = 1; j <= 12; j++){
            var arg = cat[i] + j;
            var pan = $.CreatePanel("Panel", container, arg)
            for(var k in imbalist[arg]){
                pan.AddClass(imbalist[arg][k])
            }
            pan.AddClass(imbalist[cat[i]][0])
            pan.SetPanelEvent("onmouseover",prepareDescription(arg));
            pan.SetPanelEvent("onmouseout",hiddeDescription(arg));
            pan.SetPanelEvent("onmouseactivate",selectTalant(arg));
            pan.SetPanelEvent("ondblclick", selectTalantCheat(cat[i], j));
            pan.i = cat[i];
            pan.j = j;
            
            $.CreatePanel("Image", pan, "img"+arg);
        }
    }
    
    
    var tab = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer() )
    for(var i in talant_shop){
        var shop = $.CreatePanel('Panel',$("#talant-shop"),'talant-shop'+i)
        shop.AddClass("shop")
        var shop_image = $.CreatePanel('Image',shop,'shop_image'+i)
        shop_image.AddClass("shop-image")
        shop_image.SetImage("file://{resources}" + talant_shop[i]["url"])
        shop_image.SetPanelEvent("onmouseover",TipsOver(talant_shop[i]["description"],'shop_image'+i));
        shop_image.SetPanelEvent("onmouseout",TipsOut());
        var shop_text_panel = $.CreatePanel('Panel',shop,'shop_text_panel'+i)
        shop_text_panel.AddClass("shop-text-panel")
        var shop_text = $.CreatePanel('Label',shop_text_panel,'shop_text'+i)
        shop_text.AddClass("shop-text")
        shop_text.text = $.Localize("#"+ talant_shop[i]["name"] )
        if(talant_shop[i]["gems"] && talant_shop[i]["gems"] > 0){
            var shop_gem_btn_panel = $.CreatePanel('Panel',shop,'shop_gem_btn_panel'+i)
            shop_gem_btn_panel.AddClass("shop-gem-btn-panel")
            shop_gem_btn_panel.SetPanelEvent("onmouseactivate",pressShopBtn(i,"gems", shop_gem_btn_panel))
            shop_gem_btn_panel.SetPanelEvent("onmouseover",function(){Game.EmitSound("ui_select_arrow")});
            var gem_img = $.CreatePanel('Image',shop_gem_btn_panel,'gem_img_gem'+i)
            gem_img.AddClass("gem-img")
            gem_img.SetImage("file://{resources}/images/custom_game/talants/1.png")
            var price = $.CreatePanel('Panel',shop_gem_btn_panel,'price_gem'+i)
            price.AddClass("price")
            var price_text = $.CreatePanel('Label',price,'price_text_gem'+i)
            price_text.AddClass("price-text")
            price_text.text = talant_shop[i]["gems"]
            var gem_image = $.CreatePanel('Image',price,'gem_image_gem'+i)
            gem_image.AddClass("gem-image")
            gem_image.SetImage("file://{resources}/images/custom_game/RDAShop/money_logo_3.png")
            if(tab['coins'] < talant_shop[i]["gems"]){
                shop_gem_btn_panel.AddClass("no-money")
            }else{
                shop_gem_btn_panel.AddClass("btn-hover")
            }
        }
        if(talant_shop[i]["rait"] && talant_shop[i]["rait"] > 0){
            var shop_rait_btn_panel = $.CreatePanel('Panel',shop,'shop_rait_btn_panel'+i)
            shop_rait_btn_panel.AddClass("shop-rait-btn-panel")
            shop_rait_btn_panel.SetPanelEvent("onmouseactivate",pressShopBtn(i,"rait", shop_rait_btn_panel))
            shop_rait_btn_panel.SetPanelEvent("onmouseover",function(){Game.EmitSound("ui_select_arrow")});
            var gem_img = $.CreatePanel('Image',shop_rait_btn_panel,'gem_img_rait'+i)
            gem_img.AddClass("gem-img")
            gem_img.SetImage("file://{resources}/images/custom_game/talants/2.png")
            var price = $.CreatePanel('Panel',shop_rait_btn_panel,'price_rait'+i)
            price.AddClass("price")
            var price_text = $.CreatePanel('Label',price,'price_text_rait'+i)
            price_text.AddClass("price-rait")
            price_text.text = talant_shop[i]["rait"]
            var gem_image = $.CreatePanel('Image',price,'gem_image_rait'+i)
            gem_image.AddClass("rait-image")
            gem_image.SetImage("file://{resources}/images/custom_game/RDAShop/protection.png")
            if(tab['mmrpoints'] < talant_shop[i]["rait"]){
                shop_rait_btn_panel.AddClass("no-money")
            }else{
                shop_rait_btn_panel.AddClass("btn-hover")
            }
        }
    }

    
    asssd = true;
    let abilitiesPanel =  FindDotaHudElement("abilities")
    for(let i = 0; i < abilitiesPanel.GetChildCount(); i++){
        let AbilityLevelContainer = abilitiesPanel.GetChild(i).GetChild(0).FindChildTraverse("AbilityLevelContainer")
        const childCount =  AbilityLevelContainer.GetChildCount()
        for(let j = 0; j < childCount; j++){
            if(AbilityLevelContainer.GetChild(j) && childCount == 10){
                AbilityLevelContainer.GetChild(j).style.width = "4px"
                AbilityLevelContainer.GetChild(j).style.margin = "2px 1px 2px 1px"
            }else if(AbilityLevelContainer.GetChild(j) && childCount > 10){
                AbilityLevelContainer.GetChild(j).style.width = "3px"
                AbilityLevelContainer.GetChild(j).style.margin = "2px 0px 2px 1px"
            }
        }
    }
}

const selectTalantCheat = function(i, j){
    return ()=>{
        GameEvents.SendCustomGameEventToServer("selectTalantCheat",  {i : i, j : j})
    }
}

function showHeroPanel(name){
    for(var i in pInfo){
        if(pInfo[i][1] == name && talantpanel.FindChildTraverse(pInfo[i][1])){
            talantpanel.FindChildTraverse(pInfo[i][1]).visible = true;//true
        }else if(talantpanel.FindChildTraverse(pInfo[i][1])){
            talantpanel.FindChildTraverse(pInfo[i][1]).visible = false;
        }
    }
}


function portrait(){
    if(pInfo == null || isOpen == true){
        return
    }
    var idx = Players.GetLocalPlayerPortraitUnit()

    for(var i in pInfo){
        if(pInfo[i][2] == idx){
            portID = i;
            portName = pInfo[i][1];
            portIndex = pInfo[i][2];
        }
    }
    if(idx == portIndex && talantbtn){
        talantbtn.visible = true;
    }else if(idx != portIndex && talantbtn){
        talantbtn.visible = false;
    }
    let abilitiesPanel =  FindDotaHudElement("abilities")
    for(let i = 0; i < abilitiesPanel.GetChildCount(); i++){
        let AbilityLevelContainer = abilitiesPanel.GetChild(i).GetChild(0).FindChildTraverse("AbilityLevelContainer")
        const childCount =  AbilityLevelContainer.GetChildCount()
        for(let j = 0; j < childCount; j++){
            if(AbilityLevelContainer.GetChild(j) && childCount == 10){
                AbilityLevelContainer.GetChild(j).style.width = "4px"
                AbilityLevelContainer.GetChild(j).style.margin = "2px 1px 2px 1px"
            }else if(AbilityLevelContainer.GetChild(j) && childCount > 10){
                AbilityLevelContainer.GetChild(j).style.width = "3px"
                AbilityLevelContainer.GetChild(j).style.margin = "2px 0px 2px 1px"
            }
        }
    }
}

function GetPlayerIDByPortraitIndex(){
    if(pInfo == null){
        return -1
    }
    var idx = Players.GetLocalPlayerPortraitUnit()
    for(var i in pInfo){
        if(pInfo[i][2] == idx){
            return i
        }
    }
}

function open(){
    isOpen = true;
    $("#talant_root").visible = true;
    Game.EmitSound("ui_rollover_today");
    //Game.EmitSound("ui_custom_lobby_quit_slide");
    if(portID == null || !portIndex || !portName || !pInfo || !lvls || !herotalant[portID]){
        return;
    }
    for(var i in herotalant[portID]){
        for(var j in herotalant[portID][i]){
            var arg = i + j;
            var img = $("#img"+arg);
            if(img){
                img.SetImage("file://{resources}" + herotalant[portID][i][j]["url"])
            }
        }
    }
    var data = CustomNetTables.GetTableValue( "talants" , portID);
    lastdata = data;
    updateExpInfo(data);
    setIconParam(data);
    showHeroPanel(portName);
}


function updatetab(tab){
    lastdata = tab.progress;
    setIconParam(tab.progress);
}

function talantsUpdate(table_name, key, data){
    if(key == Players.GetLocalPlayer() && lvls){
        
    }
    if(key != portID){
        return;
    }

    lastdata = data;
    updateExpInfo(data)

    if($("#talant_name_label").i == "don" && data["freedonpoints"] > 0){
        talantpanel.FindChildTraverse("button").RemoveClass("brightness02");
    }else if($("#talant_name_label").i != "don" && data["freepoints"] > 0){
        talantpanel.FindChildTraverse("button").RemoveClass("brightness02");
    }


    setIconParam(data);

}

function shopinfo(table_name, key, data){
    if(key == Players.GetLocalPlayer()){
        for(var i in talant_shop){
            var pan = $('#shop_gem_btn_panel'+i)
            if(pan && data["coins"] >= talant_shop[i]["gems"] && pan.BHasClass("no-money") == true){
                pan.RemoveClass("no-money")
                pan.AddClass("btn-hover")
            }else if(pan && data["coins"] < talant_shop[i]["gems"] && pan.BHasClass("no-money") == false){
                if(pan.BHasClass("btn-hover") == true){
                    pan.RemoveClass("btn-hover")
                }
                pan.AddClass("no-money")
            }
            pan = $('#shop_rait_btn_panel'+i)
            if(pan && data["mmrpoints"] >= talant_shop[i]["rait"] && pan.BHasClass("no-money") == true){
                pan.RemoveClass("no-money")
                pan.AddClass("btn-hover")
            }else if(pan && data["mmrpoints"] < talant_shop[i]["rait"] && pan.BHasClass("no-money") == false){
                if(pan.BHasClass("btn-hover") == true){
                    pan.RemoveClass("btn-hover")
                }
                pan.AddClass("no-money")
            }
        }
    }
}
function isBonusExpAvailable(playerID) {
	const player = Players.GetPlayerHeroEntityIndex(playerID);
	for (let i = 0; i < Entities.GetNumBuffs(player); i++) {
	  const modifier = Entities.GetBuff( player, i );
	  if (Buffs.GetName(player, modifier) === "modifier_don2") {
		return true;
	  }
	}
	return false;
  }
function updateExpInfo(data){
    if(asssd == false){
        asssd = true;
        return
    }
    var level,text,
    lvlup, percent,
    intnow;
    level = Number(data["level"]);
    text = "lvl." + level;
    if(data["freepoints"] > 0)
        text += "( " + data["freepoints"] + " )";
    $("#RDA_level_label").text = text;
    if(lvls[level+1]){
        var this_lvl = 0
        for(var i = 1; i <= level;i++){
            this_lvl = this_lvl + lvls[i];
        }
        var next_lvl = this_lvl + lvls[level + 1];
        lvlup = lvls[level+1];
        intnow = next_lvl - data["totalexp"];
        intnow = lvlup - intnow;
        percent = ( intnow / lvlup ) * 100;
        percent = parseFloat(Math.ceil( percent * 10 ) / 10).toFixed(1)
        text = (Math.ceil( Number(intnow) * 10 ) / 10).toFixed(1) + " / " + lvlup;
    }else{
        percent = 100;
        text = lvls[level] + " / " + lvls[level];
    }
    $("#blue_line_label").text = text;
    text = percent + "%";
    $("#blue_line_panel").style.width = text;

    level = Number(data["donlevel"]);
    text = "lvl." + level;
    if(data["freedonpoints"] > 0)
        text += "( " + data["freedonpoints"] + " )";
    $("#normal_level_label").text = text;
    if(lvls[level+1]){
        var this_lvl = 0
        for(var i = 1; i <= level;i++){
            this_lvl = this_lvl + lvls[i];
        }
        var next_lvl = this_lvl + lvls[level + 1];
        lvlup = lvls[level+1];
        intnow = next_lvl - data["totaldonexp"];
        intnow = lvlup - intnow;
        percent = ( intnow / lvlup ) * 100;
        percent = parseFloat(Math.ceil( percent * 10 ) / 10).toFixed(1)
        text = (Math.ceil( Number(intnow) * 10 ) / 10).toFixed(1) + " / " + lvlup;
    }else{
        percent = 100;
        text = lvls[level] + " / " + lvls[level];
    }
    $("#red_line_label").text = text;
    text = percent + "%";
    $("#red_line_panel").style.width = text;
    if(data["gave_exp"]){
        $.Msg(data["gave_exp"])
        const gave_exp = isBonusExpAvailable(Number(portID)) ? Number(data["gave_exp"]) * 1.15 : Number(data["gave_exp"])
        var gain = (Math.ceil( gave_exp * 10 ) / 10).toFixed(1)
        $("#blue_line_label_gain").text = "+" + gain;
        if(data["donavailable"] == 1){
            $("#red_line_label_gain").text = "+" + gain;
        }else{
            $("#red_line_label_gain").text = "0";
        }
    }
    $("#state-blue-exp").text = (Math.ceil( Number(data["totalexp"]) * 10 ) / 10);
    $("#state-gold-exp").text = (Math.ceil( Number(data["totaldonexp"]) * 10 ) / 10);
    $("#state-games").text = data["gamecout"];
    var m = data["gametime"] % 60;
    var h = (data["gametime"] - m) / 60
    var time = h + "min";
    $("#state-time").text = time;

}


var pressShopBtn = (function(i, cur, pan)
{
	return function()
	{
        if(pan.BHasClass("btn-hover") == true){
            talantpanel.FindChildTraverse("button").visible = false;
        }
        Game.EmitSound("ui_rollover_today");
        GameEvents.SendCustomGameEventToServer("talant_shop", {i : i, cur : cur})
	}
});

var prepareDescription = (function(arg)
{
	return function()
	{
        if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
            talantpanel = $("#talant_root")
        }
        Game.EmitSound("ui_select_arrow")
        var pan = talantpanel.FindChildTraverse(arg);
        if(pan.available || pan.selected){
            pan.RemoveClass("selected");
            pan.AddClass("brightness25");
        }else{
            pan.AddClass("brightness5");
        }
        
	}
});

var hiddeDescription = (function(arg)
{
	return function()
	{
        if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
            talantpanel = $("#talant_root")
        }
        var pan = talantpanel.FindChildTraverse(arg);
        pan.RemoveClass("brightness15");
        pan.RemoveClass("brightness5");
        pan.RemoveClass("brightness25");
        if(pan.selected){
            pan.AddClass("selected");
        }
	}
});

function MoreInformation(pan){
    return function(){
        talantpanel.FindChildTraverse("players_have").text = $.Localize('#talents_loading')
        let portID = GetPlayerIDByPortraitIndex()
        $.Msg("portID:",portID)
        GameEvents.SendCustomGameEventToServer("HeroesAmountInfo", {i : pan.i, j : pan.j, portID:Number(portID)})
    }
}


GameEvents.Subscribe("ThrowHeroInfo",function(t){
    talantpanel.FindChildTraverse("players_have").text = $.Localize("#yest' u") + t.count + $.Localize("#igrokov")
})
var selectTalant = (function(arg)
{
	return function()
	{
        if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
            talantpanel = $("#talant_root")
        }
        Game.EmitSound("ui_team_select_shuffle")

        var pid = Players.GetLocalPlayer();
        var pan = talantpanel.FindChildTraverse(arg);
        var url = herotalant[portID][pan.i][pan.j]["url"];
        var name = herotalant[portID][pan.i][pan.j]["name"];
        var tooltip = herotalant[portID][pan.i][pan.j]["tooltip"] != undefined ? herotalant[portID][pan.i][pan.j]["tooltip"] : herotalant[portID][pan.i][pan.j]["name"] + "_tooltip";
        var buff = herotalant[portID][pan.i][pan.j]["buff"] != undefined ? herotalant[portID][pan.i][pan.j]["buff"] : herotalant[portID][pan.i][pan.j]["name"] + "_description";
        talantpanel.FindChildTraverse("talant_img_description").visible = true;
        talantpanel.FindChildTraverse("talant_name_label").visible = true;
        talantpanel.FindChildTraverse("talant_description_buff_label").visible = true;
        talantpanel.FindChildTraverse("button").visible = true;
        talantpanel.FindChildTraverse("talant_img_description").SetImage("file://{resources}" + url);
        talantpanel.FindChildTraverse("talant_name_label").text = $.Localize("#"+name);
        talantpanel.FindChildTraverse("talant_name_label").i = pan.i;
        talantpanel.FindChildTraverse("talant_description_buff_label").text = $.Localize("#"+buff);
        if("#"+tooltip != $.Localize("#"+tooltip)){
            $("#InfoIcon").SetPanelEvent("onmouseover",()=>{
                $.DispatchEvent( "DOTAShowTextTooltip", $("#InfoIcon"), $.Localize("#"+tooltip));
            });
            $("#InfoIcon").SetPanelEvent("onmouseout",()=>{
                $.DispatchEvent( "DOTAHideTitleTextTooltip");
                $.DispatchEvent( "DOTAHideTextTooltip");
            });
            $("#InfoIcon").visible = true
        }else $("#InfoIcon").visible = false
        let progress = CustomNetTables.GetTableValue( "talants", GetPlayerIDByPortraitIndex() )
        if(talantpanel.FindChildTraverse("players_have")){
            if(!progress[pan.i+pan.j+"count"]){
                talantpanel.FindChildTraverse("players_have").text = $.Localize("#talent_count")
            }else{
                talantpanel.FindChildTraverse("players_have").text = $.Localize("#yest' u") + progress[pan.i+pan.j+"count"] + $.Localize("#igrokov")
            }
            talantpanel.FindChildTraverse("players_have").SetPanelEvent("onmouseactivate",MoreInformation(pan))
        }
        if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME && talantpanel.FindChildTraverse("button") && pid == portID && !pan.selected && ((pan.i == 'don' && progress['freedonpoints'] >= LevelNeed(pan.i, pan.j, progress)) || (pan.i != 'don' && progress['freepoints'] >= LevelNeed(pan.i, pan.j, progress)) ) && 
            (pan.j != 12 || pan.available) && ((pan.j != 6 && pan.j != 7 && pan.j != 8) || (progress[pan.i+6] + progress[pan.i+7] + progress[pan.i+8] == 0)) && ((pan.j != 9 && pan.j != 10 && pan.j != 11) || ((progress[pan.i+9] + progress[pan.i+10] + progress[pan.i+11] == 0) && (progress[pan.i+6] + progress[pan.i+7] + progress[pan.i+8] == 0 || ((pan.j == 9 && progress[pan.i+6] == 1) || (pan.j == 10 && progress[pan.i+7] == 1) || (pan.j == 11 && progress[pan.i+8] == 1))))) && 
            (pan.i == "don" || (progress["int1"] + progress["agi1"] + progress["str1"] < progress["cout"] || progress[pan.i+1] == 1))){
            
            talantpanel.FindChildTraverse("button").visible = true;
            if((pan.i == "don" && lastdata["freedonpoints"] > 0) || (pan.i != "don" && lastdata["freepoints"] > 0)){
                talantpanel.FindChildTraverse("button").RemoveClass("brightness02");
            }else{
                talantpanel.FindChildTraverse("button").AddClass("brightness02");
            }
            talantpanel.FindChildTraverse("button").SetPanelEvent("onmouseactivate",selectTalantButton(pan))
            talantpanel.FindChildTraverse("button_label_count").text =  LevelNeed(pan.i, pan.j, progress) > 1 ? ` (${LevelNeed(pan.i, pan.j, progress)})` : ""
        }else if(talantpanel.FindChildTraverse("button")){
            talantpanel.FindChildTraverse("button").visible = false;
        }
        if($("#talant_description_label")){
            $("#talant_description_label").visible = false;
            if(pan.j == 12){
                $("#talant_description_label").visible = true;
            }
        }
        $("#players_have").visible = true
	}
});

function LevelNeed(cat, n, progress){
    let levelNeed = 5
    if(n <5 ){
        levelNeed = n
    }
    if(n == 6 || n == 7 || n == 8){
        levelNeed += 1
    }
    if(n == 9 || n == 10 || n == 11){
        levelNeed += 2
    }
    if(n == 12){
        levelNeed += 3
    }

    let branch_count = 0
    for(let i = 1; i <= 5; i++){
        if(progress[cat+i] == 1){
            branch_count += 1
        }
    }
    if(progress[cat+6] || progress[cat+7] || progress[cat+8]){
        branch_count += 1
    }
    if(progress[cat+9] || progress[cat+10] || progress[cat+11]){
        branch_count += 1
    }
    if(progress[cat+12] == 1){
        branch_count += 1
    }
    return  levelNeed - branch_count
}


var selectTalantButton = (function(pan)
{
	return function()
	{
        Game.EmitSound("ui_generic_button_click")
        if((pan.i == "don" && lastdata["freedonpoints"] > 0) || (pan.i != "don" && lastdata["freepoints"] > 0)){
            GameEvents.SendCustomGameEventToServer("selectTalantButton", {i : pan.i, j : pan.j})
            talantpanel.FindChildTraverse("button").visible = false;
        }
	}
});

function close(){
    isOpen = false;
    talantpanel.FindChildTraverse("talant_img_description").visible = false;
    talantpanel.FindChildTraverse("talant_name_label").visible = false;
    talantpanel.FindChildTraverse("talant_description_buff_label").visible = false;
    talantpanel.FindChildTraverse("button").visible = false;
    Game.EmitSound("ui_rolloff_today");
    /*
    ui_rollover_today
    ui_rollover_today
    ui_menu_activate_open
    */
    //Game.EmitSound("ui_custom_lobby_dialog_slide");
    $("#talant-2nd-window").visible = false;
    isShop = false;
    $("#talant_root").visible = false;

}





var TipsOver = (function(message, pos)
{
	return function()
	{
        if (talantpanel.FindChildTraverse(pos) != undefined)
        {
            $.DispatchEvent( "DOTAShowTextTooltip", talantpanel.FindChildTraverse(pos), $.Localize("#"+message));
        }
	}
});

var TipsOut = (function()
{
	return function()
	{
        $.DispatchEvent( "DOTAHideTitleTextTooltip");
        $.DispatchEvent( "DOTAHideTextTooltip");
	}
});

function testsound(){
    $.Schedule(1, function(){
		Game.EmitSound("ui_generic_button_click")
        testsound()
	})
}
function opnShop(){
    if(isShop == true){
        $("#talant-2nd-window").visible = false;
        Game.EmitSound("ui_rolloff_today");
        isShop = false;
    }else if(isShop == false){
        Game.EmitSound("ui_rollover_today");
        $("#talant-2nd-window").visible = true;
        isShop = true;
    }
    if(portID == Players.GetLocalPlayer()){
        $("#talant-shop").visible = true;
        if($("#player-state").BHasClass("player-state-1") == false){
            $("#player-state").AddClass("player-state-1")
        }
        if($("#player-state").BHasClass("player-state-2") == true){
            $("#player-state").RemoveClass("player-state-2")
        }
        $("#talant-bg-img-shop").SetImage("file://{resources}/images/custom_game/talants/2ws.png")
    }else{
        $("#talant-shop").visible = false;
        if($("#player-state").BHasClass("player-state-1") == true){
            $("#player-state").RemoveClass("player-state-1")
        }
        if($("#player-state").BHasClass("player-state-2") == false){
            $("#player-state").AddClass("player-state-2")
        }
        $("#talant-bg-img-shop").SetImage("file://{resources}/images/custom_game/talants/2w3s.png")
    }
}

(function() {
    
    GameEvents.Subscribe('pickInit', pickInit);
    GameEvents.Subscribe('updatetab', updatetab);
    if($("#talant_description_label")){
        $("#talant_description_label").visible = false;
    }
    if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
        $("#talant-2nd-window").visible = false;
        
        if(talantpanel.FindChildTraverse("button"))
            talantpanel.FindChildTraverse("button").visible = false;
        $("#talant_root").visible = false;
        GameEvents.Subscribe('talantTreeInit', talantTreeInit);
        CustomNetTables.SubscribeNetTableListener( "talants", talantsUpdate );
        CustomNetTables.SubscribeNetTableListener( "shopinfo", shopinfo ); 
        GameEvents.Subscribe( "talant_replace_hero", talant_replace_hero ); 
        GameEvents.Subscribe( "ChangeHeroLoadTree", ChangeHeroLoadTree ); 
        
        //
        
        GameEvents.Subscribe("dota_player_update_query_unit", portrait);

        GameEvents.Subscribe('dota_player_update_hero_selection', portrait);
        GameEvents.Subscribe('dota_player_update_selected_unit', portrait);

        
        
        $("#players_have").visible = false
    }else{
        // FindDotaHudElement("HeroAbilities").GetChild(4).visible = false;
        // FindDotaHudElement("HeroAbilities").GetChild(5).visible = false;
        // FindDotaHudElement("HeroAbilities").GetChild(0).visible = false
        // if(FindDotaHudElement("RightContainerMain")){
        //     FindDotaHudElement("RightContainerMain").visible = false;
        // }
    }
})();

(()=>{
    $.RegisterForUnhandledEvent('Cancelled',() => {
        close()
    })
})();









function setIconParam(data){
    if(Game.GetState() >= DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME){
        talantpanel = $("#talant_root")
    }
    for(var n in cat = ["str","agi","int","don"]){
        
        for(var pos = 1; pos <= 12; pos++){
            if(talantpanel.FindChildTraverse(cat[n]+pos)){
                talantpanel.FindChildTraverse(cat[n]+pos).selected = false;
                talantpanel.FindChildTraverse(cat[n]+pos).available = false;
            }
        }

        if(data[cat[n]+12] == 1 && talantpanel.FindChildTraverse(cat[n]+12)){
            talantpanel.FindChildTraverse(cat[n]+12).selected = true;
            talantpanel.FindChildTraverse(cat[n]+12).available = false;
        }else if(data[cat[n]+12] == 0 && (data[cat[n]+11] == 1 || data[cat[n]+10] == 1 || data[cat[n]+9] == 1) && talantpanel.FindChildTraverse(cat[n]+12)){
            // 3 == don
            if(n == 3 && data['donlevel'] >= 30 || data["str12"] == 0 && data["int12"] == 0 && data["agi12"] == 0 && data['level'] >= 30){
                talantpanel.FindChildTraverse(cat[n]+12).selected = false;
                talantpanel.FindChildTraverse(cat[n]+12).available = true;
            }
        }

        if(data[cat[n]+11] == 1 && talantpanel.FindChildTraverse(cat[n]+11)){
            talantpanel.FindChildTraverse(cat[n]+11).selected = true;
            talantpanel.FindChildTraverse(cat[n]+11).available = false;
        }else if(data[cat[n]+11] == 0 && data[cat[n]+8] == 1 && talantpanel.FindChildTraverse(cat[n]+11)){
            talantpanel.FindChildTraverse(cat[n]+11).selected = false;
            talantpanel.FindChildTraverse(cat[n]+11).available = true;
        }

        if(data[cat[n]+10] == 1 && talantpanel.FindChildTraverse(cat[n]+10)){
            talantpanel.FindChildTraverse(cat[n]+10).selected = true;
            talantpanel.FindChildTraverse(cat[n]+10).available = false;
        }else if(data[cat[n]+10] == 0 && data[cat[n]+7] == 1 && talantpanel.FindChildTraverse(cat[n]+10)){
            talantpanel.FindChildTraverse(cat[n]+10).selected = false;
            talantpanel.FindChildTraverse(cat[n]+10).available = true;
        }

        if(data[cat[n]+9] == 1 && talantpanel.FindChildTraverse(cat[n]+9)){
            talantpanel.FindChildTraverse(cat[n]+9).selected = true;
            talantpanel.FindChildTraverse(cat[n]+9).available = false;
        }else if(data[cat[n]+9] == 0 && data[cat[n]+6] == 1 && talantpanel.FindChildTraverse(cat[n]+9)){
            talantpanel.FindChildTraverse(cat[n]+9).selected = false;
            talantpanel.FindChildTraverse(cat[n]+9).available = true;
        }

        if(data[cat[n]+8] == 1 && talantpanel.FindChildTraverse(cat[n]+8)){
            talantpanel.FindChildTraverse(cat[n]+8).selected = true;
            talantpanel.FindChildTraverse(cat[n]+8).available = false;
        }else if(data[cat[n]+7] == 0 && data[cat[n]+6] == 0 && data[cat[n]+8] == 0 && data[cat[n]+5] == 1 && talantpanel.FindChildTraverse(cat[n]+8)){
            talantpanel.FindChildTraverse(cat[n]+8).selected = false;
            talantpanel.FindChildTraverse(cat[n]+8).available = true;
        }

        if(data[cat[n]+7] == 1 && talantpanel.FindChildTraverse(cat[n]+7)){
            talantpanel.FindChildTraverse(cat[n]+7).selected = true;
            talantpanel.FindChildTraverse(cat[n]+7).available = false;
        }else if(data[cat[n]+7] == 0 && data[cat[n]+6] == 0 && data[cat[n]+8] == 0 && data[cat[n]+5] == 1 && talantpanel.FindChildTraverse(cat[n]+7)){
            talantpanel.FindChildTraverse(cat[n]+7).selected = false;
            talantpanel.FindChildTraverse(cat[n]+7).available = true;
        }

        if(data[cat[n]+6] == 1 && talantpanel.FindChildTraverse(cat[n]+6)){
            talantpanel.FindChildTraverse(cat[n]+6).selected = true;
            talantpanel.FindChildTraverse(cat[n]+6).available = false;
        }else if(data[cat[n]+7] == 0 && data[cat[n]+6] == 0 && data[cat[n]+8] == 0 && data[cat[n]+5] == 1 && talantpanel.FindChildTraverse(cat[n]+6)){
            talantpanel.FindChildTraverse(cat[n]+6).selected = false;
            talantpanel.FindChildTraverse(cat[n]+6).available = true;
        }

        if(data[cat[n]+5] == 1 && talantpanel.FindChildTraverse(cat[n]+5)){
            talantpanel.FindChildTraverse(cat[n]+5).selected = true;
            talantpanel.FindChildTraverse(cat[n]+5).available = false;
        }else if(data[cat[n]+5] == 0 && data[cat[n]+4] == 1 && talantpanel.FindChildTraverse(cat[n]+5)){
            talantpanel.FindChildTraverse(cat[n]+5).selected = false;
            talantpanel.FindChildTraverse(cat[n]+5).available = true;
        }

        if(data[cat[n]+4] == 1 && talantpanel.FindChildTraverse(cat[n]+4)){
            talantpanel.FindChildTraverse(cat[n]+4).selected = true;
            talantpanel.FindChildTraverse(cat[n]+4).available = false;
        }else if(data[cat[n]+4] == 0 && data[cat[n]+3] == 1 && talantpanel.FindChildTraverse(cat[n]+4)){
            talantpanel.FindChildTraverse(cat[n]+4).selected = false;
            talantpanel.FindChildTraverse(cat[n]+4).available = true;
        }

        if(data[cat[n]+3] == 1 && talantpanel.FindChildTraverse(cat[n]+3)){
            talantpanel.FindChildTraverse(cat[n]+3).selected = true;
            talantpanel.FindChildTraverse(cat[n]+3).available = false;
        }else if(data[cat[n]+3] == 0 && data[cat[n]+2] == 1 && talantpanel.FindChildTraverse(cat[n]+3)){
            talantpanel.FindChildTraverse(cat[n]+3).selected = false;
            talantpanel.FindChildTraverse(cat[n]+3).available = true;
        }

        if(data[cat[n]+2] == 1 && talantpanel.FindChildTraverse(cat[n]+2)){
            talantpanel.FindChildTraverse(cat[n]+2).selected = true;
            talantpanel.FindChildTraverse(cat[n]+2).available = false;
        }else if(data[cat[n]+2] == 0 && data[cat[n]+1] == 1 && talantpanel.FindChildTraverse(cat[n]+2)){
            talantpanel.FindChildTraverse(cat[n]+2).selected = false;
            talantpanel.FindChildTraverse(cat[n]+2).available = true;
        }

        if(data[cat[n]+1] == 1 && talantpanel.FindChildTraverse(cat[n]+1)){
            talantpanel.FindChildTraverse(cat[n]+1).selected = true;
            talantpanel.FindChildTraverse(cat[n]+1).available = false;
        }else if(cat[n] == "don" && data["freedonpoints"] > 0 && talantpanel.FindChildTraverse(cat[n]+1)){
            talantpanel.FindChildTraverse(cat[n]+1).selected = false;
            talantpanel.FindChildTraverse(cat[n]+1).available = true;
        }else if(data["freepoints"] > 0 && talantpanel.FindChildTraverse(cat[n]+1)){
            var boo = 1;
            if(data["int1"] == 1){ boo++; }
            if(data["str1"] == 1){ boo++; }
            if(data["agi1"] == 1){ boo++; }
            if(boo <= data["cout"]){
                talantpanel.FindChildTraverse(cat[n]+1).selected = false;
                talantpanel.FindChildTraverse(cat[n]+1).available = true;
            }
        }

        for(var pos = 1; pos <= 12; pos++){
            var pan = talantpanel.FindChildTraverse(cat[n]+pos);
            if(pan){
                pan.RemoveClass("available-0");
                pan.RemoveClass("available-1");
                pan.RemoveClass("selected");
                if(pan.available){
                    pan.AddClass("available-1");
                }else if(pan.selected){
                    if(pan.BHasClass("brightness25") == false){
                        pan.AddClass("selected");
                    }
                }else{
                    pan.AddClass("available-0");
                }
            }
        }
    }
}

