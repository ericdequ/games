import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

output_path = "output.json"

prompts = [
    "test prompt "
    "test prompt 2"
]

email = input("Enter your email: ")
password = input("Enter your password: ")

options = webdriver.ChromeOptions()
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--disable-web-security')
options.add_argument('--disable-extensions')
options.add_argument('--no-sandbox')
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--proxy-server=direct://')
options.add_argument('--proxy-bypass-list=*')
options.add_argument('--start-maximized')
options.add_argument('--log-level=3')

driver = webdriver.Chrome("C:/users/ericd/dev/personal/chromedriver_win32/chromedriver.exe", options=options)
driver.get("https://bard.google.com/")

sign_in_button = driver.find_element(By.XPATH, '/html/body/header/div[2]/div[3]/div[1]/a/span')
sign_in_button.click()

email_input = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="identifierId"]')))
email_input.send_keys(email)

next_button = driver.find_element(By.XPATH, '/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div[1]/div/div/button/div[3]')
next_button.click()

password_input = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section[2]/div/div/div[1]/div[1]/div/div/div/div/div[1]/div/div[1]/input')))
password_input.send_keys(password)

next_button = driver.find_element(By.XPATH, '/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div[1]/div/div/button/div[3]')
next_button.click()

# Wait for login
WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, '//*[@id="mat-input-0"]')))

results = []

for prompt in prompts:
    print(f"Processing prompt: {prompt}")
    input_box = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="mat-input-0"]')))
    input_box.clear()
    input_box.send_keys(prompt)

    send_button = driver.find_element(By.XPATH, '//*[@id="mat-icon-0"]')
    send_button.click()

    print("Waiting for the response...")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "model-response")))

    actions_menu_button = driver.find_element(By.XPATH, '//*[@id="actions-menu-button-r_5fd2df77ffe1300b"]/span[3]')
    actions_menu_button.click()

    copy_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="mat-menu-panel-0"]/div/div/button')))
    copy_button.click()

    time.sleep(1)

    response = driver.find_element(By.CSS_SELECTOR, "model-response .text-content").text
    print("Response received:")
    print(response)

    result = {
        "prompt": prompt,
        "response": response
    }
    results.append(result)

with open(output_path, "w") as outfile:
    json.dump(results, outfile)

print("All prompts processed. Results saved to:", output_path)

driver.quit()
