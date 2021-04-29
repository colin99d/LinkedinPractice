def palindrom(string):
    string = string.lower().replace(" ", "")
    times = int(len(string)/2)

    for i in range(0,times):
        if string[i] != string[-1-i]:
            return False

    return True


print(palindrom("raee car"))