import json
import random
random.seed(4)
values = [i for i in range(1, 31)]
random.shuffle(values)
N = len(values)

trace = {"states": []}

def serialize_state(values, color_func):
    xy_padding = 0.1
    bar_width = (1 - xy_padding * 2) / (N + (N - 1)) # divide the padded space by the number of bars and equal sized space between bars
    max_value = max(values)

    rects = {}
    for i in range(0, N):
        
        rect = {
            "type": "rect", 
            "args": {
                "x": xy_padding + 2 * i * bar_width,
                "y": 0.5 + (values[i] / max_value) * (1 - xy_padding) / 2,
                "width": bar_width,
                "height": -(values[i] / max_value) * (1 - xy_padding),
                "color": color_func(i)
            }
        }
        rects[values[i]] = rect
    return rects



###
def quicksort_inplace(arr, low, high):
    if low < high:
        # Partition the array and get the pivot index
        pivot_index = hoare_partition(arr, low, high)
        # Recursively sort elements before and after the pivot
        quicksort_inplace(arr, low, pivot_index)
        quicksort_inplace(arr, pivot_index + 1, high)

def hoare_partition(arr, low, high):
    mid = (low + high) // 2
    pivot = arr[mid]  # Choose the middlde element as the pivot, good choice for rand, sorted, reverse sorted
    i = low - 1
    j = high + 1

    while True:
        # Move `i` to the right until an element greater than or equal to the pivot is found
            
        i += 1
        while arr[i] < pivot:
            i += 1
            trace['states'].append(serialize_state(arr, lambda id: 'orange' if arr[id] == pivot else ('red' if id in (i, j) else ( 'grey' if low <= id <= high else 'white'))))
            

        # Move `j` to the left until an element less than or equal to the pivot is found
        j -= 1
        while arr[j] > pivot:
            j -= 1
            trace['states'].append(serialize_state(arr, lambda id: 'orange' if arr[id] == pivot else ('red' if id in (i, j) else ( 'grey' if low <= id <= high else 'white'))))
            

        # If pointers have crossed, return the partition index
        if i >= j:
            return j

        # Swap the elements at `i` and `j`
        arr[i], arr[j] = arr[j], arr[i]
        trace['states'].append(serialize_state(arr, lambda id: 'orange' if arr[id] == pivot else ('red' if id in (i, j) else ( 'grey' if low <= id <= high else 'white'))))

###

quicksort_inplace(values, 0, len(values) - 1)





assert sorted(values) == values
print(len(trace['states']))
trace['states'] = trace['states'] + [trace['states'][-1]] * 3

with open("gobrr/public/quick_sort.json", "w") as f:
    json.dump(trace, f)
