/**
 * ============================================
 * RPG Adventure - 포만감/수분 시스템
 * ============================================
 * 플레이어의 포만감과 수분 상태를 관리합니다.
 */

// ============================================
// 🍖 포만감/수분 상태
// ============================================

let hungerState = {
    hunger: 100,   // 포만감 (0-100)
    thirst: 100,   // 수분 (0-100)
    lastUpdate: Date.now()
};

// ============================================
// 🍖 포만감/수분 함수
// ============================================

/**
 * 포만감과 수분을 업데이트합니다.
 */
function updateHungerThirst() {
    const now = Date.now();
    const elapsedMinutes = (now - hungerState.lastUpdate) / (60 * 1000);

    // 분당 감소
    hungerState.hunger = Math.max(0, hungerState.hunger - (HUNGER_CONFIG.hungerDecreasePerMinute * elapsedMinutes));
    hungerState.thirst = Math.max(0, hungerState.thirst - (HUNGER_CONFIG.thirstDecreasePerMinute * elapsedMinutes));

    hungerState.lastUpdate = now;

    // 디버프 적용 확인
    checkHungerDebuffs();

    return hungerState;
}

/**
 * 포만감 상태에 따른 디버프를 확인합니다.
 */
function checkHungerDebuffs() {
    const { hunger, thirst } = hungerState;
    const config = HUNGER_CONFIG;

    // 심각한 상태 (10 이하)
    if (hunger <= config.criticalThreshold || thirst <= config.criticalThreshold) {
        return {
            level: 'critical',
            effects: config.debuffs.critical,
            message: '⚠️ 극심한 허기와 갈증! 체력이 감소합니다!'
        };
    }

    // 부족 상태 (30 이하)
    if (hunger <= config.lowThreshold || thirst <= config.lowThreshold) {
        return {
            level: 'low',
            effects: config.debuffs.low,
            message: '⚠️ 배가 고프거나 목이 마릅니다.'
        };
    }

    return { level: 'normal', effects: {}, message: '' };
}

/**
 * 음식을 먹어 포만감을 회복합니다.
 * @param {number} amount - 회복량
 */
function eat(amount) {
    hungerState.hunger = Math.min(HUNGER_CONFIG.maxHunger, hungerState.hunger + amount);
    addGameLog(`🍖 음식을 먹었습니다. 포만감 +${amount}`);
    updateHungerUI();
}

/**
 * 물을 마셔 수분을 회복합니다.
 * @param {number} amount - 회복량
 */
function drink(amount) {
    hungerState.thirst = Math.min(HUNGER_CONFIG.maxThirst, hungerState.thirst + amount);
    addGameLog(`💧 물을 마셨습니다. 수분 +${amount}`);
    updateHungerUI();
}

/**
 * 포만감/수분 게이지를 초기화합니다.
 */
function resetHungerThirst() {
    hungerState = {
        hunger: 100,
        thirst: 100,
        lastUpdate: Date.now()
    };
}

// ============================================
// 🎨 포만감/수분 UI
// ============================================

/**
 * 포만감/수분 UI를 업데이트합니다.
 */
function updateHungerUI() {
    const hungerBar = document.getElementById('hungerBar');
    const thirstBar = document.getElementById('thirstBar');

    if (hungerBar) {
        hungerBar.style.width = `${hungerState.hunger}%`;
        hungerBar.style.backgroundColor = getHungerColor(hungerState.hunger);
    }

    if (thirstBar) {
        thirstBar.style.width = `${hungerState.thirst}%`;
        thirstBar.style.backgroundColor = getThirstColor(hungerState.thirst);
    }

    // 상태 텍스트
    const hungerText = document.getElementById('hungerText');
    const thirstText = document.getElementById('thirstText');

    if (hungerText) {
        hungerText.textContent = `🍖 ${Math.floor(hungerState.hunger)}%`;
    }
    if (thirstText) {
        thirstText.textContent = `💧 ${Math.floor(hungerState.thirst)}%`;
    }
}

/**
 * 포만감에 따른 색상을 반환합니다.
 */
function getHungerColor(value) {
    if (value <= 10) return '#f44336';  // 빨강 (위험)
    if (value <= 30) return '#ff9800';  // 주황 (경고)
    return '#8bc34a';  // 녹색 (정상)
}

/**
 * 수분에 따른 색상을 반환합니다.
 */
function getThirstColor(value) {
    if (value <= 10) return '#f44336';  // 빨강 (위험)
    if (value <= 30) return '#ff9800';  // 주황 (경고)
    return '#03a9f4';  // 파랑 (정상)
}

// ============================================
// ⏱️ 포만감/수분 업데이트 루프
// ============================================

let hungerUpdateInterval = null;

/**
 * 포만감/수분 시스템을 시작합니다.
 */
function startHungerSystem() {
    if (hungerUpdateInterval) clearInterval(hungerUpdateInterval);

    // 30초마다 업데이트
    hungerUpdateInterval = setInterval(() => {
        updateHungerThirst();
        updateHungerUI();
    }, 30000);

    // 초기 업데이트
    updateHungerUI();

    console.log('🍖 포만감/수분 시스템 시작!');
}

/**
 * 포만감/수분 시스템을 중지합니다.
 */
function stopHungerSystem() {
    if (hungerUpdateInterval) {
        clearInterval(hungerUpdateInterval);
        hungerUpdateInterval = null;
    }
}

// ============================================
// 🔊 콘솔 로그
// ============================================

console.log('🍖 hungerSystem.js 로드 완료!');
