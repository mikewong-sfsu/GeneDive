from lib import Database, ENVIRONMENT_DATA_FOLDER, ENVIRONMENT_NAME
import os

# Create the data folder
if not os.path.exists(ENVIRONMENT_DATA_FOLDER):
    os.makedirs(ENVIRONMENT_DATA_FOLDER)

db = Database(ENVIRONMENT_NAME)
db.build_schema()
