/**
 * ============================================
 * RPG Adventure - 제작 시스템
 * ============================================
 * 재료를 소모해 아이템을 제작합니다.
 */

// ============================================
// 🛠️ 제작 데이터
// ============================================

/**
 * 제작 시스템에서 사용하는 기본 아이템 정의입니다.
 * 기존 아이템 DB에 없을 때만 등록됩니다.
 */
const CRAFTING_ITEM_DEFINITIONS = {
    old_cloth_scrap: {
        id: 'old_cloth_scrap',
        name: '낡은 천조각',
        type: 'material',
        rarity: 'common',
        description: '낡아 해졌지만 아직 쓸모가 있는 천조각입니다.',
        icon: '🧵',
        sellPrice: 2,
        stackable: true
    },
    crude_grass: {
        id: 'crude_grass',
        name: '조잡한 풀',
        type: 'material',
        rarity: 'common',
        description: '손질이 덜 된 들풀입니다.',
        icon: '🍀',
        sellPrice: 2,
        stackable: true
    },
    water: {
        id: 'water',
        name: '물',
        type: 'material',
        rarity: 'common',
        description: '간단한 제조에 쓰이는 깨끗한 물입니다.',
        icon: '💧',
        sellPrice: 2,
        stackable: true
    },
    bark_armor: {
        id: 'bark_armor',
        name: '나무껍질 갑옷',
        type: 'armor',
        rarity: 'uncommon',
        stats: { pDef: 6, vit: 1 },
        description: '거친 나무껍질과 천을 엮어 만든 초급 갑옷입니다.',
        icon: '🪵',
        sellPrice: 45
    },
    crude_hp_potion: {
        id: 'crude_hp_potion',
        name: '조잡한 HP 회복 물약',
        type: 'consumable',
        rarity: 'common',
        effect: { hp: 35 },
        description: '효과는 약하지만 급할 때 유용한 회복 물약입니다.',
        icon: '🧪',
        image: 'assets/items/hp_potion.png',
        sellPrice: 12,
        stackable: true
    },
    crude_bandage: {
        id: 'crude_bandage',
        name: '조잡한 붕대',
        type: 'consumable',
        rarity: 'common',
        effect: { hp: 20 },
        description: '응급 처치용으로 감아두는 조잡한 붕대입니다.',
        icon: '🩹',
        sellPrice: 8,
        stackable: true
    },
    copper_ingot: {
        id: 'copper_ingot',
        name: '구리 주괴',
        type: 'material',
        rarity: 'uncommon',
        description: '구리 광석을 정제해 만든 기본 금속 재료입니다.',
        icon: '🧱',
        sellPrice: 12,
        stackable: true
    }
};

/**
 * 제작 레시피 목록입니다.
 */
const CRAFTING_RECIPES = [
    {
        id: 'recipe_bark_armor',
        name: '나무껍질 갑옷 제작',
        result: { itemId: 'bark_armor', quantity: 1 },
        ingredients: [
            { itemId: 'wood_piece', quantity: 10 },
            { itemId: 'old_cloth_scrap', quantity: 5 }
        ],
        difficulty: 34,
        description: '기본 생존에 필요한 임시 방어구를 만듭니다.'
    },
    {
        id: 'recipe_crude_hp_potion',
        name: '조잡한 HP 회복 물약 제조',
        result: { itemId: 'crude_hp_potion', quantity: 1 },
        ingredients: [
            { itemId: 'crude_grass', quantity: 3 },
            { itemId: 'water', quantity: 3 }
        ],
        difficulty: 28,
        description: '간단한 재료를 끓여 체력을 회복하는 물약을 만듭니다.'
    },
    {
        id: 'recipe_crude_bandage',
        name: '조잡한 붕대 제작',
        result: { itemId: 'crude_bandage', quantity: 2 },
        ingredients: [
            { itemId: 'old_cloth_scrap', quantity: 3 },
            { itemId: 'herb', quantity: 2 }
        ],
        difficulty: 22,
        description: '천과 약초를 섞어 응급용 붕대를 만듭니다.'
    }
];

/**
 * 자유 조합 전용 레시피입니다.
 * 기존 레시피는 자동으로 자유 조합에 포함됩니다.
 */
const MANUAL_CRAFTING_EXTRA_RECIPES = [
    {
        id: 'manual_recipe_copper_ingot',
        name: '구리 주괴 제련',
        result: { itemId: 'copper_ingot', quantity: 1 },
        ingredients: [
            { itemId: 'copper_ore', quantity: 2 },
            { itemId: 'coal', quantity: 1 }
        ],
        difficulty: 26,
        description: '구리 광석과 석탄을 달궈 구리 주괴를 만듭니다.'
    }
];

/**
 * 장비 분해 레시피입니다.
 * key는 분해 대상 아이템 ID입니다.
 */
