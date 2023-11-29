function UpdateTalentIcons(data){
    for(let i of ['str','agi','int','don']){
        for(let j = 1; j <= 13; j++){
            const arg = i + j
            const panel = $("#img"+arg);
            if(panel){
                panel.SetImage("file://{resources}/images/custom_game/talants/img" + data[arg]["url"])
            }
        }
    }
}
function UpdateIconParam(data){
    for(var n in cat = ["str","agi","int","don"]){
        
        for(var pos = 1; pos <= 13; pos++){
            if(PANEL.talant_root.FindChildTraverse(cat[n]+pos)){
                PANEL.talant_root.FindChildTraverse(cat[n]+pos).selected = false;
                PANEL.talant_root.FindChildTraverse(cat[n]+pos).available = false;
            }
        }

        if(data[cat[n]+13].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+13)){
            PANEL.talant_root.FindChildTraverse(cat[n]+13).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+13).available = false;
        }else if(data[cat[n]+13].value == 0 && data[cat[n]+12].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+13)){
            PANEL.talant_root.FindChildTraverse(cat[n]+13).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+13).available = true;
        }

        if(data[cat[n]+12].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+12)){
            PANEL.talant_root.FindChildTraverse(cat[n]+12).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+12).available = false;
        }else if(data[cat[n]+12].value == 0 && (data[cat[n]+11].value == 1 || data[cat[n]+10].value == 1 || data[cat[n]+9].value == 1) && PANEL.talant_root.FindChildTraverse(cat[n]+12)){
            if(n == 3 && data['donlevel'] >= 30 || data["str12"].value == 0 && data["int12"].value == 0 && data["agi12"].value == 0 && data['level'] >= 30){
                PANEL.talant_root.FindChildTraverse(cat[n]+12).selected = false;
                PANEL.talant_root.FindChildTraverse(cat[n]+12).available = true;
            }
        }

        if(data[cat[n]+11].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+11)){
            PANEL.talant_root.FindChildTraverse(cat[n]+11).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+11).available = false;
        }else if(data[cat[n]+11].value == 0 && data[cat[n]+8].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+11)){
            PANEL.talant_root.FindChildTraverse(cat[n]+11).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+11).available = true;
        }

        if(data[cat[n]+10].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+10)){
            PANEL.talant_root.FindChildTraverse(cat[n]+10).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+10).available = false;
        }else if(data[cat[n]+10].value == 0 && data[cat[n]+7].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+10)){
            PANEL.talant_root.FindChildTraverse(cat[n]+10).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+10).available = true;
        }

        if(data[cat[n]+9].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+9)){
            PANEL.talant_root.FindChildTraverse(cat[n]+9).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+9).available = false;
        }else if(data[cat[n]+9].value == 0 && data[cat[n]+6].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+9)){
            PANEL.talant_root.FindChildTraverse(cat[n]+9).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+9).available = true;
        }

        if(data[cat[n]+8].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+8)){
            PANEL.talant_root.FindChildTraverse(cat[n]+8).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+8).available = false;
        }else if(data[cat[n]+7].value == 0 && data[cat[n]+6].value == 0 && data[cat[n]+8].value == 0 && data[cat[n]+5].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+8)){
            PANEL.talant_root.FindChildTraverse(cat[n]+8).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+8).available = true;
        }

        if(data[cat[n]+7].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+7)){
            PANEL.talant_root.FindChildTraverse(cat[n]+7).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+7).available = false;
        }else if(data[cat[n]+7].value == 0 && data[cat[n]+6].value == 0 && data[cat[n]+8].value == 0 && data[cat[n]+5].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+7)){
            PANEL.talant_root.FindChildTraverse(cat[n]+7).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+7).available = true;
        }

        if(data[cat[n]+6].value == 1 && PANEL.talant_root.FindChildTraverse(cat[n]+6)){
            PANEL.talant_root.FindChildTraverse(cat[n]+6).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+6).available = false;
        }else if(data[cat[n]+7].value == 0 && data[cat[n]+6].value == 0 && data[cat[n]+8].value == 0 && data[cat[n]+5].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+6)){
            PANEL.talant_root.FindChildTraverse(cat[n]+6).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+6).available = true;
        }

        if(data[cat[n]+5].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+5)){
            PANEL.talant_root.FindChildTraverse(cat[n]+5).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+5).available = false;
        }else if(data[cat[n]+5].value == 0 && data[cat[n]+4].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+5)){
            PANEL.talant_root.FindChildTraverse(cat[n]+5).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+5).available = true;
        }

        if(data[cat[n]+4].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+4)){
            PANEL.talant_root.FindChildTraverse(cat[n]+4).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+4).available = false;
        }else if(data[cat[n]+4].value == 0 && data[cat[n]+3].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+4)){
            PANEL.talant_root.FindChildTraverse(cat[n]+4).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+4).available = true;
        }

        if(data[cat[n]+3].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+3)){
            PANEL.talant_root.FindChildTraverse(cat[n]+3).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+3).available = false;
        }else if(data[cat[n]+3].value == 0 && data[cat[n]+2].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+3)){
            PANEL.talant_root.FindChildTraverse(cat[n]+3).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+3).available = true;
        }

        if(data[cat[n]+2].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+2)){
            PANEL.talant_root.FindChildTraverse(cat[n]+2).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+2).available = false;
        }else if(data[cat[n]+2].value == 0 && data[cat[n]+1].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+2)){
            PANEL.talant_root.FindChildTraverse(cat[n]+2).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+2).available = true;
        }

        if(data[cat[n]+1].value > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+1)){
            PANEL.talant_root.FindChildTraverse(cat[n]+1).selected = true;
            PANEL.talant_root.FindChildTraverse(cat[n]+1).available = false;
        }else if(cat[n] == "don" && data["freedonpoints"] > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+1)){
            PANEL.talant_root.FindChildTraverse(cat[n]+1).selected = false;
            PANEL.talant_root.FindChildTraverse(cat[n]+1).available = true;
        }else if(data["freepoints"] > 0 && PANEL.talant_root.FindChildTraverse(cat[n]+1)){
            var boo = 1;
            boo += data["int1"].value > 0 ? 1 : 0
            boo += data["agi1"].value > 0 ? 1 : 0
            boo += data["str1"].value > 0 ? 1 : 0
            if(boo <= data["cout"]){
                PANEL.talant_root.FindChildTraverse(cat[n]+1).selected = false;
                PANEL.talant_root.FindChildTraverse(cat[n]+1).available = true;
            }
        }

        for(var pos = 1; pos <= 13; pos++){
            var pan = PANEL.talant_root.FindChildTraverse(cat[n]+pos);
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
                pan.FindChildTraverse("Level_Label").text = ""
                if(cat[n] != "don" && data[cat[n]+pos].value > 1){
                    pan.FindChildTraverse("Level_Label").text = data[cat[n]+pos].value
                }
            }
        }
    }
}