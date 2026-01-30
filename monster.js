//몬스터 관련 변수와 배열
let m_hp, m_mp, m_atk, m_def;
let training_name = ["허수아비", "튼튼한허수아비", "거대허수아비"];
let mouse_name = ["생쥐", "시궁쥐", "거대쥐", "쥐왕"];
let goblin_name = ["고블린", "홉고블린", "고블린전사", "고블린왕"];
let orc_name = ["오크", "빨간오크", "오크전사", "오크왕"];
let ogre_name = ["오우거", "거대오우거", "오우거전사", "오우거왕"];
let dragon_name = ["어린드래곤", "드래곤", "고룡", "고룡왕"];

//몬스터 랜덤 스탯 설정 -> 객체로 반환.
function m_randomStatus() {
    return {
        hp: Math.floor(Math.random() * 21) + 200,
        mp: Math.floor(Math.random() * 11) + 40,
        atk: Math.floor(Math.random() * 3) + 8,
        def: Math.floor(Math.random() * 3) + 8,
    };
}

//몬스터 관련 클래스
class Monster {
    constructor(name, hp, mp, atk, def) {
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.atk = atk;
        this.def = def;
    }

    attack() {
        return this.atk;
    }

    skill() {
        return this.atk * 2;
    }

    defense() {
        return this.def * 2;
    }
}

// 현재 몬스터 변수 (나중에 전투 시 생성됨)
let monster = null;

// 몬스터 이름 배열 모음
const monsterNames = {
    training: training_name,
    mouse: mouse_name,
    goblin: goblin_name,
    orc: orc_name,
    ogre: ogre_name,
    dragon: dragon_name
};

// 몬스터 생성 함수
function createMonster(type, difficulty = 0) {
    const names = monsterNames[type];
    if (!names) {
        console.error('알 수 없는 몬스터 타입:', type);
        return null;
    }

    // difficulty: 0~3 (해당 타입의 몇 번째 몬스터인지)
    const index = Math.min(difficulty, names.length - 1);
    const monsterName = names[index];
    const stats = m_randomStatus();

    // 난이도에 따라 스탯 보정
    const multiplier = 1 + (difficulty * 0.3);

    monster = new Monster(
        monsterName,
        Math.floor(stats.hp * multiplier),
        Math.floor(stats.mp * multiplier),
        Math.floor(stats.atk * multiplier),
        Math.floor(stats.def * multiplier)
    );

    console.log('🐲 몬스터 생성:', monster);
    return monster;
}

// 랜덤 몬스터 선택
function createRandomMonster(type) {
    const names = monsterNames[type];
    if (!names) return null;

    const randomIndex = Math.floor(Math.random() * names.length);
    return createMonster(type, randomIndex);
}

console.log('👹 monster.js 로드 완료!');