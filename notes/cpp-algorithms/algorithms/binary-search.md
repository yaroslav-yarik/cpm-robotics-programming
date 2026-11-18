# Двоичный поиск

[Оглавление](../README.md) · Базовые алгоритмы

## Граница в отсортированном массиве

Нижняя граница — первый индекс со значением ≥ x. Верхняя — первый индекс со значением > x. Если подходящего элемента нет, вернуть n. Для [1, 3, 3, 7] и x = 3 границы равны 1 и 3. Ровно две тройки лежат на участке [1, 3). Для x = 4 обе границы равны 3. В пустом массиве результат всегда 0.

В начале left = 0 и right = n. Все индексы до left уже отброшены как слишком маленькие, все настоящие индексы от right удовлетворяют условию. При left < right вычисляем середину. Если она не подходит, переносим left за неё. Если подходит, переносим right на неё: середина остаётся возможным ответом. Когда границы совпали, проверка закончена. Если нужен ответ «число встречается», проверяем, что результат нижней границы меньше n и a[result] == x. Сначала проверяем индекс.

В Python ручные варианты — **lower_bound**, **upper_bound**, библиотечные аналоги — bisect_left и bisect_right из bisect. В C++ учебный **first_boundary** по умолчанию ищет ≥ x, при upper = true ищет > x. Библиотечные std::lower_bound и std::upper_bound возвращают итератор. Для vector из полученного итератора вычитаем a.begin(): result - a.begin() даёт индекс. Время O(log n), дополнительная память O(1) у ручных функций.

**Python**

```python
def lower_bound(a, target):
    left, right = 0, len(a)
    while left < right:
        middle = left + (right - left) // 2
        if a[middle] < target:
            left = middle + 1
        else:
            right = middle
    return left


def upper_bound(a, target):
    left, right = 0, len(a)
    while left < right:
        middle = left + (right - left) // 2
        if a[middle] <= target:
            left = middle + 1
        else:
            right = middle
    return left
```

**C++17**

```cpp
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

std::size_t first_boundary(const Numbers& a, Int target, bool upper = false) {
    std::size_t left = 0, right = a.size();
    while (left < right) {
        std::size_t middle = left + (right - left) / 2;
        if (a[middle] < target || (upper && a[middle] == target)) {
            left = middle + 1;
        } else {
            right = middle;
        }
    }
    return left;
}
```

## Поиск по ответу

Нужно отправить n одинаковых деталей за не более чем k рейсов. Ищем минимальную вместимость машины. Для пробной вместимости c число рейсов равно n // c + (n % c != 0). При большей вместимости число рейсов не растёт. Поэтому варианты сначала не подходят, а начиная с некоторого c подходят все. Это и есть **монотонность**.

При n = 11 и k = 3 вместимость 3 требует 4 рейса, вместимость 4 — 3 рейса. Стартовые границы 1…n, верхняя точно подходит при k ≥ 1. Берём середину и сдвигаем правую границу к ней, если рейсов достаточно мало. Иначе передвигаем левую границу за середину. **min_batch_size** реализует эту схему за O(log n) времени и O(1) дополнительной памяти при 1 ≤ n ≤ 10¹⁸.

**Python**

```python
def min_batch_size(n, batches):
    """1 <= n <= 10**18; batches >= 1."""
    left, right = 1, n
    while left < right:
        middle = left + (right - left) // 2
        needed = n // middle + (n % middle != 0)
        if needed <= batches:
            right = middle
        else:
            left = middle + 1
    return left
```

**C++17**

```cpp
using Int = long long;

Int min_batch_size(Int n, Int batches) {
    Int left = 1, right = n;
    while (left < right) {
        Int middle = left + (right - left) / 2;
        Int needed = n / middle + (n % middle != 0);
        if (needed <= batches) right = middle;
        else left = middle + 1;
    }
    return left;
}
```

---

[← Сортировка и ключи](sorting.md) · [→ Префиксные суммы](prefix-sums.md)
