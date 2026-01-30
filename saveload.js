/**
 * ============================================
 * RPG 게임 세이브/로드 시스템
 * ============================================
 * 
 * 사용법:
 * 1. HTML에서 로드: <script src="saveload.js"></script>
 * 2. 저장: saveGame() 또는 showSaveLoadMenu()
 * 3. 불러오기: loadGame() 또는 showSaveLoadMenu()
 */

// ============================================
// 🔧 설정
// ============================================

const SAVE_CONFIG = {
    // localStorage 키 이름
    saveKey: 'rpg_save_data',

    // 최대 세이브 슬롯 수
    maxSlots: 3,

    // 자동 저장 사용 여부
    autoSaveEnabled: true,

    // 자동 저장 간격 (밀리초) - 5분
    autoSaveInterval: 300000
};

// ============================================
// 💾 핵심 저장/불러오기 함수
// ============================================

/**
 * 게임 데이터를 저장합니다.
 * @param {number} slotNumber - 슬롯 번호 (1, 2, 3)
 * @returns {boolean} 저장 성공 여부
 */
function saveGame(slotNumber = 1) {
    try {
        // 현재 게임 상태 수집 (실제 게임에 맞게 수정하세요!)
        const saveData = {
            // 메타 정보
            slotNumber: slotNumber,
            savedAt: new Date().toISOString(),
            playTime: getPlayTime(), // 플레이 시간

            // 플레이어 정보
            player: {
                name: typeof player !== 'undefined' ? player.name : '용사',
                hp: typeof player !== 'undefined' ? player.hp : 100,
                maxHp: typeof player !== 'undefined' ? (player.maxHp || player.hp) : 100,
                mp: typeof player !== 'undefined' ? player.mp : 50,
                maxMp: typeof player !== 'undefined' ? (player.maxMp || player.mp) : 50,
                atk: typeof player !== 'undefined' ? player.atk : 10,
                def: typeof player !== 'undefined' ? player.def : 10,
                level: typeof player !== 'undefined' ? (player.level || 1) : 1,
                exp: typeof player !== 'undefined' ? (player.exp || 0) : 0
            },

            // 게임 진행 상태
            progress: {
                currentStage: typeof currentStage !== 'undefined' ? currentStage : 1,
                gold: typeof gold !== 'undefined' ? gold : 0,
                defeatedBosses: typeof defeatedBosses !== 'undefined' ? defeatedBosses : [],
                unlockedAreas: typeof unlockedAreas !== 'undefined' ? unlockedAreas : ['훈련장']
            },

            // 인벤토리
            inventory: typeof inventory !== 'undefined' ? inventory : [],

            // 기타 설정
            settings: {
                bgmVolume: typeof bgmVolume !== 'undefined' ? bgmVolume : 100,
                sfxVolume: typeof sfxVolume !== 'undefined' ? sfxVolume : 100
            }
        };

        // 기존 저장 데이터 불러오기
        let allSaves = getAllSaveData();

        // 해당 슬롯에 저장
        allSaves[`slot${slotNumber}`] = saveData;

        // localStorage에 저장
        localStorage.setItem(SAVE_CONFIG.saveKey, JSON.stringify(allSaves));

        console.log(`✅ 슬롯 ${slotNumber}에 저장 완료!`);
        return true;

    } catch (error) {
        console.error('❌ 저장 실패:', error);
        return false;
    }
}

/**
 * 게임 데이터를 불러옵니다.
 * @param {number} slotNumber - 슬롯 번호 (1, 2, 3)
 * @returns {boolean} 불러오기 성공 여부
 */
