$("#UpgradeItemPanel").RemoveAndDeleteChildren()
const new_panel = $.CreatePanel("Panel", $("#UpgradeItemPanel"), "")

new_panel.BLoadLayoutSnippet("UpgradeItemSnippet")
new_panel.FindChildTraverse("ItemIcon").itemname = "item_satanic_lua1"
