# 아이템 이미지 파일명 매핑 가이드 (업데이트 버전)

**마지막 업데이트: 2026년 4월 15일**  
이 문서는 현재 게임 코드(`inventorySystem.js`, `shopSystem.js`, `craftingSystem.js`) 기준으로, 모든 아이템의 이미지 관리 정보를 정리한 완전 가이드입니다.

## 저장 기본 규칙

- **재료 계열**: `assets/items/materials/` 폴더에 저장합니다.
- **일반 아이템**: `assets/items/` 폴더에 저장합니다.
- **권장 확장자**: png (일부 SVG도 가능)
- **파일명**: 아이템 ID와 동일하게 소문자 + 언더스코어 형식 (예: `gold_ore.png`, `old_longsword.png`)

## 표 범례

| 컬럼 | 설명 |
|---|---|
| ID | 게임 코드의 고유 아이템 식별자 |
| 이름 | 게임 내 표시되는 한국어 이름 |
| 타입 | weapon(무기), armor(방어구), consumable(소모품), material(재료), necklace(목걸이), ring(반지), gloves(장갑), boots(신발), special(특수), tool(도구) |
| 능력치 | 착용/사용 시 적용 (물리공격력, 마법공격력, 물리방어력, 마법방어력, 근력/민첩성/지능/생명력=기본스탯, 체력/마나=회복량) |
| 판매가격 | 상점 판매 가격 (구매 가격) |
| 획득방법 | 어디서 얻을 수 있는지 |
| 현황 | ✅ 경로지정됨 / ⏳ 파일필요 |
| 저장 경로 | 이미지 파일 저장 위치 |

---

## 📦 전체 아이템 목록

### 1️⃣ 초기 장비 (Starting Equipment)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| old_longsword | 낡은 대검 | weapon | 물리공격력: 5 | 10 | 전사 초기 장비 | ⏳ | assets/items/old_longsword.png |
| old_heavy_leather_armor | 낡은 가죽 중갑 | armor | 물리방어력: 4, 마법방어력: 2 | 10 | 전사 초기 장비 | ⏳ | assets/items/old_heavy_leather_armor.png |
| crude_bow | 조잡한 활 | weapon | 물리공격력: 5 | 10 | 궁수 초기 장비 | ⏳ | assets/items/crude_bow.png |
| old_hunting_clothes | 낡은 사냥복 | armor | 물리방어력: 3, 마법방어력: 1 | 10 | 궁수 초기 장비 | ⏳ | assets/items/old_hunting_clothes.png |
| crude_staff | 조잡한 지팡이 | weapon | 마법공격력: 5 | 10 | 마법사 초기 장비 | ⏳ | assets/items/crude_staff.png |
| old_robe | 낡은 로브 | armor | 물리방어력: 3, 마법방어력: 1 | 10 | 마법사 초기 장비 | ⏳ | assets/items/old_robe.png |
| old_sword | 낡은 단검 | weapon | 물리공격력: 5 | 10 | 도적 초기 장비 | ⏳ | assets/items/old_sword.png |
| old_leather_armor | 낡은 가죽 경갑 | armor | 물리방어력: 3, 마법방어력: 1 | 10 | 도적 초기 장비 | ⏳ | assets/items/old_leather_armor.png |

### 2️⃣ 기본 장비 (Basic Equipment)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| wooden_sword | 나무 단검 | weapon | 물리공격력: 3 | 5 | 초반 아이템 | ⏳ | assets/items/wooden_sword.png |
| iron_sword | 철 단검 | weapon | 물리공격력: 8 | 25 | 상점 판매 / 몬스터 드랍 | ⏳ | assets/items/iron_sword.png |
| leather_armor | 가죽 갑옷 | armor | 물리방어력: 3 | 10 | 초반 아이템 | ⏳ | assets/items/leather_armor.png |

