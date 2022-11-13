BASE_URL = 'http://192.168.1.100:8080/'
CREATE_USER_URL = '/api/create_user'
GET_USER_URL = '/api/get_user'
GET_MESSAGES_URL = '/api/get_messages/'
CREATE_CHAT_ROOM_URL = '/api/create_chat_room'
SEARCH_CHAT_URL = '/api/search_room'
UPDATE_USER_PHOTO_URL = '/api/update_user_photo'
UPDATE_CHAT_PHOTO_URL = '/api/update_chat_photo'
UPDATE_MESSAGES_PHOTO_URL = '/api/update_messages_photo'

DEFAULT_IMG = "https://firebasestorage.googleapis.com/v0/b/gravens-chat.appspot.com/o/NoImg.png?alt=media&token=1697ece8-e26f-46e0-a603-078da521e6f0"

SIGNUP_CREDENTIALS = {
                        'username': 'demo4',
                        'email': 'demo@yandex.ru',
                        'password': 'qwerty',
                        'confirmPassword': 'qwerty',
                        'imageUrl': DEFAULT_IMG
                     }

GET_USER_DATA = {
    "email": "demo@yandex.ru"
}

TEST_ROOM_ID = "fVZqRk6CdhMY8LGDQ4aj"
TEST_USER_ID = "ZWNdU7pr4425w26H01Ql"

CREATE_CHAT_ROOM_DATA = {
    "name": "Demo room",
    "creator": SIGNUP_CREDENTIALS['email'],
    "lastUpdate": 1,
    "joined": [SIGNUP_CREDENTIALS['email']],
    "imageUrl": DEFAULT_IMG,
    "username": SIGNUP_CREDENTIALS["username"]
}

SEARCH_CHAT_DATA = {
    'room_id': TEST_ROOM_ID,
    'email': SIGNUP_CREDENTIALS['email']
}

UPDATE_USER_PHOTO_DATA = {
    "userId": TEST_USER_ID,
    "imageUrl": DEFAULT_IMG,
}

UPDATE_CHAT_PHOTO_DATA = {
    "chatId": TEST_ROOM_ID,
    "imageUrl": DEFAULT_IMG,
}

UPDATE_MESSAGES_PHOTO_DATA = {
    "imageUrl": DEFAULT_IMG,
    "email": SIGNUP_CREDENTIALS["email"]
}

POST_HEADERS = {
                    "Content-type": "application/json; charset=UTF-8"
                }

SIGNUP_FIELDS = ['username', 'email', 'password', 'confirmPassword']