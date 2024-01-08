from random import shuffle
from typing import List

# {
#     "name": "Hong Kong",
#     "componentTypes": [
#         {
#             "name": "corner",
#             "components": [

# theme
# theme.name
# theme.layerGroups
# theme.layerGroups[n].name
# theme.layerGroups[n].variant


def has_component_of_type(tile: List, component_type: str) -> bool:
    """
    Checks if tile has a component of a the supplied type
    """
    if len(tile) == 0:
        return False

    component_types = [component["component_type_name"] for component in tile]

    return component_type in component_types


# TODO come up with a better name
def get_indexes(tiles: List, component_type: str, quantity: int = 2) -> List[int]:
    """
    Finds indexes of tiles missing a component of the given type
    and returns the requested number of randomized results
    """
    candidate_indexes = [
        i
        for i, tile in enumerate(tiles)
        if not has_component_of_type(tile, component_type)
    ]
    shuffle(candidate_indexes)
    return candidate_indexes[:quantity]
