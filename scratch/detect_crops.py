from PIL import Image

im = Image.open('mengenal lebih lama atau lebih cepat.jpeg').convert('RGB')
w, h = im.size

def find_box_pure(min_x, max_x, min_y, max_y):
    # Find bounding box where pixel is not near white (r<240 or g<240 or b<240)
    left, top, right, bottom = max_x, max_y, min_x, min_y
    found = False
    for y in range(min_y, max_y):
        for x in range(min_x, max_x):
            r, g, b = im.getpixel((x, y))
            if r < 240 or g < 240 or b < 240:
                found = True
                if x < left: left = x
                if x > right: right = x
                if y < top: top = y
                if y > bottom: bottom = y
    if found and right > left and bottom > top:
        return (left, top, right + 1, bottom + 1)
    return None

boxes = {
    "activity_combing.png": find_box_pure(100, 350, 580, 750),
    "activity_bathing.png": find_box(380, 650, 580, 750) if False else find_box_pure(380, 650, 580, 750),
    "activity_sleeping.png": find_box_pure(100, 350, 830, 1000),
    "activity_brushing.png": find_box_pure(380, 650, 830, 1000),
    "activity_studying.png": find_box_pure(100, 350, 1070, 1250),
    "activity_breakfast.png": find_box_pure(380, 650, 1070, 1250),
}

for name, box in boxes.items():
    print(name, box)
    if box:
        c = im.crop(box)
        c.save(f"assets/images/{name}")
        print(f"Saved {name}, size: {c.size}")
