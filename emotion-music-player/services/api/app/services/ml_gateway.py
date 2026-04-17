import requests

ML_SERVICE = "http://ml:8001"

def predict_emotion(data):

    res = requests.post(
        f"{ML_SERVICE}/predict",
        json=data
    )

    return res.json()