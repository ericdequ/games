import os
from urllib import request

from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://www.bing.com/create?toWww=1&redig=30C04FC20A7A4BA08168CC7BB17EDFD6"
SAVE_PATH = "C:/Users/ericd/dev/personal/Games/games/images"
CHROME_DRIVER_PATH = "C:/users/ericd/dev/personal/chromedriver_win32/chromedriver.exe"

Hearts = [
"Create a unique Two of Hearts featuring two hearts connected by a ribbon that flows like a river.",
"Illustrate the Three of Hearts with three hearts forming a triangle and emitting a warm, radiant light.",
"Depict the Four of Hearts with four hearts forming a circle, symbolizing unity and harmony.",
"Draw the Five of Hearts with five hearts floating in a whimsical, dreamlike cloud.",
"Design the Six of Hearts with six hearts arranged in an interlocking hexagonal pattern.",
"Create the Seven of Hearts with seven hearts intertwined in an elegant and graceful spiral.",
"Illustrate the Eight of Hearts with eight hearts connected by a delicate lattice of ribbons and vines.",
"Depict the Nine of Hearts with nine hearts elegantly dancing in a circle around a central point.",
"Draw the Ten of Hearts with ten hearts forming a perfect and symmetrical pattern, like a work of art.",
"Design the Jack of Hearts as a charming and romantic figure holding a heart-shaped shield, symbolizing love and protection.",
"Create the Queen of Hearts as a regal and loving ruler, surrounded by an aura of hearts, symbolizing compassion and kindness.",
"Illustrate the King of Hearts as a wise and compassionate leader, with a heart-shaped crown, symbolizing love and wisdom.",
"Design a creative Ace of Hearts with a heart surrounded by intricate and delicate floral patterns, symbolizing the beginning of love and romance.",
]

Diamonds = [
"Create a unique Two of Diamonds featuring two diamonds connected by a beam of light that shines like a star.",
"Illustrate the Three of Diamonds with three diamonds forming a pyramid and reflecting beams of light, symbolizing strength and stability.",
"Depict the Four of Diamonds with four diamonds interlocking in a square grid, symbolizing unity and harmony.",
"Draw the Five of Diamonds with five diamonds suspended in a starry sky, symbolizing the brilliance and beauty of diamonds.",
"Design the Six of Diamonds with six diamonds arranged in an interlocking hexagonal pattern, symbolizing the brilliance and strength of diamonds.",
"Create the Seven of Diamonds with seven diamonds cascading down like a waterfall, symbolizing the flow and beauty of diamonds.",
"Illustrate the Eight of Diamonds with eight diamonds connected by a web of intricate lines, symbolizing the intricacy and beauty of diamonds.",
"Depict the Nine of Diamonds with nine diamonds orbiting around a central point like celestial bodies, symbolizing the brilliance and beauty of diamonds.",
"Draw the Ten of Diamonds with ten diamonds forming a harmonious and symmetrical pattern, symbolizing the balance and beauty of diamonds.",
"Design the Jack of Diamonds as a cunning and resourceful figure holding a diamond-shaped shield, symbolizing strength and resilience.",
"Create the Queen of Diamonds as a sophisticated and poised ruler, surrounded by sparkling diamonds, symbolizing elegance and grace.",
"Illustrate the King of Diamonds as a powerful and commanding leader, with a diamond-shaped crown, symbolizing strength and authority.",
"Design a creative Ace of Diamonds with a diamond encircled by geometric patterns, symbolizing the beauty and brilliance of diamonds.",
by bolts of lightning from above, symbolizing power and strength.",
"Depict the Four of Clubs with four clubs interlocking in a cross formation, symbolizing unity and stability.",
"Draw the Five of Clubs with five clubs floating in a mysterious fog, symbolizing mystery and intrigue.",
"Design the Six of Clubs with six clubs arranged in an interlocking hexagonal pattern, symbolizing strength and resilience.",
"Create the Seven of Clubs with seven clubs elegantly intertwined like a bouquet of flowers, symbolizing beauty and growth.",
"Illustrate the Eight of Clubs with eight clubs connected by a network of vines and leaves, symbolizing growth and renewal.",
"Depict the Nine of Clubs with nine clubs spiraling outward from a central point, symbolizing energy and movement.",
"Draw the Ten of Clubs with ten clubs forming a symmetrical pattern reminiscent of a kaleidoscope, symbolizing beauty and diversity.",
"Design the Jack of Clubs as a strong and agile figure holding a club-shaped shield, symbolizing protection and power.",
"Create the Queen of Clubs as a wise and mysterious ruler, surrounded by a lush garden of clubs, symbolizing wisdom and growth.",
"Illustrate the King of Clubs as a bold and strategic leader, with a club-shaped crown, symbolizing strength and leadership.",
"Design a creative Ace of Clubs with a club surrounded by an intricate network of vines, symbolizing growth and renewal.",

]

Spades = [
"Create a unique Two of Spades featuring two spades connected by a gust of wind that symbolizes movement and change.",
"Illustrate the Three of Spades with three spades forming a mountain peak and a majestic eagle soaring above, symbolizing strength and freedom.",
"Depict the Four of Spades with four spades interlocking in a square formation, symbolizing stability and unity.",
"Draw the Five of Spades with five spades floating in a moonlit night sky, symbolizing mystery and enchantment.",
"Design the Six of Spades with six spades arranged in an interlocking hexagonal pattern, symbolizing strength and resilience.",
"Create the Seven of Spades with seven spades gracefully intertwined, forming a gust of wind, symbolizing change and movement.",
"Illustrate the Eight of Spades with eight spades connected by a web of swirling energy, symbolizing power and movement.",
"Depict the Nine of Spades with nine spades radiating outward from a central point like the rays of the sun, symbolizing energy and brilliance.",
"Draw the Ten of Spades with ten spades forming a symmetrical pattern that evokes a sense of balance and harmony, symbolizing balance and stability.",
"Design the Jack of Spades as a stealthy and cunning figure holding a spade-shaped shield, symbolizing cunning and stealth.",
"Create the Queen of Spades as a cool and calculating ruler, surrounded by a vortex of spades, symbolizing power and control.",
"Illustrate the King of Spades as a determined and disciplined leader, with a spade-shaped crown, symbolizing determination and discipline.",
"Design a creative Ace of Spades with a spade encased in an elegant ice crystal, symbolizing strength and beauty."
]



products = {
    "Hearts": Hearts,
    "Diamonds": Diamonds,
    "Clubs": Clubs,
    "Spades": Spades
}


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

    driver.quit()

if __name__ == "__main__":
    main()