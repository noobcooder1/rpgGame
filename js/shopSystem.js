/**
 * ============================================
 * RPG Adventure - 상점 시스템
 * ============================================
 * 상점 아이템 구매/판매, NPC 대화를 처리합니다.
 */

// ============================================
// 🛒 상점 아이템 데이터
// ============================================

/**
 * 훈련장 상점 판매 아이템
 * 설정:
 * - 탐사불가지역, 전투불가
 * - 상점주인 NPC와 대화 후 구매 가능
 * - 직업별 무기/방어구, 소모품, 재료 판매
 */
const SHOP_ITEMS = {
    // ===== 구리 무기 (Tier 1) =====
    copperWeapons: {
        warrior: {
            id: 'copper_longsword',
            name: '구리 대검',
            type: 'weapon',
            rarity: 'common',
            stats: { pAtk: 7 },
            description: '구리로 만든 전사용 대검입니다. 초보자에게 적합합니다.',
            icon: '⚔️',
            price: 150,
            sellPrice: 75,
            job: 'warrior'
        },
        archer: {
            id: 'copper_bow',
            name: '구리 활',
            type: 'weapon',
            rarity: 'common',
            stats: { pAtk: 7 },
            description: '구리로 보강된 궁수용 활입니다.',
            icon: '🏹',
            price: 150,
            sellPrice: 75,
            job: 'archer'
        },
        mage: {
            id: 'copper_staff',
            name: '구리 지팡이',
            type: 'weapon',
            rarity: 'common',
            stats: { mAtk: 7 },
            description: '구리 장식이 달린 마법사용 지팡이입니다.',
            icon: '🪄',
            price: 150,
            sellPrice: 75,
            job: 'mage'
        },
        skirmisher: {
            id: 'copper_sword',
            name: '구리 단검',
            type: 'weapon',
            rarity: 'common',
            stats: { pAtk: 7 },
            description: '구리로 만든 도적용 단검입니다. 가볍고 날카롭습니다.',
            icon: '🗡️',
            price: 150,
            sellPrice: 75,
            job: 'skirmisher'
        }
    },

    // ===== 평범한 무기 (Tier 2) =====
    weapons: {
        warrior: {
            id: 'plain_longsword',
            name: '평범한 대검',
            type: 'weapon',
            rarity: 'uncommon',
            stats: { pAtk: 10, str: 1 },
            description: '전사용 평범한 대검입니다. 기본기에 충실합니다.',
            icon: '⚔️',
            price: 300,
            sellPrice: 150,
            job: 'warrior'
        },
        archer: {
            id: 'plain_bow',
            name: '평범한 활',
            type: 'weapon',
            rarity: 'uncommon',
            stats: { pAtk: 10, str: 1 },
            description: '궁수용 평범한 활입니다. 강한 장력을 자랑합니다.',
            icon: '🏹',
            price: 300,
            sellPrice: 150,
            job: 'archer'
        },
        mage: {
            id: 'plain_staff',
            name: '평범한 지팡이',
            type: 'weapon',
            rarity: 'uncommon',
            stats: { mAtk: 10, int: 1 },
            description: '마법사용 평범한 지팡이입니다. 마력을 담기에 적합합니다.',
            icon: '🪄',
            price: 300,
            sellPrice: 150,
            job: 'mage'
        },
        skirmisher: {
            id: 'plain_sword',
            name: '평범한 단검',
            type: 'weapon',
            rarity: 'uncommon',
            stats: { pAtk: 10, agi: 1 },
            description: '도적용 평범한 단검입니다. 가볍고 빠릅니다.',
            icon: '🗡️',
            price: 300,
            sellPrice: 150,
            job: 'skirmisher'
        }
    },

    // ===== 직업별 방어구 (재료별) =====
    armors: {
        // --- 튼튼한 가죽 (Tier 1) ---
        leather: {
            warrior: {
                id: 'leather_heavy_armor',
                name: '튼튼한 가죽 중갑',
                type: 'armor',
                rarity: 'common',
                stats: { pDef: 6, mDef: 3 },
                description: '질긴 가죽으로 만든 전사용 중갑입니다.',
                icon: '🛡️',
                price: 80,
                sellPrice: 40,
                job: 'warrior'
            },
            skirmisher: {
                id: 'leather_light_armor',
                name: '튼튼한 가죽 경갑',
                type: 'armor',
                rarity: 'common',
                stats: { pDef: 5, mDef: 3 },
                description: '질긴 가죽으로 만든 도적용 경갑입니다. 움직임이 자유롭습니다.',
                icon: '🥋',
                price: 80,
                sellPrice: 40,
                job: 'skirmisher'
            },
            archer: {
                id: 'leather_hunting_clothes',
                name: '튼튼한 가죽 사냥복',
                type: 'armor',
                rarity: 'common',
                stats: { pDef: 4, mDef: 3 },
                description: '질긴 가죽으로 만든 궁수용 사냥복입니다. 숲에서 위장에 유리합니다.',
                icon: '👕',
                price: 80,
                sellPrice: 40,
                job: 'archer'
            },
            mage: {
                id: 'leather_lined_robe',
                name: '튼튼한 가죽 로브',
                type: 'armor',
                rarity: 'common',
                stats: { pDef: 3, mDef: 4 },
                description: '질긴 가죽 안감이 달린 마법사용 로브입니다.',
                icon: '🧥',
                price: 80,
                sellPrice: 40,
                job: 'mage'
            }
        },
        // --- 구리 (Tier 2) ---
        copper: {
            warrior: {
                id: 'copper_heavy_armor',
                name: '구리 중갑',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 8, mDef: 5 },
                description: '구리판으로 보강된 전사용 중갑입니다. 묵직한 방어력을 자랑합니다.',
                icon: '🛡️',
                price: 190,
                sellPrice: 95,
                job: 'warrior'
            },
            skirmisher: {
                id: 'copper_light_armor',
                name: '구리 경갑',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 8, mDef: 4 },
                description: '구리 조각으로 보강된 도적용 경갑입니다. 민첩성을 유지하면서 방어력을 높였습니다.',
                icon: '🥋',
                price: 190,
                sellPrice: 95,
                job: 'skirmisher'
            },
            archer: {
                id: 'copper_reinforced_hunting_clothes',
                name: '구리 보강 사냥복',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 6, mDef: 4 },
                description: '구리판으로 어깨와 가슴을 보강한 궁수용 사냥복입니다.',
                icon: '👕',
                price: 190,
                sellPrice: 95,
                job: 'archer'
            },
            mage: {
                id: 'copper_inscribed_robe',
                name: '구리 문양 로브',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 5, mDef: 7 },
                description: '마력 증폭을 위한 구리 문양이 새겨진 마법사용 로브입니다.',
                icon: '🧥',
                price: 190,
                sellPrice: 95,
                job: 'mage'
            }
        },
        // --- 철 (Tier 3) ---
        iron: {
            warrior: {
                id: 'iron_heavy_armor',
                name: '철 중갑',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 12, mDef: 8, str: 1 },
                description: '단단한 철판으로 만든 전사용 중갑입니다. 최고의 물리 방어력을 자랑합니다.',
                icon: '🛡️',
                price: 400,
                sellPrice: 200,
                job: 'warrior'
            },
            skirmisher: {
                id: 'iron_light_armor',
                name: '철 경갑',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 10, mDef: 6, agi: 1 },
                description: '경량화된 철판으로 만든 도적용 경갑입니다.',
                icon: '🥋',
                price: 400,
                sellPrice: 200,
                job: 'skirmisher'
            },
            archer: {
                id: 'iron_plated_hunting_clothes',
                name: '철판 사냥복',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 8, mDef: 6, agi: 1 },
                description: '철판으로 요소요소를 보강한 궁수용 사냥복입니다. 방어력이 크게 향상되었습니다.',
                icon: '👕',
                price: 400,
                sellPrice: 200,
                job: 'archer'
            },
            mage: {
                id: 'iron_woven_robe',
                name: '철사 직조 로브',
                type: 'armor',
                rarity: 'uncommon',
                stats: { pDef: 7, mDef: 10, int: 1 },
                description: '마법 강화된 철사로 직조된 마법사용 로브입니다. 방어력과 마법 저항력이 뛰어납니다.',
                icon: '🧥',
                price: 400,
                sellPrice: 200,
                job: 'mage'
            }
        }
    },

    // ===== 소모품 =====
    consumables: [
        {
            id: 'hp_potion',
            name: '체력회복물약',
            type: 'consumable',
            rarity: 'common',
            description: 'HP를 50 회복합니다.',
            icon: '❤️',
            price: 15,
            sellPrice: 7,
            effect: { type: 'heal_hp', amount: 50 },
            stackable: true
        },
        {
            id: 'mp_potion',
            name: '마나회복물약',
            type: 'consumable',
            rarity: 'common',
            description: 'MP를 30 회복합니다.',
            icon: '💙',
            price: 20,
            sellPrice: 10,
            effect: { type: 'heal_mp', amount: 30 },
            stackable: true
        },
        {
            id: 'bandage',
            name: '붕대',
            type: 'consumable',
            rarity: 'common',
            description: 'HP를 20 회복합니다. 저렴하지만 효과가 약합니다.',
            icon: '🩹',
            price: 10,
            sellPrice: 5,
            effect: { type: 'heal_hp', amount: 20 },
            stackable: true
        },
        {
            id: 'purify_potion',
            name: '정화의 물약',
            type: 'consumable',
            rarity: 'uncommon',
            description: '모든 상태이상을 제거합니다.',
            icon: '✨',
            image: 'assets/items/purify_potion.png',
            price: 25,
            sellPrice: 12,
            effect: { type: 'cure_status' },
            stackable: true
        }
    ],

    // ===== 재료 =====
    materials: [
        {
            id: 'herb',
            name: '약초',
            type: 'material',
            rarity: 'common',
            description: '일반적인 약초입니다. 물약 제조에 사용됩니다.',
            icon: '🌿',
            price: 5,
            sellPrice: 2,
            stackable: true
        },
        {
            id: 'bread',
            name: '빵',
            type: 'material',
            rarity: 'common',
            description: '맛있는 빵입니다. 배고픔을 달랠 수 있습니다.',
            icon: '🍞',
            price: 8,
            sellPrice: 4,
            stackable: true
        },
        {
            id: 'grass',
            name: '풀',
            type: 'material',
            rarity: 'common',
            description: '일반적인 풀입니다. 다양한 용도로 사용됩니다.',
            icon: '🌱',
            price: 3,
            sellPrice: 1,
            stackable: true
        },
        {
            id: 'herb_material',
            name: '허브',
            type: 'material',
            rarity: 'common',
            description: '향긋한 허브입니다. 요리나 물약에 사용됩니다.',
            icon: '🌿',
            price: 6,
            sellPrice: 3,
            stackable: true
        }
    ]
};

