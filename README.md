# tiles

A recreation of the New York Times game, Tiles

<video src="https://www.dropbox.com/scl/fi/0s02l5j7lm3vo2xifr02c/tiles_demo.mov?rlkey=48cm5orvj948ej5301dcjac4w&st=xry4py5a&dl=0"><video>

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
