import os
from urllib import request

from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://www.bing.com/create?toWww=1&redig=30C04FC20A7A4BA08168CC7BB17EDFD6"
SAVE_PATH = "C:/Users/ericd/dev/personal/Games/games/images"
CHROME_DRIVER_PATH = "C:/users/ericd/dev/personal/chromedriver_win32/chromedriver.exe"
timeless_journeys = [
    "A whimsical encounter with a prehistoric dinosaur.",
    "A journey through the winding streets of an ancient city, rich with history.",
    "A breathtaking view of Earth from the perspective of a future space colony.",
    "A voyage on a majestic sailing ship through uncharted waters in the Age of Exploration.",
    "A bustling medieval marketplace, filled with merchants and craftsmen from far and wide.",
    "A chance meeting between two famous historical figures from different eras.",
    "A futuristic cityscape blending elements of the past, present, and future.",
    "An adventurer exploring the ruins of a long-lost civilization.",
    "A mesmerizing depiction of a historical event as it unfolds in real-time."
]
# Air
air = [
  "A painting of a swirling cloudscape.",
  "A sculpture of a bird in flight.",
  "A photograph of a waterfall.",
  "A piece of music that evokes the feeling of wind.",
  "A poem that celebrates the beauty of the sky.",
  "A short story about a character who can fly.",
  "A film that takes place in a world without gravity.",
  "A video game that allows players to explore the vastness of space.",
  "A piece of architecture that is inspired by the shapes and forms of clouds."
]

# Earth
earth = [
  "A painting of a mountain range.",
  "A sculpture of a tree.",
  "A photograph of a forest.",
  "A piece of music that evokes the feeling of the earth beneath our feet.",
  "A poem that celebrates the beauty of the land.",
  "A short story about a character who is connected to the earth.",
  "A film that takes place in a natural setting.",
  "A video game that allows players to explore the world around them.",
  "A piece of architecture that is inspired by the shapes and forms of the earth."
]

# Fire
fire = [
  "A painting of a burning flame.",
  "A sculpture of a fire-breathing dragon.",
  "A photograph of a campfire.",
  "A piece of music that evokes the feeling of heat and passion.",
  "A poem that celebrates the power of fire.",
  "A short story about a character who is consumed by fire.",
  "A film that tells the story of a fire.",
  "A video game that allows players to control fire.",
  "A piece of architecture that is inspired by the shapes and forms of fire."
]

# Water
water = [
  "A painting of a crashing wave.",
  "A sculpture of a mermaid.",
  "A photograph of a waterfall.",
  "A piece of music that evokes the feeling of being underwater.",
  "A poem that celebrates the beauty of water.",
  "A short story about a character who is lost at sea.",
  "A film that takes place in a world of water.",
  "A video game that allows players to explore the depths of the ocean.",
  "A piece of architecture that is inspired by the shapes and forms of water."
]

# Wood
wood = [
  "A painting of a forest.",
  "A sculpture of a tree.",
  "A photograph of a log cabin.",
  "A piece of music that evokes the feeling of being in a forest.",
  "A poem that celebrates the beauty of wood.",
  "A short story about a character who lives in a treehouse.",
  "A film that takes place in a world of wood.",
  "A video game that allows players to build things out of wood.",
  "A piece of architecture that is made of wood."
]

# Metal
metal = [
  "A painting of a sword.",
  "A sculpture of a robot.",
  "A photograph of a metal sculpture.",
  "A piece of music that evokes the feeling of strength and power.",
  "A poem that celebrates the beauty of metal.",
  "A short story about a character who is made of metal.",
  "A film that takes place in a world of metal.",
  "A video game that allows players to control a robot.",
  "A piece of architecture that is made of metal."
]

club = [
  "A crowded nightclub with people dancing and drinking.",
  "A close-up of a DJ mixing music on a turntable.",
  "A shot of the stage from the crowd, with a band performing.",
  "A view of the nightclub from above, with people dancing and drinking below.",
  "A neon sign outside of a nightclub, with the name of the club and the date of the event.",
  "A group of people taking selfies in front of a mirror in a nightclub.",
  "A close-up of a woman's face, with her makeup and hair done up for a night out at the club.",
  "A man and a woman dancing together in a nightclub.",
  "A shot of the bar in a nightclub, with people ordering drinks.",
  "A view of the dance floor in a nightclub, with people dancing and having fun."
]

