# Двоичный поиск

[Оглавление](../README.md) · Базовые алгоритмы

## Как найти первую тройку

В массиве `[1, 3, 3, 7]` число 3 встречается дважды. Если нужно узнать, сколько здесь троек, удобно найти две позиции.

| Граница | Что ищем | Индекс |
|---|---|---|
| Нижняя | Первый элемент, который **больше или равен** 3 | 1 |
| Верхняя | Первый элемент, который **строго больше** 3 | 3 |

Тройки занимают индексы от 1 включительно до 3 исключительно. Их количество равно `3 − 1 = 2`. Для числа 4 обе границы равны 3, поэтому четвёрок в массиве нет. Если подходящего элемента нет, граница равна длине массива `n`. В пустом массиве она равна нулю.

### Почему можно отбросить половину

Массив отсортирован по возрастанию с возможными повторами. Посмотрим на поиск нижней границы тройки. До индекса `left` лежат заведомо маленькие элементы. Начиная с `right`, все существующие элементы уже подходят. Проверить осталось участок `[left, right)`.

| Проверяемый участок | Середина | Решение |
|---|---|---|
| `[0, 4)` | `a[2] = 3` | Тройка подходит. Ищем, есть ли подходящий элемент левее, `right = 2` |
| `[0, 2)` | `a[1] = 3` | Так же передвигаем `right` на 1 |
| `[0, 1)` | `a[0] = 1` | Единица мала. Переходим к `left = 1` |

Теперь `left == right == 1`. Это индекс первой тройки. Для верхней границы тройку считаем слишком маленькой и продолжаем поиск справа от неё.

В C++ функция ниже с параметром `upper = true` ищет верхнюю границу. В Python показаны две отдельные функции. Обе границы находятся за `O(log n)` времени с `O(1)` дополнительной памяти.

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

<details>
<summary>Тот же алгоритм на Python</summary>

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

</details>

В стандартных библиотеках уже есть обе операции. В Python это `bisect_left` и `bisect_right` из модуля `bisect`. В C++ функции `std::lower_bound` и `std::upper_bound` возвращают итераторы. Чтобы получить индекс в векторе, вычти `a.begin()` из итератора. Для проверки наличия числа сначала убедись, что индекс меньше `n`, и только затем сравни элемент с искомым числом.

## Как найти минимальную вместимость

Нужно перевезти 11 одинаковых деталей не более чем за 3 рейса. Машина вместимостью 3 детали сделает четыре рейса. Машине вместимостью 4 хватит трёх. Ответ равен 4.

Двоичным поиском можно найти эту границу даже без готового массива. Если вместимости хватает, любая большая вместимость тоже подойдёт. Такое свойство называется **монотонностью**. Для кандидата `c` делим число деталей на вместимость и добавляем один рейс, если остался ненулевой остаток.

Функция ищет ответ среди целых чисел от 1 до `n`. Вместимость `n` заведомо подходит при хотя бы одном разрешённом рейсе. На каждом шаге мы уменьшаем диапазон примерно вдвое. Для `1 ≤ n ≤ 10¹⁸` время составляет `O(log n)`, дополнительная память — `O(1)`.

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

<details>
<summary>Тот же алгоритм на Python</summary>

```python
def min_batch_size(n, batches):
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

</details>

---

[← Сортировка и ключи](sorting.md) · [→ Префиксные суммы](prefix-sums.md)
