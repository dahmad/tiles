from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_themes():
    response = client.get("/themes")
    assert response.status_code == 200
    assert response.json() == ["hongKong", "test"]


def test_read_theme():
    response = client.get(
        "/theme/hongKong/generate?theme=hongKong&rowSize=2&columnSize=2"
    )
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert len(response.json()[0]) == 2


def test_read_theme__test():
    response = client.get("/theme/hongKong/generate?theme=test")
    assert response.status_code == 200
    assert len(response.json()) == 6
    assert len(response.json()[0]) == 5


def test_read_theme__odd_number_of_tiles():
    response = client.get(
        "/theme/hongKong/generate?theme=hongKong&rowSize=3&columnSize=3"
    )
    assert response.status_code == 400
