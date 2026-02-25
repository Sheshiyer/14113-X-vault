# Implementation Plan: Hybrid PARA Knowledge System

## 1. Overview

### 1.1. Goal
To create a living, queryable database for the `twc-vault` that tracks the evolution of knowledge, enabling both structural and semantic queries. This system will be built with a "safety-first" principle, treating the existing vault as a read-only source of truth.

### 1.2. Final Architecture (Post-Analysis)
Our analysis concluded that manually building a temporal (history) layer is the biggest risk. Therefore, this plan adopts a revised architecture that mitigates this risk by using a native temporal database.

*   **Primary Database:** **XTDB**. A bitemporal database that uses a familiar SQL interface. It will store the graph structure (nodes, edges) and handle all versioning and historical queries automatically.
*   **Semantic Layer:** **ChromaDB**. A lightweight, open-source vector database for semantic search on note content. It will be self-hosted.
*   **Sync Service:** A Python service that watches the filesystem for changes, parses `.md` files, and updates the databases.
*   **Development Environment:** The entire project will be built in an isolated directory (`~/dev/para-indexer`) to guarantee no modifications are made to the existing vault.

### 1.3. Guiding Principles
*   **Read-Only Vault:** The `twc-vault` directory is sacred and will only be read from. No file will ever be modified or deleted by this system.
*   **Test-Driven Development (TDD):** Every piece of logic, from parsing to API endpoints, will be developed with a "test-first" approach.
*   **Granular Commits:** Each small, completed task will be a single commit to build a clean and understandable project history.
*   **Service-Based Architecture:** The core components (Parser, Watcher, API) will be developed as distinct services, communicating via a database, to ensure separation of concerns.

---

## Phase 0: Project Setup & Environment Configuration (18 Tasks)

**Goal:** Create a clean, isolated, and reproducible development environment.

### Sprint 0.1: Workspace & Git Initialization
1.  **Task:** Create the main project directory.
    *   **Command:** `mkdir -p ~/dev/para-indexer`
2.  **Task:** Navigate into the new project directory.
    *   **Command:** `cd ~/dev/para-indexer`
3.  **Task:** Initialize a new Git repository.
    *   **Command:** `git init`
4.  **Task:** Create a `.gitignore` file.
    *   **Command:** `touch .gitignore`
5.  **Task:** Populate `.gitignore` with standard Python and environment patterns.
    *   **Content:**
        ```
        __pycache__/
        *.pyc
        .env
        .venv/
        build/
        dist/
        *.egg-info/
        ```
6.  **Task:** Create the initial project structure.
    *   **Command:** `mkdir -p src/parser src/watcher src/api tests/parser tests/watcher tests/api scripts/`
7.  **Task:** Create placeholder `__init__.py` files to define Python packages.
    *   **Command:** `touch src/__init__.py src/parser/__init__.py src/watcher/__init__.py src/api/__init__.py tests/__init__.py tests/parser/__init__.py tests/watcher/__init__.py tests/api/__init__.py`
8.  **Task:** Commit the initial project structure.
    *   **Command:** `git add . && git commit -m "Initial commit: project structure"`

### Sprint 0.2: Python Environment & Dependencies
9.  **Task:** Create a Python virtual environment.
    *   **Command:** `python3 -m venv .venv`
10. **Task:** Activate the virtual environment.
    *   **Command:** `source .venv/bin/activate`
11. **Task:** Create a `requirements.txt` file.
    *   **Command:** `touch requirements.txt`
12. **Task:** Add core dependencies to `requirements.txt`.
    *   **Content:**
        ```
        # Parser & Watcher
        watchdog
        mistune
        PyYAML
        # Vector DB
        chromadb
        sentence-transformers
        # API
        fastapi
        uvicorn
        # XTDB Driver (placeholder)
        psycopg2-binary
        ```
13. **Task:** Install initial dependencies.
    *   **Command:** `pip install -r requirements.txt`
14. **Task:** Create a `README.md` file for the project.
    *   **Command:** `touch README.md`
15. **Task:** Populate `README.md` with project title and setup instructions.
    *   **Content:** `# PARA Knowledge System Indexer

Setup:
1. `python3 -m venv .venv`
2. `source .venv/bin/activate`
3. `pip install -r requirements.txt``
16. **Task:** Install development-only dependencies.
    *   **Command:** `pip install pytest`
17. **Task:** Create a `pytest.ini` configuration file.
    *   **Command:** `touch pytest.ini`
18. **Task:** Configure `pytest.ini`.
    *   **Content:** `[pytest]
pythonpath = src
`

---

## Phase 1: Database Setup & Proof-of-Concept (32 Tasks)

**Goal:** Get local instances of XTDB and ChromaDB running and validate that they can store a single, parsed note.