### 3️⃣ 구리 장비 - Tier 1 (Copper Equipment)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| copper_longsword | 구리 대검 | weapon | 물리공격력: 7 | 75 | 상점 판매 | ⏳ | assets/items/copper_longsword.png |
| copper_bow | 구리 활 | weapon | 물리공격력: 7 | 75 | 상점 판매 | ⏳ | assets/items/copper_bow.png |
| copper_staff | 구리 지팡이 | weapon | 마법공격력: 7 | 75 | 상점 판매 | ⏳ | assets/items/copper_staff.png |
| copper_sword | 구리 단검 | weapon | 물리공격력: 7 | 75 | 상점 판매 | ⏳ | assets/items/copper_sword.png |
| copper_heavy_armor | 구리 중갑 | armor | 물리방어력: 8, 마법방어력: 5 | 95 | 상점 판매 | ⏳ | assets/items/copper_heavy_armor.png |
| copper_light_armor | 구리 경갑 | armor | 물리방어력: 8, 마법방어력: 4 | 95 | 상점 판매 | ⏳ | assets/items/copper_light_armor.png |
| copper_reinforced_hunting_clothes | 구리 보강 사냥복 | armor | 물리방어력: 6, 마법방어력: 4 | 95 | 상점 판매 | ⏳ | assets/items/copper_reinforced_hunting_clothes.png |
| copper_inscribed_robe | 구리 문양 로브 | armor | 물리방어력: 5, 마법방어력: 7 | 95 | 상점 판매 | ⏳ | assets/items/copper_inscribed_robe.png |

### 4️⃣ 평범한 장비 - Tier 2 (Plain Equipment)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| plain_longsword | 평범한 대검 | weapon | 물리공격력: 10, 근력: 1 | 150 | 상점 판매 | ⏳ | assets/items/plain_longsword.png |
| plain_bow | 평범한 활 | weapon | 물리공격력: 10, 근력: 1 | 150 | 상점 판매 | ⏳ | assets/items/plain_bow.png |
| plain_staff | 평범한 지팡이 | weapon | 마법공격력: 10, 지능: 1 | 150 | 상점 판매 | ⏳ | assets/items/plain_staff.png |
| plain_sword | 평범한 단검 | weapon | 물리공격력: 10, 민첩성: 1 | 150 | 상점 판매 | ⏳ | assets/items/plain_sword.png |

### 5️⃣ 가죽 장비 - Tier 1 (Leather Equipment)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| leather_heavy_armor | 튼튼한 가죽 중갑 | armor | 물리방어력: 6, 마법방어력: 3 | 40 | 상점 판매 | ⏳ | assets/items/leather_heavy_armor.png |
| leather_light_armor | 튼튼한 가죽 경갑 | armor | 물리방어력: 5, 마법방어력: 3 | 40 | 상점 판매 | ⏳ | assets/items/leather_light_armor.png |
| leather_hunting_clothes | 튼튼한 가죽 사냥복 | armor | 물리방어력: 4, 마법방어력: 3 | 40 | 상점 판매 | ⏳ | assets/items/leather_hunting_clothes.png |
| leather_lined_robe | 튼튼한 가죽 로브 | armor | 물리방어력: 3, 마법방어력: 4 | 40 | 상점 판매 | ⏳ | assets/items/leather_lined_robe.png |

### 6️⃣ 철 장비 - Tier 3 (Iron Equipment)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| iron_heavy_armor | 철 중갑 | armor | 물리방어력: 12, 마법방어력: 8, 근력: 1 | 200 | 상점 판매 | ⏳ | assets/items/iron_heavy_armor.png |
| iron_light_armor | 철 경갑 | armor | 물리방어력: 10, 마법방어력: 6, 민첩성: 1 | 200 | 상점 판매 | ⏳ | assets/items/iron_light_armor.png |
| iron_plated_hunting_clothes | 철판 사냥복 | armor | 물리방어력: 8, 마법방어력: 6, 민첩성: 1 | 200 | 상점 판매 | ⏳ | assets/items/iron_plated_hunting_clothes.png |
| iron_woven_robe | 철사 직조 로브 | armor | 물리방어력: 7, 마법방어력: 10, 지능: 1 | 200 | 상점 판매 | ⏳ | assets/items/iron_woven_robe.png |

