/**
 * ============================================
 * RPG Adventure - 탐험 모달 시스템
 * ============================================
 * 탐험 버튼 클릭 시 전용 모달을 열고,
 * 수색 진행(2.5초) 후 결과를 적용합니다.
 */

(function () {
    // ============================================
    // ⚙️ 설정 / 상태
    // ============================================

    /** 탐험 진행 시간 및 게임 시간 소모 설정 */
    const EXPLORE_MODAL_CONFIG = {
        realDurationMs: 2500,
        gameMinutesPerSearch: 10
    };

    /** 탐험 모달 런타임 상태 */
    const exploreModalState = {
        isSearching: false,
        progressTimerId: null,
        pendingResult: null,
        lastLocationKey: ''
    };

    /** 공통 특별 이벤트 풀 */
    const EXPLORE_BASE_SPECIAL_EVENTS = [
        {
            id: 'hidden_pouch',
            name: '숨겨진 주머니',
            icon: '💰',
            preview: '숨겨진 금화를 발견할 수 있습니다.',
            description: '무너진 돌 틈에서 금화가 든 주머니를 찾아냈습니다.',
            reward: { type: 'gold', amount: [8, 24] }
        },
        {
            id: 'old_journal',
            name: '오래된 탐험 일지',
            icon: '📜',
            preview: '경험치를 얻는 기록 이벤트입니다.',
            description: '낡은 탐험 일지를 읽고 지형에 대한 통찰을 얻었습니다.',
            reward: { type: 'exp', amount: [6, 18] }
        },
        {
            id: 'safe_spot',
            name: '숨은 쉼터',
            icon: '🧘',
            preview: '잠시 숨을 돌리며 체력/마나를 회복합니다.',
            description: '잠시 쉴 만한 장소를 찾아 숨을 고르고 기운을 회복했습니다.',
            reward: { type: 'recover', hpRate: 0.12, mpRate: 0.12 }
        }
    ];

    // ============================================
    // 🧩 공통 헬퍼
    // ============================================

    /**
     * 탐험 모달 DOM 요소를 가져옵니다.
     */
    function getExploreModalElements() {
        return {
            modal: document.getElementById('exploreModal'),
            locationName: document.getElementById('exploreModalLocationName'),
            locationDesc: document.getElementById('exploreModalLocationDesc'),
            previewItems: document.getElementById('explorePreviewItems'),
            previewMonsters: document.getElementById('explorePreviewMonsters'),
            previewEvents: document.getElementById('explorePreviewEvents'),
            progressWrap: document.getElementById('exploreProgressWrap'),
            progressLabel: document.getElementById('exploreProgressLabel'),
            progressTime: document.getElementById('exploreProgressTime'),
            progressFill: document.getElementById('exploreProgressFill'),
            resultCard: document.getElementById('exploreResultCard'),
            resultIcon: document.getElementById('exploreResultIcon'),
            resultTitle: document.getElementById('exploreResultTitle'),
            resultDesc: document.getElementById('exploreResultDesc'),
            huntBtn: document.getElementById('exploreHuntBtn'),
            searchBtn: document.getElementById('exploreSearchBtn'),
            claimBtn: document.getElementById('exploreClaimBtn')
        };
    }

    /**
     * 현재 탐험 컨텍스트를 가져옵니다.
     */
    function getCurrentExploreContext() {
        if (typeof getCurrentLocation !== 'function' || typeof getCurrentMap !== 'function') {
            return { map: null, location: null, locationKey: '' };
        }

        const location = getCurrentLocation();
        const map = getCurrentMap();
        const locationKey = (map && location) ? `${map.id}:${location.id}` : '';
        return { map, location, locationKey };
    }

    /**
     * 중복 아이템 ID를 병합합니다.
     * @param {Array} itemList - 아이템 목록
     * @returns {Array}
     */
    function mergeExploreItemsById(itemList) {
        const merged = new Map();

        itemList.forEach(item => {
            if (!item || !item.id) return;

            const prev = merged.get(item.id);
            if (!prev) {
                merged.set(item.id, { ...item });
                return;
            }

            const prevChance = typeof prev.chance === 'number' ? prev.chance : 0;
            const nextChance = typeof item.chance === 'number' ? item.chance : 0;

            merged.set(item.id, {
                ...prev,
                ...item,
                chance: Math.max(prevChance, nextChance)
            });
        });

        return Array.from(merged.values());
    }

    /**
     * 현재 위치 기준 탐험 아이템 풀을 가져옵니다.
     * @param {Object} map - 현재 맵
     * @param {Object} location - 현재 위치
     */
    function getExploreItemPools(map, location) {
        let baseItems = [];

        if (location.useRestAreaItems && Array.isArray(map.restAreaExploreItems)) {
            baseItems = map.restAreaExploreItems;
        } else if (Array.isArray(map.exploreItems)) {
            baseItems = map.exploreItems;
        }

        const specialItems = Array.isArray(location.specialExploreItems)
            ? location.specialExploreItems
            : [];

        return {
            baseItems,
            specialItems,
            mergedItems: mergeExploreItemsById([...specialItems, ...baseItems])
        };
    }

    /**
     * 현재 위치 기준 몬스터 풀을 가져옵니다.
     * @param {Object} map - 현재 맵
     * @param {Object} location - 현재 위치
     * @returns {Array<string>}
     */
    function getExploreMonsterPool(map, location) {
        if (Array.isArray(location.monsters) && location.monsters.length > 0) {
            return [...new Set(location.monsters)];
        }

        if (Array.isArray(map.monsters) && map.monsters.length > 0) {
            return [...new Set(map.monsters)];
        }

        return [];
    }

    /**
     * 위치 특성에 맞는 특별 이벤트를 구성합니다.
     * @param {Object} location - 현재 위치
     * @param {{baseItems:Array, specialItems:Array}} itemPools - 탐험 아이템 풀
     * @returns {Array<Object>}
     */
    function getExploreSpecialEvents(location, itemPools) {
        const events = EXPLORE_BASE_SPECIAL_EVENTS.map(event => ({ ...event }));

        if (itemPools.specialItems.length > 0) {
            events.push({
                id: 'special_cache',
                name: '특수 물품 보관함',
                icon: '🎁',
                preview: '지역 특수 물품을 획득할 수 있습니다.',
                description: '지역 특수 물품이 보관된 상자를 발견했습니다!',
                reward: { type: 'specialItem' }
            });
        }

        if (itemPools.baseItems.length > 0) {
            events.push({
                id: 'supply_cache',
                name: '보급품 흔적',
                icon: '📦',
                preview: '기본 탐험 물품을 추가로 획득할 수 있습니다.',
                description: '누군가 남기고 간 보급품 흔적을 찾아냈습니다.',
                reward: { type: 'baseItem' }
            });
        }

        if (location.id && location.id.includes('mine')) {
            events.push({
                id: 'mine_bonus',
                name: '광맥 발견',
                icon: '⛏️',
                preview: '광산 지역에서 골드를 추가로 얻을 수 있습니다.',
                description: '작은 광맥을 찾아 골드로 바꿀 수 있는 광석을 챙겼습니다.',
                reward: { type: 'gold', amount: [12, 30] }
            });
        }

        return events;
    }

    /**
     * 아이템 비주얼 정보(이미지 우선, 이모지 폴백)를 만듭니다.
     * @param {Object} item - 아이템 정보
     */
    function getExploreItemVisual(item) {
        const dbItem = (typeof ITEMS_DATABASE !== 'undefined') ? ITEMS_DATABASE[item.id] : null;
        const itemName = item.name || (dbItem ? dbItem.name : item.id);
        const iconText = (dbItem && dbItem.icon) || item.icon || '📦';
        const image = (dbItem && dbItem.image) || item.image || '';

        if (image) {
            return {
                iconHtml: `<img src="${image}" class="explore-item-image" alt="${itemName}">`,
                iconText,
                itemName
            };
        }

        return {
            iconHtml: '',
            iconText,
            itemName
        };
    }

    /**
     * 확률 표시 문자열을 반환합니다.
     * @param {number} chance - 0~1 확률
     */
    function formatExploreChance(chance) {
        if (typeof chance !== 'number' || Number.isNaN(chance)) return '-';
        return `${Math.max(0.1, chance * 100).toFixed(1)}%`;
    }

    /**
     * 가중치 테이블에서 결과 타입을 선택합니다.
     * @param {Array<{type:string, weight:number}>} weightedTable - 가중치 테이블
     */
    function pickRandomWeighted(weightedTable) {
        const totalWeight = weightedTable.reduce((sum, entry) => sum + entry.weight, 0);
        if (totalWeight <= 0) return 'none';

        let roll = Math.random() * totalWeight;

        for (const entry of weightedTable) {
            roll -= entry.weight;
            if (roll <= 0) return entry.type;
        }

        return weightedTable[weightedTable.length - 1].type;
    }

    /**
     * 아이템 목록에서 확률 기반으로 아이템 하나를 선택합니다.
     * @param {Array} items - 아이템 목록
     */
    function pickExploreItemByChance(items) {
        if (!Array.isArray(items) || items.length === 0) return null;

        const total = items.reduce((sum, item) => {
            const chance = typeof item.chance === 'number' ? item.chance : 0.01;
            return sum + Math.max(0.01, chance);
        }, 0);

        let roll = Math.random() * total;

        for (const item of items) {
            const weight = Math.max(0.01, typeof item.chance === 'number' ? item.chance : 0.01);
            roll -= weight;
            if (roll <= 0) return item;
        }

        return items[items.length - 1] || null;
    }

    /**
     * 아이템 발견 결과 설명을 반환합니다.
     * @param {Object} item - 아이템
     * @param {Object} location - 위치
     * @param {boolean} isSpecial - 특수 드롭 여부
     */
    function getExploreItemResultDescription(item, location, isSpecial) {
        const itemName = item.name || item.id;

        if (isSpecial) {
            const specialTemplates = [
                `${location.name}의 깊은 구석에서 ${itemName}을(를) 찾아냈습니다.`,
                `평범해 보이던 잔해 더미에서 ${itemName}이(가) 모습을 드러냈습니다.`,
                `이 지역의 특수 흔적을 따라가다 ${itemName}을(를) 발견했습니다.`
            ];
            return specialTemplates[Math.floor(Math.random() * specialTemplates.length)];
        }

        const normalTemplates = [
            `주변을 살피던 중 ${itemName}을(를) 손에 넣었습니다.`,
            `조심스럽게 수색한 끝에 ${itemName}을(를) 발견했습니다.`,
            `${location.name}의 틈새에서 ${itemName}을(를) 찾았습니다.`
        ];
        return normalTemplates[Math.floor(Math.random() * normalTemplates.length)];
    }

    // ============================================
    // 🎨 렌더링
    // ============================================

    /**
     * 탐험 미리보기 목록을 렌더링합니다.
     * @param {Object} map - 현재 맵
     * @param {Object} location - 현재 위치
     */
    function renderExplorePreview(map, location) {
        const elements = getExploreModalElements();
        if (!elements.modal) return;

        const itemPools = getExploreItemPools(map, location);
        const monsterPool = getExploreMonsterPool(map, location);
        const specialEvents = getExploreSpecialEvents(location, itemPools);

        if (elements.previewItems) {
            if (itemPools.mergedItems.length === 0) {
                elements.previewItems.innerHTML = '<p class="explore-empty">획득 가능한 물품이 없습니다.</p>';
            } else {
                const sortedItems = [...itemPools.mergedItems]
                    .sort((a, b) => (b.chance || 0) - (a.chance || 0))
                    .slice(0, 8);

                elements.previewItems.innerHTML = sortedItems.map(item => {
                    const visual = getExploreItemVisual(item);
                    const chanceText = formatExploreChance(item.chance);
                    const iconHtml = visual.iconHtml || visual.iconText;

                    return `
                        <div class="explore-chip">
                            <span class="explore-chip-icon">${iconHtml}</span>
                            <span class="explore-chip-name">${visual.itemName}</span>
                            <span class="explore-chip-chance">${chanceText}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        if (elements.previewMonsters) {
            if (!location.canBattle || monsterPool.length === 0) {
                elements.previewMonsters.innerHTML = '<p class="explore-empty">이 지역은 전투 조우가 없습니다.</p>';
            } else {
                elements.previewMonsters.innerHTML = monsterPool.slice(0, 8).map(monsterId => {
                    const monsterData = (typeof MONSTERS !== 'undefined') ? (MONSTERS[monsterId] || {}) : {};
                    const monsterName = monsterData.name || monsterId;
                    const monsterIcon = monsterData.emoji || monsterData.icon || '👾';

                    return `
                        <div class="explore-chip">
                            <span class="explore-chip-icon">${monsterIcon}</span>
                            <span class="explore-chip-name">${monsterName}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        if (elements.previewEvents) {
            if (specialEvents.length === 0) {
                elements.previewEvents.innerHTML = '<p class="explore-empty">발생 가능한 특별 이벤트가 없습니다.</p>';
            } else {
                elements.previewEvents.innerHTML = specialEvents.slice(0, 8).map(event => `
                    <div class="explore-chip">
                        <span class="explore-chip-icon">${event.icon}</span>
                        <span class="explore-chip-name">${event.name}</span>
                    </div>
                `).join('');
            }
        }
    }

    /**
     * 탐험 결과 카드를 렌더링합니다.
     * @param {Object|null} result - 탐험 결과
     */
    function renderExploreResultCard(result) {
        const elements = getExploreModalElements();
        if (!elements.resultCard || !elements.resultIcon || !elements.resultTitle || !elements.resultDesc) return;

        elements.resultCard.classList.remove('item', 'battle', 'special', 'none');

        if (!result) {
            elements.resultCard.classList.add('none');
            elements.resultIcon.textContent = '🧭';
            elements.resultTitle.textContent = '탐험 준비 완료';
            elements.resultDesc.textContent = '수색을 시작하면 이 지역에서 아이템, 적 조우, 특별 이벤트를 만날 수 있습니다.';
            return;
        }

        if (result.iconHtml) {
            elements.resultIcon.innerHTML = result.iconHtml;
        } else {
            elements.resultIcon.textContent = result.icon || '🧭';
        }

        elements.resultTitle.textContent = result.title;
        elements.resultDesc.textContent = result.description;

        if (result.type === 'item') {
            elements.resultCard.classList.add('item');
        } else if (result.type === 'battle') {
            elements.resultCard.classList.add('battle');
        } else if (result.type === 'specialEvent') {
            elements.resultCard.classList.add('special');
        } else {
            elements.resultCard.classList.add('none');
        }
    }

    /**
     * 버튼 상태를 갱신합니다.
     */
    function updateExploreModalButtons() {
        const elements = getExploreModalElements();

        if (!elements.huntBtn || !elements.searchBtn || !elements.claimBtn) return;

        const hasPendingResult = !!exploreModalState.pendingResult;

        elements.huntBtn.disabled = exploreModalState.isSearching;
        elements.searchBtn.disabled = exploreModalState.isSearching || hasPendingResult;
        elements.claimBtn.disabled = exploreModalState.isSearching || !hasPendingResult;

        if (hasPendingResult) {
            if (exploreModalState.pendingResult.type === 'battle') {
                elements.claimBtn.textContent = '⚔️ 조우';
            } else if (exploreModalState.pendingResult.type === 'none') {
                elements.claimBtn.textContent = '확인';
            } else {
                elements.claimBtn.textContent = '🎁 획득';
            }
        } else {
            elements.claimBtn.textContent = '🎁 획득';
        }
    }

    /**
     * 진행바를 초기화합니다.
     */
    function resetExploreProgressBar() {
        const elements = getExploreModalElements();
        if (!elements.progressFill || !elements.progressTime || !elements.progressLabel) return;

        elements.progressFill.style.width = '0%';
        elements.progressTime.textContent = '0%';
        elements.progressLabel.textContent = '주변을 수색하는 중...';
    }

    /**
     * 진행바 상태를 갱신합니다.
     * @param {number} progress - 진행률(0~1)
     */
    function setExploreProgress(progress) {
        const elements = getExploreModalElements();
        if (!elements.progressFill || !elements.progressTime || !elements.progressLabel) return;

        const clamped = Math.max(0, Math.min(progress, 1));
        const percent = Math.floor(clamped * 100);
        const remainSec = ((EXPLORE_MODAL_CONFIG.realDurationMs * (1 - clamped)) / 1000).toFixed(1);

        elements.progressFill.style.width = `${percent}%`;
        elements.progressTime.textContent = `${percent}%`;
        elements.progressLabel.textContent = clamped >= 1
            ? '수색 완료!'
            : `주변을 수색하는 중... (${remainSec}초)`;
    }

    // ============================================
    // 🎲 결과 계산
    // ============================================

    /**
     * 탐험 결과를 랜덤으로 결정합니다.
     * @param {Object} location - 현재 위치
     * @param {{baseItems:Array, specialItems:Array, mergedItems:Array}} itemPools - 아이템 풀
     * @param {Array<string>} monsterPool - 몬스터 풀
     * @param {Array<Object>} specialEvents - 특별 이벤트 풀
     */
    function resolveExploreOutcome(location, itemPools, monsterPool, specialEvents) {
        const canEncounterBattle = location.canBattle && monsterPool.length > 0;

        const weightedTable = [];

        if (canEncounterBattle) weightedTable.push({ type: 'battle', weight: 24 });
        if (itemPools.specialItems.length > 0) weightedTable.push({ type: 'specialDrop', weight: 20 });
        if (itemPools.baseItems.length > 0) weightedTable.push({ type: 'baseDrop', weight: 32 });
        if (specialEvents.length > 0) weightedTable.push({ type: 'specialEvent', weight: 18 });
        weightedTable.push({ type: 'none', weight: 14 });

        const selectedType = pickRandomWeighted(weightedTable);

        if (selectedType === 'battle') {
            const monsterId = monsterPool[Math.floor(Math.random() * monsterPool.length)];
            const monsterData = (typeof MONSTERS !== 'undefined') ? (MONSTERS[monsterId] || {}) : {};
            const monsterName = monsterData.name || monsterId;
            const monsterIcon = monsterData.emoji || monsterData.icon || '👾';

            return {
                type: 'battle',
                monsterId,
                monsterName,
                icon: monsterIcon,
                title: `${monsterName}의 흔적`,
                description: `${location.name}에서 ${monsterName}의 움직임을 포착했습니다. 조심스럽게 접근해 조우를 확정하세요.`
            };
        }

        if (selectedType === 'specialDrop') {
            const item = pickExploreItemByChance(itemPools.specialItems);
            if (item) {
                const visual = getExploreItemVisual(item);
                return {
                    type: 'item',
                    item,
                    icon: visual.iconText,
                    iconHtml: visual.iconHtml,
                    title: `희귀 발견: ${visual.itemName}`,
                    description: getExploreItemResultDescription(item, location, true)
                };
            }
        }

        if (selectedType === 'baseDrop') {
            const item = pickExploreItemByChance(itemPools.baseItems);
            if (item) {
                const visual = getExploreItemVisual(item);
                return {
                    type: 'item',
                    item,
                    icon: visual.iconText,
                    iconHtml: visual.iconHtml,
                    title: `${visual.itemName} 발견`,
                    description: getExploreItemResultDescription(item, location, false)
                };
            }
        }

        if (selectedType === 'specialEvent') {
            const event = specialEvents[Math.floor(Math.random() * specialEvents.length)];
            let rewardItem = null;

            if (event.reward.type === 'specialItem') {
                rewardItem = pickExploreItemByChance(itemPools.specialItems);
            } else if (event.reward.type === 'baseItem') {
                rewardItem = pickExploreItemByChance(itemPools.baseItems);
            }

            return {
                type: 'specialEvent',
                event,
                rewardItem,
                icon: event.icon,
                title: `특별 이벤트: ${event.name}`,
                description: event.description
            };
        }

        return {
            type: 'none',
            icon: '🕳️',
            title: '성과 없음',
            description: '구석구석 확인했지만 이번에는 눈에 띄는 수확이 없었습니다.'
        };
    }

    // ============================================
    // 🎁 결과 적용
    // ============================================

    /**
     * 특별 이벤트 보상을 적용합니다.
     * @param {Object} result - 특별 이벤트 결과
     */
    function applyExploreSpecialEventReward(result) {
        const reward = result.event && result.event.reward;
        if (!reward) {
            addGameLog('✨ 특별 이벤트가 스쳐 지나갔지만 얻은 것은 없었습니다.');
            return;
        }

        if (reward.type === 'gold') {
            const amount = Math.floor(Math.random() * (reward.amount[1] - reward.amount[0] + 1)) + reward.amount[0];
            gold += amount;
            addGameLog(`💰 특별 이벤트 보상: ${amount} 골드를 획득했습니다!`);
            return;
        }

        if (reward.type === 'exp') {
            const amount = Math.floor(Math.random() * (reward.amount[1] - reward.amount[0] + 1)) + reward.amount[0];
            player.exp = (player.exp || 0) + amount;
            addGameLog(`⭐ 특별 이벤트 보상: 경험치 ${amount}를 획득했습니다!`);
            if (typeof checkLevelUp === 'function') checkLevelUp();
            return;
        }

        if (reward.type === 'recover') {
            const hpRecover = Math.max(1, Math.floor(player.maxHp * reward.hpRate));
            const mpRecover = Math.max(1, Math.floor(player.maxMp * reward.mpRate));

            player.hp = Math.min(player.maxHp, player.hp + hpRecover);
            player.mp = Math.min(player.maxMp, player.mp + mpRecover);

            addGameLog(`💚 특별 이벤트 보상: HP +${hpRecover}, MP +${mpRecover} 회복!`);
            return;
        }

        if ((reward.type === 'specialItem' || reward.type === 'baseItem') && result.rewardItem) {
            addGameLog('🎁 특별 이벤트 보상으로 아이템을 획득했습니다!');
            if (typeof handleExploreItemFound === 'function') {
                handleExploreItemFound(result.rewardItem);
            }
            return;
        }

        addGameLog('✨ 특별 이벤트가 발생했지만 적용 가능한 보상이 없습니다.');
    }

    /**
     * 탐험 결과를 실제 게임 상태에 반영합니다.
     * @param {Object} result - 탐험 결과
     */
    function applyExploreResult(result) {
        if (!result) return;

        switch (result.type) {
            case 'battle':
                hideExploreModal(true);
                addGameLog(`⚔️ ${result.monsterName}과(와) 조우했습니다!`);
                if (typeof startBattle === 'function' && result.monsterId) {
                    startBattle([result.monsterId]);
                } else if (typeof startLocationBattle === 'function') {
                    startLocationBattle();
                }
                break;

            case 'item':
                if (typeof handleExploreItemFound === 'function') {
                    handleExploreItemFound(result.item);
                }
                break;

            case 'specialEvent':
                applyExploreSpecialEventReward(result);
                break;

            default:
                addGameLog('🔎 이번 수색에서는 눈에 띄는 성과가 없었습니다.');
                break;
        }

        if (typeof updatePlayerUI === 'function') {
            updatePlayerUI();
        }
    }

    // ============================================
    // 🪟 모달 동작
    // ============================================

    /**
     * 탐험 모달을 엽니다.
     */
    function showExploreModal() {
        const elements = getExploreModalElements();
        const context = getCurrentExploreContext();
        const map = context.map;
        const location = context.location;

        if (!elements.modal || !map || !location) return;

        if (!elements.modal.dataset.boundOutsideClose) {
            elements.modal.addEventListener('click', (event) => {
                if (event.target === elements.modal) {
                    hideExploreModal();
                }
            });
            elements.modal.dataset.boundOutsideClose = 'true';
        }

        if (exploreModalState.lastLocationKey !== context.locationKey) {
            exploreModalState.pendingResult = null;
            renderExploreResultCard(null);
        }

        exploreModalState.lastLocationKey = context.locationKey;

        if (elements.locationName) {
            elements.locationName.textContent = location.name || map.name;
        }
        if (elements.locationDesc) {
            elements.locationDesc.textContent = location.description || map.description || '탐험 정보를 불러올 수 없습니다.';
        }

        renderExplorePreview(map, location);

        if (exploreModalState.pendingResult) {
            renderExploreResultCard(exploreModalState.pendingResult);
        } else {
            renderExploreResultCard(null);
        }

        if (elements.progressWrap && !exploreModalState.isSearching) {
            elements.progressWrap.classList.add('hidden');
            resetExploreProgressBar();
        }

        elements.modal.classList.remove('hidden');
        updateExploreModalButtons();
    }

    /**
     * 탐험 모달을 닫습니다.
     * @param {boolean} forceClose - 강제 닫기 여부
     */
    function hideExploreModal(forceClose = false) {
        const elements = getExploreModalElements();
        if (!elements.modal) return;

        if (exploreModalState.isSearching && !forceClose) {
            addGameLog('⏳ 수색이 끝날 때까지 탐험 창을 닫을 수 없습니다.');
            return;
        }

        if (exploreModalState.isSearching && forceClose) {
            clearInterval(exploreModalState.progressTimerId);
            exploreModalState.progressTimerId = null;
            exploreModalState.isSearching = false;
        }

        elements.modal.classList.add('hidden');
    }

    /**
     * 탐험 모달의 사냥 버튼 동작입니다.
     */
    function startExploreHunt() {
        if (exploreModalState.isSearching) return;

        if (typeof player !== 'undefined' && player && player.hp <= 0) {
            addGameLog('❌ HP가 0입니다. 먼저 회복하세요!');
            return;
        }

        if (exploreModalState.pendingResult) {
            exploreModalState.pendingResult = null;
            renderExploreResultCard(null);
        }

        hideExploreModal(true);
        addGameLog('⚔️ 탐험 창에서 사냥을 시작합니다!');

        if (typeof startLocationBattle === 'function') {
            startLocationBattle();
        }
    }

    /**
     * 수색을 시작합니다.
     */
    function startExploreSearch() {
        const elements = getExploreModalElements();
        const context = getCurrentExploreContext();
        const map = context.map;
        const location = context.location;

        if (!elements.modal || !map || !location) return;
        if (exploreModalState.isSearching) return;

        if (exploreModalState.pendingResult) {
            addGameLog('📌 먼저 현재 탐험 결과를 처리하세요.');
            return;
        }

        if (typeof player !== 'undefined' && player && player.hp <= 0) {
            addGameLog('❌ HP가 0입니다. 먼저 회복하세요!');
            return;
        }

        if (location.canExplore === false) {
            addGameLog('❌ 이 지역에서는 탐사가 불가능합니다.');
            return;
        }

        exploreModalState.isSearching = true;
        addGameLog(`🔍 ${location.name}을(를) 수색하기 시작합니다...`);

        if (typeof addGameTime === 'function') {
            addGameTime(EXPLORE_MODAL_CONFIG.gameMinutesPerSearch);
            addGameLog(`⏱️ 게임 시간이 ${EXPLORE_MODAL_CONFIG.gameMinutesPerSearch}분 경과했습니다.`);
        }

        if (elements.progressWrap) {
            elements.progressWrap.classList.remove('hidden');
        }

        resetExploreProgressBar();
        updateExploreModalButtons();

        const startedAt = Date.now();

        exploreModalState.progressTimerId = setInterval(() => {
            const elapsed = Date.now() - startedAt;
            const progress = Math.min(elapsed / EXPLORE_MODAL_CONFIG.realDurationMs, 1);
            setExploreProgress(progress);

            if (progress >= 1) {
                clearInterval(exploreModalState.progressTimerId);
                exploreModalState.progressTimerId = null;
                exploreModalState.isSearching = false;
                finishExploreSearch();
            }
        }, 40);
    }

    /**
     * 수색 종료 후 결과를 생성합니다.
     */
    function finishExploreSearch() {
        const elements = getExploreModalElements();
        const context = getCurrentExploreContext();
        const map = context.map;
        const location = context.location;

        if (!map || !location) return;

        const itemPools = getExploreItemPools(map, location);
        const monsterPool = getExploreMonsterPool(map, location);
        const specialEvents = getExploreSpecialEvents(location, itemPools);

        const result = resolveExploreOutcome(location, itemPools, monsterPool, specialEvents);
        exploreModalState.pendingResult = result;

        renderExploreResultCard(result);
        updateExploreModalButtons();

        if (elements.progressWrap) {
            setTimeout(() => {
                if (!exploreModalState.isSearching && elements.progressWrap) {
                    elements.progressWrap.classList.add('hidden');
                }
            }, 200);
        }

        if (result.type === 'battle') {
            addGameLog(`⚠️ ${result.monsterName}의 흔적을 발견했습니다. '조우' 버튼으로 전투를 시작할 수 있습니다.`);
        } else if (result.type === 'item') {
            addGameLog(`📦 수색 결과: ${result.item.name}을(를) 발견했습니다. '획득' 버튼을 눌러 챙기세요.`);
        } else if (result.type === 'specialEvent') {
            addGameLog(`✨ 특별 이벤트 발생: ${result.event.name}! '획득' 버튼으로 결과를 적용하세요.`);
        } else {
            addGameLog('🔎 수색했지만 특별한 성과를 찾지 못했습니다.');
        }
    }

    /**
     * 대기 중인 탐험 결과를 적용합니다.
     */
    function claimExploreResult() {
        if (exploreModalState.isSearching) return;

        if (!exploreModalState.pendingResult) {
            addGameLog('ℹ️ 아직 획득할 탐험 결과가 없습니다.');
            return;
        }

        const result = exploreModalState.pendingResult;
        exploreModalState.pendingResult = null;

        applyExploreResult(result);
        renderExploreResultCard({
            type: 'none',
            icon: '✅',
            title: '결과 처리 완료',
            description: '다시 수색하거나 사냥을 진행할 수 있습니다.'
        });
        updateExploreModalButtons();
    }

    /**
     * 탐험 진입(기존 doExplore 대체) 함수입니다.
     */
    function doExplore() {
        const context = getCurrentExploreContext();
        const map = context.map;
        const location = context.location;

        if (!location || !map) {
            addGameLog('❌ 탐험할 수 없는 지역입니다.');
            return;
        }

        if (location.canExplore === false) {
            addGameLog('❌ 이 지역에서는 탐사가 불가능합니다.');
            return;
        }

        if (typeof battleState !== 'undefined' && battleState && battleState.inBattle) {
            addGameLog('⚔️ 전투 중에는 탐험 창을 열 수 없습니다.');
            return;
        }

        showExploreModal();
    }

    // ============================================
    // 🌍 전역 노출
    // ============================================

    window.showExploreModal = showExploreModal;
    window.hideExploreModal = hideExploreModal;
    window.startExploreSearch = startExploreSearch;
    window.startExploreHunt = startExploreHunt;
    window.claimExploreResult = claimExploreResult;
    window.doExplore = doExplore;
})();
