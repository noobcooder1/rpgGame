/**
 * ============================================
 * RPG 게임 규칙 & 도움말 시스템
 * ============================================
 * 
 * 사용법:
 * 1. HTML에서 이 파일을 로드: <script src="gamerule.js"></script>
 * 2. 버튼 클릭 시 showGameRule() 함수 호출
 * 
 * 예시:
 * <button onclick="showGameRule()">도움말</button>
 */

// ============================================
// 📝 게임 설명 내용 (여기를 수정하세요!)
// ============================================

const gameRuleData = {
    // 게임 제목
    gameTitle: "RPG 어드벤처",

    // 게임 소개
    introduction: `
        이 게임은 턴제 RPG 게임입니다.
        플레이어는 용사가 되어 다양한 몬스터를 처치하고,
        최종 보스인 고룡왕을 물리쳐 세계를 구해야 합니다.
    `,

    // 게임 규칙 섹션들
    sections: [
        {
            icon: "⚔️",
            title: "전투 시스템",
            content: `
                <ul>
                    <li><strong>공격</strong>: 기본 공격으로 적에게 데미지를 줍니다.</li>
                    <li><strong>스킬</strong>: MP를 소모하여 강력한 공격을 합니다. (공격력 x2)</li>
                    <li><strong>방어</strong>: 방어 태세를 취해 받는 데미지를 줄입니다. (방어력 x2)</li>
                    <li><strong>아이템</strong>: 포션 등의 아이템을 사용합니다.</li>
                </ul>
            `
        },
        {
            icon: "📊",
            title: "스탯 설명",
            content: `
                <ul>
                    <li><strong>HP (체력)</strong>: 0이 되면 게임 오버됩니다.</li>
                    <li><strong>MP (마나)</strong>: 스킬 사용에 필요한 자원입니다.</li>
                    <li><strong>ATK (공격력)</strong>: 적에게 주는 데미지에 영향을 줍니다.</li>
                    <li><strong>DEF (방어력)</strong>: 받는 데미지를 감소시킵니다.</li>
                </ul>
            `
        },
        {
            icon: "👹",
            title: "몬스터 종류",
            content: `
                <table>
                    <tr><td>🎯 훈련장</td><td>허수아비, 튼튼한허수아비, 거대허수아비</td></tr>
                    <tr><td>🐭 쥐 계열</td><td>생쥐 → 시궁쥐 → 거대쥐 → 쥐왕</td></tr>
                    <tr><td>👺 고블린 계열</td><td>고블린 → 홉고블린 → 고블린전사 → 고블린왕</td></tr>
                    <tr><td>🧌 오크 계열</td><td>오크 → 빨간오크 → 오크전사 → 오크왕</td></tr>
                    <tr><td>👹 오우거 계열</td><td>오우거 → 거대오우거 → 오우거전사 → 오우거왕</td></tr>
                    <tr><td>🐉 드래곤 계열</td><td>어린드래곤 → 드래곤 → 고룡 → 고룡왕</td></tr>
                </table>
            `
        },
        {
            icon: "🎮",
            title: "게임 진행",
            content: `
                <ol>
                    <li>게임 시작 시 캐릭터 이름을 입력합니다.</li>
                    <li>스탯이 랜덤으로 부여됩니다.</li>
                    <li>스테이지별로 몬스터와 전투합니다.</li>
                    <li>전투에서 승리하면 경험치와 골드를 획득합니다.</li>
                    <li>모든 스테이지를 클리어하면 게임 클리어!</li>
                </ol>
            `
        },
        {
            icon: "💡",
            title: "공략 팁",
            content: `
                <ul>
                    <li>MP는 보스전을 위해 아껴두세요.</li>
                    <li>적의 공격이 강할 때는 방어를 활용하세요.</li>
                    <li>HP가 낮을 때는 아이템을 사용하세요.</li>
                    <li>스킬은 MP를 많이 소모하지만 데미지가 2배입니다.</li>
                </ul>
            `
        }
    ],

    // 조작법
    controls: {
        keyboard: [
            { key: "1", action: "공격" },
            { key: "2", action: "스킬" },
            { key: "3", action: "방어" },
            { key: "4", action: "아이템" },
            { key: "ESC", action: "메뉴/닫기" }
        ]
    }
};

