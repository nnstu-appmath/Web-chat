from utils import CREATE_USER_URL, GET_USER_URL, GET_USER_DATA, POST_HEADERS, TEST_ROOM_ID, GET_MESSAGES_URL, BASE_URL
import ast


def test_get_existing_user(client):
    result = client.post(BASE_URL + GET_USER_URL, json=GET_USER_DATA, headers=POST_HEADERS)
    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert type(result_dict["userChatRooms"]) is list and result_dict["user"]