creative_inventors = [
  "A picture of Nikola Tesla and Leonardo da Vinci working together on an invention.",
  "A picture of Nikola Tesla and Leonardo da Vinci brainstorming new ideas.",
  "A picture of Nikola Tesla and Leonardo da Vinci discussing their latest inventions.",
  "A picture of Nikola Tesla and Leonardo da Vinci celebrating a successful invention.",
  "A picture of Nikola Tesla and Leonardo da Vinci being inspired by each other's work.",
  "A picture of Nikola Tesla and Leonardo da Vinci challenging each other to be more creative.",
  "A picture of Nikola Tesla and Leonardo da Vinci pushing the boundaries of what is possible.",
  "A picture of Nikola Tesla and Leonardo da Vinci changing the world with their inventions.",
  "A picture of Nikola Tesla and Leonardo da Vinci inspiring future generations of inventors."
]

nikola_tesla_leonardo_davinci_inventing = [
  "A picture of Nikola Tesla working on his alternating current (AC) induction motor.",
  "A picture of Leonardo da Vinci sketching his plans for the helicopter.",
  "A picture of Nikola Tesla standing next to his Wardenclyffe Tower.",
  "A picture of Leonardo da Vinci painting the Mona Lisa.",
  "A picture of Nikola Tesla giving a lecture on the future of electricity.",
  "A picture of Leonardo da Vinci flying his glider.",
  "A picture of Nikola Tesla sitting at his desk, surrounded by his inventions.",
  "A picture of Leonardo da Vinci working on his Vitruvian Man drawing.",
  "A picture of Nikola Tesla conducting an experiment in his laboratory.",
  "A picture of Leonardo da Vinci sketching his plans for the parachute."
]

night_club = [
  "A group of friends dancing on a crowded dance floor.",
  "A DJ spinning records behind a booth in a dark club.",
  "A woman in a sequined dress taking a selfie in front of a mirror.",
  "A man in a suit and tie smoking a cigar at the bar.",
  "A couple kissing passionately in the corner of the club.",
  "A group of people playing beer pong at a table in the back of the club.",
  "A woman in a revealing outfit dancing on top of a table.",
  "A man crowdsurfing over the heads of the other clubbers.",
  "A group of people singing along to the music at the top of their lungs.",
  "A man throwing his head back and laughing hysterically."
]

illuminati_secrets = [
  "The Illuminati's secret handshake.",
  "The Illuminati's secret code.",
  "The Illuminati's secret oath.",
  "The Illuminati's secret meeting place.",
  "The Illuminati's secret agenda.",
  "The Illuminati's secret plan for world domination.",
  "The Illuminati's secret list of members.",
  "The Illuminati's secret treasure.",
  "The Illuminati's secret weapon.",
  "The Illuminati's secret weakness."
]

free_mason = [
  "A picture of a freemason's apron with the square and compasses hidden in the folds.",
  "A picture of a freemason's square and compasses with the all-seeing eye hidden in the center.",
  "A picture of a freemason's lodge with the secret handshake hidden in the shadows.",
  "A picture of a freemason's meeting with the secret code hidden in the minutes.",
  "A picture of a freemason's funeral with the secret oath hidden on the tombstone.",
  "A picture of a freemason's monument with the secret ritual hidden in the engravings.",
  "A picture of a freemason's charity work with the secret symbol hidden in the background.",
  "A picture of a freemason's education program with the secret teaching hidden in the curriculum.",
  "A picture of a freemason's community service with the secret message hidden in the graffiti."
]

eye_triangle_logo = [
  "A logo of an eye inside a triangle.",
  "A logo of a triangle with an eye in the center.",
  "A logo of a pair of eyes, one inside each side of a triangle.",
  "A logo of a triangle with a spiral coming out of it, and an eye at the end of the spiral.",
  "A logo of a triangle with a lightning bolt coming out of it, and an eye at the end of the lightning bolt.",
  "A logo of a triangle with a sun in the center, and an eye in the sun.",
  "A logo of a triangle with a moon in the center, and an eye in the moon.",
  "A logo of a triangle with a planet in the center, and an eye in the planet.",
  "A logo of a triangle with a galaxy in the center, and an eye in the galaxy.",
  "A logo of a triangle with the universe in the center, and an eye in the universe."
]

