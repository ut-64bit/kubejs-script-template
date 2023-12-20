// priority: 0

global.deleteItem = []

ServerEvents.recipes((event) => {
  // 特定のレシピを削除
		removeRecipeID.forEach(element => { event.remove({ id: element }) })

		// レシピタイプを削除
		global.deleteRecipeType.forEach(element => { event.remove({ type: element }) })
  
		// アイテムを削除
		global.deleteItem.forEach(element => { event.remove([{ output: element },{ input: element }]) })

		// 置き換えるアイテム
		for (const [key, value] of Object.entries(global.replaceItem)) {
			event.replaceInput({ input: key }, key, value)
			event.replaceOutput({ output: key }, key, value)
		}
})

LootJS.modifiers(event => {
	event.addBlockLootModifier("#forge:ores").modifyLoot("#forge:raw_materials", item => {
		const replacement = AlmostUnified.getReplacementForItem(item);
		if (replacement.isEmpty()) { return item }
		replacement.setCount(item.getCount());
		return replacement;
	})

	global.deleteItem.forEach(element => { event.addLootTableModifier(/.*/).removeLoot(element) })

	for (const [key, value] of Object.entries(global.replaceItem)) { event.addLootTableModifier(/.*/).replaceLoot(key, value) }

	// 草からドロップする藁を植物の繊維に変更
	event.addBlockLootModifier("tall_grass").replaceLoot("minecraft:grass", "minecraft:tall_grass");
})
