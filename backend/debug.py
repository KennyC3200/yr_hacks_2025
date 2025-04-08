from selenium.webdriver.remote.webdriver import WebDriver


class AnsiColor:
    white = "\033[0;37m"
    black = "\033[0;30m"
    red = "\033[0;31m"
    green = "\033[0;32m"
    yellow = "\033[0;33m"
    blue = "\033[0;34m"
    purple = "\033[0;35m"
    cyan = "\033[0;36m"
    reset = "\033[0m"


def print_debug(s: str, end="\n"):
    print(f"[DEBUG] {s}", end=end)


def print_alert(s: str, end="\n"):
    print(f"{AnsiColor.yellow}[ALERT] {s}{AnsiColor.reset}", end=end)


def print_error(s: str, end="\n"):
    print(f"{AnsiColor.red}[ERROR] {s}{AnsiColor.reset}", end=end)


def print_valid(s: str, end="\n"):
    print(f"{AnsiColor.green}[VALID] {s}{AnsiColor.reset}", end=end)


def shorten_str(s: str, max_len: int=50) -> str:
    return s if len(s) < max_len else s[:max_len - 3] + "..."


def str_debug(s: str):
    return f"[DEBUG] {s}"


def str_alert(s: str):
    return f"{AnsiColor.yellow}[ALERT] {s}{AnsiColor.reset}"


def str_error(s: str):
    return f"{AnsiColor.red}[ERROR] {s}{AnsiColor.reset}"


def str_valid(s: str):
    return f"{AnsiColor.green}[VALID] {s}{AnsiColor.reset}"


def screenshot_error(driver: WebDriver, function_name: str):
    print_error(f"{function_name} | Saving screenshot: error.png") # TODO: Move the file output to a folder
    driver.save_screenshot("error.png")
