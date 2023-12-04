var Tutorial = {
    waiting : 5,
    checked : false,
    ActionPrint : function(word){
        if(this.checked) return
        $("#Main").visible = true
        $("#TutorialLabelsVerticalPanel").RemoveAndDeleteChildren()
        this.waiting = 5
        this.Printer(0, word.split(" "))
        this.PrepButton()
    },
    Printer : function(index, words){
        $.CreatePanel("Label", $("#TutorialLabelsVerticalPanel"), "", {text : words[index] + ' ', class : "word_animation"})
        if(words.length > index +1){
            $.Schedule(0.4, ()=>{ Tutorial.Printer(index +1, words) })
        }
    },
    ActionButton : function(){
        if(this.waiting > 0) return
        $("#Main").visible = false
        this.checked = $("#TutorialDontShowAgainToggle").checked
    },
    PrepButton : function(){
        if(this.waiting == 0){
            $("#TutorialButtonTimerLabel").visible = false
            $("#TutorialButtonLabel").AddClass("LabelColorWhite")
            $("#TutorialButtonLabel").RemoveClass("LabelColorGray")
            return
        }
        Game.EmitSound("General.ButtonClick");
        $("#TutorialButtonTimerLabel").visible = true
        $("#TutorialButtonLabel").RemoveClass("LabelColorWhite")
        $("#TutorialButtonLabel").AddClass("LabelColorGray")
        $("#TutorialButtonTimerLabel").text = "("+this.waiting+")"
        this.waiting -= 1
        $.Schedule(1 , ()=>{Tutorial.PrepButton()})
    }
}

$("#TutorialButtonPanel").SetPanelEvent("onmouseactivate", ()=>{Tutorial.ActionButton()})
$("#Main").SetPanelEvent("onmouseactivate", ()=>{})
$("#Main").visible = false

GameEvents.Subscribe( "TutorialMessage", function(data){
    let message = "#"
    if(data && data.message){
        message += data.message
    }
    Tutorial.ActionPrint($.Localize(message))
})