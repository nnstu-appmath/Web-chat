import pytest
import sys
import os
sys.path.append(os.path.join(sys.path[0], '../src'))
from main import application


@pytest.fixture
def client():
    application.config["TESTING"] = True
    with application.test_client() as client:
        yield client