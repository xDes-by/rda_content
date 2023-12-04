function UpdateTasks(data){
    if(data == undefined){
        data = CustomNetTables.GetTableValue( "quests", Players.GetLocalPlayer());
        data = data.bp
    }
    for(let i in data){
        const panel = PANEL_BP.tasks_panel.GetChild(i-1)
        const progress_bar = panel.FindChildTraverse("task_progress_bar_1")
        progress_bar.min = 0
        progress_bar.max = data[i].count
        progress_bar.value = data[i].now
        progress_bar.FindChildTraverse("task_progress_bar_label").text = progress_bar.value + "/" + progress_bar.max
        if(false){//if(progress_bar.value >= progress_bar.max){
            progress_bar.SetHasClass("hidden", true)
            panel.FindChildTraverse("task_reward_panel").SetHasClass("hidden", false)
        }else{
            progress_bar.SetHasClass("hidden", false)
            panel.FindChildTraverse("task_reward_panel").SetHasClass("hidden", true)
        }
    }
}