### 7️⃣ 강철 장비 - Tier 4 (Steel Equipment - 대련 보상)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| steel_longsword | 강철 대검 | weapon | 물리공격력: 15, 근력: 2 | 300 | 훈련 대련 보상 | ⏳ | assets/items/steel_longsword.png |
| steel_bow | 강철 활 | weapon | 물리공격력: 15, 민첩성: 2 | 300 | 훈련 대련 보상 | ⏳ | assets/items/steel_bow.png |
| steel_staff | 강철 지팡이 | weapon | 마법공격력: 15, 지능: 2 | 300 | 훈련 대련 보상 | ⏳ | assets/items/steel_staff.png |
| steel_dagger | 강철 단검 | weapon | 물리공격력: 15, 민첩성: 2 | 300 | 훈련 대련 보상 | ⏳ | assets/items/steel_dagger.png |

### 8️⃣ 소모품 - 음식 (Consumable - Food)

| ID | 이름 | 타입 | 효과 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| hp_potion | HP 포션 | consumable | 체력: +50 | 15 | 초기장비 / 상점 / 몬스터드랍 | ✅ | assets/items/hp_potion.png |
| mp_potion | MP 포션 | consumable | 마나: +30 | 20 | 초기장비 / 상점 / 몬스터드랍 | ✅ | assets/items/mp_potion.png |
| crude_hp_potion | 조잡한 HP 회복 물약 | consumable | 체력: +35 | 12 | 탐사 / 제작 | ✅ | assets/items/hp_potion.png |
| bandage | 붕대 | consumable | HP: +20 | 5 | 상점 판매 | ⏳ | assets/items/bandage.png |
| bread | 빵 | consumable | 배고픔: +20 | 4 | 상점 판매 / 탐사 | ⏳ | assets/items/bread.png |
| green_tea | 녹차 | consumable | 갈증: +20 | 4 | 상점 판매 | ⏳ | assets/items/green_tea.png |
| purify_potion | 정화의 물약 | consumable | 상태이상 제거 | 12 | 상점 판매 / 몬스터드랍 | ✅ | assets/items/purify_potion.png |

### 9️⃣ 소모품 - 엘릭서 (Consumable - Elixir)

| ID | 이름 | 타입 | 효과 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| regeneration_elixir | 재생의 엘릭서 | consumable | 체력: +200 | 300 | 엘릭서 제작 / 몬스터드랍 | ⏳ | assets/items/regeneration_elixir.png |
| strength_elixir | 힘의 엘릭서 | consumable | 체력: +100 | 250 | 엘릭서 제작 / 몬스터드랍 | ⏳ | assets/items/strength_elixir.png |
| power_elixir | 힘의 영약 | consumable | 영구: 근력 +3 | 400 | 엘릭서 제작 | ⏳ | assets/items/power_elixir.png |
| old_wind_elixir | 오래된 바람의 영약 | consumable | 영구: 민첩성 +2 | 350 | 몬스터드랍 / 보물상자 | ⏳ | assets/items/old_wind_elixir.png |
| old_wisdom_elixir | 오래된 지혜의 영약 | consumable | 영구: 지능 +2 | 350 | 몬스터드랍 / 보물상자 | ⏳ | assets/items/old_wisdom_elixir.png |
| old_will_elixir | 오래된 의지의 영약 | consumable | 영구: 근력 +1, 민첩성 +1 | 350 | 몬스터드랍 / 보물상자 | ⏳ | assets/items/old_will_elixir.png |

### 🔟 장식품 (Accessories)

