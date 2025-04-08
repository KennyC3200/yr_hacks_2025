from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Union, Dict
from pydantic import BaseModel

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException

import ollama
from ollama import ChatResponse

from debug import *

import uvicorn

import time
import json
import threading


# Constants
PAGE_WAIT_TIME = 2
FIND_ELEMENT_DEFAULT_PARAMS = {
    "timeout": 0,
    "exit_on_fail": False,
    "show_debug": False,
    "by": By.CSS_SELECTOR
}
JSON_OUT = "out"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Make it "*" idk why its not working for my local server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LocationRequest(BaseModel):
    url: str
    max_scrolls: int


def server():
    uvicorn.run(app)


@app.get("/")
def root():
    return {"Msg": "Hello there"}


@app.post("/api/scrape/")
async def scrape_location(req: LocationRequest):
    reviews = []

    try:
        print_debug(f"Navigating to url: {shorten_str(req.url)}")
        driver.get(req.url)

        # Allow the page to load
        time.sleep(PAGE_WAIT_TIME)

        # Locate button and click it
        print_debug("Locating reviews button")
        reviews_button = driver.find_element(By.CSS_SELECTOR, "button[jsaction*=\"reviewChart\"]")
        driver.execute_script("arguments[0].click()", reviews_button)
        print_debug("Clicked reviews button")

        # Allow reviews to load
        print_debug("Waiting for reviews to load")
        time.sleep(PAGE_WAIT_TIME)

        # Reviews div
        reviews_div = driver.find_element(By.CSS_SELECTOR, "div[class=\"m6QErb DxyBCb kA9KIf dS8AEf XiKgde \"]")

        # Scrape reviews
        scrolls = 0
        prev_height = driver.execute_script("return arguments[0].scrollHeight", reviews_div)
        print_debug("Starting to scroll")

        while scrolls < req.max_scrolls:
            scrolls += 1
            print_debug(f"Scrolled {scrolls} times")

            # Scroll and let the new reviews load
            driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", reviews_div)
            time.sleep(0.5)

            # Scroll until reaching very bottom of reviews or reaching max scrolls
            curr_height = driver.execute_script("return arguments[0].scrollHeight", reviews_div)
            if curr_height == prev_height:
                print_debug("Reached bottom of reviews section")
                break
            prev_height = curr_height
        time.sleep(1)

        # Scrape the reviews
        print_debug("Starting to scrape the reviews")
        review_elements = reviews_div.find_elements(By.CSS_SELECTOR, "div[class=\"jftiEf fontBodyMedium \"]")
        for review_element in review_elements:
            try:
                more_button = review_element.find_element(By.CSS_SELECTOR, "button[class=\"w8nwRe kyuRq\"]")
                more_button.click()
            except:
                print_alert("Could not locate more_button")

            desc_fields = []
            try:
                desc_fields_container = review_element.find_element(By.CSS_SELECTOR, "div[jslog=\"127691\"]")
                desc_fields = desc_fields_container.find_elements(By.CSS_SELECTOR, "div[jslog]")
            except:
                print_alert("Could not locate desc_fields_container")
            desc = review_element.find_element(By.CSS_SELECTOR, "span[class=\"wiI7pd\"]")

            review = {}
            if desc:
                review["description"] = desc.text
            for desc_field in desc_fields:
                field = desc_field.find_elements(By.CSS_SELECTOR, "span[class=\"RfDO5c\"]")
                if field:
                    if len(field) == 1:
                        s = field[0].text.split(": ")
                        review[s[0]] = int(s[1])
                    elif len(field) == 2:
                        review[field[0].text] = field[1].text
            reviews.append(review)
    except Exception as e:
        print_error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    print_valid(f"Succesfully collected {len(reviews)} reviews")
    return reviews


class AIRequest(BaseModel):
    json: str


@app.post("/api/ai/")
async def ai_req(req: AIRequest):
    print_debug("AI Processing...")
    response: ChatResponse = ollama.chat(model='deepseek-r1:1.5b', messages=[
        {
            "role": "user",
            "content": "Given the following dict with JSON formatted restaurant reviews, generate "
                "overall feedback and areas for improvement. Each key is the title and the"
                f"value is the response from the individual: " + req.json
        },
    ])
    if response.message.content:
        print_valid(response.message.content)
    return response.message.content


if __name__ == "__main__":
    # Create separate thread
    server_thread = threading.Thread(target=server, daemon=True)
    server_thread.start()

    # Create the driver
    driver_opts = webdriver.ChromeOptions()
    driver_opts.add_argument("--no-sandbox")
    driver_opts.add_argument("--disable-dev-shm-usage")
    driver_opts.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(options=driver_opts)

    time.sleep(1000)

    driver.quit()
