from utils import UPDATE_USER_PHOTO_DATA, UPDATE_USER_PHOTO_URL, POST_HEADERS, UPDATE_CHAT_PHOTO_URL, UPDATE_CHAT_PHOTO_DATA, UPDATE_MESSAGES_PHOTO_DATA, UPDATE_MESSAGES_PHOTO_URL
import ast


def test_update_user_photo(client):
    result = client.post(UPDATE_USER_PHOTO_URL, json=UPDATE_USER_PHOTO_DATA, headers=POST_HEADERS)
    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict["Success"] == "Updated"


def test_update_chat_photo(client):
    result = client.post(UPDATE_CHAT_PHOTO_URL, json=UPDATE_CHAT_PHOTO_DATA, headers=POST_HEADERS)
    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict["Success"] == "Updated"


def test_update_messages_photo(client):
    result = client.post(UPDATE_MESSAGES_PHOTO_URL, json=UPDATE_MESSAGES_PHOTO_DATA, headers=POST_HEADERS)
    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict["Success"] == "Updated"