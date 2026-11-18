# Обработка сигналов

[Оглавление](../README.md) · Прикладные алгоритмы

## Серии и полузакрытые интервалы

Если одинаковые значения идут подряд, можно описать их одной записью `(начало, конец, значение)`. Интервал `[left, right)` включает `left` и заканчивается перед `right`. Его длина равна `right - left`. Это удобно для измерений с равным шагом, когда один элемент соответствует одной единице времени.

Позиция `n` играет роль виртуального конца. В обеих реализациях мы проверяем её до обращения к массиву. Короткое замыкание у `or` и `||` не даёт обратиться к несуществующему элементу.

**Python**

```python
def runs(values):
    result = []
    start = 0
    for end in range(1, len(values) + 1):
        if end == len(values) or values[end] != values[start]:
            result.append((start, end, values[start]))
            start = end
    return result
```

**C++**

```cpp
#include <cstddef>
#include <tuple>
#include <vector>

using Run = std::tuple<std::size_t, std::size_t, int>;

std::vector<Run> runs(const std::vector<int>& values) {
    std::vector<Run> result;
    std::size_t start = 0;
    for (std::size_t end = 1; end <= values.size(); ++end) {
        if (end == values.size() || values[end] != values[start]) {
            result.emplace_back(start, end, values[start]);
            start = end;
        }
    }
    return result;
}
```

Например, в `[4, 4, 9, 9, 4]` значение 9 занимает интервал `[2, 4)` длиной 2. Если это отсчёты амплитуды, у серии значений **выше порога** амплитуда может меняться. Тогда применяй алгоритм к признакам `x > threshold`, а границы используй как индексы исходной записи. Фрагмент сигнала у края записи может быть обрезан, если для полного импульса задано требование видеть фон с обеих сторон.

Соседство в кольце требует дополнительного шага. Если линейных серий больше одной и значения первой и последней совпадают, эти две серии на кольце образуют одну. Храни их как два исходных полуинтервала, если нужны реальные индексы. Обработка серий занимает `O(n)`.

## Подтверждение устойчивого сигнала

При дребезге механической кнопки короткие смены уровня пропускают, а новый уровень принимают после непрерывного интервала устойчивости. В дискретной модели ниже новый уровень подтверждается после `needed` одинаковых отсчётов подряд. Счётчик сбрасывается при каждой смене сырого уровня. Начальное подтверждённое состояние равно 0, а `needed > 0`.

**Python**

```python
def stable_levels(samples, needed):
    confirmed = candidate = 0
    length = 0
    result = []
    for value in samples:
        if value != candidate:
            candidate, length = value, 0
        length += 1
        if length == needed:
            confirmed = candidate
        result.append(confirmed)
    return result
```

**C++**

```cpp
#include <cstddef>
#include <vector>

std::vector<int> stable_levels(const std::vector<int>& samples,
                               std::size_t needed) {
    int confirmed = 0;
    int candidate = 0;
    std::size_t length = 0;
    std::vector<int> result;
    for (int value : samples) {
        if (value != candidate) {
            candidate = value;
            length = 0;
        }
        ++length;
        if (length == needed) {
            confirmed = candidate;
        }
        result.push_back(confirmed);
    }
    return result;
}
```

При входе `[1, 0, 1, 1]` и `needed = 2` получим `[0, 0, 0, 1]`. Время работы `O(n)`. Для отсчётов с неравными интервалами удобнее сравнивать отметки времени. Вместо длины серии храни момент появления кандидата и проверяй прошедшее время. При анализе записи учитывай последнюю известную отметку, чтобы не предполагать устойчивость за её пределами.

## Как перебрать существенные пороги

Для правила `x >= threshold` на целых числах состав выбранных элементов меняется только после перехода через наблюдаемое значение. Например, для значений 4 и 9 пороги 5, 6, 7, 8 и 9 выбирают один и тот же набор. Поэтому для поиска лучшего порога можно рассмотреть наблюдавшиеся значения и один порог выше максимума. Промежуточные пороги дают те же наборы.

Следующие функции возвращают **число отобранных элементов** при каждом существенном пороге. Сортируем вход. При встрече новой группы одинаковых значений все элементы от начала группы до конца массива проходят порог. Из этих сведений можно построить оценку по своему критерию. Предполагаем, что `max(values) + 1` помещается в знаковый 64-битный тип.

**Python**

```python
def threshold_counts(values):
    ordered = sorted(values)
    result = []
    for i, threshold in enumerate(ordered):
        if i == 0 or threshold != ordered[i - 1]:
            result.append((threshold, len(ordered) - i))
    if ordered:
        result.append((ordered[-1] + 1, 0))
    return result
```

**C++**

```cpp
#include <algorithm>
#include <cstddef>
#include <utility>
#include <vector>

std::vector<std::pair<long long, std::size_t>>
threshold_counts(std::vector<long long> ordered) {
    std::sort(ordered.begin(), ordered.end());
    std::vector<std::pair<long long, std::size_t>> result;
    for (std::size_t i = 0; i < ordered.size(); ++i) {
        if (i == 0 || ordered[i] != ordered[i - 1]) {
            result.emplace_back(ordered[i], ordered.size() - i);
        }
    }
    if (!ordered.empty()) {
        result.emplace_back(ordered.back() + 1, 0);
    }
    return result;
}
```

Для `[4, 4, 9]` получим пары `(4, 3)`, `(9, 1)`, `(10, 0)`. Сортировка и проход требуют `O(n log n)` времени. Когда порог ограничен заданными границами или при совпадении оценок нужен конкретный порог, отдельно выясни, какой представитель допустим в каждом промежутке.

---

[← Состояние и события](state-and-events.md) · [→ Клеточные карты и изображения](grids-and-images.md)
