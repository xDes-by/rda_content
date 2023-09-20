var Tutorial = {
    win : $("#Main"),
    ent : $("#TutorialLabelsVerticalPanel"),
    btn : $("#TutorialButtonPanel"),
    waiting : 5,
    checked : false,
    ActionPrint : function(word){
        if(this.checked) return
        this.win.visible = true
        this.ent.RemoveAndDeleteChildren()
        this.waiting = 5
        this.Printer(0, word.split(" "))
        this.PrepButton()
    },
    Printer : function(index, words){
        $.CreatePanel ("Label", this.ent, "", {text : words[index] + ' ', class : "word_animation"})
        if(words.length > index +1){
            $.Schedule(0.4, ()=>{ Tutorial.Printer(index +1, words) })
        }
    },
    ActionButton : function(){
        if(this.waiting > 0) return
        this.win.visible = false
        this.checked = $("#TutorialDontShowAgainToggle").checked
    },
    PrepButton : function(){
        if(this.waiting == 0){
            this.btn.FindChildTraverse("TutorialButtonTimerLabel").visible = false
            this.btn.FindChildTraverse("TutorialButtonLabel").AddClass("LabelColorWhite")
            this.btn.FindChildTraverse("TutorialButtonLabel").RemoveClass("LabelColorGray")
            return
        }
        this.btn.FindChildTraverse("TutorialButtonTimerLabel").visible = true
        this.btn.FindChildTraverse("TutorialButtonLabel").RemoveClass("LabelColorWhite")
        this.btn.FindChildTraverse("TutorialButtonLabel").AddClass("LabelColorGray")
        this.btn.FindChildTraverse("TutorialButtonTimerLabel").text = "("+this.waiting+")"
        this.waiting -= 1
        $.Schedule(1 , ()=>{Tutorial.PrepButton()})
    }
}


Tutorial.ActionPrint("В городе Академград живут подростки со сверхъестественными способностями, а называют их эсперами. Большая часть жителей городка ученики, но также бок о бок с ними живут обычные люди. Академград был построен для правильного развития и обучения эсперов, которое делится на пять уровней, где ноль — это самый слабый, а пятый уровень очень редкий и опасный.")
Tutorial.btn.SetPanelEvent("onmouseactivate", ()=>{Tutorial.ActionButton()})
Tutorial.win.SetPanelEvent("onmouseactivate", ()=>{})

Tutorial.win.visible = false