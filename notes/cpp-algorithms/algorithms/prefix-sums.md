# Префиксные суммы

[Оглавление](../README.md) · Базовые алгоритмы

Пусть a = [2, −5, 4]. Сохраним суммы первых k элементов, начиная с нулевого префикса. Получим p = [0, 2, −3, 1]. Сумма a[l:r] равна p[r] − p[l]. Например, для [1, 3) получаем 1 − 2 = −1. Для пустого участка вычитаем одинаковые числа и получаем 0.

**prefix_sums** строит массив длины n + 1 за O(n) времени и памяти. Каждый запрос выполняется за O(1). Для q независимых запросов это O(n + q) вместо O(nq) при прямом проходе по каждому участку. При частых изменениях массива префиксы пришлось бы пересчитывать.

**Python**

```python
def prefix_sums(a):
    prefix = [0]
    for value in a:
        prefix.append(prefix[-1] + value)
    return prefix


def range_sum(prefix, left, right):
    return prefix[right] - prefix[left]
```

**C++17**

```cpp
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

Numbers prefix_sums(const Numbers& a) {
    Numbers p{0};
    for (Int value : a) p.push_back(p.back() + value);
    return p;
}

Int range_sum(const Numbers& p, std::size_t left, std::size_t right) {
    return p[right] - p[left];
}
```

## Прямоугольники на сетке

Для прямоугольной таблицы размера h × w создаём p размера (h + 1) × (w + 1). p[i][j] хранит сумму строк [0, i) и столбцов [0, j). При построении складываем накопленную сумму очередной строки с p предыдущих строк. В примере:

```text
   исходная таблица       таблица p
     1   2   3             0   0   0   0
     4  -5   6             0   1   3   6
                           0   5   2  11
```

Для прямоугольника [top, bottom) × [left, right) начинаем с p[bottom][right]. Вычитаем часть выше и часть левее. Общий верхний левый угол вычтен дважды, поэтому добавляем его обратно. Для всех строк и двух правых столбцов сумма равна 11 − 0 − 5 + 0 = 6. Построение **rectangle_prefix** занимает O(hw) времени и O((h + 1)(w + 1)) памяти, запрос **rectangle_sum** — O(1).

**Python**

```python
def rectangle_prefix(a):
    rows, cols = len(a), len(a[0]) if a else 0
    p = [[0] * (cols + 1) for _ in range(rows + 1)]
    for i in range(rows):
        row_sum = 0
        for j in range(cols):
            row_sum += a[i][j]
            p[i + 1][j + 1] = p[i][j + 1] + row_sum
    return p


def rectangle_sum(p, top, left, bottom, right):
    return p[bottom][right] - p[top][right] - p[bottom][left] + p[top][left]
```

**C++17**

```cpp
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;
using Matrix = std::vector<Numbers>;

Matrix rectangle_prefix(const Matrix& a) {
    std::size_t rows = a.size(), cols = a.empty() ? 0 : a[0].size();
    Matrix p(rows + 1, Numbers(cols + 1));
    for (std::size_t i = 0; i < rows; ++i) {
        Int row_sum = 0;
        for (std::size_t j = 0; j < cols; ++j) {
            row_sum += a[i][j];
            p[i + 1][j + 1] = p[i][j + 1] + row_sum;
        }
    }
    return p;
}

Int rectangle_sum(const Matrix& p, std::size_t top, std::size_t left,
                  std::size_t bottom, std::size_t right) {
    return p[bottom][right] - p[top][right] - p[bottom][left] + p[top][left];
}
```

---

[← Двоичный поиск](binary-search.md) · [→ Два указателя и скользящее окно](two-pointers-and-window.md)