// ============================================
// 🏪 상점 상태
// ============================================

let currentShopOpen = false;
let currentShopMode = 'buy'; // 'buy' or 'sell'
let currentNpcDialogOpen = false;
let currentNpc = null;

/**
 * 보상 아이템 배열을 표준 형태로 정규화합니다.
 * @param {Array} rawItems - 문자열 ID 배열 또는 {id, quantity} 객체 배열
 * @returns {Array} 정규화된 아이템 배열
 */
function normalizeRewardItems(rawItems) {
    if (!Array.isArray(rawItems)) return [];

    return rawItems
        .map(entry => {
            if (typeof entry === 'string') {
                return { id: entry, quantity: 1 };
            }

            if (entry && typeof entry === 'object' && entry.id) {
                return { id: entry.id, quantity: entry.quantity || 1 };
            }

            return null;
        })
        .filter(Boolean);
}

/**
 * 보상을 실제로 지급하고 요약 정보를 반환합니다.
 * @param {Object} rewards - 보상 데이터
 * @returns {{exp:number, gold:number, items:Array}} 지급된 보상 요약
 */
function applyQuestRewards(rewards) {
    const summary = {
        exp: 0,
        gold: 0,
        items: []
    };

    if (!rewards) return summary;

    if (rewards.exp) {
        const expAmount = rewards.exp;
        player.exp = (player.exp || 0) + expAmount;
        summary.exp = expAmount;
        addGameLog(`✨ 경험치 ${expAmount} 획득!`);
    }

    if (rewards.gold) {
        const goldAmount = rewards.gold;
        gold = (gold || 0) + goldAmount;
        summary.gold = goldAmount;
        addGameLog(`💰 골드 ${goldAmount} 획득!`);
    }

    const normalizedItems = normalizeRewardItems(rewards.items);
    normalizedItems.forEach(item => {
        if (typeof addItemToInventory === 'function') {
            addItemToInventory(item.id, item.quantity);
        }

        const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[item.id] : null;
        const itemName = itemData ? itemData.name : item.id;

        summary.items.push({
            id: item.id,
            quantity: item.quantity,
            name: itemName,
            icon: itemData ? itemData.icon : '📦',
            image: itemData ? itemData.image : null
        });

        addGameLog(`📦 ${itemName} x${item.quantity} 획득!`);
    });

    return summary;
}

/**
 * 보상 수령 알림창을 표시합니다.
 * @param {Object} options - 알림 옵션
 * @param {string} options.title - 알림 제목
 * @param {string} options.message - 알림 본문
 * @param {number} [options.exp] - 경험치 보상
 * @param {number} [options.gold] - 골드 보상
 * @param {Array} [options.items] - 아이템 보상 목록
 */
function showRewardReceiveModal(options = {}) {
    const {
        title = '축하합니다!',
        message = '',
        exp = 0,
        gold: rewardGold = 0,
        items = []
    } = options;

    const existing = document.querySelector('.reward-alert-overlay');
    if (existing) existing.remove();

    const primaryItem = items[0] || null;
    const primaryVisual = primaryItem
        ? (primaryItem.image
            ? `<img src="${primaryItem.image}" class="reward-alert-item-image" alt="${primaryItem.name}">`
            : (primaryItem.icon || '🎁'))
        : '🎉';

    const itemLines = items.map(item => `
        <div class="reward-alert-line">
            <span class="reward-alert-line-label">📦</span>
            <span>${item.name} x${item.quantity}</span>
        </div>
    `).join('');

    const expLine = exp > 0
        ? `
        <div class="reward-alert-line">
            <span class="reward-alert-line-label">✨</span>
            <span>경험치 ${exp}</span>
        </div>
    `
        : '';

    const goldLine = rewardGold > 0
        ? `
        <div class="reward-alert-line">
            <span class="reward-alert-line-label">💰</span>
            <span>골드 ${rewardGold}</span>
        </div>
    `
        : '';

    const overlay = document.createElement('div');
    overlay.className = 'reward-alert-overlay';
    if (options.onClose) overlay.onCloseCallback = options.onClose;
    overlay.innerHTML = `
        <div class="reward-alert-modal">
            <div class="reward-alert-header">🎊 ${title}</div>
            <div class="reward-alert-body">
                <div class="reward-alert-icon-wrap">
                    <div class="reward-alert-burst"></div>
                    <div class="reward-alert-icon">${primaryVisual}</div>
                </div>
                ${message ? `<p class="reward-alert-message">${message}</p>` : ''}
                <div class="reward-alert-lines">
                    ${itemLines}
                    ${expLine}
                    ${goldLine}
                </div>
            </div>
            <button class="reward-alert-confirm" onclick="closeRewardReceiveModal()">확인</button>
        </div>
    `;

    document.body.appendChild(overlay);
}

/**
 * 보상 수령 알림창을 닫습니다.
 */
function closeRewardReceiveModal() {
    const overlay = document.querySelector('.reward-alert-overlay');
    if (overlay) {
        const callback = overlay.onCloseCallback;
        overlay.remove();
        if (typeof callback === 'function') callback();
    }
}

// ============================================
// 💬 NPC 대화 시스템
// ============================================

/**
 * NPC 대화를 표시합니다.
 * 현재 위치에 있는 NPC 목록을 보여주고 선택할 수 있습니다.
 */
function showNPCDialog() {
    const location = getCurrentLocation();
    if (!location || !location.npcs || location.npcs.length === 0) {
        addGameLog('💬 이 지역에는 대화할 수 있는 NPC가 없습니다.');
        return;
    }

    // NPC 선택 모달 표시
    showNPCSelectionModal(location.npcs);
}

/**
 * NPC 선택 모달을 표시합니다.
 */