bars_eye_view_logo = [
  "A logo of a pair of eyes looking out from a bar window.",
  "A logo of a bar stool with a pair of eyes on it.",
  "A logo of a cocktail glass with a pair of eyes inside it.",
  "A logo of a bartender with a pair of eyes on the back of his head.",
  "A logo of a drunk person with a pair of crossed eyes.",
  "A logo of a group of people dancing in a bar with their eyes closed.",
  "A logo of a bar with a neon sign that says 'Bars Eye View'.",
  "A logo of a bar with a view of the city skyline.",
  "A logo of a bar with a view of the ocean.",
  "A logo of a bar with a view of the mountains."
]

eskimo_bro_logo_funny = [
  "A logo of two eskimo brothers with their noses touching.",
  "A logo of two eskimo brothers sharing a single igloo.",
  "A logo of two eskimo brothers wearing matching tuxedos.",
  "A logo of two eskimo brothers riding a unicycle.",
  "A logo of two eskimo brothers playing patty-cake.",
  "A logo of two eskimo brothers dancing the macarena.",
  "A logo of two eskimo brothers playing poker.",
  "A logo of two eskimo brothers wrestling in the snow.",
  "A logo of two eskimo brothers having a snowball fight.",
  "A logo of two eskimo brothers building a snowman."
]

eskimo_bro_logo = [
  "A logo of two eskimo brothers shaking hands.",
  "A logo of two eskimo brothers hugging.",
  "A logo of a eskimo brother with a thumbs up.",
  "A logo of a eskimo brother with a wink.",
  "A logo of a eskimo brother with a beer in his hand.",
  "A logo of a eskimo brother with a tattoo of an eskimo woman.",
  "A logo of a eskimo brother with a pet polar bear.",
  "A logo of a eskimo brother riding a dog sled.",
  "A logo of a eskimo brother hunting a whale.",
  "A logo of a eskimo brother building an igloo."
]


art_nature = [
  "A painting of a forest with 3 trees in a row, 6 leaves on each tree, and 9 flowers in each flowerbed.",
  "A sculpture of a mountain with 3 peaks, 6 sides, and 9 ridges.",
  "A photograph of a river with 3 tributaries, 6 bends, and 9 waterfalls.",
  "A piece of music that evokes the feeling of being in nature, with 3 notes in each measure, 6 beats per measure, and 9 measures per song.",
  "A poem that celebrates the beauty of nature, with 3 lines per stanza, 6 stanzas per poem, and 9 words per line.",
  "A short story about a character who is lost in nature, with 3 chapters, 6 scenes per chapter, and 9 characters.",
  "A film that tells the story of a journey through nature, with 3 acts, 6 scenes per act, and 9 characters.",
  "A video game that allows players to explore nature, with 3 worlds, 6 levels per world, and 9 challenges per level.",
  "A piece of architecture that is inspired by nature, with 3 floors, 6 rooms per floor, and 9 windows per room."
]

art_abstract = [
  "A painting of a series of 369 circles, each with a different color and size.",
  "A sculpture of a 369-sided polygon, made of 369 different materials.",
  "A photograph of a 369-pixel image, with each pixel a different color.",
  "A piece of music that is made up of 369 notes, each with a different pitch and duration.",
  "A poem that is made up of 369 words, each with a different meaning.",
  "A short story that is made up of 369 sentences, each with a different plot twist.",
  "A film that is made up of 369 scenes, each with a different ending.",
  "A video game that is made up of 369 levels, each with a different challenge.",
  "A piece of architecture that is made up of 369 rooms, each with a different purpose."
]

art_digital = [
  "A painting that is created using a computer program.",
  "A sculpture that is created using a 3D printer.",
  "A photograph that is created using a digital camera.",
  "A piece of music that is created using a synthesizer.",
  "A poem that is created using a word processor.",
  "A short story that is created using a writing program.",
  "A film that is created using a computer animation program.",
  "A video game that is created using a video game engine.",
  "A piece of architecture that is created using a computer-aided design program."
]

