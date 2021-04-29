from functools import lru_cache

def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

@lru_cache
def fibonacci_lru(n):
    if n < 2:
        return n
    return fibonacci_lru(n-1) + fibonacci_lru(n-2)
print(fibonacci_lru(400))

def sum(a_list):
    if len(a_list) == 0:
        return 0
    return a_list[0] + sum(a_list[1:])

#print(sum([1,2,3,4]))

def gcd(a,b):
    if b == 0:
        return a
    return gcd(b, a % b)

#print(gcd(5,10))

def multiply(n,a):
    if n == 1:
        return a
    return multiply(n-1, a) + a

#print(multiply(4,5))

def exponent(n,a):
    if n == 1:
        return a
    return exponent(n-1, a) * a

#print(exponent(3,4))

def strLen(a_str):
    if a_str == "":
        return 0
    return 1 + strLen(a_str[1:])

#print(strLen("ween"))