#### 목걸이 (Necklace)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| bone_necklace | 뼈 목걸이 | necklace | 물리공격력: 5, 물리방어력: 3 | 200 | 제작 / 몬스터드랍 | ⏳ | assets/items/bone_necklace.png |
| cursed_necklace | 저주받은 목걸이 | necklace | 마법공격력: 6, 마법방어력: 3 | 350 | 몬스터드랍(저주시인) | ⏳ | assets/items/cursed_necklace.png |
| kings_necklace | 왕의 목걸이 | necklace | 물리공격력: 8, 마법공격력: 8, 물리방어력: 5, 마법방어력: 5, 근력: 7, 민첩성: 7, 지능: 7, 생명력: 7 | 1800 | 스토리 보상 | ⏳ | assets/items/kings_necklace.png |

#### 반지 (Ring)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| bone_ring | 뼈 반지 | ring | 물리공격력: 3, 생명력: 2 | 150 | 제작 / 몬스터드랍 | ⏳ | assets/items/bone_ring.png |
| cursed_ring | 저주받은 반지 | ring | 마법공격력: 4, 지능: 2 | 300 | 몬스터드랍(저주시인) | ⏳ | assets/items/cursed_ring.png |
| nameless_king_ring | 이름 없는 왕의 반지 | ring | 물리공격력: 10, 마법공격력: 10, 물리방어력: 8, 마법방어력: 8, 근력: 7, 민첩성: 7, 지능: 7, 생명력: 7 | 2000 | 최루스 신관 퀘스트 보상 | ⏳ | assets/items/nameless_king_ring.png |
| instructor_ring | 교관의 증명 | ring | 물리공격력: 5, 마법공격력: 5, 물리방어력: 5, 마법방어력: 5, 근력: 5, 민첩성: 5, 지능: 5, 생명력: 5 | 500 | 모든 훈련 교관 대련 클리어 보상 | ⏳ | assets/items/instructor_ring.png |

#### 신발 (Boots)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| swift_boots | 신속의 부츠 | boots | 민첩성: 5, 물리방어력: 3 | 800 | 엘릭서 제작 / 보물상자 | ⏳ | assets/items/swift_boots.png |
| cursed_shoes | 저주받은 신발 | boots | 마법공격력: 5, 민첩성: 3 | 400 | 몬스터드랍(저주시인) | ⏳ | assets/items/cursed_shoes.png |

#### 장갑 (Gloves)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| magic_gloves | 마법 장갑 | gloves | 마법공격력: 8, 지능: 3 | 800 | 엘릭서 제작 / 보물상자 | ⏳ | assets/items/magic_gloves.png |
| cursed_gloves | 저주받은 장갑 | gloves | 마법공격력: 5, 지능: 2 | 400 | 몬스터드랍(저주시인) | ⏳ | assets/items/cursed_gloves.png |

#### 투구/모자 (Helmet)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| instructor_hat | 교관의 모자 | armor | 물리방어력: 8, 마법방어력: 8, 근력: 1, 지능: 1, 민첩성: 1 | 500 | 상급교관 퀘스트 보상 | ⏳ | assets/items/instructor_hat.png |

### 1️⃣1️⃣ 특수 아이템 (Special Items)

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| ancient_rune | 고대 룬 | special | 고대의 마력이 깃든 신비한 룬 | 1500 | 고대 유적 / 혼돈의 던전 | ⏳ | assets/items/ancient_rune.png |
| unknown_book | 알 수 없는 책 | special | 해독할 수 없는 문자로 씌어진 책 | 500 | 마왕성 / 혼돈의 던전 | ⏳ | assets/items/unknown_book.png |
| golem_essence | 골렘의 정수 | special | 훈련용 마법골렘의 핵심 부품에서 추출한 마력의 정수 | 1000 | 훈련 골렘 파괴 / 스파 보상 | ⏳ | assets/items/golem_essence.png |

---

## 📚 재료 아이템 (Materials)

