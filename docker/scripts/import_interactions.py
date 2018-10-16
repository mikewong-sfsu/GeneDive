from lib import Database, ENVIRONMENT_NAME

import sys
import_file = sys.argv[1]  # The location of the file being imported

print("Executing import")

db = Database(ENVIRONMENT_NAME)
db.import_tsv_file(import_file)

print("Imported",import_file)
