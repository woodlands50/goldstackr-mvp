#!/usr/bin/env python3
"""
Generates simple placeholder PNG icons for the GoldStackr Chrome extension.
Run this once to create the required icon files.
"""
import struct
import zlib
import os

def create_simple_png(size: int, filename: str):
    """Create a simple gold circle PNG icon."""

    # Gold color background (#FFD700) with dark $ symbol
    def create_pixel(x, y, img_size):
        cx, cy = img_size // 2, img_size // 2
        r = img_size // 2 - 1
        dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5

        if dist > r:
            return (0, 0, 0, 0)  # transparent

        # Check if pixel is part of $ symbol (simplified)
        char_x = (x - cx) / img_size
        char_y = (y - cy) / img_size

        # Gold background
        gold_r, gold_g, gold_b = 255, 215, 0

        # Navy foreground for the $ sign
        # Vertical bar
        if abs(char_x) < 0.06 and abs(char_y) < 0.45:
            return (30, 41, 59, 255)  # navy

        # Top curve
        if -0.15 < char_y < 0.0 and (0.12 < abs(char_x) < 0.28):
            return (30, 41, 59, 255)
        if -0.15 < char_y < 0.0 and abs(char_x) < 0.06 and char_y > -0.15:
            return (30, 41, 59, 255)

        # Bottom curve
        if 0.0 < char_y < 0.15 and (0.12 < abs(char_x) < 0.28):
            return (30, 41, 59, 255)
        if 0.0 < char_y < 0.15 and abs(char_x) < 0.06 and char_y < 0.15:
            return (30, 41, 59, 255)

        return (gold_r, gold_g, gold_b, 255)  # gold

    # Build raw image data
    raw_data = b''
    for y in range(size):
        raw_data += b'\x00'  # filter byte
        for x in range(size):
            r, g, b, a = create_pixel(x, y, size)
            raw_data += bytes([r, g, b, a])

    # PNG structure
    def make_chunk(chunk_type: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(chunk_type + data)
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', crc)

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    # Correct: 8-bit RGBA = bit_depth=8, color_type=6
    ihdr_data = struct.pack('>II', size, size) + bytes([8, 6, 0, 0, 0])

    # IDAT chunk (compressed image data)
    compressed = zlib.compress(raw_data)

    png_data = (
        b'\x89PNG\r\n\x1a\n'  # PNG signature
        + make_chunk(b'IHDR', ihdr_data)
        + make_chunk(b'IDAT', compressed)
        + make_chunk(b'IEND', b'')
    )

    with open(filename, 'wb') as f:
        f.write(png_data)

    print(f'Created {filename} ({size}x{size})')


if __name__ == '__main__':
    icons_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    for size in [16, 32, 48, 128]:
        filename = os.path.join(icons_dir, f'icon{size}.png')
        create_simple_png(size, filename)

    print('\nAll icons generated successfully!')
    print(f'Icons saved to: {icons_dir}')
