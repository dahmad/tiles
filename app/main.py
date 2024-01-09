from json import load
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .tile_sets import THEMES, generate_tile_set, load_theme

app = FastAPI()

origins = [
    "http://localhost:3000",  # React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEST_TILESET_FILE_PATH = f"./src/assets/tileSets/testTileSet.json"


@app.get("/themes")
def read_themes() -> List[str]:
    return THEMES


@app.get("/theme/{theme}")
def read_theme(theme: str) -> dict:
    return load_theme(theme)


@app.get("/theme/{theme}/generate")
def read_generated_tile_set(theme: str, rowSize: int = 5, columnSize: int = 6) -> List:
    if (rowSize * columnSize) % 2 != 0:
        raise HTTPException(
            status_code=400, detail="Number of tiles must be an even number"
        )

    if theme == "test":
        with open(TEST_TILESET_FILE_PATH, "r", encoding="utf-8") as handler:
            return load(handler)

    theme = load_theme(theme)
    return generate_tile_set(theme, rowSize, columnSize)
