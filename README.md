# tiles

A recreation of the New York Times game, Tiles

https://www.dropbox.com/scl/fi/0s02l5j7lm3vo2xifr02c/tiles_demo.mov

## Running the application

In one terminal window:

```bash
yarn install
yarn start
```

In another terminal window:

```bash
pip install -r ./requirements.txt
uvicorn main:app --app-dir app --reload
```

## Running tests

React:

```bash
yarn install
yarn test
```

Then press `a` to run all tests.

Python:

```bash
pip install -r ./requirements.txt
PYTHON_PATH=app pytest --verbose
```