// ============================================
// 🎨 스타일 (CSS)
// ============================================

const gameRuleStyles = `
    /* 오버레이 배경 */
    .game-rule-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .game-rule-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    /* 모달 컨테이너 */
    .game-rule-modal {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 3px solid #e94560;
        border-radius: 20px;
        width: 90%;
        max-width: 800px;
        max-height: 85vh;
        overflow: hidden;
        box-shadow: 
            0 0 50px rgba(233, 69, 96, 0.3),
            0 20px 60px rgba(0, 0, 0, 0.5);
        transform: scale(0.8) translateY(50px);
        transition: transform 0.3s ease;
    }

    .game-rule-overlay.active .game-rule-modal {
        transform: scale(1) translateY(0);
    }

    /* 헤더 */
    .game-rule-header {
        background: linear-gradient(135deg, #e94560 0%, #c73659 100%);
        padding: 25px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .game-rule-title {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .game-rule-title-icon {
        font-size: 32px;
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    .game-rule-title h1 {
        margin: 0;
        color: #fff;
        font-size: 28px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .game-rule-title p {
        margin: 5px 0 0 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
    }

    /* 닫기 버튼 */
    .game-rule-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .game-rule-close:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: rotate(90deg);
    }

    /* 컨텐츠 영역 */
    .game-rule-content {
        padding: 30px;
        max-height: 60vh;
        overflow-y: auto;
        color: #fff;
    }

    .game-rule-content::-webkit-scrollbar {
        width: 8px;
    }

    .game-rule-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .game-rule-content::-webkit-scrollbar-thumb {
        background: #e94560;
        border-radius: 4px;
    }

    /* 소개 섹션 */
    .game-rule-intro {
        background: rgba(233, 69, 96, 0.1);
        border-left: 4px solid #e94560;
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 0 10px 10px 0;
        font-size: 16px;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.9);
    }

    /* 섹션 카드 */
    .game-rule-section {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        margin-bottom: 20px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
    }

    .game-rule-section:hover {
        border-color: rgba(233, 69, 96, 0.5);
        transform: translateX(5px);
    }

    .game-rule-section-header {
        background: rgba(233, 69, 96, 0.2);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
    }

    .game-rule-section-icon {
        font-size: 24px;
    }

    .game-rule-section-title {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
    }

    .game-rule-section-body {
        padding: 20px;
        line-height: 1.8;
    }

    /* 리스트 스타일 */
    .game-rule-section-body ul,
    .game-rule-section-body ol {
        margin: 0;
        padding-left: 20px;
    }

    .game-rule-section-body li {
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.85);
    }

    .game-rule-section-body strong {
        color: #e94560;
    }

    /* 테이블 스타일 */
    .game-rule-section-body table {
        width: 100%;
        border-collapse: collapse;
    }

    .game-rule-section-body table td {
        padding: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.85);
    }

    .game-rule-section-body table td:first-child {
        width: 120px;
        font-weight: bold;
        color: #e94560;
    }

    /* 조작법 섹션 */
    .game-rule-controls {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 15px;
        padding: 20px;
        margin-top: 20px;
    }

    .game-rule-controls h3 {
        margin: 0 0 15px 0;
        color: #e94560;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .game-rule-controls-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
    }

    .game-rule-key {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .game-rule-key kbd {
        background: linear-gradient(135deg, #333 0%, #222 100%);
        border: 2px solid #555;
        border-radius: 8px;
        padding: 8px 15px;
        font-family: monospace;
        font-size: 14px;
        color: #fff;
        box-shadow: 0 3px 0 #111;
        min-width: 50px;
        text-align: center;
    }

    .game-rule-key span {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
    }

    /* 푸터 */
    .game-rule-footer {
        background: rgba(0, 0, 0, 0.3);
        padding: 15px 30px;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* 반응형 */
    @media (max-width: 600px) {
        .game-rule-modal {
            width: 95%;
            max-height: 90vh;
        }

        .game-rule-header {
            padding: 20px;
        }

        .game-rule-title h1 {
            font-size: 22px;
        }

        .game-rule-content {
            padding: 20px;
        }

        .game-rule-controls-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
`;

// ============================================
// 🔧 기능 함수들
// ============================================