eskimo_bro = [
  "A comic about two eskimo brothers who are trying to figure out how to break the news to their wives that they've been Eskimo brothers.",
  "A song about the joys and tribulations of being an eskimo brother.",
  "A movie about a group of eskimo brothers who go on a road trip to find the woman who they've all slept with.",
  "A TV show about a group of eskimo brothers who live together in an apartment.",
  "A video game about eskimo brothers who have to compete against each other to win the heart of the woman they've all slept with.",
  "A poem about the bond between two eskimo brothers.",
  "A short story about the first time two eskimo brothers meet.",
  "A painting of two eskimo brothers shaking hands.",
  "A sculpture of two eskimo brothers hugging.",
  "A dance performance about the relationship between two eskimo brothers."
]

ME_1 = [
    "A serene beach with crystal-clear water and swaying palm trees",
    "A bustling city street with historic architecture and lively cafes",
    "A peaceful mountain landscape with a winding road and vibrant foliage",
    "A dreamy nightscape with a full moon illuminating a tranquil lake",
    "A charming small town with cobblestone streets and colorful houses",
    "A dramatic thunderstorm over a sweeping desert landscape",
    "A panoramic view of a lush, green valley with a winding river",
    "A cozy cabin nestled in a snowy winter forest",
    "A vibrant underwater scene featuring a coral reef and diverse marine life",
    "An idyllic countryside with rolling hills and quaint farmhouses"
]

ME_2 = [
    "A modern city skyline with sleek skyscrapers and a beautiful sunset",
    "A lush tropical rainforest with a hidden waterfall and vibrant wildlife",
    "A picturesque European village with narrow streets and ivy-covered walls",
    "A stunning view of a glacier with vivid blue ice and rugged mountains",
    "An atmospheric medieval castle shrouded in mist",
    "A beautiful Japanese garden with a pond, bridge, and cherry blossoms",
    "A lively street market with a variety of colorful produce and spices",
    "A panoramic view of a rugged coastline with dramatic cliffs and crashing waves",
    "A breathtaking aerial view of a vast canyon",
    "A tranquil Zen garden with raked sand, rocks, and a small pagoda"
]

ME_3 = [
    "A sunlit forest with a carpet of wildflowers and moss-covered trees",
    "An ancient, mysterious ruin hidden in a lush jungle",
    "A charming lakeside village with colorful boats and historic buildings",
    "A dramatic mountain pass with towering peaks and a long, winding road",
    "A peaceful riverside scene with an old stone bridge and willow trees",
    "A fascinating astronomical event, such as a solar eclipse or a comet",
    "A lively urban park with people enjoying various outdoor activities",
    "A serene, moonlit beach with a campfire and gently crashing waves",
    "A vibrant autumn landscape with a canopy of colorful leaves",
    "A captivating view of a cityscape reflected in a still body of water"
]

ME_4 = [
    "An awe-inspiring view of a mountain range under a starry night sky",
    "A nostalgic scene of a vintage railway station and steam train",
    "A tranquil Japanese tea garden with a wooden bridge and koi pond",
    "A stunning aerial view of a coastal city with a harbor and beaches",
    "A mesmerizing geometric pattern found in nature, such as a honeycomb or fractal",
    "A lively festival with traditional costumes, music, and dance",
    "An enchanting forest path lined with tall trees and dappled sunlight",
    "A magical winter scene with a frozen lake and snow-covered trees",
    "A captivating display of fireworks against a city skyline",
    "An elegant, historic ballroom filled with people dancing in period attire"
]


product = [
  "A smartphone with a foldable screen.",
  "A self-driving car.",
  "A 3D printer that can print food.",
  "A robot that can clean your house.",
  "A pair of shoes that can change color.",
  "A jacket that can keep you warm in the cold and cool in the heat.",
  "A watch that can track your health and fitness.",
  "A glasses that can translate languages in real time.",
  "A computer that can learn and adapt to your needs.",
  "A virtual reality headset that can transport you to any place in the world."
]

GPT_1 = [
    "A mystical forest with glowing creatures at twilight",
    "A futuristic city skyline with flying cars and neon lights",
    "An underwater kingdom filled with bioluminescent marine life",
    "A majestic mountain range with a hidden valley of cherry blossoms",
    "A dreamy nightscape with northern lights and shooting stars",
    "An ancient lost city emerging from a desert sandstorm",
    "A panoramic view of a stunning, multi-level waterfall oasis",
    "A cosmic dance of celestial bodies and vibrant nebulae",
    "A serene lakeside village with reflections of autumn colors",
    "A magical island with floating mountains and mythical beasts"
]

