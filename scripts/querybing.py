import os
from urllib import request

from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://www.bing.com/create?toWww=1&redig=30C04FC20A7A4BA08168CC7BB17EDFD6"
SAVE_PATH = "C:/Users/ericd/dev/personal/Games/games/images"
CHROME_DRIVER_PATH = "C:/users/ericd/dev/personal/chromedriver_win32/chromedriver.exe"

fire_ring_4 = [
    "Ace (Suicide Shot): A game where players mix different types of alcohol and drink them in rapid succession.",
    "2 (Tequila Sunrise): A person drinking tequila and orange juice, and then vomiting into a bucket to create a sunrise effect.",
    "3 (Body Shots Galore): A game where people take shots off of each other's bodies in increasingly suggestive places.",
    "4 (Orgy Poker): A game where people play strip poker, and the losers have to engage in sexual activities with the winner.",
    "5 (Bull Riding): A game where players mount a mechanical bull while holding a drink, and the last one to fall off drinks.",
    "6 (Bros Before Hoes): A game where players drink based on how many sexual partners they've had, with those who have had fewer drinks more.",
    "7 (Naked Mile): A game where players have to run a mile naked while carrying a drink, and the last one to finish drinks.",
    "8 (Power Chugger): A game where players have to chug a large amount of alcohol in a short time, and the last one to finish drinks.",
    "9 (Drunk Driving): A game where players take turns driving a car or other vehicle while drunk, and the last one to crash drinks.",
    "10 (Booze Cruise): A game where players drink while on a boat or other watercraft, and the last one to jump in the water drinks.",
    "Jack (The Lick Race): A game where players race to lick a line of salt, drink a shot, and suck a lemon wedge.",
    "Queen (Truth or Strip): A game where players choose between telling the truth or taking off a piece of clothing.",
    "King (Alcohol Enema): A game where players pour alcohol into their rectum using a funnel, and the last one to hold it in drinks."
]

fire_ring_3 = [
    "Ace (Death Cup): A game where players pour a bit of their drink into a communal cup, and the last one to finish it drinks the whole thing.",
    "2 (Russian Roulette): A person spinning a gun-like object that determines who takes a shot.",
    "3 (Gutterball): A person pouring their drink into a bowling ball and drinking from it.",
    "4 (Strip Poker): A game where people take off a piece of clothing each time they lose a round.",
    "5 (Slap Cup): A game where players try to bounce a ping pong ball into a cup, and the last one to do it drinks.",
    "6 (Asshole): A game where players are assigned different roles and have to drink or perform certain actions based on their rank.",
    "7 (Edward 40-Hands): A game where players have to tape 40-ounce bottles of beer to their hands and can't remove them until they finish both.",
    "8 (Centurion): A game where players take a shot of beer every minute for 100 minutes straight.",
    "9 (Drinkopoly): A board game where players move around the board and have to drink or perform challenges based on where they land.",
    "10 (Boozy Jenga): A game where players remove blocks from a Jenga tower and have to complete challenges or drink based on the block they pull.",
    "Jack (Drink Dunk): A game where players try to dunk a ball into a net while holding a drink, and the last one to do it drinks.",
    "Queen (Dare Wheel): A game where players spin a wheel to determine their dare, which can range from harmless to extreme.",
    "King (Beer Bong): A game where players pour beer into a funnel and chug it through a tube, usually in a race against others."
]

fire_ring_2 = [
    "Ace (Chug): A group of friends in a circle, chugging their drinks one after another in a race to the bottom.",
    "2 (Pick Your Poison): A person choosing a drink from a selection of various alcoholic beverages.",
    "3 (Toast to Destruction): A person smashing their glass on the ground after taking a shot.",
    "4 (Shot Roulette): A group of people taking turns choosing a shot without knowing what's in it.",
    "5 (Never Have I Ever): A game where people confess to things they've never done, and those who have done them drink.",
    "6 (Flip the Cup): A competition where two teams race to drink and flip a cup over first.",
    "7 (Finger Game): A game where players place their fingers on a table, and the last one to lift theirs drinks.",
    "8 (Cheers to the Devil): A person drinking with the intention of summoning the devil.",
    "9 (Rhyme Time Bomb): A game where players take turns saying a word that rhymes with a random word, and the first one to fail drinks.",
    "10 (Truth or Dare): A game where players have to choose between revealing a personal truth or completing a risky dare.",
    "Jack (Body Shots): A person licking or sucking a shot off another person's body.",
    "Queen (Questionable Questions): A game where players have to ask uncomfortable or embarrassing questions to others.",
    "King (Power Hour): A drinking game where people take a shot of beer every minute for an hour straight."
]

fire_ring = [
    "Ace (Waterfall): A group of friends in a circle, with one person starting to drink while the others follow suit, creating a waterfall effect.",
    "2 (Choose): A person pondering, with a finger on their chin, while looking at a group of friends to choose someone to drink.",
    "3 (Me): A person happily raising their glass, ready to take a sip.",
    "4 (Wh0re): A group of women raising their wine glasses, preparing to take a drink.",
    "5 (Thumb Master): A hand placing a thumb on a table, with other hands following suit.",
    "6 (Dicks): A group of men raising their beer glasses, getting ready to drink.",
    "7 (Heaven): Several people pointing their fingers to the sky, with the last person taking a drink.",
    "8 (Mate): Two friends clinking their glasses together, smiling as they become drinking partners.",
    "9 (Rhyme): A group of friends sitting in a circle, each saying a word that rhymes with the previous word.",
    "10 (Categories): A group of people brainstorming words related to a category like football.",
    "Jack (Make a Rule): A person with a mischievous grin, creating a new rule while others look on attentively.",
    "Queen (Questions): A group of friends in a circle, engaging in a lively conversation by asking questions.",
    "King (Pour): A person pouring a drink into a cup placed in the middle of the table, with other drinks already mixed in."
]


products = {
  "Fire Ring 1": fire_ring,
  "Fire Ring 2": fire_ring_2,
  "Fire Ring 3": fire_ring_3,
  "Fire Ring 4": fire_ring_4,
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