const DISMANTLE_RECIPES = {
    // 요청 반영 예시: 상점의 구리 단검 분해
    copper_sword: [
        { itemId: 'copper_ingot', quantity: 1 },
        { itemId: 'wood_piece', quantity: 2 }
    ],
    copper_longsword: [
        { itemId: 'copper_ingot', quantity: 1 },
        { itemId: 'wood_piece', quantity: 2 }
    ],
    copper_bow: [
        { itemId: 'copper_ingot', quantity: 1 },
        { itemId: 'wood_piece', quantity: 2 }
    ],
    copper_staff: [
        { itemId: 'copper_ingot', quantity: 1 },
        { itemId: 'wood_piece', quantity: 2 }
    ],
    copper_heavy_armor: [
        { itemId: 'copper_ingot', quantity: 2 },
        { itemId: 'old_cloth_scrap', quantity: 1 }
    ],
    copper_light_armor: [
        { itemId: 'copper_ingot', quantity: 2 },
        { itemId: 'old_cloth_scrap', quantity: 1 }
    ],
    copper_reinforced_hunting_clothes: [
        { itemId: 'copper_ingot', quantity: 2 },
        { itemId: 'old_cloth_scrap', quantity: 1 }
    ],
    copper_inscribed_robe: [
        { itemId: 'copper_ingot', quantity: 2 },
        { itemId: 'old_cloth_scrap', quantity: 1 }
    ]
};

const CRAFTING_EQUIPABLE_TYPES = ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'tool', 'necklace', 'ring', 'accessory'];
const MANUAL_CRAFTING_SLOT_COUNT = 9;
const MANUAL_PICKER_PAGE_SIZE = 20;

let currentCraftingTab = 'recipe';
let manualCraftSlots = Array.from({ length: MANUAL_CRAFTING_SLOT_COUNT }, () => ({ itemId: '', quantity: 1 }));
let activeManualSlotIndex = -1;
let manualPickerSelection = { itemId: '', quantity: 1 };
let currentManualPickerTab = 'all';

// ============================================
// 🔧 내부 유틸
// ============================================

/**
 * 숫자를 최소/최대 범위로 제한합니다.
 * @param {number} value - 원본 값
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {number} 제한된 값
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * 제작/분해에서 공통으로 사용할 수량 배열 키를 생성합니다.
 * @param {Array<{itemId:string, quantity:number}>} ingredients - 재료 배열
 * @returns {string} 정규화 키
 */
function createIngredientKey(ingredients) {
    return [...ingredients]
        .filter(entry => entry.itemId && entry.quantity > 0)
        .sort((a, b) => a.itemId.localeCompare(b.itemId))
        .map(entry => `${entry.itemId}:${entry.quantity}`)
        .join('|');
}

/**
 * 아이템 이름을 반환합니다.
 * @param {string} itemId - 아이템 ID
 * @returns {string} 아이템 이름
 */
function getItemNameById(itemId) {
    return ITEMS_DATABASE[itemId]?.name || itemId;
}

/**
 * 아이템 아이콘을 반환합니다.
 * @param {string} itemId - 아이템 ID
 * @returns {string} 아이콘
 */
function getItemIconById(itemId) {
    return ITEMS_DATABASE[itemId]?.icon || '📦';
}

/**
 * 인벤토리에서 특정 아이템의 총 수량을 구합니다.
 * @param {string} itemId - 아이템 ID
 * @returns {number} 보유 수량
 */
function getInventoryItemQuantity(itemId) {
    if (!Array.isArray(inventoryItems)) return 0;

    return inventoryItems
        .filter(item => item.id === itemId)
        .reduce((sum, item) => sum + (item.quantity || 1), 0);
}

/**
 * 인벤토리에서 선택 가능한 아이템 목록(중복 ID 병합)을 반환합니다.
 * @returns {Array<{id:string, name:string, icon:string, quantity:number}>} 선택 가능한 아이템 목록
 */