// 스타일 주입 (최초 1회만)
let styleInjected = false;
function injectStyles() {
    if (styleInjected) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'game-rule-styles';
    styleElement.textContent = gameRuleStyles;
    document.head.appendChild(styleElement);
    styleInjected = true;
}

// 게임 규칙 모달 생성
function createGameRuleModal() {
    // 이미 존재하면 제거
    const existing = document.getElementById('gameRuleOverlay');
    if (existing) existing.remove();

    // 섹션 HTML 생성
    const sectionsHTML = gameRuleData.sections.map(section => `
        <div class="game-rule-section">
            <div class="game-rule-section-header">
                <span class="game-rule-section-icon">${section.icon}</span>
                <h3 class="game-rule-section-title">${section.title}</h3>
            </div>
            <div class="game-rule-section-body">
                ${section.content}
            </div>
        </div>
    `).join('');

    // 조작법 HTML 생성
    const controlsHTML = gameRuleData.controls.keyboard.map(ctrl => `
        <div class="game-rule-key">
            <kbd>${ctrl.key}</kbd>
            <span>${ctrl.action}</span>
        </div>
    `).join('');

    // 전체 모달 HTML
    const modalHTML = `
        <div class="game-rule-overlay" id="gameRuleOverlay" onclick="closeGameRuleOnOverlay(event)">
            <div class="game-rule-modal">
                <!-- 헤더 -->
                <div class="game-rule-header">
                    <div class="game-rule-title">
                        <span class="game-rule-title-icon">📖</span>
                        <div>
                            <h1>${gameRuleData.gameTitle}</h1>
                            <p>게임 규칙 & 도움말</p>
                        </div>
                    </div>
                    <button class="game-rule-close" onclick="hideGameRule()">✕</button>
                </div>

                <!-- 컨텐츠 -->
                <div class="game-rule-content">
                    <!-- 소개 -->
                    <div class="game-rule-intro">
                        ${gameRuleData.introduction}
                    </div>

                    <!-- 섹션들 -->
                    ${sectionsHTML}

                    <!-- 조작법 -->
                    <div class="game-rule-controls">
                        <h3>🎮 조작법</h3>
                        <div class="game-rule-controls-grid">
                            ${controlsHTML}
                        </div>
                    </div>
                </div>

                <!-- 푸터 -->
                <div class="game-rule-footer">
                    ESC 키를 누르거나 바깥을 클릭하면 닫힙니다
                </div>
            </div>
        </div>
    `;

    // DOM에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ============================================
// 📢 외부에서 사용할 함수들
// ============================================

/**
 * 게임 규칙 모달을 표시합니다.
 * 버튼에서 호출: onclick="showGameRule()"
 */
function showGameRule() {
    injectStyles();
    createGameRuleModal();

    // 약간의 딜레이 후 활성화 (애니메이션을 위해)
    setTimeout(() => {
        document.getElementById('gameRuleOverlay').classList.add('active');
    }, 10);

    // ESC 키 이벤트 추가
    document.addEventListener('keydown', handleEscKey);
}

/**
 * 게임 규칙 모달을 닫습니다.
 */
function hideGameRule() {
    const overlay = document.getElementById('gameRuleOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }

    // ESC 키 이벤트 제거
    document.removeEventListener('keydown', handleEscKey);
}

/**
 * 오버레이 클릭 시 모달 닫기
 */
function closeGameRuleOnOverlay(event) {
    if (event.target.id === 'gameRuleOverlay') {
        hideGameRule();
    }
}

/**
 * ESC 키 핸들러
 */
function handleEscKey(event) {
    if (event.key === 'Escape') {
        hideGameRule();
    }
}

// ============================================
// 🔗 HTML에서 사용 예시
// ============================================
/*
    <!-- HTML에서 사용하는 방법 -->
    
    <!-- 1. 스크립트 로드 (body 끝에) -->
    <script src="gamerule.js"></script>
    
    <!-- 2. 도움말 버튼 예시 -->
    <button onclick="showGameRule()" style="
        background: linear-gradient(135deg, #e94560, #c73659);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    ">
        📖 도움말
    </button>
    
    <!-- 또는 간단하게 -->
    <button onclick="showGameRule()">❓ 도움말</button>
*/