function loadGame(slotNumber = 1) {
    try {
        const allSaves = getAllSaveData();
        const saveData = allSaves[`slot${slotNumber}`];

        if (!saveData) {
            console.log(`❌ 슬롯 ${slotNumber}에 저장된 데이터가 없습니다.`);
            return false;
        }

        // 플레이어 데이터 복원 (실제 게임에 맞게 수정하세요!)
        if (typeof player !== 'undefined') {
            player.name = saveData.player.name;
            player.hp = saveData.player.hp;
            player.maxHp = saveData.player.maxHp;
            player.mp = saveData.player.mp;
            player.maxMp = saveData.player.maxMp;
            player.atk = saveData.player.atk;
            player.def = saveData.player.def;
            player.level = saveData.player.level;
            player.exp = saveData.player.exp;
        }

        // 게임 진행 상태 복원
        if (typeof currentStage !== 'undefined') {
            currentStage = saveData.progress.currentStage;
        }
        if (typeof gold !== 'undefined') {
            gold = saveData.progress.gold;
        }
        if (typeof defeatedBosses !== 'undefined') {
            defeatedBosses = saveData.progress.defeatedBosses;
        }
        if (typeof unlockedAreas !== 'undefined') {
            unlockedAreas = saveData.progress.unlockedAreas;
        }

        // 인벤토리 복원
        if (typeof inventory !== 'undefined') {
            inventory = saveData.inventory;
        }

        // 플레이 시간 복원
        if (typeof startTime !== 'undefined' && saveData.playTime) {
            // 저장된 플레이 시간만큼 시작 시간을 조정
            const savedPlayTimeMs = saveData.playTime.totalSeconds * 1000;
            startTime = Date.now() - savedPlayTimeMs;
        }

        console.log(`✅ 슬롯 ${slotNumber} 불러오기 완료!`);
        return true;

    } catch (error) {
        console.error('❌ 불러오기 실패:', error);
        return false;
    }
}

/**
 * 모든 저장 데이터를 가져옵니다.
 */
