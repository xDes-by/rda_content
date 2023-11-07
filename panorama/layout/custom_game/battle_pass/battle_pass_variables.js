const LEVEL_MAX = 30
const dataReward = CustomNetTables.GetTableValue( "BattlePass", "reward")
const experienceList = CustomNetTables.GetTableValue( "BattlePass", "ExpToLevelUp")
const PANEL_BP = {
    scroll_panel : $("#rewards_list_scroll_panel"),
    battle_pass_level :$("#level_main_label"),
    progress_bar : $("#experience_progress_bar"),
    progress_bar_label : $("#experience_progress_bar_Label"),
    collect_all_button : $("#collect_all_rewards_button_Panel"),
}
const IMAGE_NAME = {
    boost_experience : "talent_exp.png",
    boost_rp : "rp_boost.png",
    rp : "rp.png",
    coins : "coins.png",
    gems : "forge_gems.png",
    experience_common : "book_1.png",
    experience_golden : "book_2.png",
    hero_access : "hero.png",
    treasury : "treasure.png",
    pet_access : "pet.png",
    effect : "effect.png",
    item_scroll : "scroll.png",
    golden_branch : "golden_branch.png",
    soul : "soul.png",
    item_forever_ward : "forever_ward.png",
    item_boss_summon : "summon.png",
    item_ticket : "ticket.png",
}
// tooltip_talent_exp
const ITEM_TOOLTIP = {
    boost_experience : {name:"BattlePass_exp_boost_name", description:"BattlePass_exp_boost_description", image:"tooltip_talent_exp.png", image_width:"215px", image_height:"157px"},
    boost_rp : {name:"BattlePass_rp_boost_name", description:"BattlePass_rp_boost_description", image:"tooltip_rp_booster.png", image_width:"215px", image_height:"157px"},
    gems : {name:"BattlePass_forge_gems_name", description:"BattlePass_forge_gems_description", image:"tooltip_forge_gems.png", image_width:"100perc", image_height:"width-percentage( 26% )"},
    experience_common : {name:"BattlePass_exp_book_1_name", description:"BattlePass_exp_book_1_description", image:"tooltip_exp_book_1.png", image_width:"100perc", image_height:"width-percentage( 13.2% )"},
    experience_golden : {name:"BattlePass_exp_book_2_name", description:"BattlePass_exp_book_2_description", image:"tooltip_exp_book_2.png", image_width:"100perc", image_height:"width-percentage( 13.2% )"},
    hero_access : {name:"BattlePass_hero_access_name", description:"BattlePass_hero_access_description", image:"", image_width:"100perc", image_height:"20px"},
    treasury : {name:"BattlePass_treasury_name", description:"BattlePass_treasury_description", image:"tooltip_treasure.png", image_width:"100perc", image_height:"width-percentage( 59% )"},
    rp : {name:"BattlePass_add_rp_name", description:"BattlePass_add_rp_description", image:"tooltip_add_rp.png", image_width:"100perc", image_height:"width-percentage( 27% )"},
    pet_access : {name:"BattlePass_pet_name", description:"BattlePass_pet_description", image:"tooltip_pet.png", image_width:"133px", image_height:"142px"},
    coins : {name:"BattlePass_add_coins_name", description:"BattlePass_add_coins_description", image:"tooltip_add_coins.png", image_width:"100perc", image_height:"width-percentage( 27% )"},
    item_scroll : {name:"BattlePass_item_scroll_name", description:"BattlePass_item_scroll_description", image:"tooltip_item_scroll.png", image_width:"172px", image_height:"86px"},
    effect : {name:"BattlePass_effect_name", description:"BattlePass_effect_description", image:"", image_width:"100perc", image_height:"20px"},
    golden_branch : {name:"BattlePass_golden_branch_name", description:"BattlePass_golden_branch_description", image:"", image_width:"100perc", image_height:"20px"},
    soul : {name:"BattlePass_soul_name", description:"BattlePass_soul_description", image:"tooltip_souls.png", image_width:"100perc", image_height:"width-percentage( 36% )"},
    item_forever_ward : {name:"BattlePass_forever_ward_name", description:"BattlePass_forever_ward_description", image:"", image_width:"100perc", image_height:"20px"},
    item_boss_summon : {name:"BattlePass_boss_summo_name", description:"BattlePass_boss_summo_description", image:"", image_width:"100perc", image_height:"20px"},
    item_ticket : {name:"BattlePass_ticket_name", description:"BattlePass_ticket_description", image:"", image_width:"100perc", image_height:"20px"},
}