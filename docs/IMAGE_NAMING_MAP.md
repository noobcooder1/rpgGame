# 아이템 이미지 파일명 매핑 가이드

이 문서는 현재 코드 기준으로, 아이템 이미지를 어떤 이름으로 저장하면 게임에 반영되는지 정리한 표입니다.

## 저장 기본 규칙

- 재료 계열은 assets/items/materials 폴더에 저장합니다.
- 재료가 아닌 일반 아이템은 assets/items 폴더에 저장합니다.
- 권장 확장자는 png입니다.
- 파일명은 아이템 ID와 동일하게 소문자 + 언더스코어 형식으로 저장합니다.
- 예시: gold_ore.png, old_longsword.png, hp_potion.png

## 코드에 이미 경로가 지정된 아이템

| ID | 이름 | 타입 | 저장 경로 |
|---|---|---|---|
| amethyst | 자수정 | material | assets/items/materials/amethyst.png |
| amethyst_ore | 자수정 원석 | material | assets/items/materials/amethyst.png |
| bat_wing | 박쥐 날개 | material | assets/items/materials/bat_wing.svg |
| black_iron_ore | - | material | assets/items/materials/black_iron_ore.svg |
| blue_crystal | 푸른 수정 | material | assets/items/materials/blue_crystal.png |
| blue_crystal_ore | 푸른 수정 원석 | material | assets/items/materials/blue_crystal.png |
| coal | - | material | assets/items/materials/coal.svg |
| copper_ingot | 구리 주괴 | material | assets/items/materials/copper_ingot.svg |
| copper_ore | - | material | assets/items/materials/copper_ore.svg |
| crude_grass | 조잡한 풀 | material | assets/items/materials/crude_grass.svg |
| crude_hp_potion | 조잡한 HP 회복 물약 | consumable | assets/items/hp_potion.png |
| cursed_bone | 저주받은 뼈 | material | assets/items/materials/cursed_bone.svg |
| diamond | 다이아몬드 | material | assets/items/materials/diamond.svg |
| diamond_ore | 다이아몬드 원석 | material | assets/items/materials/diamond.svg |
| emerald | 에메랄드 | material | assets/items/materials/emerald.svg |
| emerald_ore | 에메랄드 원석 | material | assets/items/materials/emerald.svg |
| goblin_ear | 고블린 귀 | material | assets/items/materials/goblin_ear.svg |
| gold_ore | - | material | assets/items/materials/gold_ore.png |
| grass | 풀 | material | assets/items/materials/grass.svg |
| green_crystal | 녹색 수정 | material | assets/items/materials/green_crystal.png |
| green_crystal_ore | 녹색 수정 원석 | material | assets/items/materials/green_crystal.png |
| herb | 약초 | material | assets/items/materials/herb.svg |
| herb_material | 허브 | material | assets/items/materials/herb_material.svg |
| hp_potion | HP 포션 | consumable | assets/items/hp_potion.png |
| iron_ore | - | material | assets/items/materials/iron_ore.svg |
| mana_stone | 마나석 | material | assets/items/materials/mana_stone.svg |
| mana_stone_ore | 마나석 원석 | material | assets/items/materials/mana_stone.svg |
| metal_piece | 금속 조각 | material | assets/items/materials/metal_piece.svg |
| mithril_ore | - | material | assets/items/materials/mithril_ore.svg |
| monster_tooth | 몬스터 이빨 | material | assets/items/materials/monster_tooth.svg |
| mp_potion | MP 포션 | consumable | assets/items/mp_potion.png |
| obsidian | 흑요석 | material | assets/items/materials/obsidian_ore.png |
| obsidian_ore | 흑요석 원석 | material | assets/items/materials/obsidian_ore.png |
| old_cloth_scrap | 낡은 천조각 | material | assets/items/materials/old_cloth_scrap.svg |
| purify_potion | 정화의 물약 | consumable | assets/items/purify_potion.png |
| purple_crystal | 보라 수정 | material | assets/items/materials/purple_crystal.svg |
| purple_crystal_ore | 보라 수정 원석 | material | assets/items/materials/purple_crystal.svg |
| red_crystal | 붉은 수정 | material | assets/items/materials/red_crystal.png |
| red_crystal_ore | 붉은 수정 원석 | material | assets/items/materials/red_crystal.png |
| rotten_flesh | 썩은 살점 | material | assets/items/materials/rotten_flesh.svg |
| ruby | 루비 | material | assets/items/materials/ruby.svg |
| ruby_ore | 루비 원석 | material | assets/items/materials/ruby.svg |
| sapphire | 사파이어 | material | assets/items/materials/sapphire.svg |
| sapphire_ore | 사파이어 원석 | material | assets/items/materials/sapphire.svg |
| silver_ore | - | material | assets/items/materials/silver_ore.png |
| spider_silk | 거미줄 | material | assets/items/materials/spider_silk.svg |
| stone | - | material | assets/items/materials/stone.svg |
| strange_bone | 이상한 뼈 | material | assets/items/materials/strange_bone.svg |
| troll_blood | 트롤의 피 | material | assets/items/materials/troll_blood.svg |
| troll_tooth | 동굴트롤의 이빨 | material | assets/items/materials/troll_tooth.svg |
| water | 물 | material | assets/items/materials/water.svg |
| wood_piece | 나무 조각 | material | assets/items/materials/wood_piece.svg |

