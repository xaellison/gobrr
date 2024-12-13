import json
import random
values = [i for i in range(1, 11)]
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
        

total_steps = 0
for i in range(0, N):
    for j in range(i + 1, N):
        if values[i] > values[j]:
            values[i], values[j] = values[j], values[i]

        trace['states'].append(serialize_state(values, lambda id: 'red' if id in (i, j) else 'white'))
        total_steps += 1

trace["total_steps"] = total_steps

with open("gobrr/public/bubble_sort.json", "w") as f:
    json.dump(trace, f)

    