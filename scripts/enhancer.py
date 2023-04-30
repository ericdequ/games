import os
import sys
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageChops

def remove_border(image, tolerance=10):
    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_area = 0
    max_contour = None
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > max_area:
            max_area = area
            max_contour = cnt

    x, y, w, h = cv2.boundingRect(max_contour)
    cropped_image = cv_image[y:y+h, x:x+w]
    pil_image = Image.fromarray(cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB))

    return pil_image

def process_images(source_dir):
    for root, _, files in os.walk(source_dir):
        print("Processing")
        for file in files:
            print("Processing ")
            try:
                file_path = os.path.join(root, file)
                file_name, file_extension = os.path.splitext(file_path)

                if file_extension.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                    continue

                image = Image.open(file_path)

                # Remove border
                image = remove_border(image)

                   
                # Convert image to grayscale
                gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)

                # Perform histogram equalization on the grayscale image
                equalized = cv2.equalizeHist(gray)

                # Convert the equalized grayscale image back to RGB
                image = cv2.cvtColor(equalized, cv2.COLOR_GRAY2RGB)

                # Enhance contrast and sharpness
                enhancer = ImageEnhance.Contrast(image)
                image = enhancer.enhance(1.5)
                

                if file_extension.lower() in ['.jpg', '.jpeg']:
                    image.save(file_path, "JPEG", quality=100)
                elif file_extension.lower() in ['.png']:
                    image.save(file_path, "PNG", compress_level=0)
                else:  # for '.webp' files
                    image.save(file_path, "WEBP", quality=100)

                print(f"Improved quality of {file}")

            except Exception as e:
                print(f"Error processing {file}: {e}")
                continue

if __name__ == "__main__":
    source_directory = "C:/Users/ericd/dev/personal/Games/games/images/"
    process_images(source_directory)
    