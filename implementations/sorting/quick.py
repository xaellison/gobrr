import json
import random
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



def quicksort_inplace(arr, low, high):
    if low < high:
        # Partition the array and get the pivot index
        pivot_index = partition(arr, low, high)
        # Recursively sort elements before and after the pivot
        quicksort_inplace(arr, low, pivot_index - 1)
        quicksort_inplace(arr, pivot_index + 1, high)

def partition(arr, low, high):

    pivot = arr[high]  # Choose the last element as the pivot
    i = low - 1        # Pointer for the smaller element

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            # Swap elements to place smaller elements on the left
            if i != j:
                arr[i], arr[j] = arr[j], arr[i]    
                trace['states'].append(serialize_state(arr, lambda id: 'orange' if arr[id] == pivot else (('red' if id in (i, j) else ( 'grey' if low <= id <= high else 'white')))))
        

    # Swap the pivot element to its correct position
    if i+1 != high:
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        trace['states'].append(serialize_state(arr, lambda id: 'orange' if arr[id] == pivot else ('red' if id in (i+1, high) else ( 'grey' if low <= id <= high else 'white'))))
    return i + 1

quicksort_inplace(values, 0, len(values) - 1)


assert sorted(values) == values

trace['states'] = trace['states'] + [trace['states'][-1]] * 3

with open("gobrr/public/quick_sort.json", "w") as f:
    json.dump(trace, f)