GPT_2 = [
    "A steampunk cityscape with intricate gears and steam-powered machinery",
    "A breathtaking sunset over a serene lavender field",
    "A fantasy ice palace shimmering under the aurora borealis",
    "A lush jungle with enormous trees, hidden ruins, and exotic creatures",
    "A whimsical candy land filled with delectable treats and candy rivers",
    "A panoramic view of a rugged coastline with dramatic cliffs and lighthouses",
    "A surreal world where time and space bend and intertwine",
    "A peaceful Zen garden with a mesmerizing koi pond and cherry blossoms",
    "A captivating underwater city with advanced technology and architecture",
    "An enchanting moonlit forest with glowing mushrooms and fairy lights"
]

GPT_3 = [
    "A celestial garden with ethereal flowers and butterflies",
    "A post-apocalyptic world being reclaimed by lush vegetation and wildlife",
    "A mesmerizing desert landscape with enormous sand dunes and a hidden oasis",
    "An ancient temple with elaborate carvings and mysterious symbols",
    "A vast canyon with breathtaking rock formations and a winding river",
    "A magical winter wonderland with snow-covered trees and ice sculptures",
    "A futuristic space colony with innovative architecture and technology",
    "A vibrant coral reef teeming with colorful fish and marine life",
    "A whimsical treehouse village interconnected by rope bridges",
    "A captivating sunset over a peaceful, pristine mountain lake"
]

GPT_4 = [
    "A surreal dreamscape with floating islands and gravity-defying waterfalls",
    "An enchanted forest filled with towering trees and magical creatures",
    "A stunning vista of rolling hills blanketed in wildflowers",
    "A panoramic view of a bustling harbor with historic ships and lighthouses",
    "A serene mountain meadow with wild horses and a golden sunset",
    "A lively street scene in a colorful, historic European town",
    "An otherworldly landscape with vivid rock formations and alien flora",
    "A dramatic storm approaching a tranquil beach",
    "A picturesque countryside with quaint cottages and vibrant gardens",
    "A fascinating galaxy with vibrant star clusters and swirling cosmic dust"
]

UrbanExplorations = [
    "A dynamic cityscape with soaring skyscrapers and bustling streets.",
    "A mysterious, graffiti-covered alleyway that hints at hidden stories.",
    "A historic cobblestone street lined with quaint cafes and shops.",
    "An old, abandoned factory reclaimed by nature, with ivy growing over its walls.",
    "A rooftop garden oasis in the heart of a concrete jungle.",
    "A vibrant street market filled with the sights, sounds, and scents of a bustling city.",
    "A panoramic view of a city skyline at dusk, with lights just starting to twinkle.",
    "A futuristic cityscape with cutting-edge architecture and technology.",
    "A quiet, snow-covered city street in the early hours of the morning."
]

WhimsicalWorlds = [
    "A magical forest filled with glowing, bioluminescent plants and creatures.",
    "A towering castle made entirely of crystalline ice.",
    "A whimsical tea party with anthropomorphic animals as guests.",
    "An underwater city inhabited by intelligent, aquatic beings.",
    "A steampunk metropolis powered by gears, cogs, and steam engines.",
    "A fairytale landscape with candy-colored trees and cotton candy clouds.",
    "A surreal world where gravity-defying structures float in mid-air.",
    "An enchanted garden with enormous flowers and talking insects.",
    "A mystical library filled with ancient books and magical artifacts."
]

EmotionalLandscapes = [
    "An isolated beach at sunset, evoking feelings of solitude and introspection.",
    "A vibrant cityscape, alive with energy and excitement.",
    "A barren desert landscape, symbolizing the starkness of loss and grief.",
    "A lush, peaceful garden, inviting relaxation and tranquility.",
    "A stormy ocean scene, capturing the raw power and intensity of nature.",
    "A serene mountaintop vista, offering a sense of perspective and clarity.",
    "A dense, foggy forest, creating an atmosphere of mystery and intrigue.",
    "A cozy, warmly lit cabin in a snow-covered landscape, evoking comfort and safety.",
    "A fiery volcanic landscape, representing passion and transformation."
]

