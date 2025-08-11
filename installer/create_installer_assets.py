#!/usr/bin/env python3
"""
Create installer assets for Trica NSIS installer
Generates ICO files and BMP files from SVG sources
"""

import os
from PIL import Image, ImageDraw, ImageFont
import io

def create_gradient_background(width, height, color1, color2):
    """Create a gradient background"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def create_trica_icon():
    """Create Trica icon in multiple sizes for ICO file"""
    sizes = [16, 32, 48, 64, 128, 256]
    images = []
    
    for size in sizes:
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Colors
        primary_color = (99, 102, 241, 255)  # #6366f1
        secondary_color = (139, 92, 246, 255)  # #8b5cf6
        
        # Draw T shape
        t_width = size * 0.6
        t_height = size * 0.7
        stroke_width = max(2, size // 16)
        
        # Horizontal bar of T
        x1 = (size - t_width) // 2
        y1 = (size - t_height) // 2
        x2 = x1 + t_width
        y2 = y1 + stroke_width * 2
        
        draw.rectangle([x1, y1, x2, y2], fill=primary_color)
        
        # Vertical bar of T
        v_width = stroke_width * 2
        v_x1 = size // 2 - v_width // 2
        v_y1 = y1
        v_x2 = v_x1 + v_width
        v_y2 = y1 + t_height
        
        draw.rectangle([v_x1, v_y1, v_x2, v_y2], fill=primary_color)
        
        # Add some decorative elements for larger sizes
        if size >= 32:
            # Small accent dots
            dot_size = max(1, size // 32)
            center_x, center_y = size // 2, size // 2
            
            # Draw small accent dots
            for i, (dx, dy) in enumerate([(-1, -1), (1, -1), (-1, 1), (1, 1)]):
                dot_x = center_x + dx * size // 4
                dot_y = center_y + dy * size // 4
                color = secondary_color if i % 2 else primary_color
                draw.ellipse([dot_x - dot_size, dot_y - dot_size, 
                            dot_x + dot_size, dot_y + dot_size], fill=color)
        
        images.append(img)
    
    return images

def create_header_bitmap():
    """Create header bitmap for installer"""
    width, height = 150, 57
    
    # Create gradient background
    bg = create_gradient_background(width, height, (10, 10, 10), (26, 26, 26))
    
    # Add Trica logo
    draw = ImageDraw.Draw(bg)
    
    # Draw T
    t_size = 30
    t_x = 20
    t_y = (height - t_size) // 2
    
    # T shape
    primary_color = (99, 102, 241)
    draw.rectangle([t_x, t_y, t_x + t_size, t_y + 6], fill=primary_color)
    draw.rectangle([t_x + t_size//2 - 3, t_y, t_x + t_size//2 + 3, t_y + t_size], fill=primary_color)
    
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()
    
    text_x = t_x + t_size + 15
    text_y = height // 2 - 8
    draw.text((text_x, text_y), "TRICA", fill=(255, 255, 255), font=font)
    
    return bg

def create_wizard_bitmap():
    """Create wizard side bitmap for installer"""
    width, height = 164, 314
    
    # Create gradient background
    bg = create_gradient_background(width, height, (10, 10, 10), (26, 26, 26))
    
    draw = ImageDraw.Draw(bg)
    
    # Large T logo
    t_size = 80
    t_x = (width - t_size) // 2
    t_y = 50
    
    primary_color = (99, 102, 241)
    secondary_color = (139, 92, 246)
    
    # Draw large T
    draw.rectangle([t_x, t_y, t_x + t_size, t_y + 12], fill=primary_color)
    draw.rectangle([t_x + t_size//2 - 6, t_y, t_x + t_size//2 + 6, t_y + t_size], fill=primary_color)
    
    # Add decorative elements
    for i in range(8):
        angle = i * 45
        import math
        x = t_x + t_size//2 + int(30 * math.cos(math.radians(angle)))
        y = t_y + t_size//2 + int(30 * math.sin(math.radians(angle)))
        color = secondary_color if i % 2 else primary_color
        draw.ellipse([x-2, y-2, x+2, y+2], fill=color)
    
    # Add text at bottom
    try:
        font = ImageFont.truetype("arial.ttf", 12)
        small_font = ImageFont.truetype("arial.ttf", 10)
    except:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Title
    title_y = t_y + t_size + 40
    draw.text((width//2 - 25, title_y), "TRICA", fill=(255, 255, 255), font=font)
    
    # Subtitle
    subtitle_y = title_y + 25
    draw.text((width//2 - 45, subtitle_y), "Ultra-Fast", fill=(150, 150, 150), font=small_font)
    draw.text((width//2 - 55, subtitle_y + 15), "Mind-Bending", fill=(150, 150, 150), font=small_font)
    draw.text((width//2 - 35, subtitle_y + 30), "Language", fill=(150, 150, 150), font=small_font)
    
    return bg

def create_mock_executables():
    """Create mock executable files for the installer"""
    
    # Create a simple batch file that acts as trica.exe
    trica_content = '''@echo off
echo.
echo +==============================================================+
echo ^|                    TRICA REPL v0.1.0                        ^|
echo ^|              Ultra-Fast Mind-Bending Language                ^|
echo +==============================================================+
echo.
echo Welcome to Trica REPL!
echo Type 'help' for commands, 'exit' to quit.
echo.
:loop
set /p input="trica> "
if "%input%"=="exit" goto end
if "%input%"=="help" (
    echo Available commands:
    echo   help     - Show this help
    echo   version  - Show version info
    echo   demo     - Run demo program
    echo   exit     - Exit REPL
    goto loop
)
if "%input%"=="version" (
    echo Trica v0.1.0 Alpha - Mind Destruction Release
    echo Execution time: ^<1us
    echo Complexity: Infinite
    goto loop
)
if "%input%"=="demo" (
    echo Running demo program...
    echo let result = infinity -^> 1;
    echo print^(result^); // Output: 42
    echo Demo completed in 0.0001us
    goto loop
)
echo Executing: %input%
echo Result: Mind = Destroyed
echo Execution time: 0.0001us
goto loop
:end
echo Thank you for using Trica!
echo Your mind has been successfully destroyed.
pause
'''
    
    with open('c:/Users/Prime/OneDrive/Desktop/trica/installer/trica.exe.bat', 'w', encoding='utf-8') as f:
        f.write(trica_content)
    
    # Create compiler batch file
    compiler_content = '''@echo off
echo.
echo +==============================================================+
echo ^|                 TRICA COMPILER v0.1.0                       ^|
echo ^|            Ultra-Fast Quantum Compilation                   ^|
echo +==============================================================+
echo.
if "%1"=="" (
    echo Usage: trica-compiler ^<source.tri^> [options]
    echo Options:
    echo   --optimize-universe  Enable universal optimizations
    echo   --quantum-compile    Use quantum compilation
    echo   --time-travel        Compile in the past
    echo   --output ^<file^>      Specify output file
    goto end
)
echo Compiling %1...
echo [########################################] 100%%
echo Compilation completed in -0.001us ^(time travel used^)
echo Output: %~n1.exe
echo Mind-bending optimizations applied: Infinite
:end
pause
'''
    
    with open('c:/Users/Prime/OneDrive/Desktop/trica/installer/trica-compiler.exe.bat', 'w', encoding='utf-8') as f:
        f.write(compiler_content)

def main():
    print("Creating Trica installer assets...")
    
    # Create icon file
    print("Creating trica-icon.ico...")
    icon_images = create_trica_icon()
    icon_images[0].save('c:/Users/Prime/OneDrive/Desktop/trica/installer/trica-icon.ico', 
                       format='ICO', sizes=[(img.width, img.height) for img in icon_images])
    
    # Create header bitmap
    print("Creating header.bmp...")
    header = create_header_bitmap()
    header.save('c:/Users/Prime/OneDrive/Desktop/trica/installer/header.bmp', format='BMP')
    
    # Create wizard bitmap
    print("Creating wizard.bmp...")
    wizard = create_wizard_bitmap()
    wizard.save('c:/Users/Prime/OneDrive/Desktop/trica/installer/wizard.bmp', format='BMP')
    
    # Create mock executables
    print("Creating mock executables...")
    create_mock_executables()
    
    print("All installer assets created successfully!")
    print("\nFiles created:")
    print("- trica-icon.ico")
    print("- header.bmp") 
    print("- wizard.bmp")
    print("- trica.exe.bat")
    print("- trica-compiler.exe.bat")

if __name__ == "__main__":
    main()