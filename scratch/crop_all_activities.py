from PIL import Image

# 1. Crop from mengenal lebih lama atau lebih cepat.jpeg
im1 = Image.open('mengenal lebih lama atau lebih cepat.jpeg').convert('RGB')

# Exact boxes:
im1.crop((153, 602, 310, 758)).save("assets/images/activity_combing.png")
im1.crop((416, 603, 572, 757)).save("assets/images/activity_bathing.png")
im1.crop((150, 837, 310, 995)).save("assets/images/activity_sleeping.png")
im1.crop((416, 839, 572, 997)).save("assets/images/activity_brushing.png")
im1.crop((150, 1075, 310, 1230)).save("assets/images/activity_studying.png")
im1.crop((416, 1075, 572, 1230)).save("assets/images/activity_breakfast.png")

# 2. Crop drinking & cooking from contoh yang lebih lama atau lebih sebentar tu.jpeg
im2 = Image.open('contoh yang lebih lama atau lebih sebentar tu.jpeg').convert('RGB')
# Meminum air is top-left card: approx x: 45 to 515, y: 195 to 455
im2.crop((45, 195, 525, 455)).save("assets/images/activity_drinking.png")
# Memasak is top-right card: approx x: 560 to 1040, y: 195 to 455
im2.crop((560, 195, 1040, 455)).save("assets/images/activity_cooking.png")

print("All 8 activity illustrations cropped and saved successfully!")
