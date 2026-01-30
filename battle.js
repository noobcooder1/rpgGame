//전투와 남은 체력검사
function fight() {
    while (true) {
        if (player.hp <= 0) {
            alert("플레이어가 쓰러졌습니다.");
            break;
        }
        else if (monster.hp <= 0) {
            alert("몬스터가 쓰러졌습니다.");
            battleReward();
            break;
        }
    }

}


function battleReward() {
    document.getElementById("result").innerHTML = "전투에서 승리했습니다." + ` 획득한 골드 ${gold} <br>
    획득한 경험치 ${exp}`;
}