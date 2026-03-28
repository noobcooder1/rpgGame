"""
============================================================
  체커보드 배경 완전 제거 도구 (초강력 8-way Flood Fill 버전)
  - 밝은 배경 / 어두운 배경 모두 자동 감지
  - 대각선으로 이어진 체커보드 패턴도 완벽히 인식하여 제거
  - 사용법: python3 remove_bg.py [파일1.png] [파일2.png] ...
  - 인자 없이 실행하면 현재 폴더의 모든 PNG 중 처리합니다.
============================================================
"""

import math, sys, os, glob
from PIL import Image

def detect_bg_colors(img, border_px=10, sample_step=2):
    """이미지 외곽부 최상단/최하단/좌우에서 배경 색상을 샘플링합니다."""
    w, h = img.size
    pixels = img.load()
    
    candidates = []
    # 4면 모서리 샘플링
    for x in range(0, w, sample_step):
        for y in range(0, border_px):
            if pixels[x, y][3] > 0: candidates.append(pixels[x, y][:3])
        for y in range(h - border_px, h):
            if pixels[x, y][3] > 0: candidates.append(pixels[x, y][:3])
            
    for y in range(border_px, h - border_px, sample_step):
        for x in range(0, border_px):
            if pixels[x, y][3] > 0: candidates.append(pixels[x, y][:3])
        for x in range(w - border_px, w):
            if pixels[x, y][3] > 0: candidates.append(pixels[x, y][:3])

    if not candidates:
        return [(0,0,0), (255,255,255)]  # fallback

    # 밝기 순 정렬 후 K-means 느낌으로 두 그룹 분할
    candidates.sort(key=lambda c: sum(c))
    
    # 상위 20%, 하위 20%의 평균을 구해서 체커보드 두 가지 색으로 간주
    n = len(candidates)
    if n < 10:
        return [candidates[0], candidates[-1]]
        
    def avg(lst):
        return tuple(round(sum(c[i] for c in lst)/len(lst)) for i in range(3))
        
    lower = candidates[:n//4]
    upper = candidates[3*n//4:]
    return [avg(lower), avg(upper)]


def remove_checkerboard(img_path, out_path=None, tolerance=45):
    """8방향 Flood Fill을 사용하여 체커보드 배경을 투명 처리합니다."""
    if out_path is None:
        out_path = img_path  

    img = Image.open(img_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()

    bg_colors = detect_bg_colors(img, border_px=15)
    print(f"  [{os.path.basename(img_path)}] 자동 감지된 배경 테마: {bg_colors}")

    def is_bg(c):
        if c[3] == 0: return True
        return any(math.dist(c[:3], bg) < tolerance for bg in bg_colors)

    visited = [[False]*h for _ in range(w)]
    queue = []

    # 1. 외곽(Border)에서 배경 픽셀 찾기
    for x in range(w):
        for y in [0, h-1]:
            if not visited[x][y] and is_bg(pixels[x,y]):
                visited[x][y] = True
                pixels[x,y] = (0, 0, 0, 0)
                queue.append((x, y))
                
    for y in range(1, h-1):
        for x in [0, w-1]:
            if not visited[x][y] and is_bg(pixels[x,y]):
                visited[x][y] = True
                pixels[x,y] = (0, 0, 0, 0)
                queue.append((x, y))

    # 2. 8-Way Flood Fill 실행
    head = 0
    # 8방향 좌표 오프셋 (체커보드는 대각선으로 연결되므로 8방향 탐색 필수)
    dirs = [(1,0), (-1,0), (0,1), (0,-1), (1,1), (1,-1), (-1,1), (-1,-1)]
    
    while head < len(queue):
        x, y = queue[head]
        head += 1
        
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                # 픽셀 검사
                if is_bg(pixels[nx, ny]):
                    visited[nx][ny] = True
                    pixels[nx, ny] = (0, 0, 0, 0)
                    queue.append((nx, ny))

    removed = len(queue)
    if removed > 0:
        img.save(out_path)
    print(f"  ✅ 저장 완료: {removed:,}개 배경 픽셀 제거 (Tolerance: {tolerance})")
    return removed


if __name__ == "__main__":
    targets = []
    tolerance = 23  # (기존 48 -> 20) -> 이거 조정하면 지워지는 정도 조정가능!

    for arg in sys.argv[1:]:
        if arg.startswith("--tol="):
            tolerance = int(arg.split("=")[1])
        else:
            targets.append(arg)

    if not targets:
        targets = sorted(glob.glob("*.png"))

    if not targets:
        print("처리할 PNG 파일이 없습니다.")
        sys.exit(0)

    print("=" * 60)
    print(f"체커보드 배경 완벽 제거 도구 (8-way Flood Fill) | 대상 파일: {len(targets)}개 | Tolerance: {tolerance}")
    print("=" * 60)

    for path in targets:
        if not os.path.exists(path):
            continue
        try:
            # 원본을 보호하기 위해 파일명 앞에 'fixed_'를 붙여서 저장할 수 있도록 권장하는 것도 좋으나 
            # 기존 플로우 유지를 위해 원본 덮어쓰기 유지 (필요에 따라 out_path 변경)
            remove_checkerboard(path, path, tolerance=tolerance)
        except Exception as e:
            print(f"  [오류] {path}: {e}")

    print("\n모든 작업 완료!")
