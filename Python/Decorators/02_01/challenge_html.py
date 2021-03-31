from functools import wraps

def bold(func):
    @wraps(func)
    def wrapper():
        return "<b>"+ func() +"</b>"
    return wrapper

def italics(func):
    @wraps(func)
    def wrapper():
        return "<i>"+ func() +"</i>"
    return wrapper


@bold
@italics
def printfib():
    '''return Fibonacci'''
    return 'Fibonacci'

print(printfib())
