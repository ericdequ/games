import os
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
    cv2.cvtColor(cropped_image, cv2.COLOR_BGR2RGB)

    return pil_image


def process_images(source_dir):
    for root, _, files in os.walk(source_dir):
        for file in files:
            try:
                file_path = os.path.join(root, file)
                file_name, file_extension = os.path.splitext(file_path)

                if file_extension.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                    continue

                image = Image.open(file_path)

                # Remove border
                image = remove_border(image)

                # Enhance contrast and sharpness
                enhancer = ImageEnhance.Contrast(image)
                image = enhancer.enhance(1.5)

                

                # Save the result
                if file_extension.lower() in ['.jpg', '.jpeg']:
                    cv2.imwrite(file_path, image, [cv2.IMWRITE_JPEG_QUALITY, 100])
                elif file_extension.lower() in ['.png']:
                    cv2.imwrite(file_path, image, [cv2.IMWRITE_PNG_COMPRESSION, 0])
                else:  # for '.webp' files
                    cv2.imwrite(file_path, image, [cv2.IMWRITE_WEBP_QUALITY, 100])

                print(f"Processed {file}")

            except Exception as e:
                print(f"Error processing {file}: {e}")
                continue


if __name__ == "__main__":
    source_directory = "C:/Users/ericd/dev/personal/Games/games/public/background"
    process_images(source_directory)