function showNPCSelectionModal(npcIds) {
    // 기존 모달 제거
    const existingModal = document.querySelector('.npc-modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'npc-modal-overlay';

    let npcsHtml = '';
    npcIds.forEach(npcId => {
        const npc = NPCS[npcId];
        if (npc) {
            npcsHtml += `
                <button class="npc-select-btn" onclick="selectNPC('${npcId}')">
                    <span class="npc-emoji">${npc.emoji}</span>
                    <span class="npc-name">${npc.name}</span>
                </button>
            `;
        }
    });

    overlay.innerHTML = `
        <div class="npc-modal">
            <div class="npc-modal-header">
                <h3>💬 대화할 NPC 선택</h3>
                <button class="npc-modal-close" onclick="closeNPCModal()">✕</button>
            </div>
            <div class="npc-modal-content">
                <div class="npc-list">
                    ${npcsHtml}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    currentNpcDialogOpen = true;
}

/**
 * NPC를 선택하고 대화를 시작합니다.
 */
function selectNPC(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;

    currentNpc = npc;
    closeNPCModal();
    showNPCConversation(npc);
}

/**
 * NPC와의 대화를 표시합니다.
 */
function showNPCConversation(npc, overrideGreetingText = null) {
    const overlay = document.createElement('div');
    overlay.className = 'npc-modal-overlay';

    // 훈련교관1 첫 대화 선물 처리
    let greetingText = overrideGreetingText || npc.dialogues.greeting;
    if (npc.id === 'instructor1' && npc.firstMeetGift && !player.instructor1EventComplete) {
        if (player.instructor1EventStep === undefined) player.instructor1EventStep = 0;
        
        if (player.instructor1EventStep === 0) {
            greetingText = '오호 자네 훈련장에는 처음이로군? 훈련장에 처음왔으니 힘내라는 의미로 주는 선물일세. 열심히 훈련해서 대단한 모험가가 되길바라네!';
            
            const overlayOptionsHtml = `
                <button class="dialog-option-btn" onclick="handleInstructor1Event(1)">
                    1. 감사합니다! 열심히 하겠습니다!
                </button>
                <button class="dialog-option-btn" onclick="handleInstructor1Event(2)">
                    2. 아닙니다! 마음만 받겠습니다!
                </button>
            `;
            
            overlay.innerHTML = `
                <div class="npc-dialog-modal">
                    <div class="npc-dialog-header">
                        <span class="npc-dialog-emoji">${npc.emoji}</span>
                        <span class="npc-dialog-name">${npc.name}</span>
                    </div>
                    <div class="npc-dialog-content">
                        <div class="npc-dialog-bubble">
                            <p>${greetingText}</p>
                        </div>
                        <div class="dialog-options">
                            ${overlayOptionsHtml}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            currentNpcDialogOpen = true;
            return;
        }
    }

    // 기계공 첫 방문 시 특수 인사
    if (npc.id === 'mechanist') {
        if (player.trainingRoomVictory && !player.mechanistGreeted) {
            greetingText = npc.dialogues.greeting_after_victory;
            player.mechanistGreeted = true;
        } else if (player.trainingRoomVisited && !player.trainingRoomVictory && !player.mechanistGreeted) {
            greetingText = npc.dialogues.greeting_after_defeat;
            player.mechanistGreeted = true;
        }
    }

    // 대화 옵션 생성
    let optionsHtml = '';

    // 상점주인인 경우 구매 옵션 추가
    if (npc.canTrade) {
        optionsHtml += `
            <button class="dialog-option-btn" onclick="openShopFromNPC()">
                🛒 물건을 사고 싶어요
            </button>
        `;
    }

    // 퀘스트 가능한 경우: 진행 중/완료 가능 퀘스트 확인
    if (npc.canGiveQuest) {
        const activeQuest = getNpcActiveQuest(npc.id);
        if (activeQuest) {
            // kill/spar 타입 퀘스트 자동 완료 체크
            if (activeQuest.objective && (activeQuest.objective.type === 'kill' || activeQuest.objective.type === 'spar' || activeQuest.objective.type === 'spar_multi')) {
                const isComplete = (activeQuest.objective.current || 0) >= (activeQuest.objective.count || 1);
                if (isComplete) {
                    optionsHtml += `
                        <button class="dialog-option-btn quest-complete-btn" onclick="turnInKillQuest('${npc.id}')">
                            ✅ 퀘스트를 완료했어요
                        </button>
                    `;
                }
            }
            // item_delivery 타입 퀘스트: 아이템 전달 UI
            else if (activeQuest.objective && activeQuest.objective.type === 'item_delivery') {
                optionsHtml += `
                    <button class="dialog-option-btn quest-complete-btn" onclick="showQuestHandoverUI('${npc.id}')">
                        ✅ 퀘스트를 완료했어요
                    </button>
                `;
            }
            // multi_delivery 타입 (기계공)
            else if (activeQuest.objective && activeQuest.objective.type === 'multi_delivery') {
                optionsHtml += `
                    <button class="dialog-option-btn quest-complete-btn" onclick="tryMultiDelivery('${npc.id}')">
                        ✅ 퀘스트를 완료했어요
                    </button>
                `;
            }
            optionsHtml += `
                <button class="dialog-option-btn" onclick="showNPCQuestStatus('${npc.id}')">
                    📋 퀘스트 진행 상황
                </button>
            `;
        }
        // 아직 수주할 퀘스트가 남아있는 경우
        const hasAvailableQuest = checkHasAvailableQuest(npc.id);
        if (hasAvailableQuest) {
            optionsHtml += `
                <button class="dialog-option-btn" onclick="showNPCQuest('${npc.id}')">
                    📜 의뢰가 있나요?
                </button>
            `;
        }
    }

    // 힌트/정보 옵션
    if (npc.dialogues.info) {
        optionsHtml += `
            <button class="dialog-option-btn" onclick="showNPCInfo('${npc.id}')">
                ❓ 정보가 필요해요
            </button>
        `;
    }

    // 대련 가능한 경우
    if (npc.canSpar) {
        optionsHtml += `
            <button class="dialog-option-btn spar-btn" onclick="startSpar('${npc.id}')">
                ⚔️ 대련하고 싶어요
            </button>
        `;
    }

    // 고대 수호자 NPC: 전투 선택지 추가
    if (npc.id === 'ancient_guardian_npc') {
        optionsHtml += `
            <button class="dialog-option-btn spar-btn" onclick="startGuardianNPCBattle()">
                ⚔️ 전투한다
            </button>
        `;
    }

    // 대화 종료 옵션
    optionsHtml += `
        <button class="dialog-option-btn dialog-exit" onclick="closeNPCConversation()">
            👋 안녕히 계세요
        </button>
    `;

    overlay.innerHTML = `
        <div class="npc-dialog-modal">
            <div class="npc-dialog-header">
                <span class="npc-dialog-emoji">${npc.emoji}</span>
                <span class="npc-dialog-name">${npc.name}</span>
            </div>
            <div class="npc-dialog-content">
                <div class="npc-dialog-bubble">
                    <p>${greetingText}</p>
                </div>
                <div class="dialog-options">
                    ${optionsHtml}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    currentNpcDialogOpen = true;
}

/**
 * NPC 대화에서 상점을 엽니다.
 */
function openShopFromNPC() {
    // NPC 정보를 먼저 저장 (closeNPCConversation에서 currentNpc가 null이 됨)
    const npc = currentNpc;
    const buyMessage = npc ? (npc.dialogues.buy || '좋은 선택이야! 천천히 둘러보게.') : '좋은 선택이야!';

    // 대화 모달만 닫기 (작별 인사 없이)
    const modal = document.querySelector('.npc-modal-overlay');
    if (modal) modal.remove();
    currentNpcDialogOpen = false;
    // currentNpc는 유지 (상점에서 사용할 수 있도록)

    // 상점 열기
    addGameLog(`🧓 ${npc ? npc.name : '상점주인'}: "${buyMessage}"`);
    showShopUI();
}

/**
 * NPC 정보를 표시합니다.
 */
function showNPCInfo(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;

    // 대화 버블 내용만 변경
    const bubble = document.querySelector('.npc-dialog-bubble p');
    if (bubble) {
        bubble.textContent = npc.dialogues.info;
    }
}

/**
 * NPC에게 배정된 활성 퀘스트를 반환합니다.
 * @param {string} npcId - NPC ID
 * @returns {Object|null} 활성 퀘스트 객체 또는 null
 */
function getNpcActiveQuest(npcId) {
    if (!player || !player.quests) return null;
    // NPC ID 기반으로 관련 퀘스트 검색
    for (const questKey in player.quests) {
        const quest = player.quests[questKey];
        if (quest.status === 'active' && quest.npcId === npcId) {
            return quest;
        }
    }
    // 고대 수호자 NPC 전용 처리
    if (npcId === 'ancient_guardian_npc' && player.quests.ancient_guardian_quest) {
        const aq = player.quests.ancient_guardian_quest;
        if (aq.status === 'active') return aq;
    }
    return null;
}

/**
 * 퀘스트 진행 상황을 NPC 대화창에서 표시합니다.
 */
function showNPCQuestStatus(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;

    // 해당 NPC의 모든 활성 퀘스트 표시
    let allProgressText = '';
    let questCount = 0;

    if (player.quests) {
        for (const questKey in player.quests) {
            const quest = player.quests[questKey];
            if (quest.npcId === npcId && quest.status === 'active') {
                questCount++;
                let progressText = '';

                if (quest.objective.type === 'item_delivery') {
                    const requiredItem = quest.objective.requiredItem;
                    const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[requiredItem] : null;
                    const itemName = itemData ? itemData.name : requiredItem;
                    const inventoryItem = (typeof inventoryItems !== 'undefined')
                        ? inventoryItems.find(item => item.id === requiredItem)
                        : null;
                    const currentCount = inventoryItem ? (inventoryItem.quantity || 1) : 0;
                    progressText = `${quest.name}: ${itemName} (${currentCount}/${quest.objective.count})`;
                } else if (quest.objective.type === 'multi_delivery') {
                    let reqTexts = [];
                    for (const req of quest.objective.requirements) {
                        if (req.type === 'gold') {
                            reqTexts.push(`골드 (${Math.min(gold, req.amount)}/${req.amount})`);
                        } else if (req.type === 'item') {
                            const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[req.itemId] : null;
                            const itemName = itemData ? itemData.name : req.itemId;
                            const inv = (typeof inventoryItems !== 'undefined') ? inventoryItems : [];
                            const invItem = inv.find(i => i.id === req.itemId);
                            const qty = invItem ? (invItem.quantity || 1) : 0;
                            reqTexts.push(`${itemName} (${qty}/${req.count})`);
                        }
                    }
                    progressText = `${quest.name}: ${reqTexts.join(', ')}`;
                } else if (quest.objective.type === 'spar_multi') {
                    progressText = `${quest.name}: (${quest.objective.current || 0}/${quest.objective.count})`;
                } else {
                    progressText = `${quest.name}: (${quest.objective.current || 0}/${quest.objective.count})`;
                }

                allProgressText += (allProgressText ? '<br>' : '') + progressText;
            }
        }
    }

    if (questCount === 0) {
        allProgressText = '현재 진행 중인 퀘스트가 없습니다.';
    }

    const bubble = document.querySelector('.npc-dialog-bubble p');
    if (bubble) {
        bubble.textContent = npc.dialogues.quest_in_progress || '퀘스트를 잘 진행하고 있나?';
        bubble.innerHTML += `<br><small style="color:#aaa;">${allProgressText}</small>`;
    }
}

/**
 * 아이템 직접 전달 UI를 표시합니다.
 * 플레이어가 인벤토리에서 직접 아이템을 선택하여 NPC에게 전달합니다.
 */
function showQuestHandoverUI(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;
    const quest = getNpcActiveQuest(npcId);
    if (!quest) return;

    // 기존 모달 제거
    const existingModals = document.querySelectorAll('.npc-modal-overlay, .quest-handover-overlay');
    existingModals.forEach(m => m.remove());
    currentNpcDialogOpen = false;

    const itemId = quest.objective.type === 'item_delivery' ? quest.objective.requiredItem : null;
    const requiredCount = quest.objective.count || 1;

    // 인벤토리 아이템 목록 렌더링 (퀘스트 필요 아이템 강조)
    let itemsHtml = '';
    const inv = (typeof inventoryItems !== 'undefined') ? inventoryItems : [];

    if (inv.length === 0) {
        itemsHtml = `<p class="handover-empty">인벤토리가 비어 있습니다.</p>`;
    } else {
        inv.forEach((item, idx) => {
            const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[item.id] : null;
            const name = itemData ? itemData.name : item.name || item.id;
            const icon = (itemData && itemData.image) ? `<img src="${itemData.image}" class="item-img">` : (itemData ? (itemData.icon || '📦') : '📦');
            const qty = item.quantity || 1;
            const isRequired = itemId && item.id === itemId;
            const hasEnough = isRequired && qty >= requiredCount;
            const highlightClass = isRequired ? (hasEnough ? 'required-item has-enough' : 'required-item not-enough') : '';

            itemsHtml += `
                <button class="handover-item-btn ${highlightClass}" 
                        onclick="tryHandoverItem(${idx}, '${npcId}')"
                        title="${name} x${qty}">
                    <span class="handover-item-icon">${icon}</span>
                    <span class="handover-item-name">${name}</span>
                    <span class="handover-item-qty">x${qty}</span>
                    ${isRequired ? `<span class="handover-item-badge">${hasEnough ? '✅ 필요' : '⚠️ 부족'}</span>` : ''}
                </button>
            `;
        });
    }

    const overlay = document.createElement('div');
    overlay.className = 'quest-handover-overlay';
    overlay.innerHTML = `
        <div class="quest-handover-dialog">
            <div class="quest-handover-header">
                <span class="quest-handover-npc">${npc.emoji} ${npc.name}</span>
                <button class="quest-handover-close-btn" onclick="closeQuestHandoverUI()">✕</button>
            </div>
            <div class="quest-handover-desc">
                <p>전달할 아이템을 인벤토리에서 선택하세요.</p>
                <p class="quest-target-hint">필요 아이템: <strong>${
                    itemId ? ((typeof ITEMS_DATABASE !== 'undefined' && ITEMS_DATABASE[itemId]) 
                        ? ITEMS_DATABASE[itemId].name : itemId) : '없음'
                } x${requiredCount}</strong></p>
            </div>
            <div class="quest-handover-items">
                ${itemsHtml}
            </div>
            <button class="dialog-option-btn dialog-exit" onclick="closeQuestHandoverUI()">
                🔙 돌아가기
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * 선택한 아이템을 NPC에게 전달하려고 시도합니다.
 * @param {number} invIndex - 인벤토리 슬롯 인덱스
 * @param {string} npcId - NPC ID
 */
