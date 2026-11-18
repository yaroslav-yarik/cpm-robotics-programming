# Клеточные карты и изображения

[Оглавление](../README.md) · Прикладные алгоритмы

## Поза и направление

В координатах изображения строка растёт вниз, столбец вправо. Удобно занумеровать направления в порядке север, восток, юг, запад. Поворот направо тогда увеличивает номер на 1 по модулю 4. Направление и координаты вместе образуют позу. Для перемещения на заданное число клеток прибавь произведение сдвига на вектор направления.

**Python**

```python
def move(row, col, direction, steps):
    offsets = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    dr, dc = offsets[direction]
    return row + steps * dr, col + steps * dc
```

**C++**

```cpp
#include <utility>

std::pair<long long, long long> move(long long row, long long col,
                                     int direction, long long steps) {
    const int dr[] = {-1, 0, 1, 0};
    const int dc[] = {0, 1, 0, -1};
    return {row + steps * dr[direction], col + steps * dc[direction]};
}
```

Предполагается направление от 0 до 3. Например, движение из `(3, 2)` на две клетки на север заканчивается в `(1, 2)`. Формула описывает перемещение по свободной плоскости. Если есть стены, проверь допустимость каждой промежуточной позиции или вычисли расстояние до препятствия перед решением о перемещении.

## Рамка группы клеток

Когда обход в ширину или глубину нашёл компоненту, по её клеткам можно вычислить минимальный прямоугольник, который полностью её содержит. Достаточно хранить четыре числа: минимальную и максимальную строку, минимальный и максимальный столбец. Ниже указаны **включённые** границы, поэтому площадь использует разность плюс один. Список клеток непуст.

**Python**

```python
def bounding_box(cells):
    top = bottom = cells[0][0]
    left = right = cells[0][1]
    for row, col in cells:
        top = min(top, row)
        bottom = max(bottom, row)
        left = min(left, col)
        right = max(right, col)
    return top, left, bottom, right
```

**C++**

```cpp
#include <algorithm>
#include <array>
#include <utility>
#include <vector>

std::array<int, 4> bounding_box(const std::vector<std::pair<int, int>>& cells) {
    int top = cells.front().first;
    int bottom = top;
    int left = cells.front().second;
    int right = left;
    for (auto [row, col] : cells) {
        top = std::min(top, row);
        bottom = std::max(bottom, row);
        left = std::min(left, col);
        right = std::max(right, col);
    }
    return {top, left, bottom, right};
}
```

Для клеток `(1, 1)`, `(1, 2)`, `(2, 1)` рамка имеет границы `(1, 1, 2, 2)`. Площадь 4, а клеток 3. Если список не содержит повторов, равенство площади рамки и числа клеток означает, что рамка заполнена целиком. Рамку можно обновлять прямо в ходе обхода компоненты, если потом не требуется хранить сами клетки.

## Независимые наблюдения

Состояние клетки может учитывать сразу несколько источников. Например, если один датчик обнаруживает синий цвет, а другой жёлтый, по одному биту на каждый цвет сохраняет оба свидетельства. Операция ИЛИ добавляет признак, повтор не меняет результат, а порядок наблюдений не влияет на итог.

**Python**

```python
def record_color(grid, row, col, color):
    grid[row][col] |= 1 << color
```

**C++**

```cpp
#include <cstdint>
#include <vector>

void record_color(std::vector<std::vector<std::uint32_t>>& grid,
                  int row, int col, unsigned color) {
    grid[row][col] |= std::uint32_t{1} << color;
}
```

Координаты должны быть допустимыми, номер цвета в C++ лежит в диапазоне от 0 до 31. Если клетки приходят от лучевого датчика, перечисли клетки вдоль известного луча и для каждой запиши соответствующее свидетельство. Что значит последний отсчёт и могут ли наблюдения противоречить друг другу, зависит от модели датчика. Приведённая функция хранит факт наблюдения. Когда нужно число наблюдений, требуются счётчики.

