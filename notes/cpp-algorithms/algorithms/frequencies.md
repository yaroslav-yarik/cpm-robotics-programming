# Частоты

[Оглавление](../README.md) · Базовые алгоритмы

Если нужно несколько раз отвечать, сколько раз встречалось значение, полезно хранить частотную таблицу. Для малого диапазона 0…m−1 подойдёт массив из m счётчиков. Для больших или отрицательных значений используем отображение: Counter в Python или unordered_map в C++.

Пример **equal_pairs** считает пары i < j с a[i] = a[j]. Обрабатываем очередное x и добавляем к ответу число уже встреченных x. Затем увеличиваем частоту. Для [7, 5, 7, 7] добавятся 0, 0, 1 и 2 пары, получится 3. Время для хеш-таблицы O(n) в среднем при обычной работе хеширования, память O(u), где u — число разных значений. В C++ std::map даёт O(log u) на обращение и хранит ключи упорядоченно, поэтому общее время O(n log(u + 1)).

**Python**

```python
from collections import Counter


def equal_pairs(a):
    seen = Counter()
    result = 0
    for value in a:
        result += seen[value]
        seen[value] += 1
    return result
```

**C++17**

```cpp
#include <unordered_map>
#include <vector>

using Int = long long;
using Numbers = std::vector<Int>;

Int equal_pairs(const Numbers& a) {
    std::unordered_map<Int, Int> seen;
    Int result = 0;
    for (Int value : a) {
        result += seen[value];
        ++seen[value];
    }
    return result;
}
```

---

[← Два указателя и скользящее окно](two-pointers-and-window.md) · [→ Обходы клеточной карты](grid-traversal.md)