function getCraftingSelectableItems() {
    if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) return [];

    const itemMap = new Map();

    inventoryItems.forEach(item => {
        if (!item?.id) return;
        const prev = itemMap.get(item.id) || {
            id: item.id,
            name: getItemNameById(item.id),
            icon: getItemIconById(item.id),
            type: item.type || 'material',
            quantity: 0
        };
        prev.quantity += item.quantity || 1;
        itemMap.set(item.id, prev);
    });

    return [...itemMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 자유 조합 선택 탭 기준으로 아이템을 필터링합니다.
 * @param {Array<{id:string, type:string}>} items - 선택 가능한 아이템 목록
 * @param {string} tab - 탭 ID
 * @returns {Array<Object>} 필터링된 아이템 목록
 */
function getManualPickerFilteredItems(items, tab) {
    if (!Array.isArray(items) || !items.length) return [];
    if (tab === 'all') return items;

    if (tab === 'armor') {
        const armorTypes = ['armor', 'helmet', 'boots', 'gloves', 'necklace', 'ring', 'accessory'];
        return items.filter(item => armorTypes.includes(item.type));
    }

    return items.filter(item => item.type === tab);
}

/**
 * 인벤토리에서 특정 아이템을 지정 수량만큼 소모합니다.
 * @param {string} itemId - 아이템 ID
 * @param {number} quantity - 소모 수량
 * @returns {boolean} 소모 성공 여부
 */
function consumeInventoryItemById(itemId, quantity) {
    let remaining = quantity;

    for (let i = inventoryItems.length - 1; i >= 0 && remaining > 0; i--) {
        const item = inventoryItems[i];
        if (item.id !== itemId) continue;

        const currentQuantity = item.quantity || 1;

        if (item.stackable && currentQuantity > remaining) {
            item.quantity = currentQuantity - remaining;
            remaining = 0;
            break;
        }

        remaining -= currentQuantity;
        inventoryItems.splice(i, 1);
    }

    return remaining <= 0;
}

/**
 * 여러 재료가 인벤토리에 충분한지 확인합니다.
 * @param {Array<{itemId:string, quantity:number}>} ingredients - 재료 배열
 * @returns {boolean} 충분 여부
 */
function hasEnoughIngredients(ingredients) {
    return ingredients.every(ingredient => getInventoryItemQuantity(ingredient.itemId) >= ingredient.quantity);
}

/**
 * 여러 재료를 인벤토리에서 소모합니다.
 * @param {Array<{itemId:string, quantity:number}>} ingredients - 재료 배열
 */
function consumeIngredients(ingredients) {
    ingredients.forEach(ingredient => {
        consumeInventoryItemById(ingredient.itemId, ingredient.quantity);
    });
}

/**
 * 레시피 제작 가능 여부를 반환합니다.
 * @param {Object} recipe - 레시피 객체
 * @returns {boolean} 제작 가능 여부
 */
function canCraftRecipe(recipe) {
    return hasEnoughIngredients(recipe.ingredients);
}

/**
 * 자유 조합에서 사용할 레시피 목록을 반환합니다.
 * @returns {Array<Object>} 자유 조합 레시피 배열
 */
function getManualCraftRecipes() {
    return [...CRAFTING_RECIPES, ...MANUAL_CRAFTING_EXTRA_RECIPES];
}

/**
 * 자유 조합 슬롯의 선택 상태를 집계하여 재료 배열로 반환합니다.
 * @returns {Array<{itemId:string, quantity:number}>} 집계된 재료 배열
 */
function getSelectedManualIngredients() {
    const ingredientMap = new Map();

    manualCraftSlots.forEach(slot => {
        if (!slot.itemId || slot.quantity <= 0) return;

        const prev = ingredientMap.get(slot.itemId) || 0;
        ingredientMap.set(slot.itemId, prev + slot.quantity);
    });

    return [...ingredientMap.entries()].map(([itemId, quantity]) => ({ itemId, quantity }));
}

/**
 * 현재 슬롯을 제외하고 동일 아이템이 자유 조합에 예약된 수량을 반환합니다.
 * @param {string} itemId - 아이템 ID
 * @param {number} excludeSlotIndex - 제외할 슬롯 인덱스
 * @returns {number} 예약 수량
 */
function getReservedManualQuantity(itemId, excludeSlotIndex) {
    if (!itemId) return 0;

    return manualCraftSlots.reduce((sum, slot, index) => {
        if (index === excludeSlotIndex) return sum;
        if (slot.itemId !== itemId) return sum;
        return sum + Math.max(1, Number(slot.quantity) || 1);
    }, 0);
}

/**
 * 특정 슬롯에서 선택 가능한 아이템의 최대 수량을 반환합니다.
 * @param {number} slotIndex - 슬롯 인덱스
 * @param {string} itemId - 아이템 ID
 * @returns {number} 최대 선택 수량
 */
function getManualSlotAvailableQuantity(slotIndex, itemId) {
    if (!itemId) return 0;

    const inventoryQuantity = getInventoryItemQuantity(itemId);
    const reserved = getReservedManualQuantity(itemId, slotIndex);
    return Math.max(0, inventoryQuantity - reserved);
}

/**
 * 선택된 자유 조합 재료와 일치하는 레시피를 찾습니다.
 * @param {Array<{itemId:string, quantity:number}>} ingredients - 재료 배열
 * @returns {Object|null} 일치 레시피
 */
function findManualCraftRecipe(ingredients) {
    if (!ingredients.length) return null;

    const targetKey = createIngredientKey(ingredients);
    const recipes = getManualCraftRecipes();

    return recipes.find(recipe => createIngredientKey(recipe.ingredients) === targetKey) || null;
}

/**
 * 분해 가능한 인벤토리 아이템 목록을 반환합니다.
 * @returns {Array<{index:number, item:Object}>} 인덱스 포함 분해 후보 배열
 */
function getDismantleCandidates() {
    if (!Array.isArray(inventoryItems)) return [];

    const candidates = [];
    inventoryItems.forEach((item, index) => {
        if (!item || !CRAFTING_EQUIPABLE_TYPES.includes(item.type)) return;
        candidates.push({ index, item });
    });

    return candidates;
}

/**
 * 장비 분해 결과물을 계산합니다.
 * @param {Object} item - 분해 대상 아이템
 * @returns {Array<{itemId:string, quantity:number}>} 분해 결과 배열
 */
function getDismantleResult(item) {
    const preset = DISMANTLE_RECIPES[item.id];
    if (Array.isArray(preset) && preset.length > 0) {
        return preset.map(entry => ({ ...entry }));
    }

    const fallback = [];

    if (item.type === 'weapon') {
        fallback.push({ itemId: 'wood_piece', quantity: 1 });
    } else {
        fallback.push({ itemId: 'old_cloth_scrap', quantity: 1 });
    }

    if (['uncommon', 'rare', 'epic', 'legendary'].includes(item.rarity)) {
        fallback.push({ itemId: 'metal_piece', quantity: 1 });
    }

    return fallback;
}

/**
 * 플레이어 능력치 기반 제작 성공 확률을 계산합니다.
 * @param {Object} recipe - 레시피 객체
 * @returns {number} 0~100 확률
 */
function calculateCraftChance(recipe) {
    const playerStr = player?.str || 0;
    const playerInt = player?.int || 0;

    const baseChance = 50;
    const statBonus = (playerInt * 1.2) + (playerStr * 0.8);
    const difficultyPenalty = recipe.difficulty || 0;

    return clamp(Math.round(baseChance + statBonus - difficultyPenalty), 20, 95);
}

/**
 * 게임 로그를 안전하게 출력합니다.
 * @param {string} message - 출력 메시지
 */
function addCraftLog(message) {
    if (typeof addGameLog === 'function') {
        addGameLog(message);
        return;
    }

    console.log(`📜 ${message}`);
}

// ============================================
// 🧪 제작 로직
// ============================================

/**
 * 제작을 시도합니다.
 * @param {string} recipeId - 레시피 ID
 */
function craftItem(recipeId) {
    const recipe = CRAFTING_RECIPES.find(entry => entry.id === recipeId);
    if (!recipe) {
        addCraftLog('❌ 존재하지 않는 제작식입니다.');
        return;
    }

    if (!canCraftRecipe(recipe)) {
        addCraftLog(`❌ ${recipe.name}: 재료가 부족합니다.`);
        renderCraftingUI();
        return;
    }

    // 재료를 먼저 소모합니다.
    consumeIngredients(recipe.ingredients);

    const successChance = calculateCraftChance(recipe);
    const roll = Math.random() * 100;

    if (roll <= successChance) {
        const result = recipe.result;
        addItemToInventory(result.itemId, result.quantity || 1);
        addCraftLog(`🛠️ 제작 성공! ${getItemNameById(result.itemId)} x${result.quantity || 1} 획득`);
    } else {
        addCraftLog(`💥 제작 실패... ${recipe.name} 제작에 실패했습니다.`);
    }

    // 인벤토리 창이 열려 있으면 동기화 렌더링
    const inventoryModal = document.getElementById('inventoryModal');
    if (inventoryModal && !inventoryModal.classList.contains('hidden') && typeof renderInventory === 'function') {
        renderInventory();
    }

    renderCraftingUI();
}

/**
 * 자유 조합 슬롯의 아이템을 변경합니다.
 * @param {number} slotIndex - 슬롯 인덱스
 * @param {string} itemId - 아이템 ID
 */
function setManualCraftSlotItem(slotIndex, itemId) {
    if (!manualCraftSlots[slotIndex]) return;

    manualCraftSlots[slotIndex].itemId = itemId || '';
    manualCraftSlots[slotIndex].quantity = 1;
    renderCraftingUI();
}

/**
 * 자유 조합 슬롯의 수량을 변경합니다.
 * @param {number} slotIndex - 슬롯 인덱스
 * @param {number|string} quantity - 수량
 */
function setManualCraftSlotQuantity(slotIndex, quantity) {
    if (!manualCraftSlots[slotIndex]) return;

    const parsed = Number(quantity);
    const selectedItemId = manualCraftSlots[slotIndex].itemId;
    const maxQuantity = selectedItemId ? getManualSlotAvailableQuantity(slotIndex, selectedItemId) : 1;
    const normalized = Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
    manualCraftSlots[slotIndex].quantity = clamp(normalized, 1, Math.max(1, maxQuantity));

    if (activeManualSlotIndex === slotIndex && manualPickerSelection.itemId === selectedItemId) {
        manualPickerSelection.quantity = manualCraftSlots[slotIndex].quantity;
    }

    renderCraftingUI();
}

/**
 * 자유 조합 슬롯 선택창을 엽니다.
 * @param {number} slotIndex - 슬롯 인덱스
 */
function openManualCraftSlotPicker(slotIndex) {
    if (!manualCraftSlots[slotIndex]) return;

    const slot = manualCraftSlots[slotIndex];
    activeManualSlotIndex = slotIndex;

    if (slot.itemId) {
        const maxQuantity = Math.max(1, getManualSlotAvailableQuantity(slotIndex, slot.itemId));
        manualPickerSelection = {
            itemId: slot.itemId,
            quantity: clamp(slot.quantity || 1, 1, maxQuantity)
        };
    } else {
        manualPickerSelection = { itemId: '', quantity: 1 };
    }

    renderCraftingUI();
}

/**
 * 자유 조합 슬롯 선택창을 닫습니다.
 */
function closeManualCraftSlotPicker() {
    activeManualSlotIndex = -1;
    manualPickerSelection = { itemId: '', quantity: 1 };
    currentManualPickerTab = 'all';
    renderCraftingUI();
}

/**
 * 자유 조합 아이템 선택 탭을 변경합니다.
 * @param {string} tab - 탭 ID
 */
function changeManualCraftPickerTab(tab) {
    const validTabs = ['all', 'weapon', 'armor', 'consumable', 'material'];
    if (!validTabs.includes(tab)) return;

    currentManualPickerTab = tab;
    renderCraftingUI();
}

/**
 * 슬롯 선택창에서 아이템을 선택합니다.
 * @param {string} itemId - 아이템 ID
 */
function selectManualCraftPickerItem(itemId) {
    if (activeManualSlotIndex < 0) return;

    const slot = manualCraftSlots[activeManualSlotIndex];
    const maxQuantity = Math.max(1, getManualSlotAvailableQuantity(activeManualSlotIndex, itemId));
    const nextQuantity = slot.itemId === itemId ? slot.quantity || 1 : 1;

    manualPickerSelection = {
        itemId,
        quantity: clamp(nextQuantity, 1, maxQuantity)
    };

    renderCraftingUI();
}

/**
 * 슬롯 선택창의 수량을 변경합니다.
 * @param {number|string} quantity - 변경 수량
 */
function setManualCraftPickerQuantity(quantity) {
    if (activeManualSlotIndex < 0 || !manualPickerSelection.itemId) return;

    const parsed = Number(quantity);
    const maxQuantity = Math.max(1, getManualSlotAvailableQuantity(activeManualSlotIndex, manualPickerSelection.itemId));
    const normalized = Number.isFinite(parsed) ? Math.floor(parsed) : 1;
    manualPickerSelection.quantity = clamp(normalized, 1, maxQuantity);
    renderCraftingUI();
}

/**
 * 슬롯 선택창 수량을 증감합니다.
 * @param {number} delta - 증감량
 */
function changeManualCraftPickerQuantity(delta) {
    if (activeManualSlotIndex < 0 || !manualPickerSelection.itemId) return;

    const baseQuantity = Number.isFinite(Number(manualPickerSelection.quantity)) ? Number(manualPickerSelection.quantity) : 1;
    setManualCraftPickerQuantity(baseQuantity + delta);
}

/**
 * 슬롯 선택창의 선택을 슬롯에 반영합니다.
 */
function applyManualCraftPickerSelection() {
    if (activeManualSlotIndex < 0 || !manualCraftSlots[activeManualSlotIndex]) return;
    if (!manualPickerSelection.itemId) {
        addCraftLog('❌ 아이템을 먼저 선택해주세요.');
        return;
    }

    const maxQuantity = getManualSlotAvailableQuantity(activeManualSlotIndex, manualPickerSelection.itemId);
    if (maxQuantity <= 0) {
        addCraftLog('❌ 해당 아이템의 사용 가능한 수량이 없습니다.');
        return;
    }

    manualCraftSlots[activeManualSlotIndex].itemId = manualPickerSelection.itemId;
    manualCraftSlots[activeManualSlotIndex].quantity = clamp(manualPickerSelection.quantity || 1, 1, maxQuantity);

    activeManualSlotIndex = -1;
    manualPickerSelection = { itemId: '', quantity: 1 };
    renderCraftingUI();
}

/**
 * 자유 조합 슬롯을 비웁니다.
 * @param {number} slotIndex - 슬롯 인덱스
 */
function clearManualCraftSlot(slotIndex) {
    if (!manualCraftSlots[slotIndex]) return;

    manualCraftSlots[slotIndex] = { itemId: '', quantity: 1 };

    if (activeManualSlotIndex === slotIndex) {
        activeManualSlotIndex = -1;
        manualPickerSelection = { itemId: '', quantity: 1 };
    }

    renderCraftingUI();
}

/**
 * 자유 조합 슬롯을 초기화합니다.
 */
function resetManualCraftSlots() {
    manualCraftSlots = Array.from({ length: MANUAL_CRAFTING_SLOT_COUNT }, () => ({ itemId: '', quantity: 1 }));
    activeManualSlotIndex = -1;
    manualPickerSelection = { itemId: '', quantity: 1 };
    currentManualPickerTab = 'all';
    renderCraftingUI();
}

/**
 * 자유 조합을 시도합니다.
 */
function attemptManualCraft() {
    const ingredients = getSelectedManualIngredients();

    if (!ingredients.length) {
        addCraftLog('❌ 조합할 재료를 먼저 선택해주세요.');
        return;
    }

    if (!hasEnoughIngredients(ingredients)) {
        addCraftLog('❌ 선택한 재료 수량이 인벤토리보다 많습니다.');
        renderCraftingUI();
        return;
    }

    // 자유 조합은 시도 자체에 재료를 소모합니다.
    consumeIngredients(ingredients);

    const matchedRecipe = findManualCraftRecipe(ingredients);
    if (!matchedRecipe) {
        addCraftLog('💥 조합 실패... 알 수 없는 조합이라 아무것도 만들어지지 않았습니다.');
        renderCraftingUI();
        return;
    }

    const successChance = calculateCraftChance(matchedRecipe);
    const roll = Math.random() * 100;

    if (roll <= successChance) {
        addItemToInventory(matchedRecipe.result.itemId, matchedRecipe.result.quantity || 1);
        addCraftLog(`🧪 조합 성공! ${getItemNameById(matchedRecipe.result.itemId)} x${matchedRecipe.result.quantity || 1} 획득`);
    } else {
        addCraftLog(`💥 조합 실패... ${matchedRecipe.name} 제작에 실패했습니다.`);
    }

    renderCraftingUI();
}

/**
 * 장비를 분해합니다.
 * @param {number} slotIndex - 인벤토리 슬롯 인덱스
 */
function dismantleItem(slotIndex) {
    if (!Array.isArray(inventoryItems) || slotIndex < 0 || slotIndex >= inventoryItems.length) {
        addCraftLog('❌ 분해할 아이템을 찾을 수 없습니다.');
        return;
    }

    const item = inventoryItems[slotIndex];
    if (!item || !CRAFTING_EQUIPABLE_TYPES.includes(item.type)) {
        addCraftLog('❌ 해당 아이템은 분해할 수 없습니다.');
        return;
    }

    const rewards = getDismantleResult(item);
    inventoryItems.splice(slotIndex, 1);

    rewards.forEach(reward => {
        addItemToInventory(reward.itemId, reward.quantity || 1);
    });

    const rewardText = rewards.map(reward => `${getItemNameById(reward.itemId)} x${reward.quantity}`).join(', ');
    addCraftLog(`🧰 분해 성공! ${item.name} → ${rewardText}`);

    if (typeof renderInventory === 'function') {
        const inventoryModal = document.getElementById('inventoryModal');
        if (inventoryModal && !inventoryModal.classList.contains('hidden')) {
            renderInventory();
        }
    }

    renderCraftingUI();
}

// ============================================
// 🎨 제작 UI
// ============================================

/**
 * 제작 창을 엽니다.
 */
function showCrafting() {
    const modal = document.getElementById('craftingModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    renderCraftingUI();
}

/**
 * 제작 창을 닫습니다.
 */
function hideCrafting() {
    const modal = document.getElementById('craftingModal');
    if (!modal) return;

    modal.classList.add('hidden');
}

/**
 * 제작 탭을 전환합니다.
 * @param {string} tab - 탭 ID
 */
function switchCraftingTab(tab) {
    const validTabs = ['recipe', 'manual', 'dismantle'];
    if (!validTabs.includes(tab)) return;

    currentCraftingTab = tab;
    renderCraftingUI();
}

/**
 * 상단 탭 버튼의 활성 상태를 갱신합니다.
 */
function renderCraftingTabs() {
    document.querySelectorAll('.crafting-tab-btn').forEach(button => {
        const active = button.dataset.tab === currentCraftingTab;
        button.classList.toggle('active', active);
    });
}

/**
 * 레시피 탭 패널을 렌더링합니다.
 */
function renderRecipePanel() {
    const listContainer = document.getElementById('craftingRecipeList');
    if (!listContainer) return;

    listContainer.innerHTML = CRAFTING_RECIPES.map(recipe => {
        const resultItem = ITEMS_DATABASE[recipe.result.itemId];
        const recipeAvailable = canCraftRecipe(recipe);
        const successChance = calculateCraftChance(recipe);

        const ingredientHtml = recipe.ingredients.map(ingredient => {
            const ownQuantity = getInventoryItemQuantity(ingredient.itemId);
            const enough = ownQuantity >= ingredient.quantity;

            return `
                <div class="crafting-ingredient ${enough ? 'enough' : 'lack'}">
                    <span>${getItemIconById(ingredient.itemId)} ${getItemNameById(ingredient.itemId)}</span>
                    <span>${ownQuantity}/${ingredient.quantity}</span>
                </div>
            `;
        }).join('');

        return `
            <article class="crafting-card ${recipeAvailable ? 'can-craft' : ''}">
                <header class="crafting-card-header">
                    <h4>${resultItem?.icon || '📦'} ${resultItem?.name || recipe.result.itemId}</h4>
                    <span class="crafting-result-qty">x${recipe.result.quantity || 1}</span>
                </header>
                <p class="crafting-desc">${recipe.description}</p>
                <div class="crafting-meta">
                    <span>🎯 성공 확률: ${successChance}%</span>
                    <span>🧱 난이도: ${recipe.difficulty}</span>
                </div>
                <div class="crafting-ingredients">${ingredientHtml}</div>
                <button class="crafting-btn" onclick="craftItem('${recipe.id}')" ${recipeAvailable ? '' : 'disabled'}>
                    ${recipeAvailable ? '제작하기' : '재료 부족'}
                </button>
            </article>
        `;
    }).join('');
}

/**
 * 자유 조합 탭 패널을 렌더링합니다.
 */
function renderManualPanel() {
    const manualPanel = document.getElementById('craftingManualPanel');
    if (!manualPanel) return;

    const selectableItems = getCraftingSelectableItems();
    const selectedIngredients = getSelectedManualIngredients();
    const matchedRecipe = findManualCraftRecipe(selectedIngredients);
    const hasEnough = selectedIngredients.length > 0 && hasEnoughIngredients(selectedIngredients);

    const slotHtml = manualCraftSlots.map((slot, index) => {
        const isActive = activeManualSlotIndex === index;
        const hasItem = Boolean(slot.itemId);
        const itemName = hasItem ? getItemNameById(slot.itemId) : '빈 슬롯';
        const itemIcon = hasItem ? getItemIconById(slot.itemId) : '➕';

        return `
            <article class="manual-combine-slot ${isActive ? 'active' : ''} ${hasItem ? 'filled' : 'empty'}">
                <button class="manual-slot-hitbox" onclick="openManualCraftSlotPicker(${index})">
                    <span class="manual-slot-index">${index + 1}</span>
                    <div class="manual-slot-icon">${itemIcon}</div>
                    <div class="manual-slot-name">${itemName}</div>
                    <div class="manual-slot-qty">${hasItem ? `x${slot.quantity || 1}` : '선택'}</div>
                </button>
                ${hasItem ? `<button class="manual-slot-clear" onclick="clearManualCraftSlot(${index})" title="슬롯 비우기">✕</button>` : ''}
            </article>
        `;
    }).join('');

    const activeSlot = manualCraftSlots[activeManualSlotIndex] || null;
    const pickerVisible = activeManualSlotIndex >= 0 && Boolean(activeSlot);
    const pickerItemId = manualPickerSelection.itemId;
    const pickerMaxQuantity = pickerItemId
        ? Math.max(1, getManualSlotAvailableQuantity(activeManualSlotIndex, pickerItemId))
        : 1;
    const pickerQuantity = clamp(manualPickerSelection.quantity || 1, 1, pickerMaxQuantity);
    const pickerCanApply = pickerVisible && Boolean(pickerItemId);

    const filteredPickerItems = getManualPickerFilteredItems(selectableItems, currentManualPickerTab);
    const gridCount = Math.max(MANUAL_PICKER_PAGE_SIZE, Math.ceil(filteredPickerItems.length / 5) * 5);

    const pickerGridHtml = Array.from({ length: gridCount }, (_, slotIndex) => {
        const item = filteredPickerItems[slotIndex];
        if (!item) {
            return '<div class="manual-picker-grid-slot"><div class="manual-picker-empty"></div></div>';
        }

        const selectableQuantity = getManualSlotAvailableQuantity(activeManualSlotIndex, item.id);
        const disabled = selectableQuantity <= 0;
        const selected = pickerItemId === item.id;

        return `
            <div class="manual-picker-grid-slot ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}">
                <button class="manual-picker-grid-hitbox" onclick="selectManualCraftPickerItem('${item.id}')" ${disabled ? 'disabled' : ''}>
                    <span class="manual-picker-grid-icon">${item.icon}</span>
                    <span class="manual-picker-grid-name">${item.name}</span>
                    <span class="manual-picker-grid-count">${Math.max(0, selectableQuantity)}</span>
                </button>
            </div>
        `;
    }).join('');

    const pickerSelectedItem = pickerItemId ? selectableItems.find(item => item.id === pickerItemId) : null;
    const pickerSelectedItemType = pickerSelectedItem?.type && typeof ITEM_TYPES !== 'undefined'
        ? (ITEM_TYPES[pickerSelectedItem.type]?.name || pickerSelectedItem.type)
        : '';
    const pickerSelectedItemDesc = pickerItemId ? (ITEMS_DATABASE[pickerItemId]?.description || '설명이 없는 아이템입니다.') : '';
    const pickerSelectedAvailable = pickerItemId ? Math.max(0, getManualSlotAvailableQuantity(activeManualSlotIndex, pickerItemId)) : 0;

    const pickerModalHtml = pickerVisible
        ? `
            <div class="manual-picker-overlay" onclick="closeManualCraftSlotPicker()">
            <section class="manual-picker manual-picker-modal" onclick="event.stopPropagation()">
                <header class="manual-picker-header">
                    <h4>슬롯 ${activeManualSlotIndex + 1} 재료 선택</h4>
                    <button class="manual-picker-close" onclick="closeManualCraftSlotPicker()">닫기</button>
                </header>
                <div class="manual-picker-tabs">
                    <button class="manual-picker-tab ${currentManualPickerTab === 'all' ? 'active' : ''}" onclick="changeManualCraftPickerTab('all')">전체</button>
                    <button class="manual-picker-tab ${currentManualPickerTab === 'weapon' ? 'active' : ''}" onclick="changeManualCraftPickerTab('weapon')">무기</button>
                    <button class="manual-picker-tab ${currentManualPickerTab === 'armor' ? 'active' : ''}" onclick="changeManualCraftPickerTab('armor')">방어구</button>
                    <button class="manual-picker-tab ${currentManualPickerTab === 'consumable' ? 'active' : ''}" onclick="changeManualCraftPickerTab('consumable')">소모품</button>
                    <button class="manual-picker-tab ${currentManualPickerTab === 'material' ? 'active' : ''}" onclick="changeManualCraftPickerTab('material')">재료</button>
                </div>
                <div class="manual-picker-body">
                    <section class="manual-picker-left">
                        <div class="manual-picker-grid">${pickerGridHtml}</div>
                    </section>
                    <aside class="manual-picker-side">
                        <div class="manual-picker-selection-title">선택 아이템</div>
                        ${pickerSelectedItem ? `
                            <div class="manual-picker-selected-card">
                                <div class="manual-picker-selected-icon">${pickerSelectedItem.icon || getItemIconById(pickerItemId)}</div>
                                <div class="manual-picker-selected-name">${pickerSelectedItem.name || getItemNameById(pickerItemId)}</div>
                                <div class="manual-picker-selected-meta">${pickerSelectedItemType} | 보유 ${pickerSelectedItem.quantity} | 사용 가능 ${pickerSelectedAvailable}</div>
                                <p class="manual-picker-selected-desc">${pickerSelectedItemDesc}</p>
                            </div>
                        ` : '<p class="manual-picker-selected-empty">아이템 칸을 선택하면 정보가 표시됩니다.</p>'}

                        <div class="manual-picker-controls">
                            <div class="manual-picker-qty-label">수량</div>
                            <div class="manual-picker-qty-box">
                                <button class="manual-picker-qty-btn" onclick="changeManualCraftPickerQuantity(-1)" ${pickerItemId ? '' : 'disabled'}>-</button>
                                <input
                                    class="manual-picker-qty-input"
                                    type="number"
                                    min="1"
                                    max="${pickerMaxQuantity}"
                                    value="${pickerQuantity}"
                                    ${pickerItemId ? '' : 'disabled'}
                                    onchange="setManualCraftPickerQuantity(this.value)"
                                />
                                <button class="manual-picker-qty-btn" onclick="changeManualCraftPickerQuantity(1)" ${pickerItemId ? '' : 'disabled'}>+</button>
                            </div>
                        </div>

                        <button class="crafting-btn" onclick="applyManualCraftPickerSelection()" ${pickerCanApply ? '' : 'disabled'}>슬롯에 추가</button>
                    </aside>
                </div>
            </section>
            </div>
        `
        : '';

    const selectedHtml = selectedIngredients.length
        ? selectedIngredients.map(ingredient => `
            <div class="crafting-ingredient ${getInventoryItemQuantity(ingredient.itemId) >= ingredient.quantity ? 'enough' : 'lack'}">
                <span>${getItemIconById(ingredient.itemId)} ${getItemNameById(ingredient.itemId)}</span>
                <span>${getInventoryItemQuantity(ingredient.itemId)}/${ingredient.quantity}</span>
            </div>
        `).join('')
        : '<p class="crafting-empty">재료를 선택하면 조합 미리보기가 표시됩니다.</p>';

    let previewText = '알 수 없는 조합입니다. 시도하면 실패합니다.';
    if (matchedRecipe) {
        previewText = `예상 결과: ${getItemIconById(matchedRecipe.result.itemId)} ${getItemNameById(matchedRecipe.result.itemId)} x${matchedRecipe.result.quantity || 1}`;
    }

    manualPanel.innerHTML = `
        <div class="manual-guide">재료 슬롯을 눌러 인벤토리에서 아이템을 고르고 수량을 정한 뒤 추가하세요. 최대 9가지 재료를 넣을 수 있습니다.</div>
        <div class="manual-main-layout">
            <section class="manual-left-zone">
                <section class="manual-combine-board">${slotHtml}</section>
            </section>
            <aside class="manual-preview manual-preview-side">
            <div class="manual-preview-title">조합 미리보기</div>
            <div class="crafting-ingredients">${selectedHtml}</div>
            <div class="manual-preview-result ${matchedRecipe ? 'valid' : 'invalid'}">${previewText}</div>
            <div class="manual-actions">
                <button class="crafting-btn" onclick="attemptManualCraft()" ${selectedIngredients.length ? '' : 'disabled'}>조합 시도</button>
                <button class="crafting-btn crafting-btn-secondary" onclick="resetManualCraftSlots()">슬롯 초기화</button>
            </div>
            ${!hasEnough && selectedIngredients.length ? '<p class="crafting-warning">선택한 수량이 보유량보다 많습니다.</p>' : ''}
            </aside>
        </div>
        ${pickerModalHtml}
    `;
}

/**
 * 분해 탭 패널을 렌더링합니다.
 */
function renderDismantlePanel() {
    const dismantleList = document.getElementById('craftingDismantleList');
    if (!dismantleList) return;

    const candidates = getDismantleCandidates();
    if (!candidates.length) {
        dismantleList.innerHTML = '<p class="crafting-empty">분해 가능한 장비가 인벤토리에 없습니다.</p>';
        return;
    }

    dismantleList.innerHTML = candidates.map(({ index, item }) => {
        const rewards = getDismantleResult(item);
        const rewardText = rewards.map(reward => `${getItemIconById(reward.itemId)} ${getItemNameById(reward.itemId)} x${reward.quantity}`).join(', ');

        return `
            <article class="crafting-card dismantle-card">
                <header class="crafting-card-header">
                    <h4>${item.icon || '📦'} ${item.name}</h4>
                    <span class="crafting-result-qty">분해</span>
                </header>
                <p class="crafting-desc">${item.description || '사용하지 않는 장비를 분해해 재료를 회수합니다.'}</p>
                <div class="dismantle-result">획득 예상: ${rewardText}</div>
                <button class="crafting-btn" onclick="dismantleItem(${index})">분해하기</button>
            </article>
        `;
    }).join('');
}

/**
 * 제작 레시피 목록을 렌더링합니다.
 */
function renderCraftingUI() {
    const recipePanel = document.getElementById('craftingRecipePanel');
    const manualPanel = document.getElementById('craftingManualPanel');
    const dismantlePanel = document.getElementById('craftingDismantlePanel');
    const bonusContainer = document.getElementById('craftingStatBonus');

    if (!recipePanel || !manualPanel || !dismantlePanel || !bonusContainer) return;

    const strValue = player?.str || 0;
    const intValue = player?.int || 0;
    const strBonus = (strValue * 0.8).toFixed(1);
    const intBonus = (intValue * 1.2).toFixed(1);

    bonusContainer.innerHTML = `
        <span>💪 근력 보정: +${strBonus}</span>
        <span>🧠 지능 보정: +${intBonus}</span>
    `;

    renderCraftingTabs();

    recipePanel.classList.toggle('hidden', currentCraftingTab !== 'recipe');
    manualPanel.classList.toggle('hidden', currentCraftingTab !== 'manual');
    dismantlePanel.classList.toggle('hidden', currentCraftingTab !== 'dismantle');

    if (currentCraftingTab !== 'manual') {
        activeManualSlotIndex = -1;
        manualPickerSelection = { itemId: '', quantity: 1 };
        currentManualPickerTab = 'all';
    }

    if (currentCraftingTab === 'recipe') {
        renderRecipePanel();
    } else if (currentCraftingTab === 'manual') {
        renderManualPanel();
    } else {
        renderDismantlePanel();
    }
}

/**
 * 기존 함수명 호환성을 유지합니다.
 */
function renderCraftingRecipes() {
    renderCraftingUI();
}

// ============================================
// 🚀 초기화
// ============================================

/**
 * 제작 시스템 아이템을 기존 아이템 DB에 등록합니다.
 */
function registerCraftingItems() {
    if (typeof ITEMS_DATABASE === 'undefined') return;

    Object.entries(CRAFTING_ITEM_DEFINITIONS).forEach(([itemId, itemData]) => {
        if (!ITEMS_DATABASE[itemId]) {
            ITEMS_DATABASE[itemId] = itemData;
        }
    });
}

/**
 * 제작 시스템을 초기화합니다.
 */
function initializeCraftingSystem() {
    registerCraftingItems();
    console.log('🛠️ craftingSystem.js 로드 완료!');
}

initializeCraftingSystem();