function tryHandoverItem(invIndex, npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;
    const quest = getNpcActiveQuest(npcId);
    if (!quest) return;

    const inv = (typeof inventoryItems !== 'undefined') ? inventoryItems : [];
    const item = inv[invIndex];
    if (!item) return;

    const requiredItemId = quest.objective.type === 'item_delivery' ? quest.objective.requiredItem : null;
    const requiredCount = quest.objective.count || 1;

    // 전달하려는 아이템이 맞는지 확인
    if (!requiredItemId || item.id !== requiredItemId) {
        const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[item.id] : null;
        const itemName = itemData ? itemData.name : item.id;
        showHandoverResultDialog(npc, false, `이건 필요한 게 아니네... ${itemName}이(가) 아니야. 다시 생각해보게.`);
        return;
    }

    const currentQty = item.quantity || 1;
    if (currentQty < requiredCount) {
        const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[item.id] : null;
        const itemName = itemData ? itemData.name : item.id;
        showHandoverResultDialog(npc, false, `아직 부족하군. ${itemName}이 ${requiredCount}개 필요한데, 현재 ${currentQty}개밖에 없어.`);
        return;
    }

    // 아이템 제거
    if (typeof removeItemFromInventory === 'function') {
        removeItemFromInventory(invIndex, requiredCount);
    } else {
        inv[invIndex].quantity = (inv[invIndex].quantity || 1) - requiredCount;
        if (inv[invIndex].quantity <= 0) inv.splice(invIndex, 1);
    }

    // 퀘스트 완료 처리
    quest.status = 'completed';
    const itemData2 = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[requiredItemId] : null;
    addGameLog(`📦 ${itemData2 ? itemData2.name : requiredItemId}을(를) ${npc.name}에게 전달했습니다!`);

    // 보상 지급
    const rewardSummary = applyQuestRewards(quest.rewards);

    if (typeof updatePlayerUI === 'function') updatePlayerUI();
    if (typeof checkLevelUp === 'function') checkLevelUp();

    // 성공 다이얼로그 표시
    const completionMessage = npc.dialogues.quest_complete || '수고했네. 꽤나 힘들었을 텐데 잘 완수해주었군! 여기 약속한 보상일세.';
    showHandoverResultDialog(npc, true, completionMessage);

    showRewardReceiveModal({
        title: '퀘스트 보상',
        message: `${quest.name} 완료 보상을 받았습니다!`,
        exp: rewardSummary.exp,
        gold: rewardSummary.gold,
        items: rewardSummary.items
    });
}

/**
 * 아이템 전달 결과 다이얼로그를 표시합니다.
 */
function showHandoverResultDialog(npc, success, message) {
    const existingOverlay = document.querySelector('.quest-handover-overlay');
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement('div');
    overlay.className = 'npc-modal-overlay';
    overlay.innerHTML = `
        <div class="npc-modal">
            <div class="npc-dialog-header">
                <span class="npc-dialog-emoji">${npc.emoji}</span>
                <span class="npc-dialog-name">${npc.name}</span>
            </div>
            <div class="npc-dialog-bubble" style="border-color:${success ? '#27ae60' : '#e74c3c'};">
                <p>${message}</p>
            </div>
            <button class="dialog-option-btn" onclick="closeNPCModal()">${success ? '🎉 감사합니다!' : '😅 알겠습니다.'}</button>
        </div>
    `;
    document.body.appendChild(overlay);
    addGameLog(`🗿 ${npc.name}: "${message}"`);
    currentNpcDialogOpen = true;
}

/**
 * 아이템 전달 UI를 닫습니다.
 */
function closeQuestHandoverUI() {
    const overlay = document.querySelector('.quest-handover-overlay');
    if (overlay) overlay.remove();
    // 대화창 다시 열기
    if (currentNpc) {
        showNPCConversation(currentNpc);
    }
}

/**
 * NPC에게 아직 수주 가능한 퀘스트가 있는지 확인합니다.
 */
function checkHasAvailableQuest(npcId) {
    const npc = NPCS[npcId];
    if (!npc || !npc.quests || typeof QUESTS === 'undefined') return false;
    if (!player.quests) player.quests = {};
    if (!player.completedQuests) player.completedQuests = {};

    for (const questId of npc.quests) {
        // 이미 완료 또는 진행 중이면 스킵
        if (player.completedQuests[questId]) continue;
        if (player.quests[questId]) continue;

        const questDef = QUESTS[questId];
        if (!questDef) continue;

        // 선행 퀘스트 확인
        if (questDef.prerequisite && !player.completedQuests[questDef.prerequisite]) continue;

        return true;  // 수주 가능한 퀘스트 있음
    }
    return false;
}

/**
 * kill/spar 타입 퀘스트를 완료 보고합니다.
 */
function turnInKillQuest(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;

    // 해당 NPC의 활성 퀘스트 중 완료 가능한 것 찾기
    for (const questKey in player.quests) {
        const quest = player.quests[questKey];
        if (quest.npcId === npcId && quest.status === 'active') {
            const isComplete = (quest.objective.current || 0) >= (quest.objective.count || 1);
            if (isComplete) {
                const completionMessage = npc.dialogues.quest_complete || '수고했네. 꽤나 힘들었을 텐데 잘 완수해주었군! 여기 약속한 보상일세.';

                // 퀘스트 완료 처리
                completeQuest(questKey, {
                    npcId,
                    completionMessage,
                    showRewardPopup: true
                });

                // 완료 대사를 포함한 대화창 새로고침
                closeNPCModal();
                if (currentNpc) showNPCConversation(currentNpc, completionMessage);
                return;
            }
        }
    }
}

/**
 * 다중 아이템/골드 전달 퀘스트를 처리합니다. (기계공 등)
 */
function tryMultiDelivery(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;

    const quest = getNpcActiveQuest(npcId);
    if (!quest || quest.objective.type !== 'multi_delivery') return;

    const requirements = quest.objective.requirements;
    if (!requirements) return;

    // 모든 요구 조건 확인
    let canComplete = true;
    let missingText = '';

    for (const req of requirements) {
        if (req.type === 'gold') {
            if (gold < req.amount) {
                canComplete = false;
                missingText += `골드 ${req.amount - gold} 부족\n`;
            }
        } else if (req.type === 'item') {
            const inv = (typeof inventoryItems !== 'undefined') ? inventoryItems : [];
            const invItem = inv.find(i => i.id === req.itemId);
            const currentQty = invItem ? (invItem.quantity || 1) : 0;
            if (currentQty < req.count) {
                canComplete = false;
                const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[req.itemId] : null;
                const itemName = itemData ? itemData.name : req.itemId;
                missingText += `${itemName} ${req.count - currentQty}개 부족\n`;
            }
        }
    }

    if (!canComplete) {
        const bubble = document.querySelector('.npc-dialog-bubble p');
        if (bubble) {
            bubble.textContent = `아직 재료가 부족하네. ${missingText}`;
        }
        return;
    }

    // 재료 소모
    for (const req of requirements) {
        if (req.type === 'gold') {
            gold -= req.amount;
            addGameLog(`💰 ${req.amount} 골드 전달`);
        } else if (req.type === 'item') {
            if (typeof removeItemFromInventory === 'function') {
                removeItemFromInventory(req.itemId, req.count);
            }
            const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[req.itemId] : null;
            addGameLog(`📦 ${itemData ? itemData.name : req.itemId} x${req.count} 전달`);
        }
    }

    // 퀘스트 완료
    const completeDlg = npc.dialogues.quest_complete || '감사하네! 보상을 받게.';

    // 퀘스트 완료
    completeQuest(quest.id, {
        npcId,
        completionMessage: completeDlg,
        showRewardPopup: true
    });

    // 대화창 새로고침
    closeNPCModal();
    if (currentNpc) showNPCConversation(currentNpc, completeDlg);
}



/**
 * NPC 퀘스트를 표시합니다.
 */
function showNPCQuest(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;

    // 고대 수호자 NPC 특수 퀘스트 처리
    if (npcId === 'ancient_guardian_npc') {
        closeNPCModal();
        showAncientGuardianNPCQuest();
        return;
    }

    // 다중 퀘스트 시스템: QUESTS 상수에서 NPC의 퀘스트 목록 확인
    if (npc.quests && npc.quests.length > 0 && typeof QUESTS !== 'undefined') {
        showMultiQuestSelection(npcId);
        return;
    }

    // 기계공 퀘스트 특수 처리
    if (npcId === 'mechanist') {
        showMechanistQuest(npcId);
        return;
    }

    const bubble = document.querySelector('.npc-dialog-bubble p');
    if (bubble) {
        bubble.textContent = npc.dialogues.quest || '아직 자네에게 줄 임무는 없네.';
    }
}

/**
 * 다중 퀘스트 선택 UI를 표시합니다.
 */
