from selenium import webdriver
import os

def loginIU(username, password, option):
    driver = webdriver.Chrome(os.getcwd()+"/main/chromedriver")
    driver.get('https://cas.iu.edu/cas/login?cassvc=ANY&casurl=https%3A%2F%2Fone.iu.edu%2F%3Flogin%3Dtrue')
    driver.find_element_by_xpath("/html/body/main/section/form/div[1]/input").send_keys(username)
    driver.find_element_by_xpath("/html/body/main/section/form/div[5]/input").send_keys(password)
    driver.find_element_by_xpath('/html/body/main/section/form/div[6]/input[3]').click()
    if option == "push":
        driver.find_element_by_xpath('//*[@id="auth_methods"]/fieldset[1]/div[1]/button').click()
    elif option == "call":
        driver.find_element_by_xpath('/html/body/div/div/div[1]/div/form/div[1]/fieldset[1]/div[2]/button').click()
    return True