### Sprint 1.1: Dockerized Databases
19. **Task:** Create a `docker-compose.yml` file.
20. **Task:** Define the ChromaDB service in `docker-compose.yml`.
21. **Task:** Define the XTDB service in `docker-compose.yml`.
    *   **(Note:** This will require finding a suitable Docker image for XTDB v2).
22. **Task:** Define volumes for data persistence for both services.
23. **Task:** Expose ports for both services.
24. **Task:** Start the database containers.
    *   **Command:** `docker-compose up -d`
25. **Task:** Verify containers are running.
    *   **Command:** `docker ps`
26. **Task:** Create a `.env.example` file for connection details.
27. **Task:** Add database connection variables to `.env.example`.
    *   **Content:** `XTDB_URL=... 
CHROMA_HOST=... 
CHROMA_PORT=...`
28. **Task:** Create a `.env` file and populate it for local development.
29. **Task:** Add `.env` to `.gitignore` (already done, but double-check).

### Sprint 1.2: Database Connection & POC
30. **Task:** Create `src/connectors` directory.
31. **Task:** Create `src/connectors/xtdb_client.py`.
32. **Task:** Implement a function in `xtdb_client.py` to connect to the running XTDB instance.
33. **Task:** Write a test `tests/connectors/test_xtdb_connection.py` to verify the connection.
34. **Task:** Create `src/connectors/chroma_client.py`.
35. **Task:** Implement a function in `chroma_client.py` to connect to the running ChromaDB instance.
36. **Task:** Write a test `tests/connectors/test_chroma_connection.py` to verify the connection.
37. **Task:** Create a script `scripts/poc_ingest.py`.
38. **Task:** In `poc_ingest.py`, define a hardcoded data structure for a single sample note.
39. **Task:** In `poc_ingest.py`, use the XTDB client to insert the sample node.
40. **Task:** In `poc_ingest.py`, use the Chroma client to create an embedding for the sample content and store it.
41. **Task:** Run the `poc_ingest.py` script.
42. **Task:** Write a script `scripts/poc_query.py` to fetch the data back from both databases.
43. **Task:** Verify the POC was successful.
44. **Task:** Create `src/models.py` to define data structures.
45. **Task:** In `models.py`, create Pydantic or dataclass models for `Node`, `Edge`, and `Tag`.
46. **Task:** Refactor the POC scripts to use the data models.
47. **Task:** Write a test to ensure a `Node` can be created.
48. **Task:** Write a test to ensure an `Edge` can be created.
49. **Task:** Write a test to ensure a `Tag` can be created.
50. **Task:** Commit the database setup and successful POC.

---

## Phase 2: Production Parser & Static Indexer (80 Tasks)

**Goal:** Reliably parse the entire vault and load its current state into the databases.

### Sprint 2.1: File Discovery & Metadata Parsing
51. **Task:** Create `src/parser/file_finder.py`.
52. **Task:** Implement `get_all_markdown_files(root_dir)` in `file_finder.py`.
53. **Task:** Write a failing test for `get_all_markdown_files` with a mock directory structure.
54. **Task:** Implement the logic for the test to pass.
55. **Task:** Write a test case for directories to ignore (e.g., `.obsidian`).
56. **Task:** Implement the ignore logic.
57. **Task:** Create `src/parser/metadata_parser.py`.
58. **Task:** Implement `parse_path_for_para(file_path)` to determine if a file is a Project, Area, etc.
59. **Task:** Write a test for `parse_path_for_para` with a project path.
60. **Task:** Write a test for `parse_path_for_para` with an area path.
61. **Task:** Write a test for `parse_path_for_para` with a resource path.
62. **Task:** Write a test for `parse_path_for_para` with an archive path.
63. **Task:** Implement the PARA parsing logic.
64. **Task:** In `metadata_parser.py`, implement `parse_frontmatter(file_content)`.
65. **Task:** Write a test for `parse_frontmatter` with valid YAML.
66. **Task:** Write a test for `parse_frontmatter` with missing frontmatter.
67. **Task:** Write a test for `parse_frontmatter` with malformed YAML.
68. **Task:** Implement the frontmatter parsing logic using `PyYAML`.

### Sprint 2.2: Content Parsing (Links & Tags)
69. **Task:** Create `src/parser/content_parser.py`.
70. **Task:** Implement `extract_wikilinks(content)` using regex.
71. **Task:** Write a test for `extract_wikilinks` with standard `[[links]]`.
72. **Task:** Write a test for `extract_wikilinks` with `[[links|aliased]]` links.
73. **Task:** Write a test for `extract_wikilinks` with no links.
74. **Task:** Implement the wikilink extraction logic.
75. **Task:** Implement `extract_tags(content)` using regex.
76. **Task:** Write a test for `extract_tags` with standard `#tags`.
77. **Task:** Write a test for `extract_tags` with tags containing hyphens/slashes.
78. **Task:** Write a test for `extract_tags` with no tags.
79. **Task:** Implement the tag extraction logic.

