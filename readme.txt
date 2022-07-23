资料来源 : (路径即是 Card Hunter 的 Steam 文件夹 )	

1. 把 Steam\steamapps\common\CardHunter\data\gameplay\Cards\Cards.csv
   利用网站 https://www.convertcsv.com/csv-to-json.htm 转换成档案名 cards.json (内容不作修改)
   
2. 怪物图标取自 Steam\steamapps\common\CardHunter\assets\small_portraits

3. 参考 wiki 格式 , 导出怪物卡组成档案名 monsters.json  (导出时间2022-03-27) ,
		已整合 http://forums.cardhunter.com/threads/patch-notes-3-276-0-halloween-update.12407/ 更新

   内容大概如 :[{
			"name": "Acid Fiend",
			"nameInGame": "Acid Fiend",
			"hp": "18",
			"icon": "AcidFiend.png",
			"defaultMove": 356,
			"editorName": "Acid Fiend",
			"decks": [422,422,425,425],
			"vpWorth": 2, (非必要)
			"sizeOnBoard": "1x1", (不需要)
			"drawPerROund": "3" (不需要)
		  },]
   当有新怪物或发现资料不全时, 欢迎群友帮忙补充资料,
   其中 defaultMove 和 decks 是第一步卡片文件中的 card ID
		icon 对应第二步的.png档名
   操作方式可以建自定义地图, 选中需测量的怪物, 对面则为 Reinforced door 怪物) 
   按顺序把卡片ID记录下来, 抽完一轮就可以 (不必注重顺序)