function showMultiQuestSelection(npcId) {
    const npc = NPCS[npcId];
    if (!npc || !npc.quests) return;

    if (!player.quests) player.quests = {};
    if (!player.completedQuests) player.completedQuests = {};

    // 사용 가능한 퀘스트 목록 생성
    let questListHtml = '';
    let availableCount = 0;

    for (const questId of npc.quests) {
        const questDef = QUESTS[questId];
        if (!questDef) continue;

        // 이미 완료된 퀘스트
        if (player.completedQuests[questId]) {
            questListHtml += `
                <div class="quest-item quest-completed">
                    <span class="quest-status">✅</span>
                    <span class="quest-name">${questDef.name}</span>
                    <span class="quest-label">완료</span>
                </div>
            `;
            continue;
        }

        // 현재 진행 중인 퀘스트
        if (player.quests[questId] && player.quests[questId].status === 'active') {
            const q = player.quests[questId];
            const progress = q.objective.current || 0;
            const total = q.objective.count || 1;
            questListHtml += `
                <div class="quest-item quest-active">
                    <span class="quest-status">📋</span>
                    <span class="quest-name">${questDef.name} (${progress}/${total})</span>
                    <span class="quest-label">진행 중</span>
                </div>
            `;
            continue;
        }

        // 선행 퀘스트 확인
        if (questDef.prerequisite && !player.completedQuests[questDef.prerequisite]) {
            questListHtml += `
                <div class="quest-item quest-locked">
                    <span class="quest-status">🔒</span>
                    <span class="quest-name">${questDef.name}</span>
                    <span class="quest-label">이전 퀘스트 완료 필요</span>
                </div>
            `;
            continue;
        }

        // 수주 가능한 퀘스트
        availableCount++;
        questListHtml += `
            <div class="quest-item quest-available" onclick="acceptQuest('${questId}', '${npcId}')">
                <span class="quest-status">📜</span>
                <span class="quest-name">${questDef.name}</span>
                <span class="quest-label" style="color:#4caf50;">수주 가능</span>
            </div>
        `;
    }

    // 모든 퀘스트가 완료되었는지 확인
    const allCompleted = npc.quests.every(qId => player.completedQuests[qId]);

    // 기존 모달 제거하고 퀘스트 선택 모달 표시
    const existingModals = document.querySelectorAll('.npc-modal-overlay');
    existingModals.forEach(m => m.remove());
    currentNpcDialogOpen = false;

    const overlay = document.createElement('div');
    overlay.className = 'npc-modal-overlay';
    overlay.innerHTML = `
        <div class="npc-dialog-modal" style="max-width:450px;">
            <div class="npc-dialog-header">
                <span class="npc-dialog-emoji">${npc.emoji}</span>
                <span class="npc-dialog-name">${npc.name}의 퀘스트</span>
            </div>
            <div class="npc-dialog-content" style="max-height:400px;overflow-y:auto;">
                ${allCompleted ? '<p style="color:#4caf50;text-align:center;margin-bottom:10px;">✅ 모든 퀘스트를 완료했습니다!</p>' : ''}
                <div class="quest-list" style="display:flex;flex-direction:column;gap:8px;">
                    ${questListHtml}
                </div>
            </div>
            <div class="dialog-options" style="margin-top:10px;">
                <button class="dialog-option-btn dialog-exit" onclick="closeNPCModal(); if(currentNpc) showNPCConversation(currentNpc);">
                    🔙 돌아가기
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    currentNpcDialogOpen = true;
}

/**
 * 퀘스트를 수주합니다.
 */
function acceptQuest(questId, npcId) {
    const questDef = QUESTS[questId];
    if (!questDef) return;

    if (!player.quests) player.quests = {};

    // 퀘스트 복사 후 활성화
    player.quests[questId] = {
        ...JSON.parse(JSON.stringify(questDef)),
        status: 'active'
    };

    addGameLog(`📜 퀘스트 수주: ${questDef.name}`);

    // 보상 정보 표시
    let rewardText = '';
    if (questDef.rewards) {
        if (questDef.rewards.exp) rewardText += `경험치 ${questDef.rewards.exp}`;
        if (questDef.rewards.gold) rewardText += `${rewardText ? ', ' : ''}골드 ${questDef.rewards.gold}`;
        if (questDef.rewards.items && questDef.rewards.items.length > 0) {
            questDef.rewards.items.forEach(item => {
                const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[item.id] : null;
                const itemName = itemData ? itemData.name : item.id;
                rewardText += `${rewardText ? ', ' : ''}${itemName} x${item.quantity || 1}`;
            });
        }
    }
    if (rewardText) {
        addGameLog(`💰 보상: ${rewardText}`);
    }

    // 퀘스트 선택 UI 먼저 닫기
    closeNPCModal();

    // NPC 정보 가져오기
    const npc = (typeof NPCS !== 'undefined' && NPCS[npcId]) ? NPCS[npcId] : null;

    // 퀘스트 수락 알림창/대사 표시
    showQuestAcceptModal(questDef, npc, () => {
        // 알림창 확인 후 퀘스트 목록 다시 열기
        showMultiQuestSelection(npcId);
    });
}

/**
 * 퀘스트 수락 알림 모달을 표시합니다.
 */
function showQuestAcceptModal(questDef, npc, onConfirm) {
    const existing = document.querySelector('.quest-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    // 기존 보상 알림창 스타일을 재사용하되 커스텀 클래스도 추가
    overlay.className = 'reward-alert-overlay quest-alert-overlay';
    
    // NPC 이미지가 있으면 넣고, 아니면 이모지
    const npcVisual = npc ? `<div class="reward-alert-icon" style="font-size: 3.5rem;">${npc.emoji}</div>` : '<div class="reward-alert-icon">📜</div>';
    const npcName = npc ? npc.name : '알림';
    
    // NPC 수락 대사 (없으면 기본 대사)
    let acceptMessage = `"${questDef.name}" 퀘스트를 수락했습니다!`;
    if (npc) {
        if (npc.dialogues && npc.dialogues.quest_accept) {
            acceptMessage = npc.dialogues.quest_accept;
        } else {
            acceptMessage = "좋아, 부탁을 수락해줘서 고맙군! 기대하고 있겠네.";
        }
    }
        
    overlay.innerHTML = `
        <div class="reward-alert-modal">
            <div class="reward-alert-header">📜 퀘스트 수락</div>
            <div class="reward-alert-body">
                <div class="reward-alert-icon-wrap" style="margin-bottom: 15px;">
                    ${npcVisual}
                </div>
                <h3 style="color: #f1c40f; margin-top: 0; margin-bottom: 15px;">${questDef.name}</h3>
                <div style="background-color: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; margin-bottom: 15px; border-left: 3px solid #3498db;">
                    <p style="margin: 0; color: #ecf0f1; font-style: italic; font-size: 1.1em;">"${acceptMessage}"</p>
                    <div style="text-align: right; margin-top: 5px; color: #bdc3c7; font-size: 0.9em;">- ${npcName}</div>
                </div>
            </div>
            <button class="reward-alert-confirm" id="questAcceptConfirmBtn">확인</button>
        </div>
    `;

    document.body.appendChild(overlay);
    
    document.getElementById('questAcceptConfirmBtn').onclick = () => {
        overlay.remove();
        if (typeof onConfirm === 'function') onConfirm();
    };
}

/**
 * 퀘스트 완료 처리를 합니다.
 */
function completeQuest(questId, options = {}) {
    const quest = player.quests[questId];
    if (!quest) return;

    const questDef = QUESTS[questId];
    if (!questDef) return;

    const npc = options.npcId && typeof NPCS !== 'undefined' ? NPCS[options.npcId] : null;
    const completionMessage = options.completionMessage
        || (npc && npc.dialogues ? npc.dialogues.quest_complete : null)
        || '수고했네. 꽤나 힘들었을 텐데 잘 완수해주었군! 여기 약속한 보상일세.';

    if (npc) {
        addGameLog(`💬 ${npc.name}: "${completionMessage}"`);
    }

    // 보상 지급
    const rewardSummary = applyQuestRewards(questDef.rewards);

    // 퀘스트 완료 기록
    if (!player.completedQuests) player.completedQuests = {};
    player.completedQuests[questId] = true;
    delete player.quests[questId];

    addGameLog(`🎉 퀘스트 완료: ${questDef.name}`);
    if (typeof checkLevelUp === 'function') checkLevelUp();
    if (typeof updatePlayerUI === 'function') updatePlayerUI();

    if (options.showRewardPopup) {
        showRewardReceiveModal({
            title: '퀘스트 보상',
            message: `${questDef.name} 완료 보상을 받았습니다!`,
            exp: rewardSummary.exp,
            gold: rewardSummary.gold,
            items: rewardSummary.items
        });
    }

    return {
        completionMessage,
        rewardSummary
    };
}

/**
 * 기계공 퀘스트를 표시합니다.
 */
function showMechanistQuest(npcId) {
    showMultiQuestSelection(npcId);
}

/**
 * 고대 수호자 NPC 퀘스트 대화를 표시합니다.
 * 퀘스트 상태에 따라 다른 대화를 보여줍니다.
 */
function showAncientGuardianNPCQuest() {
    const npc = NPCS['ancient_guardian_npc'];
    if (!npc) return;

    const quest = player.quests ? player.quests.ancient_guardian_quest : null;

    // 퀘스트 완료 후 보상 수령 완료 상태
    if (quest && quest.status === 'completed') {
        const overlay = document.createElement('div');
        overlay.className = 'npc-modal-overlay';
        overlay.innerHTML = `
            <div class="npc-modal">
                <div class="npc-dialog-bubble">
                    <p>이미 퀘스트를 완료했군. 덕분에 유적이 평화를 되찾았어. 감사하네.</p>
                </div>
                <button class="dialog-option-btn" onclick="closeNPCModal()">확인</button>
            </div>
        `;
        document.body.appendChild(overlay);
        return;
    }

    // 퀘스트 진행 중: 아이템 전달 UI로 이동
    if (quest && quest.status === 'active') {
        closeNPCModal();
        showQuestHandoverUI('ancient_guardian_npc');
        return;
    }

    // 퀘스트가 없을 때: 고대 수호자 대화 시퀀스 시작
    if (typeof showGuardianDialogueLine1 === 'function') {
        showGuardianDialogueLine1();
    } else {
        const overlay = document.createElement('div');
        overlay.className = 'npc-modal-overlay';
        overlay.innerHTML = `
            <div class="npc-modal">
                <div class="npc-dialog-bubble">
                    <p>${npc.dialogues.quest}</p>
                </div>
                <button class="dialog-option-btn" onclick="closeNPCModal()">확인</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

/**
 * NPC 모달을 닫습니다.
 */
function closeNPCModal() {
    const modal = document.querySelector('.npc-modal-overlay');
    if (modal) modal.remove();
    currentNpcDialogOpen = false;
}

/**
 * 고대 수호자 NPC와 전투를 시작합니다.
 */
function startGuardianNPCBattle() {
    // NPC 대화 닫기
    closeNPCConversation();
    closeNPCModal();

    addGameLog('⚔️ 고대 수호자와의 전투를 시작합니다!');
    
    if (typeof startBattle === 'function') {
        startBattle(['ancient_guardian']);
        // 보스 전투이므로 도주 불가
        if (typeof battleState !== 'undefined') {
            battleState.canEscape = false;
        }
    }
}

/**
 * NPC 대화를 종료합니다.
 */
function closeNPCConversation() {
    const modal = document.querySelector('.npc-modal-overlay');
    if (modal) modal.remove();
    currentNpcDialogOpen = false;

    if (currentNpc) {
        addGameLog(`💬 ${currentNpc.name}: "${currentNpc.dialogues.farewell || '또 오게나!'}"`);
    }
    currentNpc = null;
}

/**
 * NPC와 대련을 시작합니다.
 * @param {string} npcId - NPC ID
 */
function startSpar(npcId) {
    const npc = NPCS[npcId];
    if (!npc || !npc.canSpar || !npc.sparMonster) {
        addGameLog('❌ 이 NPC와는 대련할 수 없습니다.');
        return;
    }

    const sparMonster = MONSTERS[npc.sparMonster];
    if (!sparMonster) {
        addGameLog('❌ 대련 상대를 찾을 수 없습니다.');
        return;
    }

    // 수련생 대련: 이미 승리했으면 거절
    if (npc.isSparTrainee && player.sparRewardsReceived && player.sparRewardsReceived[sparMonster.id]) {
        const bubble = document.querySelector('.npc-dialog-bubble p');
        if (bubble) bubble.textContent = '이미 한번 졌잖아요... 더 이상은 안 할래요!';
        return;
    }

    // 교관 대련 조건 확인 (수련생 제외)
    if (!npc.isSparTrainee && npc.sparCondition) {
        if (!player.completedQuests) player.completedQuests = {};

        // 모든 퀘스트 완료 조건
        if (npc.sparCondition.allQuestsComplete && npc.quests) {
            const allDone = npc.quests.every(qId => player.completedQuests[qId]);
            if (!allDone) {
                const rejectText = npc.dialogues.spar_reject || '아직 나와 대련하기엔 너무 일러보이는군.';
                const bubble = document.querySelector('.npc-dialog-bubble p');
                if (bubble) bubble.textContent = rejectText;
                addGameLog(`⚔️ ${npc.name}: "${rejectText}"`);
                return;
            }
        }

        // 특정 대련 승리 필요 조건 (상급교관)
        if (npc.sparCondition.requiredSpars) {
            if (!player.sparRewardsReceived) player.sparRewardsReceived = {};
            const allSparsWon = npc.sparCondition.requiredSpars.every(sparId => player.sparRewardsReceived[sparId]);
            if (!allSparsWon) {
                const rejectText = npc.dialogues.spar_reject || '아직 나와 대련하기엔 너무 일러보이는군.';
                const bubble = document.querySelector('.npc-dialog-bubble p');
                if (bubble) bubble.textContent = rejectText;
                addGameLog(`⚔️ ${npc.name}: "${rejectText}"`);
                return;
            }
        }
    }

    // 이미 보상을 수령한 경우 대련 거절 대사 표시 (교관 전용)
    if (!npc.isSparTrainee && player.sparRewardsReceived && player.sparRewardsReceived[sparMonster.id]) {
        // NPC별 거절 대사 설정
        const refusalDialogues = {
            instructor2: '자네는 이미 내 활솜씨를 넘어섰네. 더 넓은 세상의 적들과 겨뤄보게나. 자네의 앞길에 행운을 빌겠네.',
            instructor3: '호오, 또 대련을 원하나? 하하, 이제 자네는 나와 대련할 필요가 없을 정도로 강하네. 더 넓은 세상에서 활약해보게나.',
            instructor4: '자네의 실력은 이미 내가 가르칠 수준을 넘어섰어. 그 빠른 검술로 더 강한 적들에게 도전해보게. 기대하고 있겠네.',
            senior_instructor: '허허, 자네가 또 나에게 도전하겠다고? 이미 나를 넘어선 자네에게 더 가르칠 것이 없네. 진정한 시련은 이 훈련장 밖에 있다네. 가서 세상을 구해보게나.'
        };
        const refusalText = refusalDialogues[npcId] || '이제 자네는 나와 대련할 필요가 없을 정도로 강하네. 더 넓은 세상에서 활약해보게나.';

        // 대화 버블 내용을 거절 대사로 변경
        const bubble = document.querySelector('.npc-dialog-bubble p');
        if (bubble) {
            bubble.textContent = refusalText;
        }
        addGameLog(`⚔️ ${npc.name}: "${refusalText}"`);
        return;
    }

    // NPC 대화 모달 닫기
    const modal = document.querySelector('.npc-modal-overlay');
    if (modal) modal.remove();
    currentNpcDialogOpen = false;

    // 대련 시작 대화 표시
    const sparDialogue = npc.dialogues.spar || sparMonster.dialogues?.start || '덤벼라!';
    addGameLog(`⚔️ ${npc.name}: "${sparDialogue}"`);

    // 대련 전투 시작
    setTimeout(() => {
        startSparBattle(sparMonster, npc);
    }, 500);
}

/**
 * 대련 전투를 시작합니다.
 * @param {Object} sparMonster - 대련 몬스터 데이터
 * @param {Object} npc - NPC 데이터
 */
function startSparBattle(sparMonster, npc) {
    // 전투용 몬스터 객체 생성
    const monster = {
        ...sparMonster,
        name: npc.name,
        currentHp: sparMonster.hp,
        currentMp: sparMonster.mp,
        cooldowns: {},  // 스킬 쿨타임 관리
        traitState: {},  // 특성 상태 관리
        isPhase2: false  // 2페이즈 상태 (상급교관용)
    };

    // 대련 시작 - battleSystem.js의 startBattle 함수 호출
    if (typeof startBattle === 'function') {
        // 대련용 플래그 설정
        battleState.isSpar = true;
        battleState.sparNpc = npc;
        battleState.sparBackground = 'assets/backgrounds/spar_arena.png';  // 대련 배경
        startBattle(monster);
    } else {
        console.error('startBattle 함수를 찾을 수 없습니다.');
        addGameLog('❌ 전투 시스템 오류가 발생했습니다.');
    }
}


// ============================================
// 🛒 상점 UI 시스템
// ============================================

/**
 * 상점 UI를 표시합니다.
 */
function showShopUI() {
    // 기존 상점 모달 제거
    const existingShop = document.querySelector('.shop-modal-overlay');
    if (existingShop) existingShop.remove();

    const overlay = document.createElement('div');
    overlay.className = 'shop-modal-overlay';

    overlay.innerHTML = `
        <div class="shop-modal">
            <div class="shop-header">
                <h2>🏪 상점</h2>
                <div class="shop-gold">💰 <span id="shopGoldDisplay">${gold || 0}</span>G</div>
                <button class="shop-close-btn" onclick="closeShop()">✕</button>
            </div>
            <div class="shop-tabs">
                <button class="shop-tab active" data-mode="buy" onclick="switchShopMode('buy')">🛒 구매</button>
                <button class="shop-tab" data-mode="sell" onclick="switchShopMode('sell')">💰 판매</button>
            </div>
            <div class="shop-content">
                <div class="shop-categories">
                    <button class="shop-category-btn active" data-category="weapons" onclick="showShopCategory('weapons')">⚔️ 무기</button>
                    <button class="shop-category-btn" data-category="armors" onclick="showShopCategory('armors')">🛡️ 방어구</button>
                    <button class="shop-category-btn" data-category="consumables" onclick="showShopCategory('consumables')">🧪 소모품</button>
                    <button class="shop-category-btn" data-category="materials" onclick="showShopCategory('materials')">🌿 재료</button>
                </div>
                <div class="shop-items" id="shopItemsContainer">
                    <!-- 동적 생성 -->
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    currentShopOpen = true;
    currentShopMode = 'buy';

    // 초기 카테고리 표시
    showShopCategory('weapons');
}

/**
 * 상점 모드를 전환합니다 (구매/판매).
 */
function switchShopMode(mode) {
    currentShopMode = mode;

    // 탭 활성화 업데이트
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    // 판매 모드면 인벤토리 표시, 구매 모드면 상점 아이템 표시
    if (mode === 'sell') {
        showSellItems();
    } else {
        showShopCategory('weapons');
    }
}

/**
 * 상점 카테고리를 표시합니다.
 */
function showShopCategory(category) {
    // 카테고리 버튼 활성화 업데이트
    document.querySelectorAll('.shop-category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    const container = document.getElementById('shopItemsContainer');
    if (!container) return;

    container.innerHTML = '';

    let items = [];

    if (category === 'weapons') {
        // 현재 플레이어 직업에 맞는 무기만 표시
        const playerJob = player ? player.job : 'warrior';
        
        // 구리 무기 (Tier 1)
        if (SHOP_ITEMS.copperWeapons) {
            const copperWeapon = SHOP_ITEMS.copperWeapons[playerJob];
            if (copperWeapon) items.push(copperWeapon);
        }
        
        // 평범한 무기 (Tier 2)
        const weapon = SHOP_ITEMS.weapons[playerJob];
        if (weapon) items.push(weapon);

        // 다른 직업 무기도 표시 (구매 불가 표시)
        if (SHOP_ITEMS.copperWeapons) {
            Object.entries(SHOP_ITEMS.copperWeapons).forEach(([job, w]) => {
                if (job !== playerJob) {
                    items.push({ ...w, otherJob: true });
                }
            });
        }
        Object.entries(SHOP_ITEMS.weapons).forEach(([job, w]) => {
            if (job !== playerJob) {
                items.push({ ...w, otherJob: true });
            }
        });
    } else if (category === 'armors') {
        const playerJob = player ? player.job : 'warrior';

        // 각 재료별로 현재 직업 방어구 표시
        ['leather', 'copper', 'iron'].forEach(material => {
            const armor = SHOP_ITEMS.armors[material][playerJob];
            if (armor) {
                items.push({ ...armor, material });
            }
        });
    } else if (category === 'consumables') {
        items = SHOP_ITEMS.consumables;
    } else if (category === 'materials') {
        items = SHOP_ITEMS.materials;
    }

    // 아이템 렌더링
    items.forEach(item => {
        const itemElement = createShopItemElement(item);
        container.appendChild(itemElement);
    });

    if (items.length === 0) {
        container.innerHTML = '<p class="shop-empty">판매 중인 아이템이 없습니다.</p>';
    }
}

/**
 * 상점 아이템 요소를 생성합니다.
 */
function createShopItemElement(item) {
    const div = document.createElement('div');
    div.className = `shop-item ${item.rarity || 'common'}`;

    if (item.otherJob) {
        div.classList.add('other-job');
    }

    const canAfford = (gold || 0) >= item.price;
    // 소모품/재료는 수량 조절 가능, 무기/방어구는 1개만 구매
    const isStackable = (item.type === 'consumable' || item.type === 'material');

    div.innerHTML = `
        <div class="shop-item-icon">${item.image ? `<img src="${item.image}" class="item-img">` : item.icon}</div>
        <div class="shop-item-info">
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-desc">${item.description}</div>
            ${item.stats ? `<div class="shop-item-stats">${formatItemStats(item.stats)}</div>` : ''}
        </div>
        <div class="shop-item-right">
            <div class="shop-item-price ${canAfford ? '' : 'not-afford'}">
                💰 <span id="buyPrice_${item.id}">${item.price}</span>G
            </div>
            ${isStackable && !item.otherJob ? `
            <div class="shop-quantity-control" data-item-id="${item.id}" data-unit-price="${item.price}">
                <button class="qty-btn qty-minus" onclick="changeShopQty('${item.id}', -1)">−</button>
                <input type="number" class="qty-input" id="qty_${item.id}" value="1" min="1" max="99" onchange="updateShopQty('${item.id}')">
                <button class="qty-btn qty-plus" onclick="changeShopQty('${item.id}', 1)">+</button>
            </div>
            ` : ''}
            <button class="shop-buy-btn" onclick="buyItem('${item.id}')" ${!canAfford || item.otherJob ? 'disabled' : ''}>
                ${item.otherJob ? '다른 직업' : (canAfford ? '구매' : '골드 부족')}
            </button>
        </div>
    `;

    return div;
}

/**
 * 상점 구매 수량을 변경합니다.
 * @param {string} itemId - 아이템 ID
 * @param {number} delta - 변경량 (+1 또는 -1)
 */
function changeShopQty(itemId, delta) {
    const input = document.getElementById(`qty_${itemId}`);
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    input.value = val;
    updateShopQty(itemId);
}

/**
 * 상점 구매 수량 입력 시 가격을 업데이트합니다.
 * @param {string} itemId - 아이템 ID
 */
function updateShopQty(itemId) {
    const input = document.getElementById(`qty_${itemId}`);
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(99, val));
    input.value = val;

    const control = input.closest('.shop-quantity-control');
    const unitPrice = parseInt(control?.dataset?.unitPrice) || 0;
    const totalPrice = unitPrice * val;

    const priceSpan = document.getElementById(`buyPrice_${itemId}`);
    if (priceSpan) {
        priceSpan.textContent = totalPrice;
        // 가격 색상 업데이트
        const priceDiv = priceSpan.closest('.shop-item-price');
        if (priceDiv) {
            priceDiv.classList.toggle('not-afford', (gold || 0) < totalPrice);
        }
    }

    // 구매 버튼 상태 업데이트
    const shopItem = input.closest('.shop-item');
    if (shopItem) {
        const buyBtn = shopItem.querySelector('.shop-buy-btn');
        if (buyBtn && !shopItem.classList.contains('other-job')) {
            buyBtn.disabled = (gold || 0) < totalPrice;
            buyBtn.textContent = (gold || 0) < totalPrice ? '골드 부족' : '구매';
        }
    }
}

/**
 * 아이템 스탯을 포맷팅합니다.
 */
function formatItemStats(stats) {
    const statNames = {
        pAtk: '물리공격력',
        mAtk: '마법공격력',
        pDef: '물리방어력',
        mDef: '마법방어력',
        str: '근력',
        vit: '체력',
        int: '지능',
        agi: '민첩',
        hp: 'HP',
        mp: 'MP',
        atk: '공격력',
        def: '방어력'
    };

    return Object.entries(stats)
        .map(([key, value]) => `${statNames[key] || key}: +${value}`)
        .join(', ');
}

/**
 * 판매할 아이템 목록을 표시합니다.
 */
function showSellItems() {
    const container = document.getElementById('shopItemsContainer');
    if (!container) return;

    container.innerHTML = '';

    // 인벤토리 아이템 표시
    if (!inventoryItems || inventoryItems.length === 0) {
        container.innerHTML = '<p class="shop-empty">판매할 아이템이 없습니다.</p>';
        return;
    }

    inventoryItems.forEach((item, index) => {
        if (!item) return;

        const sellPrice = item.sellPrice || Math.floor((item.price || 10) / 2);
        const maxQty = item.quantity || 1;
        const isStackable = maxQty > 1;

        const div = document.createElement('div');
        div.className = `shop-item ${item.rarity || 'common'}`;

        div.innerHTML = `
            <div class="shop-item-icon">${item.image ? `<img src="${item.image}" class="item-img">` : (item.icon || '📦')}</div>
            <div class="shop-item-info">
                <div class="shop-item-name">${item.name}${maxQty > 1 ? ` x${maxQty}` : ''}</div>
                <div class="shop-item-desc">${item.description || ''}</div>
            </div>
            <div class="shop-item-right">
                <div class="shop-item-price sell-price">
                    💰 <span id="sellPrice_${index}">${sellPrice}</span>G
                </div>
                ${isStackable ? `
                <div class="shop-quantity-control" data-slot-index="${index}" data-unit-price="${sellPrice}" data-max-qty="${maxQty}">
                    <button class="qty-btn qty-minus" onclick="changeSellQty(${index}, -1)">−</button>
                    <input type="number" class="qty-input" id="sellQty_${index}" value="1" min="1" max="${maxQty}" onchange="updateSellQty(${index})">
                    <button class="qty-btn qty-plus" onclick="changeSellQty(${index}, 1)">+</button>
                </div>
                ` : ''}
                <button class="shop-sell-btn" onclick="sellItem(${index})">
                    판매
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

/**
 * 아이템을 구매합니다.
 * @param {string} itemId - 아이템 ID
 */
function buyItem(itemId) {
    // 모든 상점 아이템에서 해당 아이템 찾기
    let item = null;

    // 구리 무기에서 찾기
    if (SHOP_ITEMS.copperWeapons) {
        Object.values(SHOP_ITEMS.copperWeapons).forEach(w => {
            if (w.id === itemId) item = w;
        });
    }

    // 무기에서 찾기
    if (!item) {
        Object.values(SHOP_ITEMS.weapons).forEach(w => {
            if (w.id === itemId) item = w;
        });
    }

    // 방어구에서 찾기
    if (!item) {
        Object.values(SHOP_ITEMS.armors).forEach(tier => {
            Object.values(tier).forEach(a => {
                if (a.id === itemId) item = a;
            });
        });
    }

    // 소모품에서 찾기
    if (!item) {
        item = SHOP_ITEMS.consumables.find(c => c.id === itemId);
    }

    // 재료에서 찾기
    if (!item) {
        item = SHOP_ITEMS.materials.find(m => m.id === itemId);
    }

    if (!item) {
        addGameLog('❌ 아이템을 찾을 수 없습니다.');
        return;
    }

    // 수량 확인 (수량 입력이 있으면 해당 수량, 없으면 1)
    const qtyInput = document.getElementById(`qty_${itemId}`);
    const quantity = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
    const totalCost = item.price * quantity;

    // 골드 확인
    if ((gold || 0) < totalCost) {
        addGameLog('❌ 골드가 부족합니다!');
        return;
    }

    // 구매 처리
    gold -= totalCost;

    // 인벤토리에 아이템 추가 (수량만큼)
    addItemToInventory(item.id, quantity);

    if (quantity > 1) {
        addGameLog(`🛒 ${item.name}을(를) ${quantity}개 ${totalCost}G에 구매했습니다!`);
    } else {
        addGameLog(`🛒 ${item.name}을(를) ${item.price}G에 구매했습니다!`);
    }

    // 수량 입력 초기화
    if (qtyInput) qtyInput.value = 1;

    // UI 업데이트
    updateShopGoldDisplay();
    updatePlayerUI();

    // 현재 카테고리 다시 표시 (상태 업데이트)
    const activeCategory = document.querySelector('.shop-category-btn.active');
    if (activeCategory) {
        showShopCategory(activeCategory.dataset.category);
    }
}

/**
 * 판매 수량을 변경합니다.
 * @param {number} slotIndex - 인벤토리 슬롯 인덱스
 * @param {number} delta - 변경량 (+1 또는 -1)
 */
function changeSellQty(slotIndex, delta) {
    const input = document.getElementById(`sellQty_${slotIndex}`);
    if (!input) return;
    const maxQty = parseInt(input.max) || 1;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(maxQty, val + delta));
    input.value = val;
    updateSellQty(slotIndex);
}

/**
 * 판매 수량 입력 시 가격을 업데이트합니다.
 * @param {number} slotIndex - 인벤토리 슬롯 인덱스
 */
function updateSellQty(slotIndex) {
    const input = document.getElementById(`sellQty_${slotIndex}`);
    if (!input) return;
    const maxQty = parseInt(input.max) || 1;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(maxQty, val));
    input.value = val;

    const control = input.closest('.shop-quantity-control');
    const unitPrice = parseInt(control?.dataset?.unitPrice) || 0;
    const totalPrice = unitPrice * val;

    const priceSpan = document.getElementById(`sellPrice_${slotIndex}`);
    if (priceSpan) {
        priceSpan.textContent = totalPrice;
    }
}

