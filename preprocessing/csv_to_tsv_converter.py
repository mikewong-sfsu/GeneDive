import sys,csv
#outputFile =
csv.writer(open('output.tsv', 'w+'), delimiter='\t').writerows(csv.reader(open("data/genedisease_relationship_100417_sfsu.csv")))