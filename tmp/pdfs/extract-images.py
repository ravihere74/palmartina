import pathlib
import sys

import fitz

source, output, prefix = sys.argv[1:]
document = fitz.open(source)
target = pathlib.Path(output)
target.mkdir(parents=True, exist_ok=True)
seen = set()

for page_number, page in enumerate(document, 1):
    for image_number, image in enumerate(page.get_images(full=True), 1):
        xref = image[0]
        if xref in seen:
            continue
        seen.add(xref)
        data = document.extract_image(xref)
        filename = f"{prefix}-p{page_number:02}-i{image_number:02}.{data['ext']}"
        (target / filename).write_bytes(data['image'])
