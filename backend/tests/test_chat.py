from utils import CREATE_CHAT_ROOM_URL, GET_MESSAGES_URL, POST_HEADERS, TEST_ROOM_ID, CREATE_CHAT_ROOM_DATA, SEARCH_CHAT_URL, SEARCH_CHAT_DATA
import ast


def test_get_messages(client):
    result = client.get(GET_MESSAGES_URL + TEST_ROOM_ID)
    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    received_data = result_dict["data"].copy()
    result_dict["data"].sort(key=lambda x: x["createdAt"], reverse=True)
    assert result_dict["data"] == received_data


def test_create_chat_room(client):
    result = client.post(CREATE_CHAT_ROOM_URL, json=CREATE_CHAT_ROOM_DATA, headers=POST_HEADERS)
    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict["roomId"] and result_dict["lastUpdate"]


def test_search_existing_chat_room(client):
    result = client.post(SEARCH_CHAT_URL, json=SEARCH_CHAT_DATA, headers=POST_HEADERS)

    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict.get("Success") is not None


def test_search_missing_chat_room(client):
    temp = SEARCH_CHAT_DATA["room_id"]
    SEARCH_CHAT_DATA["room_id"] += "demo"
    result = client.post(SEARCH_CHAT_URL, json=SEARCH_CHAT_DATA, headers=POST_HEADERS)
    SEARCH_CHAT_DATA["room_id"] = temp

    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict.get("Fail") is not None