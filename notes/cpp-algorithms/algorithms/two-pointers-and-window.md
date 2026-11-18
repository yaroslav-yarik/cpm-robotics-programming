# Два указателя и скользящее окно

[Оглавление](../README.md) · Базовые алгоритмы

## Пара с заданной суммой

Если массив уже отсортирован, поставим один индекс на первый, другой на последний элемент. Если сумма меньше нужной, левый край слишком мал: даже с самым большим из оставшихся элементов ответ не получается. Двигаем левый индекс. Если сумма слишком велика, у правого края нет подходящей пары среди оставшихся элементов, и двигаем правый индекс. Если индексы встретились, пары не осталось.

В [1, 2, 4, 8] для цели 6 сначала получим 1 + 8 = 9, затем 1 + 4 = 5, затем 2 + 4 = 6. В **pair_sorted** каждый индекс движется только в одну сторону, время O(n), дополнительная память O(1). При необходимости предварительной сортировки всё решение занимает O(n log n).

**Python**

```python
def pair_sorted(a, target):
    """a is sorted in ascending order."""
    left, right = 0, len(a) - 1
    while left < right:
        total = a[left] + a[right]
        if total == target:
            return True
        if total < target:
            left += 1
        else:
            right -= 1
    return False
```

**C++17**

```cpp
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

bool pair_sorted(const Numbers& a, Int target) {
    if (a.size() < 2) return false;
    std::size_t left = 0, right = a.size() - 1;
    while (left < right) {
        Int total = a[left] + a[right];
        if (total == target) return true;
        if (total < target) ++left;
        else --right;
    }
    return false;
}
```

## Окно по сумме

Пусть все элементы и предел S неотрицательны. Найдём длину самого длинного участка с суммой ≤ S. Двигаем правую границу и добавляем новый элемент. Пока сумма велика, убираем по одному элементу слева. После этого получается самое длинное допустимое окно, заканчивающееся на правой границе: уже отброшенные начала больше не станут допустимыми при дальнейшем расширении вправо.

Для [1, 2, 1, 0, 4] и S = 3 суммы окна по мере движения правой границы: 1, 3, 3 после удаления первого 1, 3 после добавления нуля, 0 после удаления всего окна с 4. Максимальная длина — 3, участок [2, 1, 0]. Каждый элемент добавляется один раз и удаляется не более одного раза. **longest_at_most** работает за O(n) времени и O(1) памяти. С отрицательными числами метод ломается: для [4, −2] и S = 3 раннее удаление 4 теряет верный участок длины 2.

**Python**

```python
def longest_at_most(a, limit):
    """All elements and limit are nonnegative."""
    left = total = best = 0
    for right, value in enumerate(a):
        total += value
        while total > limit:
            total -= a[left]
            left += 1
        best = max(best, right - left + 1)
    return best
```

**C++17**

```cpp
#include <algorithm>
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

std::size_t longest_at_most(const Numbers& a, Int limit) {
    std::size_t left = 0, best = 0;
    Int total = 0;
    for (std::size_t right = 0; right < a.size(); ++right) {
        total += a[right];
        while (total > limit) {
            total -= a[left];
            ++left;
        }
        best = std::max(best, (right + 1) - left);
    }
    return best;
}
```

---

[← Префиксные суммы](prefix-sums.md) · [→ Частоты](frequencies.md)
