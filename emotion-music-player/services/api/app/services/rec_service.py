import requests

ML_SERVICE = "http://ml:8001"

def get_recommendations(user_id, emotion):

    res = requests.post(
        f"{ML_SERVICE}/recommend",
        json={
            "user_id": user_id,
            "emotion": emotion
        }
    )

    return res.json()