import os
from urllib import request
from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageChops

BASE_URL = "https://www.bing.com/create?toWww=1&redig=30C04FC20A7A4BA08168CC7BB17EDFD6"
SAVE_PATH = "C:/Users/ericd/dev/personal/Games/games/images"
CHROME_DRIVER_PATH = "C:/users/ericd/dev/personal/chromedriver_win32/chromedriver.exe"


anime_prompts = [
    "A young girl with pink hair and a school uniform is running late for class. She holds a piece of toast in her mouth and bumps into a handsome boy with blue hair and glasses. Their eyes meet and they blush.",
    "A group of friends are sitting in a café, chatting and laughing. They are all wearing different outfits that reflect their personalities. One of them is holding a smartphone and showing them a video of a cute cat.",
    "A boy with spiky hair and a scar on his cheek is riding a motorcycle on a futuristic city street. He is chased by police robots and dodges lasers and explosions. He has a mysterious device in his backpack that could change the world.",
    "A girl with long black hair and a kimono is walking in a forest. She is holding a fan and has a fox mask on her head. She is followed by a white fox spirit that protects her from evil spirits.",
    "A boy with green hair and a sword is standing on a cliff, overlooking a medieval kingdom. He is wearing a cloak and has a dragon tattoo on his arm. He is the chosen one who must defeat the dark lord and restore peace to the land.",
    "A girl with blonde hair and a red dress is singing on a stage, surrounded by fans. She is wearing headphones and has a microphone in her hand. She is a famous idol who has a secret identity as a spy.",
    "A boy with brown hair and glasses is sitting in his room, surrounded by books and computers. He is typing on his keyboard and hacking into a secret organization. He is a genius who uses his skills to fight crime.",
    "A girl with purple hair and wings is flying in the sky, holding hands with a boy with silver hair and horns. They are both half-human, half-demon and are in love. They are escaping from their families who want to separate them.",
    "A boy with red hair and a baseball cap is throwing a pitch on a baseball field. He is wearing a uniform and has a glove on his hand. He is the ace of his team and dreams of becoming a professional player."
]

products = {
  "rando_anime": anime_prompts
}

def remove_border(image):
    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_area = 0
    max_contour = None
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > max_area:
            max_area = area
            max_contour = cnt

    x, y, w, h = cv2.boundingRect(max_contour)
    padding = 50
    cropped_image = cv_image[y-padding:y+h+padding, x-padding:x+w+padding]
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
                image = enhancer.enhance(1.0)
                

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

image_xpaths = [
    '//*[@id="mmComponent_images_as_1"]/ul[1]/li[1]/div/div/a/div/img',
    '//*[@id="mmComponent_images_as_1"]/ul[1]/li[2]/div/div/a/div/img',
    '//*[@id="mmComponent_images_as_1"]/ul[2]/li[1]/div/div/a/div/img',
    '//*[@id="mmComponent_images_as_1"]/ul[2]/li[2]/div/div/a/div/img',
]

def download_image(url, file_path):
    try:
        request.urlretrieve(url, file_path)
        return True
    except Exception as e:
        print(f"Error while downloading image: {e}")
        return False

def main():
    driver = Chrome(executable_path=CHROME_DRIVER_PATH)

    card_names = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]

    for suit, product_set in products.items():
        suit_folder = os.path.join(SAVE_PATH, suit)
        os.makedirs(suit_folder, exist_ok=True)

        for i, product in enumerate(product_set):
            driver.get(BASE_URL)

            search_box = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="sb_form_q"]'))
            )
            search_box.clear()
            
            search_box.send_keys(f"{product}")
            search_box.submit()

            card_folder = os.path.join(suit_folder, card_names[i])
            os.makedirs(card_folder, exist_ok=True)

            for index, xpath in enumerate(image_xpaths, start=1):
                
                try:
                    generated_image = WebDriverWait(driver, 30).until(
                        EC.presence_of_element_located((By.XPATH, xpath))
                    )
                    generated_image_url = generated_image.get_attribute("src")

                    image_file_name = f"{index}.jpg"
                    file_path = os.path.join(card_folder, image_file_name)
                    

                    downloaded = download_image(generated_image_url, file_path)

                    if downloaded:
                        print(f"Image {index} for {product} saved successfully.")
                    else:
                        print(f"Failed to download image {index} for {product}.")
                except Exception as e:
                    print(f"Error while downloading image {index} for {product}: {e}")

        process_images(suit_folder)
    driver.quit()

if __name__ == "__main__":
    main()