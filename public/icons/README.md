# GoldStackr Extension Icons

## Generating Icons

You need to create PNG icons in the following sizes:
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

### Option 1: Use the HTML Generator
Open `generate-icons.html` in your browser and it will automatically generate and download all required icon sizes.

### Option 2: Use an Icon Generator Tool
1. Visit https://www.favicon-generator.org/
2. Upload a logo image
3. Generate icons in the sizes listed above
4. Place the PNG files in this directory

### Option 3: Use ImageMagick (Command Line)
If you have ImageMagick installed:

```bash
# Create a simple gold coin icon
convert -size 128x128 xc:none -fill "#FFD700" -draw "circle 64,64 64,10" \
        -fill "#1E293B" -font Arial -pointsize 80 -gravity center \
        -annotate +0+0 "\$" icon128.png

convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 32x32 icon32.png
convert icon128.png -resize 16x16 icon16.png
```

## Temporary Workaround

For development, you can use placeholder images. The extension will still work without proper icons, but they're required for publishing to the Chrome Web Store.
