from PIL import Image

im = Image.open('mengenal lebih lama atau lebih cepat.jpeg').convert('RGB')

# Let's inspect x from 130 to 160 around y = 620
for x in range(130, 160):
    r, g, b = im.getpixel((x, 650))
    if r < 200: # inside colored rectangle
        print("Left edge of combing is around x =", x)
        break

# Let's sample colors to get the exact rectangle bounds for all 6
def get_colored_rect(seed_x, seed_y):
    # flood or scan boundary of the colored box (background is white > 240)
    # Scan left
    x1 = seed_x
    while x1 > 0 and (im.getpixel((x1, seed_y))[0] < 245 or im.getpixel((x1, seed_y))[1] < 245 or im.getpixel((x1, seed_y))[2] < 245):
        x1 -= 1
    x1 += 1

    # Scan right
    x2 = seed_x
    while x2 < im.width and (im.getpixel((x2, seed_y))[0] < 245 or im.getpixel((x2, seed_y))[1] < 245 or im.getpixel((x2, seed_y))[2] < 245):
        x2 += 1
    x2 -= 1

    # Scan top
    y1 = seed_y
    while y1 > 0 and (im.getpixel((seed_x, y1))[0] < 245 or im.getpixel((seed_x, y1))[1] < 245 or im.getpixel((seed_x, y1))[2] < 245):
        y1 -= 1
    y1 += 1

    # Scan bottom
    y2 = seed_y
    while y2 < im.height and (im.getpixel((seed_x, y2))[0] < 245 or im.getpixel((seed_x, y2))[1] < 245 or im.getpixel((seed_x, y2))[2] < 245):
        y2 += 1
    y2 -= 1

    return (x1, y1, x2 + 1, y2 + 1)

rects = {
    "activity_combing.png": get_colored_rect(200, 650),
    "activity_bathing.png": get_colored_rect(500, 650),
    "activity_sleeping.png": get_colored_rect(200, 900),
    "activity_brushing.png": get_colored_rect(500, 900),
    "activity_studying.png": get_colored_rect(200, 1150),
    "activity_breakfast.png": get_colored_rect(500, 1150),
}

for name, box in rects.items():
    print(name, box)
    c = im.crop(box)
    c.save(f"assets/images/{name}")
    print(f"Saved {name} with size {c.size}")
