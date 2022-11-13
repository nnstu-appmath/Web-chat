from random import randint
from utils import CREATE_USER_URL, SIGNUP_CREDENTIALS, SIGNUP_FIELDS, POST_HEADERS
import ast


def test_signup_empty_fields(client):

    for field_name in SIGNUP_FIELDS:
        temp = SIGNUP_CREDENTIALS[field_name]
        SIGNUP_CREDENTIALS[field_name] = ''
        result = client.post(CREATE_USER_URL, json=SIGNUP_CREDENTIALS, headers=POST_HEADERS)

        assert result.status_code == 400

        result_str = result.data.decode("UTF-8")
        result_dict = ast.literal_eval(result_str)

        SIGNUP_CREDENTIALS[field_name] = temp
        field_name = field_name[0].upper() + field_name[1:]

        assert result_dict['error'] == f'{field_name} field is empty!'


def test_signup_wrong_email_format_input(client):
    wrong_emails = ['aaa', 'a@a.a']

    for email in wrong_emails:
        temp = SIGNUP_CREDENTIALS['email']
        SIGNUP_CREDENTIALS['email'] = email

        result = client.post(CREATE_USER_URL, json=SIGNUP_CREDENTIALS, headers=POST_HEADERS)

        assert result.status_code == 400

        result_str = result.data.decode("UTF-8")
        result_dict = ast.literal_eval(result_str)
        SIGNUP_CREDENTIALS['email'] = temp

        assert result_dict['error'] == 'Wrong email format!'


def test_wrong_password_format_input(client):
    wrong_passwords = ['q', 'qwert', 'fg423']

    for password in wrong_passwords:
        temp = SIGNUP_CREDENTIALS['password']
        SIGNUP_CREDENTIALS['password'] = password
        SIGNUP_CREDENTIALS['confirmPassword'] = password
        result = client.post(CREATE_USER_URL, json=SIGNUP_CREDENTIALS, headers=POST_HEADERS)

        assert result.status_code == 400

        result_str = result.data.decode("UTF-8")
        result_dict = ast.literal_eval(result_str)
        SIGNUP_CREDENTIALS['password'] = temp
        SIGNUP_CREDENTIALS['confirmPassword'] = temp

        assert result_dict['error'] == 'Password must contain at least 6 symbols!'


def test_password_doesnt_match(client):
    password = 'qwerty'
    confirm_password = 'qwertyy'

    temp = SIGNUP_CREDENTIALS['password']

    SIGNUP_CREDENTIALS['password'] = password
    SIGNUP_CREDENTIALS['confirmPassword'] = confirm_password
    result = client.post(CREATE_USER_URL, json=SIGNUP_CREDENTIALS, headers=POST_HEADERS)

    assert result.status_code == 400

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)
    SIGNUP_CREDENTIALS['password'] = temp
    SIGNUP_CREDENTIALS['confirmPassword'] = temp

    assert result_dict['error'] == 'Password does not match!'


def test_correct_signup(client):
    temp = SIGNUP_CREDENTIALS['email']
    SIGNUP_CREDENTIALS['email'] = 'demo' + ''.join([str(randint(0, 9)) for i in range(10)]) + '@yandex.ru'
    result = client.post(CREATE_USER_URL, json=SIGNUP_CREDENTIALS, headers=POST_HEADERS)

    assert result.status_code == 200

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)
    SIGNUP_CREDENTIALS['email'] = temp

    assert result_dict['Success'] == 'Account created successfully'


def test_with_exist_email(client):
    result = client.post(CREATE_USER_URL, json=SIGNUP_CREDENTIALS, headers=POST_HEADERS)

    assert result.status_code == 400

    result_str = result.data.decode("UTF-8")
    result_dict = ast.literal_eval(result_str)

    assert result_dict['error'] == 'Email already exist'