import pytest
from fastapi import HTTPException

from .tile_sets import (
    add_layer,
    add_layer_pair,
    add_layers,
    convert_to_tile_set,
    generate_tile_set,
    get_indexes,
    get_randomized_variants,
    has_layer_from_group,
    load_theme,
)


#
# has_layer_from_group
#
def test_has_layer_from_group__empty_tile():
    tile = []
    group_name = "foo"
    assert not has_layer_from_group(tile, group_name)


def test_has_layer_from_group__true():
    tile = [{"group_name": "foo"}]
    group_name = "foo"
    assert has_layer_from_group(tile, group_name)


def test_has_layer_from_group__false():
    tile = [{"group_name": "foo"}]
    group_name = "bar"
    assert not has_layer_from_group(tile, group_name)


#
# get_indexes
#
def test_get_indexes__tiles_are_empty():
    tiles = [[], []]
    group_name = "foo"
    indexes = get_indexes(tiles, group_name)
    assert 2 == len(indexes)
    assert 1 in indexes
    assert 0 in indexes


def test_get_indexes__returns_correct_indexes():
    tiles = [
        [],
        [{"group_name": "foo"}],
        [],
        [{"group_name": "bar"}],
        [],
        [{"group_name": "foo"}],
    ]
    group_name = "foo"
    indexes = get_indexes(tiles, group_name)
    assert 2 == len(indexes)
    assert 1 not in indexes
    assert 5 not in indexes
    assert 0 in indexes or 2 in indexes or 3 in indexes or 4 in indexes


#
# get_randomized_variants
#
def test_get_randomized_variants():
    # This is not acccurate representation of what a variant looks like
    # but it makes for neat assertions using `set()`
    variants = [0, 1]
    layer_group = {"variants": variants}
    number_of_pairs = 8
    randomized_variants = get_randomized_variants(layer_group, number_of_pairs)
    assert 8 == len(randomized_variants)
    assert set(randomized_variants[:2]) == set(variants)
    assert set(randomized_variants[2:4]) == set(variants)
    assert set(randomized_variants[4:6]) == set(variants)
    assert set(randomized_variants[6:]) == set(variants)


#
# add_layer
#
def test_add_layer__empty_tile():
    tiles = [[], []]
    index = 1
    group_name = "foo"
    variant = {"id": "1", "svg": "<svg 1/>"}
    tiles = add_layer(tiles, index, group_name, variant)
    assert tiles[0] == tiles[0]  # unchanged
    assert tiles[1] == [{"group_name": "foo", "id": "1", "svg": "<svg 1/>"}]


def test_add_layer__non_empty_tile():
    tiles = [[], [], [{"group_name": "foo", "id": "1", "svg": "<svg 1/>"}], []]
    index = 2
    group_name = "bar"
    variant = {"id": "2", "svg": "<svg 2/>"}
    tiles = add_layer(tiles, index, group_name, variant)
    assert tiles[0] == tiles[0]  # unchanged
    assert tiles[1] == tiles[1]  # unchanged
    assert tiles[3] == tiles[3]  # unchanged
    assert tiles[2] == [
        {"group_name": "foo", "id": "1", "svg": "<svg 1/>"},
        {"group_name": "bar", "id": "2", "svg": "<svg 2/>"},
    ]


#
# add_layer_pair
#
def test_add_layer_pair():
    tiles = [
        [{"group_name": "foo", "id": "1", "svg": "<svg 1/>"}],
        [{"group_name": "bar", "id": "2", "svg": "<svg 2/>"}],
        [{"group_name": "foo", "id": "1", "svg": "<svg 1/>"}],
        [{"group_name": "bar", "id": "2", "svg": "<svg 2/>"}],
    ]
    group_name = "foo"
    variant = {"id": "3", "svg": "<svg 3/>"}
    tiles = add_layer_pair(tiles, group_name, variant)
    # These tiles already have a layer of the provided group
    # so they should be unchanged
    assert tiles[0] == tiles[0]
    assert tiles[2] == tiles[2]
    expected_tile = [
        {"group_name": "bar", "id": "2", "svg": "<svg 2/>"},
        {"group_name": "foo", "id": "3", "svg": "<svg 3/>"},
    ]
    assert tiles[1] == expected_tile
    assert tiles[3] == expected_tile


#
# add_layers
#
def test_add_layers():
    before_tiles = [
        [{"group_name": "foo", "id": "1", "svg": "<svg 1/>"}],
        [{"group_name": "foo", "id": "2", "svg": "<svg 2/>"}],
        [{"group_name": "foo", "id": "1", "svg": "<svg 1/>"}],
        [{"group_name": "foo", "id": "2", "svg": "<svg 2/>"}],
    ]
    layer_group = {
        "name": "bar",
        "variants": [
            {"group_name": "bar", "id": "3", "svg": "<svg 3/>"},
            {"group_name": "bar", "id": "4", "svg": "<svg 4/>"},
        ],
    }
    after_tiles = add_layers(before_tiles, layer_group, 2)
    for before_tile, after_tile in zip(before_tiles, after_tiles):
        # The first layer is unchanged
        assert before_tile[0] == after_tile[0]
        # Because the layers are distributed randomly
        # we check that the second layer is any one from the new group
        assert after_tile[1] in layer_group["variants"]


#
# convert_to_tile_set
#
def test_convert_to_tile_set():
    tiles = [[], [], [], [], [], [], [], [], [], [], [], []]
    expected_tile_set = [
        [[], [], []],
        [[], [], []],
        [[], [], []],
        [[], [], []],
    ]
    assert expected_tile_set == convert_to_tile_set(tiles, 3, 4)


#
# generate_tile_set
#
def test_generate_tile_set():
    theme = {
        "layerGroups": [
            {
                "name": "foo",
                "variants": [
                    {"group_name": "foo", "id": "1", "svg": "<svg 1/>"},
                    {"group_name": "foo", "id": "2", "svg": "<svg 2/>"},
                ],
            },
            {
                "name": "bar",
                "variants": [
                    {"group_name": "bar", "id": "3", "svg": "<svg 3/>"},
                    {"group_name": "bar", "id": "4", "svg": "<svg 4/>"},
                ],
            },
        ]
    }
    tile_set = generate_tile_set(theme, 2, 2)
    assert len(tile_set) == 2
    assert len(tile_set[0]) == 2
    for row in tile_set:
        for tile in row:
            assert len(tile) == 2
            group_names = [layer["group_name"] for layer in tile]
            assert group_names == ["foo", "bar"]


#
# load_theme
#
def test_load_theme():
    theme = load_theme("hongKong")
    assert theme["name"] == "Hong Kong"


def test_load_theme__test_loads_hongKong():
    theme = load_theme("test")
    assert theme["name"] == "Hong Kong"


def test_load_theme__non_existent_theme():
    with pytest.raises(HTTPException) as error:
        load_theme("foobar")
    assert str(error.value) == "404: Theme 'foobar' not found"
