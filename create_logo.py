
"""
🔥 TRICA LOGO GENERATOR 🔥
Creates a legendary logo for the mind-bending programming language
"""

import sys
import io
import math
import random
from PIL import Image, ImageDraw

# Enable UTF-8 output for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def create_trica_logo():
    width, height = 512, 512
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    colors = {
        'primary': (0, 255, 255),      # Cyan
        'secondary': (255, 0, 255),    # Magenta
        'accent': (255, 255, 0),       # Yellow
        'dark': (20, 20, 40),          # Dark blue
        'light': (255, 255, 255),      # White
        'glow': (100, 255, 255, 128),  # Cyan glow
    }

    center_x, center_y = width // 2, height // 2

    # Quantum background particles
    for _ in range(50):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(2, 8)
        alpha = random.randint(30, 80)
        color = (*colors['primary'], alpha)
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color)

    # Main background circle
    circle_radius = 200
    draw.ellipse([center_x - circle_radius, center_y - circle_radius,
                  center_x + circle_radius, center_y + circle_radius],
                 fill=colors['dark'], outline=colors['primary'], width=4)

    # Inner glow
    glow_radius = 180
    draw.ellipse([center_x - glow_radius, center_y - glow_radius,
                  center_x + glow_radius, center_y + glow_radius],
                 fill=colors['glow'])

    # Quantum hexagon pattern
    hex_radius = 120
    for angle in range(0, 360, 60):
        rad = math.radians(angle)
        x1 = center_x + hex_radius * math.cos(rad)
        y1 = center_y + hex_radius * math.sin(rad)

        next_rad = math.radians(angle + 60)
        x2 = center_x + hex_radius * math.cos(next_rad)
        y2 = center_y + hex_radius * math.sin(next_rad)

        draw.line([x1, y1, x2, y2], fill=colors['accent'], width=3)

    # Central "T" symbol
    t_width, t_height, t_thickness = 80, 100, 12

    # Horizontal bar
    draw.rectangle([center_x - t_width // 2, center_y - t_height // 2,
                    center_x + t_width // 2, center_y - t_height // 2 + t_thickness],
                   fill=colors['light'])

    # Vertical bar
    draw.rectangle([center_x - t_thickness // 2, center_y - t_height // 2,
                    center_x + t_thickness // 2, center_y + t_height // 2],
                   fill=colors['light'])

    # Quantum particles around the "T"
    for i in range(20):
        angle = random.uniform(0, 2 * math.pi)
        distance = random.uniform(60, 150)
        x = center_x + distance * math.cos(angle)
        y = center_y + distance * math.sin(angle)
        size = random.randint(2, 6)

        alpha = int(128 + 127 * math.sin(i * 0.5))
        color = (*colors['secondary'], alpha)
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color)

    # Outer ring with circuit pattern
    outer_radius = 240
    for angle in range(0, 360, 15):
        rad = math.radians(angle)
        x1 = center_x + (outer_radius - 10) * math.cos(rad)
        y1 = center_y + (outer_radius - 10) * math.sin(rad)
        x2 = center_x + outer_radius * math.cos(rad)
        y2 = center_y + outer_radius * math.sin(rad)

        if angle % 30 == 0:
            draw.line([x1, y1, x2, y2], fill=colors['primary'], width=2)
        else:
            draw.line([x1, y1, x2, y2], fill=colors['secondary'], width=1)

    return img

def create_icon_sizes(base_img):
    sizes = [16, 32, 48, 64, 128, 256]
    return {size: base_img.resize((size, size), Image.Resampling.LANCZOS) for size in sizes}

def main():
    print("🔥 GENERATING LEGENDARY TRICA LOGO + MULTI-SIZE ICO 🔥")

    logo = create_trica_logo()

    # Save base logo PNG
    base_path = "c:/Users/Prime/OneDrive/Desktop/trica/installer"
    logo.save(f"{base_path}/trica-logo.png")
    print(f"✅ Main logo saved: {base_path}/trica-logo.png")

    # Create icon sizes
    icons = create_icon_sizes(logo)

    # Save icon PNGs
    for size, img in icons.items():
        img.save(f"{base_path}/trica-icon-{size}.png")
        print(f"✅ Icon {size}x{size} saved: trica-icon-{size}.png")

    # Create ICO file (Windows icon) from multiple sizes
    ico_sizes = [16, 32, 48, 64]
    ico_imgs = [icons[size] for size in ico_sizes]
    ico_imgs[0].save(f"{base_path}/trica-icon.ico", format='ICO', sizes=[(s, s) for s in ico_sizes])
    print(f"✅ Windows ICO file saved: {base_path}/trica-icon.ico")

    # Save website favicon & icons
    web_path = "c:/Users/Prime/OneDrive/Desktop/trica/website/public"
    icons[32].save(f"{web_path}/favicon.ico", format='ICO')
    logo.resize((192, 192), Image.Resampling.LANCZOS).save(f"{web_path}/logo192.png")
    logo.resize((512, 512), Image.Resampling.LANCZOS).save(f"{web_path}/logo512.png")
    print("✅ Website icons saved")

    print("🚀 LOGO GENERATION COMPLETE - REALITY HAS BEEN ENHANCED! 🚀")

if __name__ == "__main__":
    main()
