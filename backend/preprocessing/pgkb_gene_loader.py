"""
PHARMGKB_GENE_FILE - columns needed
  0 - PA id
  1 - NCBI id
  4 - Gene Name
  5 - Gene Symbol
"""

"""
PHARMGKB_RELATION_FILE - columns
  0 - Entity 1 PA id
  1 - Entity 1 Name
  2 - Entity 1 Type
  3 - Entity 1 PA id
  4 - Entity 1 Name
  5 - Entity 1 Type
  6 - PMIDs (mult, semicolon sep)
"""

import sqlite3
import re

PHARMGKB_GENE_FILE = "pharmgkb/genes/genes_cleaned.tsv"
PHARMGKB_RELATION_FILE = "pharmgkb/relationships/relationships_cleaned.tsv"
DATABASE_PATH = "data.sqlite"
INTERACTIONS_WRITE = '''insert into interactions ( journal, article_id, pubmed_id, sentence_id, mention1_offset, mention2_offset, mention1, mention2, geneids1, geneids2, probability, context, section, reactome ) values ( "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}" );'''

conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

interactions = []

pa_ncbi_map = {}
used = {}
written = 0

with open(PHARMGKB_GENE_FILE) as file:
  for line in file:
    line = line.split("\t")
    pa_ncbi_map[line[0]] = line[1]
# File Closed

with open (PHARMGKB_RELATION_FILE) as file:
  for line in file:
    line = line[:-1]
    line = line.split("\t")

    if ";" in line[10]:
      pubmed_ids = list(set(line[10].split(";")))
      for pid in pubmed_ids:
        line[10] = pid
        interactions.append(line)
    else:
      interactions.append(line)

for line in interactions:

    entity_a_id = line[0]
    entity_a_name = line[1]
    entity_a_type = line[2]

    entity_b_id = line[3]
    entity_b_name = line[4]
    entity_b_type = line[5]

    pid = line[10]

    if pid == "":
      pid = "Unknown"

    # Skip entries that aren't some combo of gene, chemical, disease
    if entity_a_type not in ['Gene','Chemical','Disease']:
      continue

    if entity_b_type not in ['Gene','Chemical','Disease']:
      continue

    stamp = sorted([entity_a_id, entity_b_id])
    stamp = "_".join(stamp)

    if stamp in used:
      continue

    used[stamp] = True

    # Reformat A to GeneDive ID
    if entity_a_type == 'Gene':
      entity_a_id = pa_ncbi_map[ entity_a_id ]
    elif entity_a_type == 'Disease':
      entity_a_id = "D" + entity_a_id[2:]
    elif entity_a_type == 'Chemical':
      entity_a_id = "C" + entity_a_id[2:]
    else:
      continue

    # Reformat B to GeneDive ID
    if entity_b_type == 'Gene':
      entity_b_id = pa_ncbi_map[ entity_b_id ]
    elif entity_a_type == 'Disease':
      entity_b_id = "D" + entity_b_id[2:]
    elif entity_a_type == 'Chemical':
      entity_b_id = "C" + entity_b_id[2:]
    else:
      continue



    statement = INTERACTIONS_WRITE.format(
      "PharmGKB",
      pid,
      pid,
      0,
      0,
      0,
      entity_a_name,
      entity_b_name,
      entity_a_id,
      entity_b_id,
      0.99,
      "Source: PharmGKB",
      "Unknown",
      "0"
    ) 

    cursor.execute(statement)

conn.commit()

conn.close()

print(len(used))