/**
 * 아이템을 판매합니다.
 * @param {number} slotIndex - 인벤토리 슬롯 인덱스
 */
function sellItem(slotIndex) {
    if (!inventoryItems || !inventoryItems[slotIndex]) {
        addGameLog('❌ 아이템을 찾을 수 없습니다.');
        return;
    }

    const item = inventoryItems[slotIndex];
    const sellPrice = item.sellPrice || Math.floor((item.price || 10) / 2);

    // 수량 확인 (수량 입력이 있으면 해당 수량, 없으면 1)
    const qtyInput = document.getElementById(`sellQty_${slotIndex}`);
    const maxQty = item.quantity || 1;
    const quantity = qtyInput ? Math.max(1, Math.min(maxQty, parseInt(qtyInput.value) || 1)) : 1;
    const totalGold = sellPrice * quantity;

    // 판매 처리
    gold = (gold || 0) + totalGold;

    // 인벤토리에서 제거 (수량만큼)
    removeItemFromInventory(slotIndex, quantity);

    if (quantity > 1) {
        addGameLog(`💰 ${item.name}을(를) ${quantity}개 ${totalGold}G에 판매했습니다!`);
    } else {
        addGameLog(`💰 ${item.name}을(를) ${sellPrice}G에 판매했습니다!`);
    }

    // UI 업데이트
    updateShopGoldDisplay();
    updatePlayerUI();
    showSellItems();
}

