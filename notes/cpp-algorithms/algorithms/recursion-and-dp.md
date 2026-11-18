# Рекурсия и динамическое программирование

[Оглавление](../README.md) · Базовые алгоритмы

Эти темы можно читать после основных алгоритмов.

## Рекурсивный перебор

У каждого элемента два варианта: взять или пропустить. В **subset_sums** состояние задают индекс следующего элемента и сумма уже взятых. В базовом случае индекс равен длине массива, выбор завершён и сумму можно записать. Для [2, −1] четыре суммы: 0, −1, 2, 1. Одинаковые суммы от разных выборов могут повторяться. Для пустого массива есть один способ — ничего не взять, сумма 0.

Время O(2ⁿ) при поддержании текущей суммы. Стек вызовов занимает O(n), хранимый ответ — O(2ⁿ). Если нужен только счётчик удовлетворяющих условию наборов, список результатов можно не хранить. Сначала оцени число вариантов: при n = 30 их уже больше миллиарда.

**Python**

```python
def subset_sums(a):
    answer = []

    def visit(index, total):
        if index == len(a):
            answer.append(total)
            return
        visit(index + 1, total)
        visit(index + 1, total + a[index])

    visit(0, 0)
    return answer
```

**C++17**

```cpp
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

void visit_subsets(const Numbers& a, std::size_t i, Int total, Numbers& result) {
    if (i == a.size()) {
        result.push_back(total);
        return;
    }
    visit_subsets(a, i + 1, total, result);
    visit_subsets(a, i + 1, total + a[i], result);
}

Numbers subset_sums(const Numbers& a) {
    Numbers result;
    visit_subsets(a, 0, 0, result);
    return result;
}
```

## ДП по лестнице

Можно подняться на одну или на две ступеньки. Старт находится перед ступенькой 0, при посещении ступеньки i платим cost[i]. Нужно попасть на последнюю ступеньку с минимальной суммой затрат. Если знаем минимальные цены попадания на предпоследнюю и на ступеньку перед ней, достаточно взять меньшую и прибавить цену очередной ступеньки.

Для [5, 2, 10, 1]:

| Позиция | Перед лестницей | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| Минимальная цена | 0 | 5 | 2 | 12 | 3 |

Переход для i ≥ 1: dp[i] = cost[i] + min(dp[i − 1], dp[i − 2]). Здесь dp[−1] — математическое обозначение старта, его значение 0. Не обращайся к Python-списку по индексу −1 ради этого обозначения: такой индекс означает последний элемент списка. База dp[0] = cost[0]. При отсутствии ступеней цена 0. Функция **min_stair_cost** хранит только два предыдущих состояния, работает за O(n) времени при O(1) дополнительной памяти.

**Python**

```python
def min_stair_cost(cost):
    if not cost:
        return 0
    two_ago, previous = 0, cost[0]
    for i in range(1, len(cost)):
        current = cost[i] + min(two_ago, previous)
        two_ago, previous = previous, current
    return previous
```

**C++17**

```cpp
#include <algorithm>
#include <cstddef>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

Int min_stair_cost(const Numbers& cost) {
    if (cost.empty()) return 0;
    Int two_ago = 0, previous = cost[0];
    for (std::size_t i = 1; i < cost.size(); ++i) {
        Int current = cost[i] + std::min(two_ago, previous);
        two_ago = previous;
        previous = current;
    }
    return previous;
}
```

---

[← Обходы клеточной карты](grid-traversal.md)
