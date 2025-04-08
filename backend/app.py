from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException

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


class LocationMetadata(BaseModel):
    url: str


def server():
    uvicorn.run(app)


@app.get("/")
def root():
    return {"Msg": "Hello there"}


@app.post("/api/search/")
def search_location(metadata: LocationMetadata):
    return {"url": metadata.url}


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

    driver.quit()