/**
 * 상점 골드 표시를 업데이트합니다.
 */
function updateShopGoldDisplay() {
    const display = document.getElementById('shopGoldDisplay');
    if (display) {
        display.textContent = gold || 0;
    }
}

/**
 * 상점을 닫습니다.
 */
function closeShop() {
    const modal = document.querySelector('.shop-modal-overlay');
    if (modal) modal.remove();
    currentShopOpen = false;
    addGameLog('🏪 상점을 나왔습니다.');
}

/**
 * 상점을 표시합니다. (맵 시스템에서 호출)
 */
function showShop() {
    // 현재 위치가 상점인지 확인
    const location = getCurrentLocation();
    if (location && location.npcs && location.npcs.includes('shopkeeper')) {
        // 상점주인 NPC 대화로 시작
        selectNPC('shopkeeper');
    } else {
        addGameLog('🏪 여기에는 상점이 없습니다.');
    }
}

// ============================================
// 🔊 콘솔 로그
// ============================================

console.log('🛒 shopSystem.js 로드 완료!');

// ============================================
// 📦 상점 아이템을 ITEMS_DATABASE에 등록
// ============================================

/**
 * 상점 아이템들을 ITEMS_DATABASE에 등록합니다.
 * 이렇게 해야 addItemToInventory 함수가 아이템을 찾을 수 있습니다.
 */