### 일반 재료

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| old_cloth_scrap | 낡은 천조각 | material | 낡아 해졌지만 아직 쓸모가 있는 천조각 | 2 | 탐사 | ✅ | assets/items/materials/old_cloth_scrap.svg |
| crude_grass | 조잡한 풀 | material | 손질이 덜 된 들풀 | 2 | 탐사 | ✅ | assets/items/materials/crude_grass.svg |
| water | 물 | material | 간단한 제조에 쓰이는 깨끗한 물 | 2 | 탐사 / 제작 | ✅ | assets/items/materials/water.svg |
| grass | 풀 | material | 일반적인 풀. 다양한 용도 | 1 | 탐사 / 상점 | ✅ | assets/items/materials/grass.svg |
| wood_piece | 나무 조각 | material | 허수아비에서 떨어진 나무 조각 | 2 | 몬스터드랍(허수아비) | ✅ | assets/items/materials/wood_piece.svg |
| metal_piece | 금속 조각 | material | 로봇에서 떨어진 금속 조각 | 10 | 몬스터드랍(로봇/골렘) | ✅ | assets/items/materials/metal_piece.svg |
| herb | 약초 | material | 일반적인 약초. 물약 제조 | 3 | 탐사 / 상점 | ✅ | assets/items/materials/herb.svg |
| herb_material | 허브 | material | 향긋한 허브. 요리나 물약 | 3 | 상점 판매 | ✅ | assets/items/materials/herb_material.svg |

### 몬스터 드랍 재료

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| bat_wing | 박쥐 날개 | material | 박쥐의 얇은 날개 | 5 | 몬스터드랍(박쥐) | ✅ | assets/items/materials/bat_wing.svg |
| spider_silk | 거미줄 | material | 질긴 거미줄 | 8 | 몬스터드랍(거미) | ✅ | assets/items/materials/spider_silk.svg |
| strange_bone | 이상한 뼈 | material | 스켈레톤에서 떨어진 뼈 | 5 | 몬스터드랍(스켈레톤) | ✅ | assets/items/materials/strange_bone.svg |
| cursed_bone | 저주받은 뼈 | material | 저주가 깃든 뼈 | 15 | 몬스터드랍(스켈레톤) | ✅ | assets/items/materials/cursed_bone.svg |
| rotten_flesh | 썩은 살점 | material | 언데드에서 떨어진 썩은 살점 | 3 | 몬스터드랍(좀비) | ✅ | assets/items/materials/rotten_flesh.svg |
| goblin_ear | 고블린 귀 | material | 고블린의 뾰족한 귀 | 5 | 몬스터드랍(고블린) | ✅ | assets/items/materials/goblin_ear.svg |
| monster_tooth | 몬스터 이빨 | material | 몬스터의 날카로운 이빨 | 8 | 몬스터드랍(일부 몬스터) | ✅ | assets/items/materials/monster_tooth.svg |
| troll_tooth | 동굴트롤의 이빨 | material | 동굴트롤의 거대하고 날카로운 이빨 | 500 | 몬스터드랍(동굴트롤) | ✅ | assets/items/materials/troll_tooth.svg |
| troll_blood | 트롤의 피 | material | 재생력이 있는 트롤의 피 | 100 | 몬스터드랍(동굴트롤) | ✅ | assets/items/materials/troll_blood.svg |

### 광석 및 광물

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| copper_ore | 구리 광석 | material | - | - | 광산채굴 | ✅ | assets/items/materials/copper_ore.png |
| copper_ingot | 구리 주괄 | material | 구리 광석을 정제해 만든 기본 금속 재료 | 12 | 제작(광석정제) | ✅ | assets/items/materials/copper_ingot.svg |
| iron_ore | 철 광석 | material | - | - | 광산채굴 | ✅ | assets/items/materials/iron_ore.png |
| silver_ore | 은 광석 | material | - | - | 광산채굴 | ✅ | assets/items/materials/silver_ore.png |
| gold_ore | 황금 광석 | material | - | - | 광산채굴 | ✅ | assets/items/materials/gold_ore.png |
| coal | 석탄 | material | - | - | 광산채굴 | ✅ | assets/items/materials/coal.svg |
| mithril_ore | 미스릴 광석 | material | - | - | 광산채굴 | ✅ | assets/items/materials/mithril_ore.svg |
| black_iron_ore | 흑철 광석 | material | - | - | 광산채굴 | ✅ | assets/items/materials/black_iron_ore.svg |
| stone | 돌 | material | - | - | 탐사 / 광산 | ✅ | assets/items/materials/stone.svg |

