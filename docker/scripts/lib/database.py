import sqlite3
from typing import Dict
from .environment import *


class Database:

    __SCHEMA_FILE = ENVIRONMENT_SCRIPTS_FOLDER + "/schema.sql"
    __TSV_DELIMITER = "\t"
    __INSERT_SQL = 'INSERT INTO {table} ({columns}) VALUES ({values});'

    __DEFAULT_INTERACTIONS_INSERT_COLUMNS = [
        "journal",
        "article_id",
        "pubmed_id",
        "sentence_id",
        "mention1_offset",
        "mention2_offset",
        "mention1",
        "mention2",
        "geneids1",
        "geneids2",
        "probability",
        "context",
        "section",
        "reactome",
        "type1",
        "type2",
        ]

    def __init__(self):
        self.__connection = sqlite3.connect(ENVIRONMENT_SQLITE_LOCATION)

    def build_schema(self):
        schema = None
        with open(self.__SCHEMA_FILE, 'r') as myfile:
            schema = myfile.read().replace('\n', '')

        self.__connection.executescript(schema)
        self.__connection.commit()

    def import_tsv_file(self, file_location: str) -> bool:
        """

        Imports a TSV file into the database

        :param file_location: The location of the file with the TSV data
        :return: True if successful, False if failure
        """

        interactions = self.__convert_tsv_to_obj(file_location)

        # check if all the fields are present
        given_columns = interactions[0].keys()
        required_columns = self.__DEFAULT_INTERACTIONS_INSERT_COLUMNS
        all_required_present = all(map(lambda x: x in given_columns, required_columns))

        if not all_required_present:
            return False

        self.__add_objs_to_db("interaction", interactions, required_columns)

        return True

    def __convert_tsv_to_obj(self, file_location: str) -> [Dict[str, str]]:
        """

        :param file_location: The exact location of the TSV file
        :return: An array of objects, each representing a line in the TSV file
        """
        final_object_array = []  # type: [Dict[str, str]]

        with open(file_location, encoding='utf-8') as file:
            # Index is the column name, column number is the value
            header_indexes = {}  # type: Dict[int, str]
            line_number = 0
            for line in file:
                line_number += 1
                line = line.strip().split(self.__TSV_DELIMITER)

                # Read the headers of the file and assign them to a dictionary {column_name: column_number}
                if line_number == 1:
                    header_indexes = {name.strip(): col for col, name in enumerate(line)}

                # every subsequent line read as an entry
                else:
                    line_object = {}
                    for col_nam, col_num in header_indexes:
                        line_object[col_nam] = line[col_num]
                    final_object_array.append(line_object)

        return final_object_array

    def __add_objs_to_db(self, table: str, data: [Dict[str, str]], columns: [str]) -> bool:
        """

        Takes the data, inserts it into the database, then commits the changes.

        :param table: The name of the table to insert which the data will be inserted into
        :param data: An array of objects which will be inserted into the db. The key represents the column,
        and the value represents the value, in the table
        :param columns: The columns that will be inserted. The data could contain more information than neccessary,
        this will contain only the valid columns we wish to insert.
        """

        # Creates an SQL statement with the column names and ?'s to match each column
        statement = self.__INSERT_SQL.format(
            table=table,
            columns=",".join(columns),
            values=",".join(map(lambda: "?", columns)),
            )
        cursor = self.__connection.cursor()

        for row in data:
            cursor.execute(statement, row)

        self.__connection.commit()

        return True