function registerShopItemsToDatabase() {
    // 구리 무기 등록
    if (SHOP_ITEMS.copperWeapons) {
        Object.values(SHOP_ITEMS.copperWeapons).forEach(item => {
            if (!ITEMS_DATABASE[item.id]) {
                ITEMS_DATABASE[item.id] = item;
            }
        });
    }

    // 무기 등록
    Object.values(SHOP_ITEMS.weapons).forEach(item => {
        if (!ITEMS_DATABASE[item.id]) {
            ITEMS_DATABASE[item.id] = item;
        }
    });

    // 방어구 등록
    Object.values(SHOP_ITEMS.armors).forEach(tier => {
        Object.values(tier).forEach(item => {
            if (!ITEMS_DATABASE[item.id]) {
                ITEMS_DATABASE[item.id] = item;
            }
        });
    });

    // 소모품 등록
    SHOP_ITEMS.consumables.forEach(item => {
        if (!ITEMS_DATABASE[item.id]) {
            ITEMS_DATABASE[item.id] = item;
        }
    });

    // 재료 등록
    SHOP_ITEMS.materials.forEach(item => {
        if (!ITEMS_DATABASE[item.id]) {
            ITEMS_DATABASE[item.id] = item;
        }
    });

    console.log('📦 상점 아이템 등록 완료!');
}

// 즉시 실행
registerShopItemsToDatabase();

// ============================================
// 🎁 훈련교관1 특수 이벤트 관리
// ============================================

window.handleInstructor1Event = function(choice) {
    const npc = NPCS['instructor1'];
    player.instructor1EventStep = 1;
    
    // 모달 DOM 참조
    const bubbleText = document.querySelector('.npc-dialog-bubble p');
    const optionsContainer = document.querySelector('.dialog-options');
    if (!bubbleText || !optionsContainer) return;
    
    if (choice === 1) {
        bubbleText.textContent = "열정적이어서 좋군! 열심히 훈련해서 제국에 도움이 되도록!";
        optionsContainer.innerHTML = ''; // 선택지 숨김
        
        setTimeout(() => {
            giveInstructor1BasicGift(npc, false);
        }, 1500);
    } else if (choice === 2) {
        bubbleText.textContent = "내 선물을 거절하다니, 이런 경우는 또 처음이군..";
        optionsContainer.innerHTML = `<button class="dialog-option-btn" onclick="handleInstructor1Event(3)">다음으로 ▶</button>`;
    } else if (choice === 3) {
        bubbleText.textContent = "그 마음 정말 훌륭하군! 하지만 이 선물은 받아도 아무 문제없는 선물이니 그냥 받게!";
        optionsContainer.innerHTML = '';
        
        setTimeout(() => {
            giveInstructor1BasicGift(npc, true);
        }, 1500);
    } else if (choice === 4) {
        bubbleText.textContent = "아! 까먹을뻔 했군. 이것도 받게나! 앞으로의 여정에 도움이 될 것이네.";
        optionsContainer.innerHTML = '';
        
        setTimeout(() => {
            giveInstructor1BonusGift(npc);
        }, 1500);
    } else if (choice === 5) {
        // 모든 이벤트 종료 후 상태 저장 및 대화 재개
        player.instructor1EventComplete = true;
        player.instructor1GiftReceived = true; // 호환성
        closeNPCModal(); // 현재 모달 닫기
        // 정상 대화로 다시 오픈
        showNPCConversation(npc);
    }
};

function giveInstructor1BasicGift(npc, includeBonus = false) {
    const receivedGiftItems = [];
    let bonusExp = 0;
    let bonusGold = 0;

    if (includeBonus) {
        bonusExp = 200;
        bonusGold = 100;

        if (typeof player !== 'undefined') {
            player.exp = (player.exp || 0) + bonusExp;
            addGameLog(`✨ 경험치 ${bonusExp} 획득!`);
            if (typeof checkLevelUp === 'function') checkLevelUp();
        }
        if (typeof gold !== 'undefined') {
            gold += bonusGold;
            addGameLog(`💰 골드 ${bonusGold} 획득!`);
            if (typeof updatePlayerUI === 'function') updatePlayerUI();
        }
    }

    if (npc.firstMeetGift && npc.firstMeetGift.items && typeof addItemToInventory === 'function') {
        npc.firstMeetGift.items.forEach(gift => {
            const quantity = gift.quantity || 1;
            addItemToInventory(gift.id, quantity);
            const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[gift.id] : null;
            const itemName = itemData ? itemData.name : gift.id;
            receivedGiftItems.push({
                id: gift.id,
                quantity,
                name: itemName,
                icon: itemData ? itemData.icon : '🎁',
                image: itemData ? itemData.image : null
            });
            addGameLog(`🎁 ${itemName} x${quantity}을(를) 받았습니다!`);
        });

        if (receivedGiftItems.length > 0 || includeBonus) {
            let message = `${npc.name}에게 선물을 받았습니다!`;
            if (includeBonus) message = `${npc.name}에게 선물과 함께 특별한 보상을 받았습니다!`;

            showRewardReceiveModal({
                title: '첫 방문 선물',
                message: message,
                items: receivedGiftItems,
                exp: bonusExp > 0 ? bonusExp : undefined,
                gold: bonusGold > 0 ? bonusGold : undefined,
                onClose: () => handleInstructor1Event(4) // 닫으면 다음 대사로 연결
            });
        } else {
            handleInstructor1Event(4);
        }
    } else {
        handleInstructor1Event(4);
    }
}

function giveInstructor1BonusGift(npc) {
    if (typeof addItemToInventory === 'function') {
        addItemToInventory('instructor_ring', 1);
        const itemData = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE['instructor_ring'] : null;
        
        const itemName = itemData ? itemData.name : '교관의 증명';
        const itemIcon = itemData ? itemData.icon : '💍';
        
        showRewardReceiveModal({
            title: '특별한 선물',
            message: `${npc.name}이 특별 추가 선물을 주었습니다!`,
            items: [{
                id: 'instructor_ring',
                quantity: 1,
                name: itemName,
                icon: itemIcon,
                image: itemData ? itemData.image : null
            }],
            onClose: () => handleInstructor1Event(5) // 모든 절차 완료
        });
        addGameLog(`🎁 ${itemName} x1 을(를) 받았습니다!`);
    } else {
        handleInstructor1Event(5);
    }
}
