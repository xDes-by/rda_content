GameEvents.Subscribe( 'open_pudge_skill', open_pudge_skill );
GameEvents.Subscribe( 'close_pudge_skill', close_pudge_skill );
GameEvents.Subscribe( 'animate_progress_pudge', animate_progress_pudge );

function open_pudge_skill(data)
{
    $("#LineProgress").style["transition-duration"] = "0.1s"
    $("#LineProgressColor").style["transition-duration"] = (data.time + 0.25) + "s"
    //$("#LineProgressColor").style.backgroundColor = "gradient( linear, 0% 0%, 0% 100%, from( #deff0a ), color-stop( 0.2, #a4a63a ), color-stop( .5, #878f2f), to( #515c25) )"
    let percent = ((data.full_time-data.time)*100)/data.full_time
    $("#back_min").style['width'] = (100 - percent) +'%';
    $("#UseOneshot").style.visibility = "visible"
}

function close_pudge_skill(data)
{
    $("#ProgressLabel").text = "0%"
    $("#LineProgressColor").style["transition-duration"] = "0s"
    $("#LineProgress").style["transition-duration"] = "0s"
    $("#LineProgress").style.width = "100%"
    //$("#LineProgressColor").style.backgroundColor = "gradient( linear, 0% 0%, 0% 100%, from( #545c25 ), color-stop( 0.2, #9da63a ), color-stop( .5, #7c8f2f), to( #5b5c25) )"
    $("#UseOneshot").style.visibility = "collapse"
}

function animate_progress_pudge(data)
{
    let percent = ((data.full_time-data.time)*100)/data.full_time
    $("#LineProgress").style['width'] = (100 - percent) +'%';
    $("#ProgressLabel").text = Math.round(data.percent)
}

GameEvents.Subscribe( 'open_pudge_skill_flash', open_pudge_skill_flash );
GameEvents.Subscribe( 'close_pudge_skill_flash', close_pudge_skill_flash );
GameEvents.Subscribe( 'animate_progress_pudge_flash', animate_progress_pudge_flash );

function open_pudge_skill_flash(data)
{
    $.Msg(data)

    $("#LineProgress_flash").style["transition-duration"] = "0.1s"
    $("#LineProgressColor_flash").style["transition-duration"] = (data.time + 0.25) + "s"
    //$("#LineProgressColor").style.backgroundColor = "gradient( linear, 0% 0%, 0% 100%, from( #deff0a ), color-stop( 0.2, #a4a63a ), color-stop( .5, #878f2f), to( #515c25) )"
    let percent = ((data.full_time-data.time)*100)/data.full_time
    $("#back_min_flash").style['width'] = (100 - percent) +'%';
    $("#UseOneshot_flash").style.visibility = "visible"
}

function close_pudge_skill_flash(data)
{
    $("#ProgressLabel_flash").text = "0%"
    $("#LineProgressColor_flash").style["transition-duration"] = "0s"
    $("#LineProgress_flash").style["transition-duration"] = "0s"
    $("#LineProgress_flash").style.width = "100%"
    //$("#LineProgressColor").style.backgroundColor = "gradient( linear, 0% 0%, 0% 100%, from( #545c25 ), color-stop( 0.2, #9da63a ), color-stop( .5, #7c8f2f), to( #5b5c25) )"
    $("#UseOneshot_flash").style.visibility = "collapse"
}

function animate_progress_pudge_flash(data)
{
    let percent = ((data.full_time-data.time)*100)/data.full_time
    $("#LineProgress_flash").style['width'] = (100 - percent) +'%';
    $("#ProgressLabel_flash").text = Math.round(data.percent)
} 

GameEvents.Subscribe('open_pudge_skill_iron', open_pudge_skill_iron);
GameEvents.Subscribe('close_pudge_skill_iron', close_pudge_skill_iron);
GameEvents.Subscribe('animate_progress_pudge_iron', animate_progress_pudge_iron);

function open_pudge_skill_iron(data) 
{
    $("#LineProgress_ironman").style["transition-duration"] = "0.1s"
    $("#LineProgressColor_ironman").style["transition-duration"] = (data.time + 0.25) + "s"
    let percent = ((data.full_time - data.time) * 100) / data.full_time
    $("#back_min_ironman").style['width'] = (100 - percent) + '%';
    $("#UseOneshot_ironman").style.visibility = "visible"
}

function close_pudge_skill_iron(data) 
{
    //$("#ProgressLabel_ironman").text = "0"
    $("#LineProgressColor_ironman").style["transition-duration"] = "0s"
    $("#LineProgress_ironman").style["transition-duration"] = "0s"
    $("#LineProgress_ironman").style.width = "100%"
    $("#UseOneshot_ironman").style.visibility = "collapse"
}

function animate_progress_pudge_iron(data) 
{
    let percent = ((data.full_time - data.time) * 100) / data.full_time
    $("#LineProgress_ironman").style['width'] = (100 - percent) + '%';
    //$("#ProgressLabel_ironman").text = Math.round(data.percent)
    $.Msg(data)
} 