from PIL import Image

im = Image.open('mengenal lebih lama atau lebih cepat.jpeg')
w, h = im.size

# Let's inspect the vertical regions around y = 400 to 1400
# In a 739x1600 image:
# Row a: approx y = 500 to 750
# Row b: approx y = 800 to 1050
# Row c: approx y = 1100 to 1350

# Left column: approx x = 120 to 350
# Right column: approx x = 420 to 650

crops = {
    "activity_combing.png": (140, 565, 300, 725),
    "activity_bathing.png": (430, 565, 590, 725),
    "activity_sleeping.png": (140, 810, 300, 970),
    "activity_brushing.png": (430, 810, 590, 970),
    "activity_studying.png": (140, 1055, 300, 1215),
    "activity_breakfast.png": (430, 1055, 590, 1215)
}

for name, box in crops.items():
    cropped = im.crop(box)
    cropped.save(f"assets/images/{name}")
    print(f"Saved assets/images/{name} with size {cropped.size}")
