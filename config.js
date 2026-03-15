window.DB = {

/* ===== 餐厅信息 ===== */

restaurant: { zh: "金鼎", en: "GOLDEN WOK", gr: "GOLDEN WOK" },
    menuTitle: { zh: "选单", en: "THE MENU", gr: "ΤΟ ΜΕΝΟΥ" },
    galleryTitle: { zh: "视觉", en: "GALLERY", gr: "ΦΩΤΟΓΡΑΦΙΕΣ" },
    slogan: { zh: "传承正宗中华料理精髓", en: "THE ART OF CHINESE TASTE", gr: "Η ΤΕΧΝΗ ΤΗΣ ΚΙΝΕΖΙΚΗΣ ΓΕΥΣΗΣ" },
    welcome: { zh: "欢迎", en: "WELCOME", gr: "ΚΑΛΩΣ ΗΡΘΑΤΕ" },
    opening: { zh:"营业时间：每天 13:00 - 23:00",
en:"Opening Hours: Every day 13:00 - 23:00",
gr:"Ώρες λειτουργίας: Κάθε μέρα 13:00 - 23:00" },
    buffetPrice: {zh:"自助餐价格：周三周五 18€  （ 儿童 6-12岁 10€ ） | 周六周日 20€ （ 儿童 6-12岁 12€ ）", 
en:"Buffet Price: Wed Fri 18€ ( Children 6-12 10€ ) | Sat Sun 20€ ( Children 6-12 years 12€ )", 
gr:"Τιμή μπουφέ: Τετ Παρ 18€ ( Παιδιά 6-12 ετών 10€ ) | Σαβ Κυρ 20€ ( Παιδιά 6-12 ετών 12€ )"},
    buffetTime: { zh:"自助餐时间：周三周五周六 19：00 - 23：00 | 周日 13：30-17：00",
en:"Buffet Time: Wed Fri Sat 19:00 - 23:00 | Sun 13:30-17:00",
gr:"Ώρα μπουφέ: Τετ Παρ Σαβ 19:00 - 23:00 | Κυρ 13:30-17:00 "},
    orderModule: {
        title: { zh: "点餐", en: "ORDER", gr: "ΠΑΡΑΓΓΕΛΙΑ" },
        orderButton: { zh: "点餐", en: "ORDER", gr: "ΠΑΡΑΓΓΕΛΙΑ" }
    },
    locationTitle: { zh: "地点", en: "LOCATION", gr: "ΤΟΠΟΘΕΣΙΑ" },
    // 关键修复点：确保 contact 结构如下
    contact: {
        zh: { title: "联系方式", phone: "2109345137", address: "Leof. Andrea Siggrou 207" },
        en: { title: "CONTACT", phone: "2109345137", address: "Leof. Andrea Siggrou 207" },
        gr: { title: "ΕΠΙΚΟΙΝΩΝΙΑ", phone: "2109345137", address: "Λεωφ. Ανδρέα Συγγρού 207" }
    },

    gallery: [
        "f29.webp", "food1.webp", "food2.webp", "food3.webp", "food4.webp",
        "food5.webp", "food10.webp", "food11.webp", "f18.webp", "f19.webp",
        "f20.webp", "f21.webp", "f22.webp", "f36.webp", "f37.webp", "f33.webp",
        "f28.webp", "food6.webp", "food12.webp", "food13.webp", "f30.webp",
        "f31.webp", "f32.webp", "f34.webp"
    ],
/* ===== 菜单数据库（终极版三语言） ===== */

menu:[

{
id:"appetizers",
name:{
zh:" 前菜 ",
en:" Appetizers",
gr:" Ορεκτικά"
},

items:[
{
zh:"1. 蔬菜春卷（2个）",
en:"1. Spring rolls with vegetables (2pcs)",
gr:"1. Spring Rolls με λαχανικά (2 τμχ.)",
price:3.8
},

{
zh:"2. 炸起司云吞（6个）",
en:"2. Fried cheese Wonton (6pcs)",
gr:"2. Τηγανητά Wonton με τυρί (6 τμχ.)",
price:4.5
},

{
zh:"3. 芝麻炸鸡 （6个）",
en:"3. Fried chicken with sesame (6 pcs)",
gr:"3. Τηγανητό κοτόπουλο με σουσάμι (6 τμχ.)",
price:5.5
},

{
zh:"4. 鸡翅 （4个）",
en:"4. Chicken wings (4 pcs)",
gr:"4. Φτερούγες κοτόπουλου (4 τμχ.)",
price:4.8
},

{
zh:"5. 蒸或炸肉饺子 （6个）",
en:"5. Steam or fried meat Dumpings (6 pcs)",
gr: "5. Ατμού ή τηγανητά Dumplings κρέατος (6 τμχ.)",
price:4.8
},

{
zh:"6. BBQ 酱烧排骨（6块）",
en:"6. BBQ Spare ribs (6 pcs)",
gr:"6. BBQ Παϊδάκια (Spare ribs) με σάλτσα (6 τμχ.)",
price: 4.8
},

{
zh:"7. 炸馒头 (2个)",
en:"7. Fried chinese bread (2 pcs)",
gr:"7. Τηγανητό κινέζικο ψωμί (2 τμχ.)",
price: 3.2
},

{
zh:"8. 双人开胃菜拼盘 (包含 1, 2, 3, 4, 5, 6)",
en:"8. Appetizer for 2 (including 1, 2, 3, 4, 5, 6)",
gr:"8. Ποικιλία ορεκτικών για 2 άτομα (περιλαμβάνει 1, 2, 3, 4, 5, 6)",
price: 9.2
},

{
zh:"9. 单人开胃菜拼盘",
en:"9. Appetizer for 1",
gr:"9. Ποικιλία ορεκτικών για 1 άτομο",
price: 5.2
},

{
type:"complex",

title:{
zh:"10. 包子 （2个）",
en:"10. Bao Bun (2 pcs)",
gr:"10. Bao Bun (2 τμχ.)"
},

options:[
{
zh:"猪肉",
en:"with pork",
gr:"με χοιρινό",
price:7.8
},

{
zh:"牛肉",
en:"with beef",
gr:"με μοσχάρι",
price:9.8
},

{
zh:"水煮金枪鱼",
en:"with boiled tuna",
gr:"με βρασμένος τόνος",
price:9.8
},

{
zh:"炸虾",
en:"with fried shrimps",
gr:"με τηγανητές γαρίδες",
price:9.8
}
]
}


]


},

{
id:"soups",
name:{
zh:" 汤类",
en:" Soups",
gr:" Σούπες"
},

items:[
{
zh:"11. 云吞汤",
en:"11. Wonton soup",
gr:"11. Σούπα wonton",
price:4.5
},

{
zh:"12. 酸辣汤",
en:"12. Hot & sour soup",
gr:"12. Ξινή και καυτερή σούπα",
price:4.5
},

{
zh:"13. 鸡肉玉米汤",
en:"13. Chicken corn soup",
gr:"13. Σούπα κοτόπουλο με καλαμπόκι",
price:4.5
},

{
zh:"14. 海鲜汤",
en:"14. Seafood soup",
gr:"14. Θαλασσινή σούπα",
price:5.8
},

{
zh:"15. 鸡肉面条汤",
en:"15. Chicken noodle soup",
gr:"15. Κοτόσουπα με ζυμαρικά",
price:4.5
}
]
},

{
id:"salads",
name:{
zh:"沙拉与蔬菜",
en:"Salads & vegetables",
gr:"Σαλάτες & λαχανικά"
},

items:[
{
zh:"21. 酸甜沙拉",
en:"21. Sweet & sour salad",
gr:"21. Γλυκόξινη σαλάτα",
price:4.8
},

{
zh:"22. 蔬菜沙拉",
en:"22. Vegetable salad",
gr:"22. Σαλάτα λαχανικών",
price:4.8
},

{
zh:"23. 虾仁沙拉",
en:"23. Shrimps salad",
gr:"23. Γαριδοσαλάτα",
price:5.8
},

{
zh:"24. 水果沙拉",
en:"24. Fruit salad",
gr:"24. Φρουτοσαλάτα",
price:6.8
},

{
zh:"25. 鸡肉沙拉",
en:"25. Chicken salad",
gr:"25. Κοτοσαλάτα",
price:5.2
},

{
zh:"26. 什锦蔬菜沙拉",
en:"26. Mixed vegetable salad",
gr:"26. Ανάμεικτη σαλάτα λαχανικών",
price:5.2
},

{
zh:"27. 冬菇笋尖沙拉",
en:"27. Chinese mushroom & bamboo salad",
gr:"27. Σαλάτα με κινέζικα μανιτάρια και μπαμπού",
price:5.2
}
]
},


{
id:"rice",
name:{
zh:" 米饭与面条",
en:" Rice & noodles",
gr:" Ρύζι & noodles"
},

items:[

{
zh:"31. 白米饭",
en:"31. Steamed rice",
gr:"31. Ρύζι ατμού",
price:2.8
},

{
zh:"32. 蛋炒饭",
en:"32. Fried rice with egg",
gr:"32. Τηγανητό ρύζι με αυγό",
price:4.8
},

{
zh:"33. 广式炒饭",
en:"33. Cantonese fried rice",
gr:"33. Τηγανητό ρύζι Cantonese",
price:5.8
},

{
zh:"34. 虾仁炒饭",
en:"34. Shrimp fried rice",
gr:"34. Τηγανητό ρύζι με γαρίδες",
price:7.8
},

{
zh:"35. 鸡肉炒饭",
en:"35. Fried rice with chicken",
gr:"35. Ρύζι με κοτόπουλο",
price:6.8
},

{
zh:"36. 咖喱鸡肉饭",
en:"36. Chicken curry rice",
gr:"36. Τηγανιτό ρύζι με κοτόπουλο κάρυ",
price:6.8
},

{
zh:"37. 特制炒饭",
en:"37. Special fried rice",
gr:"37. Special τηγανητό ρύζι",
price:7.8
},

{
zh:"38. 蔬菜炒面",
en:"38. Fried noodles with vegetables",
gr:"38. Τηγανητά noodles με λαχανικά",
price:5.8
},

{
zh:"39. 鸡肉炒面",
en:"39. Fried noodles with chicken",
gr:"39. Τηγανητά noodles με κοτόπουλο",
price:6.8
},

{
zh:"40. 虾仁炒面",
en:"40. Fried noodles with shrimps",
gr:"40. Τηγανητά noodles με γαρίδες",
price:8.8
},

{
zh:"41. 特制炒面",
en:"41. Special fried noodles",
gr:"41. Special τηγανητά noodles",
price:8.8
},

{
zh:"42. 肉类咖喱炒河粉",
en:"42. Fried rice noodles with meat & curry",
gr:"42. Τηγανητά rice noodles με κρέας και κάρυ",
price:8.8
}
]
},

{
id:"duck",
name:{
zh:"鸭肉",
en:"Duck ",
gr:"Πάπια"
},

items:[

{
zh:"45. 冬菇笋尖鸭肉",
en:"45. Duck with Chinese mushrooms & bamboo",
gr:"45. Πάπια με κινέζικα μανιτάρια και μπαμπού",
price:10.5
},

{
zh:"46. 北京烤鸭",
en:"46. Beijing style roasted duck",
gr:"46. Ψητή πάπια Πεκίνου",
price:10.8
},

{
zh:"47. 辣酱鸭肉",
en:"47. Duck in chili sauce",
gr:"47. Πάπια με σάλτσα τσίλι",
price:10.5
},

{
zh:"48. 烧汁酥脆鸭",
en:"48. Crispy duck with BBQ sauce",
gr:"48. Τραγανή πάπια με σάλτσα BBQ",
price:10.5
}
]
},

{
id:"chicken",
name:{
zh:"鸡肉",
en:"Chicken ",
gr:"Κοτόπουλο"
},

items:[

{
zh:"51. 咖喱鸡",
en:"51. Curry chicken",
gr:"51. Κοτόπουλο κάρυ",
price:7.8
},

{
zh:"52. 酸甜鸡",
en:"52. Sweet & sour chicken",
gr:"52. Γλυκόξινο κοτόπουλο",
price:7.8
},

{
zh:"53. 蜜糖柠檬炸鸡",
en:"53. Fried chicken with honey & lemon sauce",
gr:"53. Τηγανητό κοτόπουλο με σάλτσα μέλι και λεμόνι",
price:7.8
},

{
zh:"54. 冬菇笋尖鸡肉",
en:"54. Chicken with Chinese mushrooms & bamboo",
gr:"54. Κοτόπουλο με κινέζικα μανιτάρια και μπαμπού",
price:7.8
},

{
zh:"55. 宫保鸡丁",
en:"55. Kong Bao chicken",
gr:"55. Κοτόπουλο με Λαχανικά & Φυστίκια (Kong Bao)",
price:7.8
},

{
zh:"56. 辣酱鸡肉",
en:"56. Chicken with chili sauce",
gr:"56. Κοτόπουλο με σάλτσα τσίλι",
price:7.8
}
]
},

{
id:"pork",
name:{
zh:"猪肉",
en:"Pork ",
gr:"Χοιρινό"
},

items:[

{
zh:"61. 什锦菜猪肉",
en:"61. Pork with mixed vegetables",
gr:"61. Χοιρινό με ανάμεικτα λαχανικά",
price:8.8
},

{
zh:"62. 冬菇笋尖猪肉",
en:"62. Pork with Chinese mushrooms & bamboo",
gr:"62. Χοιρινό με κινέζικα μανιτάρια και μπαμπού",
price:8.8
},

{
zh:"63. 酸甜猪肉",
en:"63. Sweet & sour pork",
gr:"63. Χοιρινό με γλυκόξυνη σάλτσα",
price:8.8
},

{
zh:"64. 辣味蔬菜猪肉",
en:"64. Pork with chili & vegetables",
gr:"64. Χοιρινό με τσίλι και λαχανικά",
price:8.8
},

{
zh:"65. 回锅肉",
en:"65. Double cooked pork",
gr:"65. Διπλομαγειρεμένο χοιρινό",
price:9.8
}
]
},

{
id:"beef",
name:{
zh:"牛肉",
en:"Beef ",
gr:"Μοσχάρι"
},

items:[

{
zh:"71. 辣酱牛肉",
en:"71. Beef with chili sauce",
gr:"71. Μοσχάρι με σάλτσα τσίλι",
price:9.8
},

{
zh:"72. 蚝油牛肉",
en:"72. Beef with oyster sauce",
gr:"72. Μοσχάρι με σάλτσα στρειδιών (Oyster sauce)",
price:9.8
},

{
zh:"73. 蔬菜牛肉",
en:"73. Beef with vegetables",
gr:"73. Μοσχάρι με λαχανικά",
price:9.8
},

{
zh:"74. 冬菇笋尖牛肉",
en:"74. Beef with Chinese mushrooms & bamboo",
gr:"74. Μοσχάρι με κινέζικα μανιτάρια και μπαμπού",
price:9.8
},

{
zh:"75. 沙爹牛肉",
en:"75. Beef with satay sauce",
gr:"75. Μοσχάρι με σάλτσα σάτεϊ (Satay sauce)",
price:9.8
},

{
zh:"76. 照烧牛肉",
en:"76. Teriyaki beef",
gr:"76. Μοσχάρι Τεριγιάκι (Teriyaki)",
price:9.8
}

]
},

{
id:"seafood",
name:{
zh:"海鲜",
en:"Seafood ",
gr:"Θαλασσινά"
},

items:[

{
zh:"81. 酸甜大虾",
en:"81. Sweet & sour prawn",
gr:"81. Τηγανητές γαρίδες με γλυκόξυνη σάλτσα",
price:9.8
},

{
zh:"82. 铁板沙爹大虾",
en:"82. Sizzling prawn with satay sauce",
gr:"82. Γαρίδες σιζλίνγκ (sizzling) με σάλτσα σάτεϊ",
price:9.8
},

{
zh:"83. 芝麻炸虾",
en:"83. Fried shrimps with sesame",
gr:"83. Τηγανητές γαρίδες με σουσάμι",
price:9.8
},

{
zh:"84. 姜葱炒鱿鱼",
en:"84. Fried squid with ginger & onion",
gr:"84. Τηγανητό καλαμάρι με τζίντζερ και κρεμμύδι",
price:9.8
}
]
},

{
id:"dessert",
name:{
zh:"甜品",
en:"Dessert ",
gr:"Επιδόρπιο"
},

items:[

{
zh:"91. 炸香蕉配冰淇淋",
en:"91. Fried banana with ice cream",
gr:"91. Τηγανητή μπανάνα με παγωτό",
price:4.8
},

{
zh:"92. 炸苹果配冰淇淋",
en:"92. Fried apple with ice cream",
gr:"92. Τηγανητό μήλο με παγωτό",
price:4.8
},

{
zh:"93. 炸冰淇淋",
en:"93. Fried ice cream",
gr:"93. Τηγανητό παγωτό",
price:4.8
},

{
zh:"94. 冰淇淋",
en:"94. Ice cream",
gr:"94. Παγωτό",
price:4.8
}
]
},

{
id:"saladsJapanese",
name:{
zh:"沙拉(日式)",
en:"Salads (Japanese)",
gr:"Σαλάτες (Ιαπωνικές)"
},

items:[

{
zh:"101. 绿意牛油果沙拉",
en:"101. Green avocado salad",
gr:"101. Πράσινη σαλάτα με αβοκάντο",
price:5.8
},

{
zh:"102. 虾沙拉",
en:"102. Ebi salad",
gr:"102. Σαλάτα με γαρίδες (Ebi)",
price:6.2
},

{
zh:"103. 金枪鱼沙拉",
en:"103. Tuna salad",
gr:"103. Σαλάτα με τόνο",
price:5.8
},

{
zh:"104. 海苔沙拉",
en:"104. Nori salad",
gr:"104. Σαλάτα με φύκια (Nori)",
price:5.8
},

{
zh:"105. 菠菜沙拉",
en:"105. Spinach salad",
gr:"105. Σαλάτα με σπανάκι",
price:5.8
},

{
zh:"106. 生鱼片沙拉 (刺身沙拉)",
en:"106. Sashimi salad",
gr:"106. Σαλάτα με σασίμι (Sashimi)",
price:7.8
}
]
},

{
id:"soupsJapanese",
name:{
zh:"汤类(日式)",
en:"Soup (Japanese)",
gr:"Σούπες (Ιαπωνικές)"
},

items:[
{
zh:"111. 味噌汤",
en:"111. Miso soup",
gr:"111. Σούπα με σόγια, Tofu (Miso soup)",
price:4.5
},

{
zh:"112. 海鲜海苔汤",
en:"112. Seafood nori soup",
gr:"112. Σούπα θαλασσινών με φύκια (Nori)",
price:5.5
},

{
zh:"113. 乌冬面汤",
en:"113. Udon soup",
gr:"113. Σούπα με ουντόν (Udon soup)",
price:5.5
}
]
},

{
id:"nigiri",
name:{
zh:"握寿司与刺身(2片装)",
en:"Nigiri & Sashimi (2 pcs)",
gr:"Nigiri & Sashimi (2 τμχ)"
},

items:[

{
zh:"121. 三文鱼",
en:"121. Shake",
gr:"121. Σολομός",
price:5.8
},

{
zh:"122. 金枪鱼",
en:"122. Maguro",
gr:"122. Τόνος",
price:5.8
},

{
zh:"123. 鲷鱼",
en:"123. Tai",
gr:"123. Τσιπούρα",
price:4.8
},

{
zh:"124. 虾",
en:"124. Ebi",
gr:"124. Γαρίδα",
price: 5.8
},

{
zh:"125. 鳗鱼",
en:"125. Unaki",
gr:"125. Χέλι",
price:5.8
},

{
zh:"126. 玉子烧",
en:"126. Tamago",
gr:"126. Ομελέτα",
price:3.8
},

{
zh:"127. 三文鱼籽",
en:"127. Ikura",
gr:"127. Αυγά Σολομού",
price:3.8
},

{
zh:"128. 鲈鱼",
en:"128. Suzuki",
gr:"128. Λαβράκι",
price:4.8
}
]
},

{
id:"maki",
name:{
zh:"卷寿司",
en:"Maki",
gr:"Maki"
},

items:[

{
zh:"131. 太卷 (蔬菜大卷)",
en:"131. Futomaki (Big roll with vegetables)",
gr:"131. Futomaki (Μεγάλο ρολό με λαχανικά)",
price:5.8
},

{
zh:"132. 牛油果卷",
en:"132. Avocado maki",
gr:"132. Μάκι με αβοκάντο (Avocado maki)",
price:5.2
},

{
zh:"133. 水果卷",
en:"133. Fruit maki",
gr:"133. Μάκι με φρούτα (Fruit maki)",
price:5.2
},

{
zh:"134. 铁火卷 (金枪鱼卷)",
en:"134. Tekka maki (Tuna roll)",
gr:"134. Τέκκα μάκι (Ρολό με τόνο) ",
price:5.8
},

{
zh:"135. 辣味金枪鱼卷（或三文鱼）",
en:"135. Spicy tuna maki (or salmon)",
gr:"135. Καυτερό μάκι με τόνο (ή σολομό)",
price:6.2
},

{
zh:"136. 脆皮天妇罗龙卷",
en:"136. Crunchy dragon roll",
gr:"136. Τραγανό dragon roll (Crunchy dragon roll)",
price:9.8
},

{
zh:"137. 加州卷",
en:"137. California maki (California roll)",
gr:"137. Καλιφόρνια μάκι (California roll)",
price:6.8
},

{
zh:"138. 芝士三文鱼卷",
en:"138. Cheese salmon maki",
gr:"138. Μάκι με σολομό και τυρί",
price:6.8
},

{
zh:"139. 炸虾天妇罗卷",
en:"139. Ebi tempura maki",
gr:"139. Μάκι με γαρίδα tempura (Ebi tempura maki)",
price:6.8
},

{
zh:"140. 阿拉斯加卷 (内裹三文鱼、牛油果和黄瓜)",
en:"140. Alaskan roll (Fresh salmon, avocado, and cucumber)",
gr:"140. Alaskan roll (Ρολό με σολομό και αβοκάντο)",
price:6.8
},

{
zh:"141. 三文鱼籽牛油果卷 (含红鱼子和牛油果)",
en:"141. Ikura maki (Salmon roe and avocado)",
gr:"141. Μάκι με μπρίκ και αβοκάντο (Ikura maki with salmon roe and avocado)",
price:6.8
},

{
zh:"142. 东方卷 (内裹红鱼子、虾、鸡蛋、牛油果和黄瓜)",
en:"142. East roll (Salmon roe, shrimp, tamago, avocado, and cucumber)",
gr:"142. East roll (Ρολό με μπρίκ, γαρίδα, ομελέτα, αβοκάντο και αγγούρι)",
price:6.8
},

{
zh:"143. 烤三文鱼菠萝卷",
en:"143. Grilled salmon and pineapple maki",
gr:"143. Μάκι με ψητό σολομό και ανανά (Grill salmon pineapple maki)",
price:6.8
}
]
},

{
id:"setsushi",
name:{
zh:"寿司套餐",
en:"Set sushi",
gr:"Ποικιλία σούσι"
},

items:[

{
zh:"151. 单人份卷寿司套餐 (15件) — (三文鱼, 金枪鱼, 虾, 牛油果, 波士顿卷, 加州卷)",
en:"151. Maki set for 1 (15pcs) — (Salmon, Tuna, Ebi, Avocado, Boston, California)",
gr:"151. Σετ μάκι για 1 άτομο (15 τμχ) — (Σολομός, Τόνος, Γαρίδα, Αβοκάντο, Boston, California)",
price:12.8
},

{
zh:"152. 双人份卷寿司套餐 (30件)",
en:"152. Maki set for 2 (30pcs)",
gr:"152. Σετ μάκι για 2 άτομα (30 τμχ)",
price:23
},

{
zh:"153. 单人份握寿司套餐 (三文鱼, 金枪鱼, 海鲈鱼, 鸡蛋, 鳗鱼, 虾)",
en:"153. Nigiri set for 1 (Salmon, tuna, sea bass, tamago, eel, shrimp)",
gr:"153. Σετ Nigiri για 1 άτομο (Σολομός, τόνος, λαβράκι, ομελέτα, χέλι, γαρίδα)",
price:17
},

{
zh:"154. 双人份握寿司套餐",
en:"154. Nigiri set for 2",
gr:"154. Σετ νιγκίρι για 2 άτομα",
price: 30
}
]
},

{
id:"dishes",
name:{
zh:"菜肴(日式)",
en:"Dishes (Japanese)",
gr:"Πιάτα (Ιαπωνικά)"
},

items:[

{
zh:"161. 三文鱼塔塔 (新鲜三文鱼、鱼子酱、炸洋葱、大豆酱汁)",
en:"161. Salmon tartar (Fresh salmon, salmon roe, fried onion, and soy sauce)",
gr:"161. Ταρτάρ σολομού (Σολομός, μπρίκ, τηγανητό κρεμμύδι και σάλτσα σόγιας)",
price:9.8
},

{
zh:"162. 金枪鱼塔塔 (三文鱼、炸洋葱、蛋黄酱、芥末)",
en:"162. Tuna tartar (Salmon, fried onion, mayonnaise, and wasabi)",
gr:"162. Ταρτάρ τόνου (Σολομός, τηγανητό κρεμμύδι, μαγιονέζα και ουασάμπι)",
price:9.8
},

{
zh:"163. 海鲈鱼塔塔 (鲷鱼、鱼子酱、炸洋葱、大豆酱汁)",
en:"163. Suzuki tartar (Sea bream, salmon roe, fried onion, and soy sauce)",
gr:"163. Ταρτάρ λαβράκι (Τσιπούρα, μπρίκ, τηγανητό κρεμμύδι και σάλτσα σόγιας)",
price:9.8
},

{
zh:"164. 炸虾天妇罗 (炸大虾及蔬菜)",
en:"164. Ebi tempura (Fried jumbo shrimps and vegetables)",
gr:"164. Τεμπούρα γαρίδας (Τηγανητές μεγάλες γαρίδες και λαχανικά)",
price:9.8
},

{
zh:"165. 坚果炸鸡",
en:"165. Fried chicken with nuts",
gr:"165. Τηγανητό κοτόπουλο με ξηρούς καρπούς",
price:8.8
},

{
zh:"166. 炸老虎虾",
en:"166. Fried tiger shrimps",
gr:"166. Τηγανητές γαρίδες τίγρης",
price:10.8
},

{
zh:"167. 炸猪排",
en:"167. Fried pork steak",
gr:"167. Τηγανητή χοιρινή μπριζόλα",
price:9.8
},

{
zh:"168. 蔬菜炒乌冬面",
en:"168. Fried Udon noodles with vegetables",
gr:"168. Τηγανητά noodles Ουντόν με λαχανικά",
price:7.8
},

{
zh:"169. 烤三文鱼汉堡",
en:"169. Grilled salmon burger",
gr:"169. Ψητό μπέργκερ σολομού",
price:10.8
},

{
zh:"170. 散寿司 (米饭配新鲜刺身)",
en:"170. Chirashi (Rice topped with fresh sashimi)",
gr:"170. Chirashi (Ρύζι με φρέσκο σασίμι)",
price:16.8
}
]
},

{
id:"drinks",
name:{
zh:"饮品",
en:"Drinks",
gr:"Ποτά"
},

items:[

{
zh:"软饮 (可口可乐、芬达、苏打水)",
en:"Soft drinks (Coca Cola, Fanta, Soda)",
gr:"Αναψυκτικά (Coca Cola, Fanta, Σόδα)",
price:1.8
},

{
zh:"青岛啤酒",
en:"Tsingtao beer",
gr:"Μπίρα Tsingtao",
price:2.8
},

{
zh:"日本啤酒 (朝日啤酒)",
en:"Japanese beer (Asahi)",
gr:"Ιαπωνική μπίρα (Asahi)",
price:3.8
},

{
zh:"喜力啤酒、阿姆斯特尔啤酒",
en:"Heineken beer, Amstel beer",
gr:"Μπίρα Heineken, Μπίρα Amstel",
price:2.2
},

{
zh:"日本清酒 (180 毫升)",
en:"Sake (180ml)",
gr:"Σάκε (180ml)",
price:5.2
},

{
zh:"矿泉水 (0.5升)",
en:"Mineral water (0.5lt)",
gr:"Εμφιαλωμένο νερό (0.5lt)",
price:0.5
}
]
}

]

}