## 이미지 경로가 아직 없는 아이템 권장 파일명

| ID | 이름 | 타입 | 권장 저장 경로 |
|---|---|---|---|
| ancient_rune | 고대 룬 | special | assets/items/ancient_rune.png |
| bandage | 붕대 | consumable | assets/items/bandage.png |
| bark_armor | 나무껍질 갑옷 | armor | assets/items/bark_armor.png |
| bone_necklace | 뼈 목걸이 | necklace | assets/items/bone_necklace.png |
| bone_ring | 뼈 반지 | ring | assets/items/bone_ring.png |
| bread | 빵 | consumable | assets/items/bread.png |
| copper_bow | 구리 활 | weapon | assets/items/copper_bow.png |
| copper_heavy_armor | 구리 중갑 | armor | assets/items/copper_heavy_armor.png |
| copper_inscribed_robe | 구리 문양 로브 | armor | assets/items/copper_inscribed_robe.png |
| copper_light_armor | 구리 경갑 | armor | assets/items/copper_light_armor.png |
| copper_longsword | 구리 대검 | weapon | assets/items/copper_longsword.png |
| copper_reinforced_hunting_clothes | 구리 보강 사냥복 | armor | assets/items/copper_reinforced_hunting_clothes.png |
| copper_staff | 구리 지팡이 | weapon | assets/items/copper_staff.png |
| copper_sword | 구리 단검 | weapon | assets/items/copper_sword.png |
| crude_bandage | 조잡한 붕대 | consumable | assets/items/crude_bandage.png |
| crude_bow | 조잡한 활 | weapon | assets/items/crude_bow.png |
| crude_staff | 조잡한 지팡이 | weapon | assets/items/crude_staff.png |
| cursed_gloves | 저주받은 장갑 | gloves | assets/items/cursed_gloves.png |
| cursed_necklace | 저주받은 목걸이 | necklace | assets/items/cursed_necklace.png |
| cursed_ring | 저주받은 반지 | ring | assets/items/cursed_ring.png |
| cursed_shoes | 저주받은 신발 | boots | assets/items/cursed_shoes.png |
| cursed_staff | 저주받은 지팡이 | weapon | assets/items/cursed_staff.png |
| golem_essence | 골렘의 정수 | special | assets/items/golem_essence.png |
| green_tea | 녹차 | consumable | assets/items/green_tea.png |
| instructor_hat | 교관의 모자 | armor | assets/items/instructor_hat.png |
| instructor_ring | 교관의 증명 | ring | assets/items/instructor_ring.png |
| iron_heavy_armor | 철 중갑 | armor | assets/items/iron_heavy_armor.png |
| iron_light_armor | 철 경갑 | armor | assets/items/iron_light_armor.png |
| iron_pickaxe | 철 곡괭이 | tool | assets/items/iron_pickaxe.png |
| iron_plated_hunting_clothes | 철판 사냥복 | armor | assets/items/iron_plated_hunting_clothes.png |
| iron_sword | 철 단검 | weapon | assets/items/iron_sword.png |
| iron_woven_robe | 철사 직조 로브 | armor | assets/items/iron_woven_robe.png |
| kings_necklace | 왕의 목걸이 | necklace | assets/items/kings_necklace.png |
| leather_armor | 가죽 갑옷 | armor | assets/items/leather_armor.png |
| leather_heavy_armor | 튼튼한 가죽 중갑 | armor | assets/items/leather_heavy_armor.png |
| leather_hunting_clothes | 튼튼한 가죽 사냥복 | armor | assets/items/leather_hunting_clothes.png |
| leather_light_armor | 튼튼한 가죽 경갑 | armor | assets/items/leather_light_armor.png |
| leather_lined_robe | 튼튼한 가죽 로브 | armor | assets/items/leather_lined_robe.png |
| magic_gloves | 마법 장갑 | gloves | assets/items/magic_gloves.png |
| mithril_pickaxe | 미스릴 곡괭이 | tool | assets/items/mithril_pickaxe.png |
| nameless_king_ring | 이름 없는 왕의 반지 | ring | assets/items/nameless_king_ring.png |
| old_heavy_leather_armor | 낡은 가죽 중갑 | armor | assets/items/old_heavy_leather_armor.png |
| old_hunting_clothes | 낡은 사냥복 | armor | assets/items/old_hunting_clothes.png |
| old_leather_armor | 낡은 가죽 경갑 | armor | assets/items/old_leather_armor.png |
| old_longsword | 낡은 대검 | weapon | assets/items/old_longsword.png |
| old_robe | 낡은 로브 | armor | assets/items/old_robe.png |
| old_sword | 낡은 단검 | weapon | assets/items/old_sword.png |
| old_will_elixir | 오래된 의지의 영약 | consumable | assets/items/old_will_elixir.png |
| old_wind_elixir | 오래된 바람의 영약 | consumable | assets/items/old_wind_elixir.png |
| old_wisdom_elixir | 오래된 지혜의 영약 | consumable | assets/items/old_wisdom_elixir.png |
| plain_bow | 평범한 활 | weapon | assets/items/plain_bow.png |
| plain_longsword | 평범한 대검 | weapon | assets/items/plain_longsword.png |
| plain_staff | 평범한 지팡이 | weapon | assets/items/plain_staff.png |
| plain_sword | 평범한 단검 | weapon | assets/items/plain_sword.png |
| power_elixir | 힘의 영약 | consumable | assets/items/power_elixir.png |
| regeneration_elixir | 재생의 엘릭서 | consumable | assets/items/regeneration_elixir.png |
| steel_bow | 강철 활 | weapon | assets/items/steel_bow.png |
| steel_dagger | 강철 단검 | weapon | assets/items/steel_dagger.png |
| steel_longsword | 강철 대검 | weapon | assets/items/steel_longsword.png |
| steel_staff | 강철 지팡이 | weapon | assets/items/steel_staff.png |
| stone_pickaxe | 돌 곡괭이 | tool | assets/items/stone_pickaxe.png |
| strength_elixir | 힘의 엘릭서 | consumable | assets/items/strength_elixir.png |
| swift_boots | 신속의 부츠 | boots | assets/items/swift_boots.png |
| troll_greatsword | 트롤 대검 | weapon | assets/items/troll_greatsword.png |
| unknown_book | 알 수 없는 책 | special | assets/items/unknown_book.png |
| wooden_pickaxe | 나무 곡괭이 | tool | assets/items/wooden_pickaxe.png |
| wooden_sword | 나무 단검 | weapon | assets/items/wooden_sword.png |

## 자주 쓰는 체크리스트

- 파일 저장 후 경로 오탈자가 없는지 확인
- 같은 ID에 확장자만 다른 파일이 여러 개 있으면 png를 우선 권장
- 반영 확인이 안 되면 캐시를 비우고 새로고침