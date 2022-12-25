BASE_URL = 'http://127.0.0.1:8080'
CREATE_USER_URL = '/api/create_user'
GET_USER_URL = '/api/get_user'
GET_MESSAGES_URL = '/api/get_messages/'
CREATE_CHAT_ROOM_URL = '/api/create_chat_room'
SEARCH_CHAT_URL = '/api/search_room'
UPDATE_USER_PHOTO_URL = '/api/update_user_photo'
UPDATE_CHAT_PHOTO_URL = '/api/update_chat_photo'
UPDATE_MESSAGES_PHOTO_URL = '/api/update_messages_photo'

DEFAULT_IMG = "https://firebasestorage.googleapis.com/v0/b/chat-be175.appspot.com/o/jame2.jpg?alt=media&token=62b371d1-f9c6-427c-a4ef-1f86ea87170f"

SIGNUP_CREDENTIALS = {
                        'username': 'demo',
                        'email': 'demo@yandex.ru',
                        'password': 'qwerty',
                        'confirmPassword': 'qwerty',
                        'imageUrl': DEFAULT_IMG
                     }

GET_USER_DATA = {
    "email": "demo@yandex.ru"
}

TEST_ROOM_ID = "wHIuEj3gh7YKhlNsytVO"
TEST_USER_ID = "Za5fiV3NYqgTgDNbR39B"

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