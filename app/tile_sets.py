from copy import deepcopy
from itertools import repeat
from json import load
from random import shuffle
from typing import List

from fastapi import HTTPException

THEMES = [
    "hongKong",
    "test",
]


def has_layer_from_group(tile: List, group_name: str) -> bool:
    """
    Checks if tile has a layer variant from the supplied group
    """
    if len(tile) == 0:
        return False

    group_names = [component["group_name"] for component in tile]

    return group_name in group_names


# TODO come up with a better name
def get_indexes(tiles: List, group_name: str, quantity: int = 2) -> List[int]:
    """
    Finds indexes of tiles missing a layer from the given group
    and returns the requested number of randomized results

    """
    candidate_indexes = [
        i for i, tile in enumerate(tiles) if not has_layer_from_group(tile, group_name)
    ]
    shuffle(candidate_indexes)
    return candidate_indexes[:quantity]


def get_randomized_variants(layer_group: dict, number_of_pairs: int) -> List[dict]:
    """
    Returns shuffled list of variants
    """
    variants = deepcopy(layer_group["variants"])
    num_variants = len(variants)

    multiplier = int(number_of_pairs / num_variants)
    if number_of_pairs % num_variants != 0:
        multiplier += 1

    ret = []
    for _ in range(multiplier):
        shuffle(variants)
        ret += variants

    return ret[:number_of_pairs]


def tile(group_name: str, variant: dict) -> dict:
    return {
        "group_name": group_name,
        "id": variant["id"],
        "svg": variant["svg"],
    }


def add_layer(tiles: List, index: int, group_name: str, variant: dict) -> List:
    """
    Add layer to tile at index
    """
    tile_copy = deepcopy(tiles[index])
    tile_copy.append(tile(group_name, variant))
    tiles[index] = tile_copy
    return tiles


def add_layer_pair(tiles: List, group_name: str, variant: dict) -> List:
    """
    Adds an even number (default 2) of the same layer variant
    to tiles missing layers from the given group
    """
    indexes = get_indexes(tiles, group_name)
    for index in indexes:
        tiles = add_layer(tiles, index, group_name, variant)
    return tiles


def add_layers(tiles: List, layer_group: dict, number_of_pairs: int) -> List:
    """
    Distributes random pairs of variants to fill up the list of tiles
    """
    randomized_variants = get_randomized_variants(layer_group, number_of_pairs)
    for variant in randomized_variants:
        tiles = add_layer_pair(tiles, layer_group["name"], variant)
    return tiles


def convert_to_tile_set(tiles: List, row_size: int, column_size: int) -> List[List]:
    tile_set = []
    i = 0
    for _ in range(column_size):
        tile_set.append(tiles[i : i + row_size])
        i += row_size
    return tile_set


def generate_tile_set(theme: dict, row_size: int, column_size: int) -> List[List[List]]:
    """
    Generates tile set
    """
    number_of_pairs = int((row_size * column_size) / 2)
    tiles = list(repeat([], row_size * column_size))
    for layer_group in theme["layerGroups"]:
        tiles = add_layers(tiles, layer_group, number_of_pairs)
    return convert_to_tile_set(tiles, row_size, column_size)


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
