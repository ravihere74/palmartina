import math
import pathlib
import sys

import fitz

folder = pathlib.Path(sys.argv[1])
files = sorted(folder.glob('*.*'))
files = [item for item in files if item.suffix.lower() in {'.png', '.jpg', '.jpeg'}]
columns = 4
cell_width, cell_height = 300, 230
rows = math.ceil(len(files) / columns)
document = fitz.open()
page = document.new_page(width=columns * cell_width, height=rows * cell_height)

for index, item in enumerate(files):
    left = (index % columns) * cell_width
    top = (index // columns) * cell_height
    page.insert_text((left + 10, top + 18), item.name, fontsize=9)
    page.insert_image(
        fitz.Rect(left + 8, top + 26, left + cell_width - 8, top + cell_height - 8),
        filename=str(item),
        keep_proportion=True,
    )

page.get_pixmap(matrix=fitz.Matrix(1, 1), alpha=False).save(folder / 'contact.png')
