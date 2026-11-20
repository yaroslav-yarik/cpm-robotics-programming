# Два указателя и скользящее окно

[Оглавление](../README.md) · Базовые алгоритмы

## Как найти пару с заданной суммой

Нужны два числа на разных позициях, дающие в сумме 6. Возьмём **отсортированный массив** `[1, 2, 4, 8]`. Один указатель поставим на первый элемент, другой — на последний. Здесь указатели — это два индекса, `left` и `right`.

| Числа на краях | Сумма | Следующий шаг |
|---|---:|---|
| 1 и 8 | 9 | Убираем 8. Даже с наименьшим числом сумма слишком велика |
| 1 и 4 | 5 | Убираем 1. Даже с наибольшим оставшимся числом суммы не хватает |
| 2 и 4 | 6 | Пара найдена |

Если индексы встретились, осталась одна позиция и составить пару уже нельзя. Каждый шаг сдвигает одну границу внутрь, поэтому время поиска составляет `O(n)`, дополнительная память — `O(1)`. Если массив сначала приходится сортировать, общее время возрастает до `O(n log n)`.

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

<details>
<summary>Тот же алгоритм на Python</summary>

```python
def pair_sorted(a, target):
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

</details>

## Как найти самый длинный участок с ограниченной суммой

Пусть все числа и предел суммы **неотрицательны**. Окном будем называть непрерывный участок массива между границами `left` и `right` включительно. При расширении вправо прибавляем новый элемент к сумме. Пока сумма больше предела, убираем элементы слева.

Для массива `[1, 2, 1, 0, 4]` и предела 3 окно меняется так.

| Добавили справа | Что убрали слева | Оставшееся окно | Сумма |
|---:|---|---|---:|
| 1 | — | `[1]` | 1 |
| 2 | — | `[1, 2]` | 3 |
| 1 | 1 | `[2, 1]` | 3 |
| 0 | — | `[2, 1, 0]` | 3 |
| 4 | 2, 1, 0 и 4 | `[]` | 0 |

Самое длинное допустимое окно — `[2, 1, 0]`, его длина равна 3. Удалённые элементы можно больше не рассматривать. Если с некоторым началом сумма уже велика, то добавление неотрицательных чисел справа её только сохранит или увеличит.

Каждый элемент добавляем один раз и удаляем не более одного раза. Поэтому два вложенных цикла вместе занимают `O(n)` времени и используют `O(1)` дополнительной памяти.

С отрицательными числами это рассуждение перестаёт работать. В массиве `[4, −2]` при пределе 3 алгоритм сразу удалил бы четвёрку, хотя сумма всего массива равна 2.

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

<details>
<summary>Тот же алгоритм на Python</summary>

```python
def longest_at_most(a, limit):
    left = total = best = 0
    for right, value in enumerate(a):
        total += value
        while total > limit:
            total -= a[left]
            left += 1
        best = max(best, right - left + 1)
    return best
```

</details>

---

[← Префиксные суммы](prefix-sums.md) · [→ Частоты](frequencies.md)
