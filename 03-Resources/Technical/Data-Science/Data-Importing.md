# Importing Data (01j0yd9zbs6pze7b9dfsndwt39)

Source: Importing Data (01j0yd9zbs6pze7b9dfsndwt39).html

The first step to using a database system is to insert data into that system. DuckDB provides several data ingestion methods that allow you to easily and efficiently fill up the database. In this section, we provide an overview of these methods so you can select which one is correct for you.
Insert Statements
Insert statements are the standard way of loading data into a database system. They are suitable for quick prototyping, but should be avoided for bulk loading as they have significant per-row overhead.
INSERT INTO people VALUES (1, 'Mark');
For a more detailed description, see the
page on the
INSERT statement
.
CSV Loading
Data can be efficiently loaded from CSV files using several methods. The simplest is to use the CSV file's name:
SELECT * FROM 'test.csv';
Alternatively, use the
read_csv
function
to pass along options:
Or use the
COPY
statement
:
It is also possible to read data directly from
compressed CSV files
(e.g., compressed with
gzip
):
DuckDB can create a table from the loaded data using the
CREATE TABLE ... AS SELECT
statement
:
For more details, see the
page on CSV loading
.
Parquet Loading
Parquet files can be efficiently loaded and queried using their filename:
Alternatively, use the
read_parquet
function
:
Or use the
COPY
statement
:
For more details, see the
page on Parquet loading
.
JSON Loading
JSON files can be efficiently loaded and queried using their filename:
Alternatively, use the
read_json_auto
function
:
Or use the
COPY
statement
:
For more details, see the
page on JSON loading
.
Appender
In several APIs (C, C++, Go, Java, and Rust), the
Appender
can be used as an alternative for bulk data loading. This class can be used to efficiently add rows to the database system without using SQL statements.