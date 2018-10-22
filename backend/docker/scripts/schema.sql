CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER NOT NULL,
        journal VARCHAR(64),
        article_id VARCHAR(64),
        pubmed_id INTEGER,
        sentence_id INTEGER,
        mention1_offset INTEGER,
        mention2_offset INTEGER,
        mention1 VARCHAR(32) collate nocase,
        mention2 VARCHAR(32) collate nocase,
        geneids1 VARCHAR(64),
        geneids2 VARCHAR(64),
        probability FLOAT,
        context VARCHAR(256),
        section VARCHAR(64), reactome INTEGER, type1 CHARACTER(1), type2 CHARACTER(1),
        PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS "gene_sets" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "set_name" VARCHAR NOT NULL , "gene" VARCHAR NOT NULL );
CREATE TABLE IF NOT EXISTS "ncbi_gene_data" ("id" INTEGER PRIMARY KEY  NOT NULL , "primary" VARCHAR, "aliases" VARCHAR, "name" VARCHAR);
CREATE TABLE IF NOT EXISTS "interactions_multi" (
        id INTEGER NOT NULL,
        journal VARCHAR(64),
        article_id VARCHAR(64),
        pubmed_id INTEGER,
        sentence_id INTEGER,
        mention1_offset INTEGER,
        mention2_offset INTEGER,
        mention1 VARCHAR(32) collate nocase,
        mention2 VARCHAR(32) collate nocase,
        geneids1 VARCHAR(64),
        geneids2 VARCHAR(64),
        probability FLOAT,
        context VARCHAR(256),
        section VARCHAR(64),
        PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS "test" ("val1" INTEGER, "val2" INTEGER);
CREATE TABLE IF NOT EXISTS "interaction_count" ("gene_id" INTEGER PRIMARY KEY  NOT NULL , "amount" INTEGER NOT NULL );
CREATE TABLE IF NOT EXISTS "test_interactions" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "journal" VARCHAR, "article_id" INTEGER, "pubmed_id" INTEGER, "sentence_id" INTEGER, "mention1_offset" INTEGER, "mention2_offset" INTEGER, "mention1" VARCHAR, "mention2" VARCHAR, "geneids1" INTEGER, "geneids2" INTEGER, "probability" FLOAT, "context" VARCHAR, "section" VARCHAR, "reactome" BOOL);
CREATE INDEX IF NOT EXISTS index_name ON gene_sets (set_name);
CREATE INDEX IF NOT EXISTS gid1 ON interactions(geneids1);
CREATE INDEX IF NOT EXISTS gid2 ON interactions(geneids2);
CREATE TABLE IF NOT EXISTS alternative_ids (
            mesh VARCHAR UNIQUE,
            pgkb VARCHAR UNIQUE,
            ncbi VARCHAR UNIQUE,
            vals VARCHAR,
            type VARCHAR,
            PRIMARY KEY (mesh, pgkb, ncbi)
            );