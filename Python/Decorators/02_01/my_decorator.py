def my_decorator(func):
    '''Decorator function'''
    def wrapper():
        return 'F-I-B-O-N-A-C-C-I'

@my_decorator
def fib():
    if n < 2:
        return n
    else:
        return fib(n-1) + fib(n-2)

def fib_three(a, b, c):
    def get_three():
        return a, b, c
    return get_three

print(pfib)