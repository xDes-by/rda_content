const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
const list_tab = CustomNetTables.GetTableValue( "Pets", "list");
const experience_levels = CustomNetTables.GetTableValue( "Pets", "experience_levels");
const main_panel = $("#PetWindowMain");
const TIERS = 7
var pages_count = 0
var current_page = 0
var is_open = true
var current_pet_view = ""
var first_init = true
const PANEL = {
    pet_showcase : $("#pet_showcase"),
    pages_pet : $("#pages_pet"),
    arrow2_left : $("#arrow2_left"),
    arrow2_right : $("#arrow2_right"),
    item_main_pet : $("#item_main_pet"),
    buy_pet_button_2 : $("#buy_pet_button_2"),
    interface_level_pet_icon_1 : $("#interface_level_pet_1"),
    interface_tier_pet : $("#interface_tier_pet"),
    exp_progress_bar_pet : $("#exp_progress_bar_pet"),
    interface_level_pet_1 : $("#interface_-1level_pet"),
    interface_level_pet_2 : $("#interface_level_pet"),
    exp_counter_pet : $("#exp_counter_pet"),
    shop_container : $("#pet_shop_container"),
    equip_pet_button : $("#change_pet_button"),
    current_pet_tier : $("#selected_tier_pet"),
    current_pet_name : $("#selected_name_pet"),
    current_pet_level : $("#selected_level_pet_1"),
    current_pet_icon : $("#item_selected_pet"),
    feed_entry_plus_panel : $("#feed_entry_plus_panel"),
    feed_entry_minus_panel : $("#feed_entry_minus_panel"),
    feed_entry_text : $("#feed_entry_text"),
    pet_update_button_1 : $("#pet_update_button_1"),
    pet_update_button_2 : $("#pet_update_button_2"),
    pet_update_button_3 : $("#pet_update_button_3"),
    gems_label_pet : $("#gems_label_pet"),
    rp_label_pet : $("#rp_label_pet"),
    feed_label_pet : $("#feed_label_pet"),
    buy_coufirm_bg_pet : $("#buy_coufirm_bg_pet"),
    buy_confirm_item_name : $("#buy_confirm_item_name"),
    buy_confirm_price : $("#buy_confirm_price"),
    coufirm_rp_image_pet : $("#coufirm_rp_image_pet"),
    coufirm_gems_image_pet : $("#coufirm_gems_image_pet"),
    confirm_drop_down : $("#confirm_drop_down"),
    confirm_yes_panel : $("#confirm_yes_panel"),
    page_name_pet : $("#page_name_pet"),
    interface_name_pet : $("#interface_name_pet"),
    pet_upgrade_container : $("#pet_upgrade_container"),
}
const goods = [
    { name : "pet_change", price : { don : 500 }, image_path : "images/custom_game/RDAShop/items/pet_change.png", tooltip : "shop_image_pet_change_tooltip"},
    { name : "feed_x230", price : { don : 3, rp : 15 }, image_path : "images/custom_game/pet/shop_feed.png", tooltip : "feed_x230_tooltip", combinable : true},
    { name : "feed_x600", price : { don : 7, rp : 35 }, image_path : "images/custom_game/pet/shop_feed.png", tooltip : "feed_x600_tooltip", combinable : true},
]