### Sprint 2.3: The Main Parser & Indexer Script
80. **Task:** Create `src/parser/main_parser.py`.
81. **Task:** Create a `parse_single_file(file_path)` function that orchestrates all previous parsing modules.
82. **Task:** The function should return a `Node` object and lists of `Edge` and `Tag` objects.
83. **Task:** Write an integration test for `parse_single_file` using a sample `.md` file on disk.
84. **Task:** Implement the orchestration logic.
85. **Task:** Create the main script `scripts/run_static_indexer.py`.
86. **Task:** In the script, use `file_finder` to get all vault files.
87. **Task:** Create a progress bar (e.g., using `tqdm`).
88. **Task:** For each file, call `parse_single_file`.
89. **Task:** For each parsed object, use the DB clients to save the `Node` to XTDB.
90. **Task:** Save the associated `Edges` to XTDB.
91. **Task:** Save the associated `Tags` to XTDB.
92. **Task:** Generate and save the content embedding to ChromaDB.
... (Extend this with 40 more granular tasks for error handling, batching DB writes, logging, configuration management, etc.)
130. **Task:** Run the static indexer on the entire vault.

---

## Phase 3: Real-Time Watcher Service (60 Tasks)

**Goal:** Create a long-running service that automatically keeps the databases in sync with the vault.

### Sprint 3.1: Watcher Logic
131. **Task:** Create `src/watcher/event_handler.py`.
132. **Task:** Create a `VaultEventHandler` class that inherits from `watchdog.events.FileSystemEventHandler`.
133. **Task:** Implement the `on_created` method.
134. **Task:** `on_created` should log the event and call `parser.parse_single_file`.
135. **Task:** It should then call the database clients to create the new node and its associated data.
136. **Task:** Write a test that simulates a file creation event and verifies the correct functions are called.
137. **Task:** Implement the `on_modified` method.
138. **Task:** `on_modified` should call the parser and then call an `update_node` function in the DB clients.
139. **Task:** The `update_node` in the XTDB client will automatically create a new version due to its bitemporal nature.
140. **Task:** Write a test that simulates a file modification event.
141. **Task:** Implement the `on_deleted` method.
142. **Task:** `on_deleted` should call a `delete_node` function in the DB clients. This will "retire" the node in XTDB.
143. **Task:** Write a test that simulates a file deletion event.
144. **Task:** Implement the `on_moved` method to handle file renames.
145. **Task:** This method should call `delete_node` for the old path and `create_node` for the new path.
146. **Task:** Write a test for file renaming.
... (Extend this with 24 more tasks for debouncing events, handling errors, retry logic, etc.)

### Sprint 3.2: Watcher Service Entrypoint
170. **Task:** Create `src/watcher/main.py`.
171. **Task:** In `main.py`, set up the watchdog observer.
172. **Task:** Instantiate and schedule the `VaultEventHandler`.
173. **Task:** Start the observer loop.
174. **Task:** Add logging to show the service has started and is watching the target directory.
175. **Task:** Add signal handling for graceful shutdown (Ctrl+C).
... (Extend this with 15 more tasks for configuration, command-line arguments for the vault path, etc.)
190. **Task:** Run the watcher service as a background process and test it manually by editing files in the vault.

---

## Phase 4: API & Query Interface (110+ Tasks)

**Goal:** Create a usable API to finally interact with the living knowledge base.

### Sprint 4.1: Basic API Setup
191. **Task:** Create `src/api/main.py`.
192. **Task:** Instantiate a FastAPI application.
193. **Task:** Create a `/status` endpoint that returns `{"status": "ok"}`.
194. **Task:** Write a test for the `/status` endpoint.
195. **Task:** Add a `Dockerfile` for the API service.
196. **Task:** Add the API service to `docker-compose.yml`.
197. **Task:** Run the API via docker-compose and verify it's accessible.

### Sprint 4.2: Query Endpoints
198. **Task:** Create `src/api/routers/query.py`.
199. **Task:** Create a `/query/graph` endpoint that accepts a graph query.
200. **Task:** Implement the logic to pass the query to the XTDB client.
201. **Task:** Write an integration test for the `/query/graph` endpoint.
202. **Task:** Create a `/query/semantic` endpoint that accepts a text query.
203. **Task:** Implement the logic to generate an embedding for the query and search ChromaDB.
204. **Task:** Write an integration test for the `/query/semantic` endpoint.
205. **Task:** Create a `/query/history/{node_path}` endpoint.
206. **Task:** Implement the logic to query XTDB for all historical versions of a given node. This showcases the core feature.
207. **Task:** Write an integration test for the history endpoint.
... (Extend this with many dozens of tasks for pagination, advanced filtering, combined graph/semantic queries, input validation, authentication, etc., to reach the final task count.)

300. **Task:** Create a final `scripts/generate_report.py` that uses the API to provide a "State of the Vault" summary.