### 보석 및 수정 - 원석

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| obsidian_ore | 흑요석 원석 | material | 거칠게 깨진 흑요석 원석. 가공하면 흑요석 | 22 | 광산채굴 | ✅ | assets/items/materials/obsidian_ore.png |
| amethyst_ore | 자수정 원석 | material | 보랏빛이 감도는 자수정 원석. 세공하면 자수정 | 24 | 광산채굴 | ✅ | assets/items/materials/amethyst.png |
| ruby_ore | 루비 원석 | material | 붉은 빛이 도는 루비 원석. 세공하면 루비 | 36 | 광산채굴 | ✅ | assets/items/materials/ruby.svg |
| sapphire_ore | 사파이어 원석 | material | 푸른 빛이 도는 사파이어 원석. 세공하면 사파이어 | 36 | 광산채굴 | ✅ | assets/items/materials/sapphire.svg |
| emerald_ore | 에메랄드 원석 | material | 초록빛이 도는 에메랄드 원석. 세공하면 에메랄드 | 42 | 광산채굴 | ✅ | assets/items/materials/emerald.svg |
| diamond_ore | 다이아몬드 원석 | material | 강한 경도를 지닌 다이아몬드 원석. 세공하면 다이아몬드 | 90 | 광산채굴 | ✅ | assets/items/materials/diamond.svg |
| mana_stone_ore | 마나석 원석 | material | 마력이 스며 있는 거친 원석. 세공하면 마나석 | 28 | 광산채굴 | ✅ | assets/items/materials/mana_stone.svg |
| red_crystal_ore | 붉은 수정 원석 | material | 붉게 빛나는 수정 원석. 세공하면 붉은 수정 | 21 | 광산채굴 | ✅ | assets/items/materials/red_crystal_ore.png |
| blue_crystal_ore | 푸른 수정 원석 | material | 푸르게 빛나는 수정 원석. 세공하면 푸른 수정 | 21 | 광산채굴 | ✅ | assets/items/materials/blue_crystal_ore.png |
| green_crystal_ore | 녹색 수정 원석 | material | 초록빛이 도는 수정 원석. 세공하면 녹색 수정 | 21 | 광산채굴 | ✅ | assets/items/materials/green_crystal_ore.png |

### 보석 및 수정 - 완제품

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| obsidian | 흑요석 | material | 정제된 흑요석 | 35 | 광산 / 제작 | ✅ | assets/items/materials/obsidian_ore.png |
| amethyst | 자수정 | material | 세공된 자수정 | 40 | 광산 / 제작 | ✅ | assets/items/materials/amethyst.png |
| ruby | 루비 | material | 세공된 루비 | 60 | 광산 / 제작 | ✅ | assets/items/materials/ruby.svg |
| sapphire | 사파이어 | material | 세공된 사파이어 | 60 | 광산 / 제작 | ✅ | assets/items/materials/sapphire.svg |
| emerald | 에메랄드 | material | 세공된 에메랄드 | 70 | 광산 / 제작 | ✅ | assets/items/materials/emerald.svg |
| diamond | 다이아몬드 | material | 세공된 다이아몬드 | 150 | 광산 / 제작 | ✅ | assets/items/materials/diamond.svg |
| mana_stone | 마나석 | material | 정제된 마나석 | 45 | 광산 / 제작 | ✅ | assets/items/materials/mana_stone.svg |
| red_crystal | 붉은 수정 | material | 세공된 붉은 수정 | 35 | 광산 / 제작 | ✅ | assets/items/materials/red_crystal.png |
| blue_crystal | 푸른 수정 | material | 세공된 푸른 수정 | 35 | 광산 / 제작 | ✅ | assets/items/materials/blue_crystal.png |
| green_crystal | 녹색 수정 | material | 세공된 녹색 수정 | 35 | 광산 / 제작 | ✅ | assets/items/materials/green_crystal.png |
| purple_crystal | 보라 수정 | material | 세공된 보라 수정 | - | - | ✅ | assets/items/materials/purple_crystal.svg |
| purple_crystal_ore | 보라 수정 원석 | material | 불빛이 도는 보라 수정 원석 | - | - | ✅ | assets/items/materials/purple_crystal.svg |