function getAllSaveData() {
    try {
        const saved = localStorage.getItem(SAVE_CONFIG.saveKey);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

/**
 * 특정 슬롯의 저장 데이터를 가져옵니다.
 */
function getSaveData(slotNumber) {
    const allSaves = getAllSaveData();
    return allSaves[`slot${slotNumber}`] || null;
}

/**
 * 저장 데이터를 삭제합니다.
 */
function deleteSave(slotNumber) {
    try {
        let allSaves = getAllSaveData();
        delete allSaves[`slot${slotNumber}`];
        localStorage.setItem(SAVE_CONFIG.saveKey, JSON.stringify(allSaves));
        console.log(`🗑️ 슬롯 ${slotNumber} 삭제 완료!`);
        return true;
    } catch (error) {
        console.error('❌ 삭제 실패:', error);
        return false;
    }
}

/**
 * 모든 저장 데이터를 삭제합니다.
 */
function deleteAllSaves() {
    localStorage.removeItem(SAVE_CONFIG.saveKey);
    console.log('🗑️ 모든 저장 데이터 삭제 완료!');
}

/**
 * 저장 데이터가 있는지 확인합니다.
 */
function hasSaveData(slotNumber = null) {
    const allSaves = getAllSaveData();

    if (slotNumber) {
        return !!allSaves[`slot${slotNumber}`];
    }

    // 아무 슬롯에나 데이터가 있는지 확인
    return Object.keys(allSaves).length > 0;
}

// ============================================
// ⏱️ 플레이 시간 관리
// ============================================

let startTime = Date.now();

function getPlayTime() {
    const elapsed = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        totalSeconds,
        formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
}

// ============================================
// 🔄 자동 저장
// ============================================

let autoSaveTimer = null;

function startAutoSave() {
    if (!SAVE_CONFIG.autoSaveEnabled) return;

    autoSaveTimer = setInterval(() => {
        saveGame(1); // 슬롯 1에 자동 저장
        console.log('🔄 자동 저장 완료!');
    }, SAVE_CONFIG.autoSaveInterval);
}

function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

// ============================================
// 🎨 세이브/로드 UI (모달)
// ============================================

const saveLoadStyles = `
    .save-load-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .save-load-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .save-load-modal {
        background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%);
        border: 3px solid #4da8da;
        border-radius: 20px;
        width: 90%;
        max-width: 600px;
        overflow: hidden;
        box-shadow: 0 0 50px rgba(77, 168, 218, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }

    .save-load-overlay.active .save-load-modal {
        transform: scale(1);
    }

    .save-load-header {
        background: linear-gradient(135deg, #4da8da 0%, #2980b9 100%);
        padding: 20px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .save-load-header h2 {
        margin: 0;
        color: #fff;
        font-size: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .save-load-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .save-load-close:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: rotate(90deg);
    }

    .save-load-tabs {
        display: flex;
        background: rgba(0, 0, 0, 0.3);
    }

    .save-load-tab {
        flex: 1;
        padding: 15px;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
    }

    .save-load-tab:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
    }

    .save-load-tab.active {
        color: #4da8da;
        border-bottom-color: #4da8da;
    }

    .save-load-content {
        padding: 25px;
    }

    .save-slot {
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(77, 168, 218, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .save-slot:hover {
        border-color: #4da8da;
        transform: translateX(5px);
    }

    .save-slot.empty {
        opacity: 0.5;
    }

    .save-slot-info {
        flex: 1;
    }

    .save-slot-title {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .save-slot-title .slot-number {
        background: #4da8da;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }

    .save-slot-details {
        color: rgba(255, 255, 255, 0.6);
        font-size: 13px;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    .save-slot-details span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .save-slot-actions {
        display: flex;
        gap: 10px;
    }

    .slot-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .slot-btn-save {
        background: linear-gradient(135deg, #27ae60, #1e8449);
        color: #fff;
    }

    .slot-btn-save:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(39, 174, 96, 0.5);
    }

    .slot-btn-load {
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: #fff;
    }

    .slot-btn-load:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
    }

    .slot-btn-delete {
        background: rgba(231, 76, 60, 0.2);
        color: #e74c3c;
        border: 1px solid #e74c3c;
    }

    .slot-btn-delete:hover {
        background: #e74c3c;
        color: #fff;
    }

    .save-load-footer {
        padding: 15px 25px;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 10001;
        opacity: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    .toast.success { border-left: 4px solid #27ae60; }
    .toast.error { border-left: 4px solid #e74c3c; }
    .toast.info { border-left: 4px solid #3498db; }
`;

let saveLoadStyleInjected = false;
let currentMode = 'save'; // 'save' 또는 'load'

function injectSaveLoadStyles() {
    if (saveLoadStyleInjected) return;

    const style = document.createElement('style');
    style.id = 'save-load-styles';
    style.textContent = saveLoadStyles;
    document.head.appendChild(style);
    saveLoadStyleInjected = true;
}

/**
 * 세이브/로드 메뉴를 표시합니다.
 * @param {string} mode - 'save' 또는 'load'
 */
function showSaveLoadMenu(mode = 'save') {
    injectSaveLoadStyles();
    currentMode = mode;

    // 기존 모달 제거
    const existing = document.getElementById('saveLoadOverlay');
    if (existing) existing.remove();

    // 슬롯 HTML 생성
    let slotsHTML = '';
    for (let i = 1; i <= SAVE_CONFIG.maxSlots; i++) {
        const saveData = getSaveData(i);

        if (saveData) {
            const savedDate = new Date(saveData.savedAt).toLocaleString('ko-KR');
            slotsHTML += `
                <div class="save-slot" data-slot="${i}">
                    <div class="save-slot-info">
                        <div class="save-slot-title">
                            <span class="slot-number">${i}</span>
                            ${saveData.player.name} (Lv.${saveData.player.level || 1})
                        </div>
                        <div class="save-slot-details">
                            <span>📅 ${savedDate}</span>
                            <span>⏱️ ${saveData.playTime?.formatted || '00:00:00'}</span>
                            <span>🏰 Stage ${saveData.progress?.currentStage || 1}</span>
                            <span>💰 ${saveData.progress?.gold || 0}G</span>
                        </div>
                    </div>
                    <div class="save-slot-actions">
                        ${mode === 'save'
                    ? `<button class="slot-btn slot-btn-save" onclick="onSlotSave(${i})">덮어쓰기</button>`
                    : `<button class="slot-btn slot-btn-load" onclick="onSlotLoad(${i})">불러오기</button>`
                }
                        <button class="slot-btn slot-btn-delete" onclick="onSlotDelete(${i})">🗑️</button>
                    </div>
                </div>
            `;
        } else {
            slotsHTML += `
                <div class="save-slot empty" data-slot="${i}">
                    <div class="save-slot-info">
                        <div class="save-slot-title">
                            <span class="slot-number">${i}</span>
                            빈 슬롯
                        </div>
                        <div class="save-slot-details">
                            <span>저장된 데이터가 없습니다</span>
                        </div>
                    </div>
                    <div class="save-slot-actions">
                        ${mode === 'save'
                    ? `<button class="slot-btn slot-btn-save" onclick="onSlotSave(${i})">저장하기</button>`
                    : ``
                }
                    </div>
                </div>
            `;
        }
    }

    // 모달 HTML
    const modalHTML = `
        <div class="save-load-overlay" id="saveLoadOverlay" onclick="closeSaveLoadOnOverlay(event)">
            <div class="save-load-modal">
                <div class="save-load-header">
                    <h2>${mode === 'save' ? '💾 게임 저장' : '📂 게임 불러오기'}</h2>
                    <button class="save-load-close" onclick="hideSaveLoadMenu()">✕</button>
                </div>
                <div class="save-load-tabs">
                    <button class="save-load-tab ${mode === 'save' ? 'active' : ''}" onclick="switchSaveLoadMode('save')">
                        💾 저장하기
                    </button>
                    <button class="save-load-tab ${mode === 'load' ? 'active' : ''}" onclick="switchSaveLoadMode('load')">
                        📂 불러오기
                    </button>
                </div>
                <div class="save-load-content">
                    ${slotsHTML}
                </div>
                <div class="save-load-footer">
                    ESC 키를 누르거나 바깥을 클릭하면 닫힙니다
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    setTimeout(() => {
        document.getElementById('saveLoadOverlay').classList.add('active');
    }, 10);

    document.addEventListener('keydown', handleSaveLoadEsc);
}

function hideSaveLoadMenu() {
    const overlay = document.getElementById('saveLoadOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
    document.removeEventListener('keydown', handleSaveLoadEsc);
}

function closeSaveLoadOnOverlay(event) {
    if (event.target.id === 'saveLoadOverlay') {
        hideSaveLoadMenu();
    }
}

function handleSaveLoadEsc(event) {
    if (event.key === 'Escape') {
        hideSaveLoadMenu();
    }
}

function switchSaveLoadMode(mode) {
    hideSaveLoadMenu();
    setTimeout(() => showSaveLoadMenu(mode), 100);
}

// ============================================
// 🔘 슬롯 버튼 핸들러
// ============================================

function onSlotSave(slotNumber) {
    const existingData = getSaveData(slotNumber);

    if (existingData) {
        if (!confirm(`슬롯 ${slotNumber}에 이미 저장된 데이터가 있습니다.\n덮어쓰시겠습니까?`)) {
            return;
        }
    }

    if (saveGame(slotNumber)) {
        showToast('✅ 저장 완료!', 'success');
        switchSaveLoadMode('save'); // 새로고침
    } else {
        showToast('❌ 저장 실패!', 'error');
    }
}

function onSlotLoad(slotNumber) {
    if (!confirm(`슬롯 ${slotNumber}의 데이터를 불러오시겠습니까?\n현재 진행 상황은 저장되지 않습니다.`)) {
        return;
    }

    if (loadGame(slotNumber)) {
        showToast('✅ 불러오기 완료!', 'success');
        hideSaveLoadMenu();
        // 필요시 게임 화면 갱신 함수 호출
        // updateGameUI();
    } else {
        showToast('❌ 불러오기 실패!', 'error');
    }
}

function onSlotDelete(slotNumber) {
    if (!confirm(`정말로 슬롯 ${slotNumber}의 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
        return;
    }

    if (deleteSave(slotNumber)) {
        showToast('🗑️ 삭제 완료!', 'info');
        switchSaveLoadMode(currentMode); // 새로고침
    } else {
        showToast('❌ 삭제 실패!', 'error');
    }
}

// ============================================
// 🍞 토스트 메시지
// ============================================

function showToast(message, type = 'info') {
    // 기존 토스트 제거
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================
// 🎮 게임 시작 시 체크
// ============================================

/**
 * 게임 시작 시 저장 데이터 확인
 * 게임 시작 부분에서 호출하세요.
 */
function checkSaveOnStart() {
    if (hasSaveData()) {
        if (confirm('저장된 게임이 있습니다.\n이어서 하시겠습니까?')) {
            showSaveLoadMenu('load');
            return true;
        }
    }
    return false;
}

// ============================================
// 📢 사용 예시
// ============================================
/*
    <!-- HTML에서 사용 -->
    <script src="saveload.js"></script>
    
    <!-- 버튼 예시 -->
    <button onclick="showSaveLoadMenu('save')">💾 저장</button>
    <button onclick="showSaveLoadMenu('load')">📂 불러오기</button>
    
    <!-- 또는 기본 모드(save)로 열기 -->
    <button onclick="showSaveLoadMenu()">💾 세이브/로드</button>
    
    <!-- 빠른 저장 (슬롯 1) -->
    <button onclick="saveGame(1)">빠른 저장</button>
    
    <!-- 게임 시작 시 -->
    <script>
        // 저장 데이터 있으면 물어보기
        if (!checkSaveOnStart()) {
            // 새 게임 시작
            createPlayer();
        }
    </script>
*/

console.log('💾 세이브/로드 시스템 로드 완료!');
