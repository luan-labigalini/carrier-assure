from fastapi import HTTPException


class FileNotValid(HTTPException):
    def __init__(self, detail: str = "File is not valid"):
        super().__init__(status_code=422, detail=detail)


class ContentNotValid(HTTPException):
    def __init__(self, detail: str = "Content is not valid"):
        super().__init__(status_code=422, detail=detail)
