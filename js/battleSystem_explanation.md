# Battle System 상세 설명

이 문서는 `battleSystem.js` 파일의 주요 개념과 작동 원리를 초보자도 이해할 수 있도록 설명합니다. 공통된 개념은 한 번만 설명하며, 주요 코드 블록에 대한 상세한 설명을 제공합니다.

---

## 1. 전투 상태 관리

`battleState` 객체는 전투의 현재 상태를 저장합니다. 주요 속성은 다음과 같습니다:

- `inBattle`: 현재 전투 중인지 여부를 나타냅니다.
- `turn`: 현재 턴의 주체를 나타냅니다. (`'player'` 또는 `'monster'`)
- `currentMonster`: 현재 타겟이 되는 몬스터 객체입니다.
- `monsters`: 전투에 참여 중인 모든 몬스터의 배열입니다.
- `isDefending`: 플레이어가 방어 상태인지 여부를 나타냅니다.
- `turnCount`: 현재 전투의 턴 수를 나타냅니다.

```javascript
let battleState = {
    inBattle: false,
    turn: 'player',
    currentMonster: null,
    monsters: [],
    isDefending: false,
    canEscape: true,
    turnCount: 0,
    playerStatusEffects: [],
    monsterStatusEffects: {}
};
```

### 작동 원리
- 전투가 시작되면 `startBattle` 함수가 호출되어 `battleState`를 초기화합니다.
- 턴이 진행될 때마다 `turn` 속성이 변경됩니다.
- 전투 종료 시 `endBattle` 함수가 호출되어 상태를 초기화합니다.

---

## 2. 전투 시작 (`startBattle` 함수)

이 함수는 전투를 초기화하고 몬스터를 생성합니다.

### 주요 코드
```javascript
function startBattle(monsterTypes) {
    console.log('🎮 startBattle 호출:', monsterTypes);

    if (battleState.inBattle) {
        console.log('이미 전투 중입니다!');
        return;
    }

    const monsterTypeArray = Array.isArray(monsterTypes) ? monsterTypes : [monsterTypes];
    const MAX_MONSTERS = 10;
    const monsters = [];

    for (const monsterType of monsterTypeArray) {
        if (monsters.length >= MAX_MONSTERS) break;
        const monster = createBattleMonster(monsterType);
        if (monster) monsters.push(monster);
    }

    battleState = {
        inBattle: true,
        turn: 'player',
        monsters: monsters,
        currentMonster: monsters[0],
        turnCount: 1
    };

    showBattleUI();
    updateBattleUI();
}
```

### 작동 원리
1. `monsterTypes` 매개변수로 전달된 몬스터 타입을 기반으로 몬스터를 생성합니다.
2. 최대 10마리의 몬스터를 생성하며, 각 몬스터는 `createBattleMonster` 함수로 생성됩니다.
3. `battleState`를 초기화하고 전투 UI를 표시합니다.

---

## 3. 몬스터 생성 (`createBattleMonster` 함수)

이 함수는 전투에 사용할 몬스터 객체를 생성합니다.

### 주요 코드
```javascript
function createBattleMonster(monsterType) {
    let template = MONSTERS[monsterType] || {
        name: '알 수 없는 몬스터',
        hp: 50, atk: 10, def: 5, exp: 20, gold: 10
    };

    const grade = rollMonsterGrade();
    const gradeData = MONSTER_GRADE[grade];

    return {
        ...template,
        grade: grade,
        hp: Math.ceil(template.hp * gradeData.hpMultiplier),
        atk: Math.ceil(template.atk * gradeData.atkMultiplier)
    };
}
```

### 작동 원리
1. `MONSTERS` 데이터에서 몬스터 템플릿을 가져옵니다.
2. `rollMonsterGrade` 함수로 몬스터의 등급을 결정합니다.
3. 등급에 따라 체력과 공격력을 조정합니다.

---

## 4. 특성 확률 처리 (`possibleTraits`)

특정 몬스터는 확률적으로 특성을 가질 수 있습니다. 아래 코드는 이를 처리하는 부분입니다:

```javascript
const activeTraits = [];
if (template.possibleTraits && Array.isArray(template.possibleTraits)) {
    template.possibleTraits.forEach(traitDef => {
        const roll = Math.random();
        if (roll < traitDef.chance) {
            activeTraits.push({ id: traitDef.id, level: traitDef.level || 1 });
        }
    });
}
```

### 작동 원리
1. `possibleTraits` 배열에 정의된 각 특성에 대해 랜덤 값을 생성합니다.
2. 랜덤 값이 `traitDef.chance`보다 작으면 해당 특성을 활성화합니다.
3. 활성화된 특성은 `activeTraits` 배열에 저장됩니다.

---

## 5. 전투 종료 (`endBattle` 함수)

이 함수는 전투 결과에 따라 보상을 지급하거나 패배 처리를 합니다.

### 주요 코드
```javascript
function endBattle(result) {
    console.log('🏁 endBattle 호출:', result);

    switch (result) {
        case 'victory':
            console.log('승리 처리');
            break;
        case 'defeat':
            console.log('패배 처리');
            break;
        case 'escape':
            console.log('도주 처리');
            break;
    }

    battleState = {
        inBattle: false,
        turn: 'player',
        currentMonster: null
    };

    hideBattleUI();
}
```

### 작동 원리
1. `result` 값에 따라 승리, 패배, 도주를 처리합니다.
2. 전투 상태를 초기화하고 UI를 업데이트합니다.

---

## 6. 상태이상 처리 (`applyStatusEffect` 함수)

몬스터나 플레이어에게 상태이상을 적용합니다.

### 주요 코드
```javascript
function applyStatusEffect(target, effectId, duration) {
    const effect = STATUS_EFFECTS[effectId];
    if (!effect) return;

    target.statusEffects = target.statusEffects || {};
    target.statusEffects[effectId] = { duration: duration };

    console.log(`${effect.name} 상태이상 적용: ${duration}턴`);
}
```

### 작동 원리
1. `STATUS_EFFECTS` 데이터에서 상태이상 정보를 가져옵니다.
2. 대상 객체에 상태이상을 추가합니다.
3. 상태이상 지속시간을 관리합니다.

---

## 7. 전투 UI 업데이트 (`updateBattleUI` 함수)

이 함수는 전투 화면의 UI를 갱신합니다.

### 주요 코드
```javascript
function updateBattleUI() {
    const monsters = battleState.monsters || [];
    const container = document.getElementById('monstersContainer');

    container.innerHTML = '';
    monsters.forEach(monster => {
        const monsterCard = document.createElement('div');
        monsterCard.textContent = `${monster.name} (${monster.hp}/${monster.maxHp})`;
        container.appendChild(monsterCard);
    });
}
```

### 작동 원리
1. `battleState.monsters` 배열을 순회하며 각 몬스터의 상태를 표시합니다.
2. HTML 요소를 동적으로 생성하여 UI를 갱신합니다.

---

이 외에도 다양한 함수와 시스템이 존재하며, 필요에 따라 추가 설명을 작성할 수 있습니다.