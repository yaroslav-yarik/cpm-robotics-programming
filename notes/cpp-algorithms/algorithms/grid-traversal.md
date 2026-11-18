# Обходы клеточной карты

[Оглавление](../README.md) · Базовые алгоритмы

Точки — свободные клетки, # — стены. За ход можно перейти на одну из четырёх соседних клеток через общую сторону. Перед чтением клетки проверяем её координаты. Входом в функции служат существующие свободные стартовая и, где нужна, конечная клетки.

```text
..S
.##
..F
```

Функция `grid_neighbors` находит свободных соседей и используется в обоих обходах ниже.

**Python**

```python
def grid_neighbors(grid, row, col):
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        r, c = row + dr, col + dc
        if 0 <= r < len(grid) and 0 <= c < len(grid[r]) and grid[r][c] != "#":
            yield r, c
```

**C++17**

```cpp
#include <string>
#include <utility>
#include <vector>

using Grid = std::vector<std::string>;
using Cell = std::pair<int, int>;

std::vector<Cell> grid_neighbors(const Grid& grid, Cell cell) {
    std::vector<Cell> neighbors;
    const Cell shifts[] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    for (auto [dr, dc] : shifts) {
        auto [row, col] = cell;
        int r = row + dr, c = col + dc;
        if (r >= 0 && r < static_cast<int>(grid.size()) &&
            c >= 0 && c < static_cast<int>(grid[r].size()) && grid[r][c] != '#') {
            neighbors.emplace_back(r, c);
        }
    }
    return neighbors;
}
```

## Поиск в ширину

**grid_bfs** хранит очередь, сначала туда попадает S с расстоянием 0. При извлечении клетки со значением d впервые встреченные соседи получают d + 1. Отмечаем клетку при добавлении в очередь: тогда она окажется там только один раз. Очередь обрабатывает клетки по неубыванию расстояния. Поэтому первое расстояние до F минимально для ходов одинаковой стоимости. На карте выше ответ 6. При недостижимости функция возвращает −1. Для пути понадобилось бы также сохранять родителя каждой клетки.

Этот фрагмент использует `grid_neighbors` из предыдущего блока.

**Python**

```python
from collections import deque


def grid_bfs(grid, start, goal):
    """start and goal exist and are open."""
    queue = deque([start])
    distance = {start: 0}
    while queue:
        cell = queue.popleft()
        if cell == goal:
            return distance[cell]
        row, col = cell
        for next_cell in grid_neighbors(grid, row, col):
            if next_cell not in distance:
                distance[next_cell] = distance[cell] + 1
                queue.append(next_cell)
    return -1
```

**C++17**

```cpp
#include <queue>

int grid_bfs(const Grid& grid, Cell start, Cell goal) {
    std::vector<std::vector<int>> distance;
    for (const auto& row : grid) distance.emplace_back(row.size(), -1);
    std::queue<Cell> queue;
    queue.push(start);
    distance[start.first][start.second] = 0;
    while (!queue.empty()) {
        auto cell = queue.front();
        queue.pop();
        int steps = distance[cell.first][cell.second];
        if (cell == goal) return steps;
        for (auto [row, col] : grid_neighbors(grid, cell)) {
            if (distance[row][col] == -1) {
                distance[row][col] = steps + 1;
                queue.emplace(row, col);
            }
        }
    }
    return -1;
}
```

## Поиск в глубину

**grid_dfs_size** использует стек: последняя добавленная клетка обрабатывается первой. Для подсчёта достижимых клеток порядок неважен, и стек без рекурсивных вызовов подходит даже для длинного коридора. Из S достижимы 7 клеток. Размер компоненты определяется множеством отмеченных клеток. Для кратчайшего пути на этой карте достаточно BFS; первое посещение в DFS может идти длинным обходом.

Оба обхода проверяют не более четырёх соседей на клетку. На прямоугольной карте время и память O(hw). В Python для BFS подойдёт collections.deque с popleft. Удаление первого элемента обычного списка с pop(0) сдвигает все оставшиеся элементы и ухудшает сложность.

Здесь также используется `grid_neighbors`. Стек хранит клетки, которые осталось обработать.

**Python**

```python
def grid_dfs_size(grid, start):
    """start exists and is open."""
    stack = [start]
    seen = {start}
    while stack:
        row, col = stack.pop()
        for next_cell in grid_neighbors(grid, row, col):
            if next_cell not in seen:
                seen.add(next_cell)
                stack.append(next_cell)
    return len(seen)
```

**C++17**

```cpp
int grid_dfs_size(const Grid& grid, Cell start) {
    std::vector<std::vector<bool>> seen;
    for (const auto& row : grid) seen.emplace_back(row.size(), false);
    std::vector<Cell> stack{start};
    seen[start.first][start.second] = true;
    int count = 0;
    while (!stack.empty()) {
        auto cell = stack.back();
        stack.pop_back();
        ++count;
        for (auto [row, col] : grid_neighbors(grid, cell)) {
            if (!seen[row][col]) {
                seen[row][col] = true;
                stack.emplace_back(row, col);
            }
        }
    }
    return count;
}
```

---

[← Частоты](frequencies.md) · [→ Рекурсия и динамическое программирование](recursion-and-dp.md)
