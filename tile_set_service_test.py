import unittest

from tile_set_service import get_indexes, has_component_of_type


class TestTileSetService(unittest.TestCase):
    # has_component_of_type
    def test_empty_tile(self):
        self.assertFalse(has_component_of_type([], "foo"))

    def test_has_component_of_type(self):
        tile = [{"component_type_name": "foo"}]
        self.assertTrue(has_component_of_type(tile, "foo"))

    def test_has_component_of_different_type(self):
        tile = [{"component_type_name": "bar"}]
        self.assertFalse(has_component_of_type(tile, "foo"))

    # get_indexes
    def test_tiles_are_empty(self):
        tiles = [[], []]
        indexes = get_indexes(tiles, "foo")
        self.assertEqual(2, len(indexes))
        self.assertTrue(1 in indexes)
        self.assertTrue(0 in indexes)

    def test_returns_correct_indexes(self):
        tiles = [
            [],
            [{"component_type_name": "foo"}],
            [],
            [{"component_type_name": "bar"}],
            [],
            [{"component_type_name": "foo"}],
        ]
        indexes = get_indexes(tiles, "foo")
        self.assertEqual(2, len(indexes))
        self.assertTrue(1 not in indexes)
        self.assertTrue(5 not in indexes)
        self.assertTrue(0 in indexes or 2 in indexes or 3 in indexes or 4 in indexes)
        return


if __name__ == "__main__":
    unittest.main()
