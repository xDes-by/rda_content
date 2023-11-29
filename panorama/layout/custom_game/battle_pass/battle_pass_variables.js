const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
const LEVEL_MAX = 30
const VOTING_HEROES = 4
const dataReward = CustomNetTables.GetTableValue( "BattlePass", "dataReward")
const experienceList = CustomNetTables.GetTableValue( "BattlePass", "ExpToLevelUp")
var voting_heroes_list = CustomNetTables.GetTableValue( "BattlePass", "VotingHeroesList")
var voting_heroes_percentage = {}
var is_open = true
const tabs_container = $("#tabs_container")
const main_panel = $("#GameBPPanel")
const PANEL_BP = {
    scroll_panel : $("#rewards_list_scroll_panel"),
    rewards_list_panel : $("#rewards_list_panel"),
    battle_pass_level :$("#battle_pass_level"),
    battle_pass_rank_image : $("#battle_pass_rank_image"),
    avatar_image_panel : $("#avatar_image_panel"),
    progress_bar : $("#battle_pass_progress_bar"),
    progress_bar_label : $("#battle_pass_experience"),
    collect_all_button : $("#collect_all_rewards_button_Panel"),
    choice_reward_bg : $("#choice_reward_main_container"),
    choice_reward_name : $("#choice_reward_name"),
    choice_reward_items_container : $("#choice_reward_items_container"),
    choice_reward_count : $("#choice_reward_count"),
    hero_selection_panel : $("#hero_selection_panel"),
    tasks_panel : $("#tasks_panel"),
    buy_buttons_panel : $("#buy_buttons_panel"),
}
const PANEL_INVENTORY = {
    inventory_container : $("#inventory_container"),
}
var projectile_particles_panels = [];
var following_particles_panels = [];
var model_panels = [];
const IMAGE_NAME = {
    boost_experience : "talent_exp.png",
    boost_rp : "rp_boost.png",
    rp : "rp.png",
    coins : "coins.png",
    gems : "forge_gems.png",
    experience_common : "book_1.png",
    experience_choice : "experience_choice.png",
    hero_access : "hero.png",
    treasury : "treasure.png",
    pet_access150 : "pet.png",
    pet_access250 : "pet.png",
    effect : "perticle.jpg",
    item_scroll1 : "scroll.png",
    item_scroll2 : "scroll.png",
    golden_branch : "golden_branch.png",
    soul : "soul.png",
    item_forever_ward : "forever_ward.png",
    boss_summon_ticket : "boss_summon_ticket.png",
    item_ticket : "ticket.png",
}
const ITEM_TOOLTIP = {
    boost_experience : {name:"BattlePass_exp_boost_name", description:"BattlePass_exp_boost_description", image:"tooltip_talent_exp.png", image_width:"215px", image_height:"157px"},
    boost_rp : {name:"BattlePass_rp_boost_name", description:"BattlePass_rp_boost_description", image:"tooltip_rp_booster.png", image_width:"215px", image_height:"157px"},
    gems : {name:"BattlePass_forge_gems_name", description:"BattlePass_forge_gems_description", image:"tooltip_forge_gems.png", image_width:"100perc", image_height:"width-percentage( 26% )"},
    experience_common : {name:"BattlePass_exp_book_1_name", description:"BattlePass_exp_book_1_description", image:"tooltip_exp_book_1.png", image_width:"100perc", image_height:"width-percentage( 13.2% )"},
    experience_choice : {name:"BattlePass_exp_book_2_name", description:"BattlePass_exp_book_2_description", image:"tooltip_exp_book_2.png", image_width:"100perc", image_height:"width-percentage( 26.4% )"},
    hero_access : {name:"BattlePass_hero_access_name", description:"BattlePass_hero_access_description", image:"", image_width:"100perc", image_height:"20px"},
    treasury : {name:"BattlePass_treasury_name", description:"BattlePass_treasury_description", image:"tooltip_treasure.png", image_width:"100perc", image_height:"width-percentage( 59% )"},
    rp : {name:"BattlePass_add_rp_name", description:"BattlePass_add_rp_description", image:"tooltip_add_rp.png", image_width:"100perc", image_height:"width-percentage( 27% )"},
    pet_access150 : {name:"BattlePass_pet_name", description:"BattlePass_pet_description", image:"tooltip_pet.png", image_width:"133px", image_height:"142px"},
    pet_access250 : {name:"BattlePass_pet_name", description:"BattlePass_pet_description", image:"tooltip_pet.png", image_width:"133px", image_height:"142px"},
    coins : {name:"BattlePass_add_coins_name", description:"BattlePass_add_coins_description", image:"tooltip_add_coins.png", image_width:"100perc", image_height:"width-percentage( 27% )"},
    item_scroll1 : {name:"BattlePass_item_scroll_name", description:"BattlePass_item_scroll_description", image:"tooltip_item_scroll1.png", image_width:"172px", image_height:"41px"},
    item_scroll2 : {name:"BattlePass_item_scroll_name", description:"BattlePass_item_scroll_description", image:"tooltip_item_scroll2.png", image_width:"172px", image_height:"130px"},
    effect : {name:"BattlePass_effect_name", description:"BattlePass_effect_description", image:"", image_width:"100perc", image_height:"20px"},
    golden_branch : {name:"BattlePass_golden_branch_name", description:"BattlePass_golden_branch_description", image:"", image_width:"100perc", image_height:"20px"},
    soul : {name:"BattlePass_soul_name", description:"BattlePass_soul_description", image:"tooltip_souls.png", image_width:"100perc", image_height:"width-percentage( 36% )"},
    item_forever_ward : {name:"BattlePass_forever_ward_name", description:"BattlePass_forever_ward_description", image:"", image_width:"100perc", image_height:"20px"},
    boss_summon_ticket : {name:"BattlePass_boss_summo_name", description:"BattlePass_boss_summo_description", image:"", image_width:"100perc", image_height:"20px"},
    item_ticket : {name:"BattlePass_ticket_name", description:"BattlePass_ticket_description", image:"", image_width:"100perc", image_height:"20px"},
}
const CHOICE_ITEMS = {
    soul : { width : "180px", height : "width-percentage( 75% )", images:[] ,items :["item_forest_soul","item_village_soul","item_mines_soul","item_dust_soul","item_cemetery_soul","item_swamp_soul","item_snow_soul","item_divine_soul"], abilities:[]},
    item_scroll1 : { width : "180px", height : "width-percentage( 75% )", images:[] ,items :["item_book_mage_damage","item_book_phys_damage","item_book_gold"], abilities:[]},
    item_scroll2 : { width : "180px", height : "width-percentage( 75% )", images:[] ,items :["item_armor_aura","item_base_damage_aura","item_expiriance_aura","item_move_aura","item_attack_speed_aura","item_hp_aura","item_book_mage_damage","item_book_phys_damage","item_book_gold"], abilities:[]},
    hero_access : { width : "350px", height : "width-percentage( 56.25% )", images:["Silencer_icon.png","Marci_icon.png"] ,items :[], abilities:[]},
    pet_access150 : { width : "150px", height : "width-percentage( 56.25% )", images:[] ,items :[], abilities:["spell_item_pet_RDA_dmg","spell_item_pet_RDA_hp","spell_item_pet_RDA_fast","spell_item_pet_RDA_cleave","spell_item_pet_RDA_block","spell_item_pet_RDA_all_dmg_amp","spell_item_pet_RDA_gold"]},
    pet_access250 : { width : "150px", height : "width-percentage( 56.25% )", images:[] ,items :[], abilities:["spell_item_pet_RDA_250_gold_and_exp","spell_item_pet_RDA_250_attribute_bonus","spell_item_pet_RDA_250_dmg_reduction","spell_item_pet_RDA_250_regen","spell_item_pet_RDA_250_bkb","spell_item_pet_RDA_250_phys_dmg_reducrion","spell_item_pet_RDA_250_pure_damage","spell_item_pet_RDA_250_no_spell_phys_bonus","spell_item_pet_RDA_250_no_phys_spell_bonus","spell_item_pet_RDA_250_minus_armor"]},
    treasury : { width : "250px", height : "width-percentage( 75% )", images:["treasury_1.png","treasury_2.png","treasury_3.png"] ,items :[], abilities:[]},
    experience_choice : { width : "250px", height : "250px", images:["book_1.png","book_2.png"] ,items :[], abilities:[]},
    boss_summon_ticket : { width : "250px", height : "250px", images:["summon.png","ticket.png"] ,items :[], abilities:[]},
}
const TABS = [
    {name:"BattlePass_tab_bp_name", index : 0, panel_container : $("#battle_pass_container")}, 
    {name:"BattlePass_tab_inventory_name", index : 1, panel_container : $("#inventory_container")},
]
const shop = [
    { name : "bp_premium", don : 150, localize : "battle_pass_buy_premium", tooltip : "battle_pass_buy_premium_tooltip", combinable : false},
    { name : "bp_experience", rp : 1000, value : 1000, localize : "battle_pass_buy_experience", combinable : true },
    { name : "bp_experience", don : 50, value : 1000, localize : "battle_pass_buy_experience", combinable : true },
]