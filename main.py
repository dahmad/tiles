from copy import deepcopy
from itertools import repeat
from json import load
from random import choice, shuffle
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from tile_set_service import get_indexes

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

THEMES = [
    "hongKong",
    "test",
]

TEST_TILESET_FILE_PATH = f"./src/assets/tileSets/testTileSet.json"


def get_randomized_variants(layer_group, number_of_pairs):
    """
    Appends shuffled lists of variants
    """
    layers = deepcopy(layer_group["components"])
    num_layers = len(layers)
    multiplier = int(number_of_pairs / num_layers)
    if number_of_pairs % num_layers != 0:
        multiplier += 1

    ret = []
    for _ in range(multiplier):
        shuffle(layers)
        ret += layers

    return ret[:number_of_pairs]


def generate_tile_set(theme, row_size, column_size):
    """
    Generates tile set
    """
    number_of_pairs = int((row_size * column_size) / 2)

    tiles = list(repeat([], row_size * column_size))

    for component_type in theme["componentTypes"]:
        randomized_variants = get_randomized_variants(component_type, number_of_pairs)

        for random_component in randomized_variants:
            indexes = get_indexes(tiles, component_type["name"])

            for index in indexes:
                # Update tile at index to add component/layer
                tile_copy = deepcopy(tiles[index])
                tile_copy.append(
                    {
                        "component_type_name": component_type["name"],
                        "id": random_component["id"],
                        "svg": random_component["svg"],
                    }
                )
                tiles[index] = tile_copy

    # Convert flat list of tiles to list of rows
    tile_set = []
    i = 0
    for _ in range(column_size):
        tile_set.append(tiles[i : i + row_size])
        i += row_size

    return tile_set


def load_theme(theme: str) -> dict:
    """
    Locates, reads, and returns theme data as JSON
    """
    if theme not in THEMES:
        raise HTTPException(status_code=404, detail=f"Theme '{theme}' not found")

    theme = "hongKong" if theme == "test" else theme

    file_path = f"./src/assets/themes/{theme}.json"

    with open(file_path, "r", encoding="utf-8") as handler:
        return load(handler)


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
            status_code=422, detail="Number of tiles must be an even number"
        )

    if theme == "test":
        with open(TEST_TILESET_FILE_PATH, "r", encoding="utf-8") as handler:
            return load(handler)

    theme = load_theme(theme)
    return generate_tile_set(theme, rowSize, columnSize)
