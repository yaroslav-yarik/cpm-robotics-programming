# Префиксные суммы

[Оглавление](../README.md) · Базовые алгоритмы

## Как получить сумму участка одним вычитанием

Пусть в массиве `[2, −5, 4]` нужно много раз находить суммы разных участков. Заранее посчитаем сумму первых `k` элементов для каждого возможного `k`. Такую сумму называют **префиксной**. Пустой префикс имеет длину 0 и сумму 0.

| Сколько взяли элементов, `k` | 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| Сумма первых `k`, `p[k]` | 0 | 2 | −3 | 1 |

Найдём сумму на участке `[1, 3)`, то есть элементов с индексами 1 и 2. В `p[3]` уже входят все три элемента. Вычтем `p[1]`, чтобы убрать первый элемент. Получим `1 − 2 = −1`, столько же даёт прямое сложение `−5 + 4`.

![Под числами −5 и 4 выделен участок от границы p[1] до p[3]. Их разность равна −1.](../assets/algorithms/prefix-sums.svg)

При построении процессор может держать текущую сумму в регистре и записывать очередной результат по следующему адресу. При запросе достаточно прочитать из готовой таблицы два значения, даже если между ними миллион элементов.

Для любого участка `[left, right)` ответ равен **`p[right] − p[left]`**. Для пустого участка границы совпадают, и результат равен нулю.

Функция `prefix_sums` за один проход строит таблицу длины `n + 1`. Построение занимает `O(n)` времени и памяти. Затем каждый вызов `range_sum` занимает `O(1)`. Для `q` запросов получаем `O(n + q)` времени вместо `O(nq)` при повторном подсчёте. Если изменить элемент массива, придётся обновить затронутые префиксы.

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

<details>
<summary>Тот же алгоритм на Python</summary>

```python
def prefix_sums(a):
    prefix = [0]
    for value in a:
        prefix.append(prefix[-1] + value)
    return prefix


def range_sum(prefix, left, right):
    return prefix[right] - prefix[left]
```

</details>

## Как сложить числа в прямоугольнике

В двумерном случае `p[i][j]` хранит сумму прямоугольника от левого верхнего угла до строки `i` и столбца `j`, исключая их. Первая строка и первый столбец таблицы сумм нулевые. Например, `p[1][2] = 3` — сумма первых двух чисел верхней строки.

```text
Исходная таблица       Префиксные суммы
  1   2   3              0   0   0   0
  4  -5   6              0   1   3   6
                         0   5   2  11
```

При построении таблицы идём по строке и накапливаем `row_sum` от её начала. К этой сумме прибавляем уже посчитанный прямоугольник прямо над ней.

Чтобы получить сумму строк `[top, bottom)` и столбцов `[left, right)`, достаточно четырёх чисел.

1. Берём `p[bottom][right]`. Туда входит всё до правого нижнего угла нужного прямоугольника.
2. Вычитаем `p[top][right]` сверху и `p[bottom][left]` слева.
3. Прибавляем `p[top][left]`. Этот угол попал в оба вычтенных прямоугольника.

Например, выберем обе строки и два правых столбца. В них лежат 2, 3, −5 и 6. По таблице получаем `11 − 0 − 5 + 0 = 6`. Для таблицы `h × w` построение занимает `O(hw)` времени при положительных размерах. Таблица префиксов занимает `(h + 1)(w + 1)` ячеек, запрос — `O(1)` времени.

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

<details>
<summary>Тот же алгоритм на Python</summary>

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

</details>

---

[← Двоичный поиск](binary-search.md) · [→ Два указателя и скользящее окно](two-pointers-and-window.md)