eco_fashion_store = [
"A model wearing an eco-friendly outfit made from recycled materials.",
"A display of sustainable accessories like bamboo sunglasses and cork wallets.",
"A close-up of an organic cotton t-shirt with a minimalistic design.",
"A group of people attending a workshop on sustainable fashion.",
"A collage of fabric swatches showcasing various eco-friendly textiles.",
"A shot of reusable bags made from recycled materials.",
"A photo of a sewing machine and other tools used in making sustainable clothing.",
"A picture of a model walking down a runway wearing eco-friendly clothing.",
"A close-up of the brand's logo, emphasizing their commitment to sustainability."
]

tech_startup = [
"A team of developers working together at their office desks.",
"A shot of a person using the company's app on their smartphone.",
"A photo of a brainstorming session with sticky notes covering a whiteboard.",
"A close-up of a laptop screen displaying the company's software or product.",
"A group of employees celebrating a successful product launch.",
"A picture of the company's headquarters or office space.",
"A shot of the company's founders giving a presentation at a conference.",
"A photo of team members collaborating via a video call.",
"A snapshot of the company's logo on a banner or promotional materials."
]

gourmet_bakery = [
"A display of freshly baked breads and pastries.",
"A close-up of a delicious, intricately decorated cake.",
"A photo of a baker kneading dough in a flour-dusted kitchen.",
"A shot of customers enjoying their treats in the bakery's cozy seating area.",
"A picture of the bakery's unique and creative packaging.",
"A snapshot of the bakery's exterior, showcasing its inviting storefront.",
"A close-up of a tray of colorful macarons.",
"A photo of a baker icing a cupcake with a piping bag.",
"A collage of different baked goods offered at the bakery."
]

fitness_center = [
"A group of people participating in a high-energy group fitness class.",
"A photo of a personal trainer assisting a client with their workout.",
"A shot of the gym's well-maintained and modern equipment.",
"A close-up of a treadmill screen displaying workout stats.",
"A picture of a group of people attending a yoga class.",
"A snapshot of the gym's inviting and well-lit interior.",
"A photo of a group of friends playing basketball in the gym's court.",
"A shot of the gym's swimming pool, with people swimming laps.",
"A photo of the fitness center's logo on their branded merchandise."
]

eco_tourism_agency = [
"A group of travelers hiking through a lush, green forest.",
"A shot of a person kayaking down a scenic river.",
"A photo of a guide teaching tourists about local wildlife.",
"A close-up of a traveler using binoculars to observe birds in their natural habitat.",
"A picture of a group of people participating in a beach cleanup.",
"A snapshot of a group of travelers cycling through a picturesque landscape.",
"A photo of a tourist enjoying an eco-friendly accommodation.",
"A shot of a guide leading a group on a sustainable walking tour.",
"A collage of the agency's eco-friendly travel destinations."
]


products = {
    "FreeMason": free_mason,
    "Illuminati": illuminati_secrets,
    "Eye_Triangle": eye_triangle_logo,
    "creative_invenventors": creative_inventors,
    "nikola_tesla_leonardo_davinci_inventing": nikola_tesla_leonardo_davinci_inventing,
    
    "Earth": earth,
    "Wind": air,
    "easth": earth,
    "fire": fire,
    "water": water,
    "wood": wood,
    "metal": metal,
    
    "Art-Nature": art_nature,
    "Art-Abstract": art_abstract,
    "Art-Digital": art_digital,
    
    "timeless_journeys": timeless_journeys,
    
    "Eskimo-Bro": eskimo_bro,
    "Eskimo-Bro-Logo": eskimo_bro_logo,
    "Eskimo-Bro-Logo-Funny": eskimo_bro_logo_funny,
    "Bars-Eye-View-Logo": bars_eye_view_logo,
    
    "eco_fashion_store": eco_fashion_store,
    "tech_startup": tech_startup,
    "gourmet_bakery": gourmet_bakery,
    "fitness_center": fitness_center,
    
    "UrbanExplorations": UrbanExplorations,
    "WhimsicalWorlds": WhimsicalWorlds,
    "EmotionalLandscapes": EmotionalLandscapes,
    
    "GPT-1": GPT_1,
    "GPT-2": GPT_2,
    "GPT-3": GPT_3,
    "GPT-4": GPT_4,
    "ME-1": ME_1,
    "ME-2": ME_2,
    "ME-3": ME_3,
    "ME-4": ME_4,
    
    "night_club": night_club,
    
    "Product": product,
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