## Поворот и голоса за относительный сдвиг

Поворот квадрата со стороной `n` на 90° по часовой стрелке переводит клетку `(row, col)` в `(col, n - 1 - row)`. Для совмещения двух наборов точек при фиксированном повороте сравни координаты. Если точка `(br, bc)` второго набора должна перейти в `(ar, ac)` первого, возможен ровно один сдвиг `(ar - br, ac - bc)`. Посчитай, сколько пар голосуют за каждый сдвиг. При уникальных точках число голосов равно числу совпадений для этого сдвига.

**Python**

```python
from collections import Counter

def rotate_point(row, col, n):
    return col, n - 1 - row

def shift_votes(first, second):
    votes = Counter()
    for ar, ac in first:
        for br, bc in second:
            votes[ar - br, ac - bc] += 1
    return votes
```

**C++**

```cpp
#include <map>
#include <utility>
#include <vector>

using Point = std::pair<int, int>;

Point rotate_point(int row, int col, int n) {
    return {col, n - 1 - row};
}

std::map<Point, long long> shift_votes(const std::vector<Point>& first,
                                      const std::vector<Point>& second) {
    std::map<Point, long long> votes;
    for (auto [ar, ac] : first) {
        for (auto [br, bc] : second) {
            ++votes[{ar - br, ac - bc}];
        }
    }
    return votes;
}
```

Оба фрагмента возвращают голоса для сдвигов с хотя бы одним совпадением. Если пустые маски или сдвиги с нулём совпадений важны, учти их отдельно. Метод перебирает `a · b` пар для наборов размеров `a` и `b`. Каждое добавление в `Counter` в среднем занимает постоянное время, а в `std::map` зависит логарифмически от числа разных сдвигов. Память пропорциональна числу разных сдвигов.

## Предвычисление расстояния до преграды

Если на прямоугольной карте много запросов «сколько свободных клеток подряд справа», можно заполнить таблицу одним проходом. Для свободной клетки ответ равен 1 плюс ответ её правого соседа, если сосед тоже свободен. Если справа стена или край, ответ 0. Поэтому обходи строку справа налево. В примере свободная клетка обозначена точкой, стена — решёткой.

**Python**

```python
def free_to_right(grid):
    result = []
    for row in grid:
        distances = [0] * len(row)
        for col in range(len(row) - 2, -1, -1):
            if row[col] == row[col + 1] == ".":
                distances[col] = 1 + distances[col + 1]
        result.append(distances)
    return result
```

**C++**

```cpp
#include <cstddef>
#include <string>
#include <vector>

std::vector<std::vector<std::size_t>>
free_to_right(const std::vector<std::string>& grid) {
    std::vector<std::vector<std::size_t>> result;
    for (const auto& row : grid) {
        std::vector<std::size_t> distances(row.size(), 0);
        for (std::size_t next = row.size(); next > 1; --next) {
            const std::size_t col = next - 2;
            if (row[col] == '.' && row[col + 1] == '.') {
                distances[col] = 1 + distances[col + 1];
            }
        }
        result.push_back(distances);
    }
    return result;
}
```

Для строки `...#..` таблица равна `[2, 1, 0, 0, 1, 0]`. Нули на стенах служебные, запрос относится к свободной клетке. Для остальных направлений меняй ось и порядок обхода так, чтобы сосед был уже обработан. Предвычисление для карты `h × w` занимает `O(h · w)` времени и памяти, затем один запрос выполняется за `O(1)`.

Таблица пригодится и при сопоставлении показаний с картой. Когда известна карта, а начальная поза неизвестна, перебери допустимые позы. Для каждой поддерживай текущую позу и сверяй предвычисленное показание в момент, когда по журналу был сделан замер. Первое несовпадение исключает начальную позу. Если хранишь найденные варианты, записывай начальную позу отдельно от текущей.

---

[← Обработка сигналов](signals.md)
