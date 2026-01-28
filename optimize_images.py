import os
from PIL import Image

def optimize_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                file_name, file_ext = os.path.splitext(file)
                webp_path = os.path.join(root, f"{file_name}.webp")
                
                try:
                    with Image.open(file_path) as img:
                        # Convert to RGB if necessary (e.g. for PNGs with transparency if saving as JPG, 
                        # but WebP supports transparency so we just need to handle mode compatibility)
                        # WebP supports RGBA, so we usually don't need to convert unless it's some weird mode.
                        # However, mostly it's fine.
                        
                        # Resize if too massive (optional, let's stick to 1600px width max for now to be safe)
                        max_width = 1600
                        if img.width > max_width:
                            ratio = max_width / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                            print(f"Resized {file} to {max_width}px width")

                        img.save(webp_path, 'WEBP', quality=80)
                        print(f"Converted: {file} -> {os.path.basename(webp_path)}")
                except Exception as e:
                    print(f"Error converting {file}: {e}")

if __name__ == "__main__":
    base_dir = r"c:\Dev\Resume\RenegadeJayhawk.github.io\RenegadeJayhawk.github.io\RenegadeJayhawk.github.io\images"
    optimize_images(base_dir)