### 제작용 재료

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| bark_armor | 나무껍질 갑옷 | armor | 거친 나무껍질과 천을 엮어 만든 초급 갑옷 | 45 | 제작 | ⏳ | assets/items/bark_armor.png |
| crude_bandage | 조잡한 붕대 | consumable | 응급 처치용으로 감아두는 조잡한 붕대 | 8 | 제작 | ⏳ | assets/items/crude_bandage.png |

---

## 🔧 도구 아이템 (Tool Items)

| ID | 이름 | 타입 | 설명 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| wooden_pickaxe | 나무 곡괭이 | tool | 초급 채굴 도구 | - | 제작 / 상점 | ⏳ | assets/items/wooden_pickaxe.png |
| stone_pickaxe | 돌 곡괭이 | tool | 기본 채굴 도구 | - | 제작 / 상점 | ⏳ | assets/items/stone_pickaxe.png |
| iron_pickaxe | 철 곡괭이 | tool | 효율적인 채굴 도구 | - | 제작 / 상점 | ⏳ | assets/items/iron_pickaxe.png |
| mithril_pickaxe | 미스릴 곡괭이 | tool | 고급 채굴 도구 | - | 제작 / 스토리 보상 | ⏳ | assets/items/mithril_pickaxe.png |

---

## ⚔️ 특수 무기 (Special Weapons)

| ID | 이름 | 타입 | 능력치 | 판매가 | 획득방법 | 현황 | 저장 경로 |
|---|---|---|---|---|---|---|---|
| cursed_staff | 저주받은 지팡이 | weapon | 마법공격력: 20, 지능: 3 | 600 | 몬스터드랍(저주시인) | ⏳ | assets/items/cursed_staff.png |
| troll_greatsword | 트롤 대검 | weapon | 물리공격력: 25, 근력: 5 | 500 | 몬스터드랍(동굴트롤) | ⏳ | assets/items/troll_greatsword.png |

---

## 📋 자주 쓰는 체크리스트

- [ ] 파일 저장 후 경로 오탈자가 없는지 확인
- [ ] 같은 ID에 확장자만 다른 파일이 여러 개 있으면 png를 우선 권장
- [ ] 반영 확인이 안 되면 캐시를 비우고 새로고침 (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] 새로운 아이템 추가 시 영어 ID(소문자_언더스코어), 한국어 이름으로 통일
- [ ] 이미지 해상도는 최소 64x64px 이상 권장 (UI 카드: 50x50 이상)

---

## 📝 참고 사항

- **⏳ 파일필요**: 게임 코드에 정의되어 있지만 이미지 파일이 아직 없는 아이템
- **✅ 경로지정됨**: 이미 코드에서 경로가 지정되어 있고 정상 작동하는 아이템
- 능력치가 "-"인 경우: 해당 스탯이 없거나 특수 효과만 있음
- 판매가가 "-"인 경우: 판매 불가 또는 특수 아이템
- 모든 경로는 게임 루트 디렉토리 기준 상대 경로입니다
