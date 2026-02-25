"""State management using SQLite for tracking processing."""

import sqlite3
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
from contextlib import contextmanager


class StateManager:
    """Manages processing state using SQLite database."""

    def __init__(self, db_path: Path):
        """
        Initialize state manager.

        Args:
            db_path: Path to SQLite database file
        """
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize_db()

    @contextmanager
    def _get_connection(self):
        """Context manager for database connections."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def _initialize_db(self):
        """Create database tables if they don't exist."""
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # Files inventory table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS files (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_path TEXT UNIQUE NOT NULL,
                    file_hash TEXT NOT NULL,
                    file_size INTEGER,
                    file_type TEXT,
                    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status TEXT DEFAULT 'pending',
                    error_message TEXT,
                    processed_at TIMESTAMP,
                    destination_path TEXT,
                    metadata TEXT
                )
            """)

            # Processing batches table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS batches (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    batch_id TEXT UNIQUE NOT NULL,
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP,
                    total_files INTEGER DEFAULT 0,
                    successful_files INTEGER DEFAULT 0,
                    failed_files INTEGER DEFAULT 0,
                    skipped_files INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'running',
                    config TEXT
                )
            """)

            # Processing stages table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS processing_stages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_id INTEGER,
                    batch_id TEXT,
                    stage_name TEXT NOT NULL,
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP,
                    status TEXT DEFAULT 'running',
                    output_data TEXT,
                    error_message TEXT,
                    FOREIGN KEY (file_id) REFERENCES files(id),
                    FOREIGN KEY (batch_id) REFERENCES batches(batch_id)
                )
            """)

            # Duplicates table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS duplicates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_hash TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    original_file_id INTEGER,
                    FOREIGN KEY (original_file_id) REFERENCES files(id)
                )
            """)

            # Create indices
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_file_hash ON files(file_hash)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_file_status ON files(status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_batch_id ON processing_stages(batch_id)")

    def add_file(self, file_path: str, file_hash: str, file_size: int, file_type: str,
                 metadata: Optional[Dict] = None) -> int:
        """Add a file to inventory."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR IGNORE INTO files
                (file_path, file_hash, file_size, file_type, metadata)
                VALUES (?, ?, ?, ?, ?)
            """, (file_path, file_hash, file_size, file_type,
                  json.dumps(metadata) if metadata else None))
            return cursor.lastrowid

    def get_file_by_path(self, file_path: str) -> Optional[Dict]:
        """Get file record by path."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM files WHERE file_path = ?", (file_path,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_file_by_hash(self, file_hash: str) -> Optional[Dict]:
        """Get file record by hash."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM files WHERE file_hash = ? LIMIT 1", (file_hash,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def update_file_status(self, file_id: int, status: str,
                           destination_path: Optional[str] = None,
                           error_message: Optional[str] = None):
        """Update file processing status."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE files
                SET status = ?,
                    processed_at = CURRENT_TIMESTAMP,
                    destination_path = ?,
                    error_message = ?
                WHERE id = ?
            """, (status, destination_path, error_message, file_id))

    def create_batch(self, batch_id: str, config: Dict) -> int:
        """Create a new processing batch."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO batches (batch_id, config)
                VALUES (?, ?)
            """, (batch_id, json.dumps(config)))
            return cursor.lastrowid

    def update_batch_stats(self, batch_id: str, stats: Dict):
        """Update batch processing statistics."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE batches
                SET total_files = ?,
                    successful_files = ?,
                    failed_files = ?,
                    skipped_files = ?,
                    status = ?,
                    completed_at = CURRENT_TIMESTAMP
                WHERE batch_id = ?
            """, (stats.get('total', 0), stats.get('successful', 0),
                  stats.get('failed', 0), stats.get('skipped', 0),
                  stats.get('status', 'completed'), batch_id))

    def add_stage_record(self, file_id: int, batch_id: str, stage_name: str,
                         status: str = 'running', output_data: Optional[Dict] = None,
                         error_message: Optional[str] = None):
        """Add a processing stage record."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO processing_stages
                (file_id, batch_id, stage_name, status, output_data, error_message, completed_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (file_id, batch_id, stage_name, status,
                  json.dumps(output_data) if output_data else None, error_message))

    def record_duplicate(self, file_hash: str, file_path: str, original_file_id: int):
        """Record a duplicate file."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO duplicates (file_hash, file_path, original_file_id)
                VALUES (?, ?, ?)
            """, (file_hash, file_path, original_file_id))

    def get_pending_files(self, limit: Optional[int] = None) -> List[Dict]:
        """Get pending files to process."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM files WHERE status = 'pending'"
            if limit:
                query += f" LIMIT {limit}"
            cursor.execute(query)
            return [dict(row) for row in cursor.fetchall()]

    def get_batch_status(self, batch_id: str) -> Optional[Dict]:
        """Get batch processing status."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM batches WHERE batch_id = ?", (batch_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def execute(self, query: str, params: tuple = (), fetch: bool = True) -> Optional[List[Dict]]:
        """
        Execute a SQL query with parameters.
        
        Args:
            query: SQL query string
            params: Query parameters tuple
            fetch: If True, return results; if False, just execute
            
        Returns:
            List of result dictionaries if fetch=True, None otherwise
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            
            if fetch:
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
            return None
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get overall processing statistics."""
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # File statistics
            cursor.execute("""
                SELECT
                    COUNT(*) as total_files,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped
                FROM files
            """)
            file_stats = dict(cursor.fetchone())

            # Batch statistics
            cursor.execute("""
                SELECT
                    COUNT(*) as total_batches,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_batches,
                    SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running_batches
                FROM batches
            """)
            batch_stats = dict(cursor.fetchone())

            # Duplicates count
            cursor.execute("SELECT COUNT(*) as duplicate_count FROM duplicates")
            duplicate_stats = dict(cursor.fetchone())

            return {
                'files': file_stats,
                'batches': batch_stats,
                'duplicates': duplicate_stats
            }

    def get_pipeline_stats(self) -> List[Dict]:
        """Get file counts by processing stage."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Count distinct files that have completed each stage
            cursor.execute("""
                SELECT stage_name, COUNT(DISTINCT file_id) as file_count
                FROM processing_stages
                WHERE status = 'completed'
                GROUP BY stage_name
                ORDER BY 
                    CASE stage_name
                        WHEN 'discovery' THEN 1
                        WHEN 'extraction' THEN 2
                        WHEN 'analysis' THEN 3
                        WHEN 'routing' THEN 4
                        WHEN 'processing' THEN 5
                        WHEN 'integration' THEN 6
                        ELSE 7
                    END
            """)
            return [dict(row) for row in cursor.fetchall()]
    
    def get_recent_files(self, limit: int = 10) -> List[Dict]:
        """Get recently processed files."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT file_path, status, processed_at, error_message
                FROM files
                WHERE processed_at IS NOT NULL
                ORDER BY processed_at DESC
                LIMIT ?
            """, (limit,))
            return [dict(row) for row in cursor.fetchall()]
    
    def get_failed_files(self, limit: Optional[int] = None) -> List[Dict]:
        """Get files that failed processing."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = """
                SELECT file_path, status, error_message, processed_at
                FROM files
                WHERE status = 'failed'
                ORDER BY processed_at DESC
            """
            if limit:
                query += f" LIMIT {limit}"
            cursor.execute(query)
            return [dict(row) for row in cursor.fetchall()]
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get summary of errors by stage."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT 
                    stage_name,
                    COUNT(*) as error_count,
                    GROUP_CONCAT(DISTINCT error_message) as error_messages
                FROM processing_stages
                WHERE status = 'failed' AND error_message IS NOT NULL
                GROUP BY stage_name
            """)
            results = cursor.fetchall()
            return {
                stage['stage_name']: {
                    'count': stage['error_count'],
                    'messages': stage['error_messages'].split(',') if stage['error_messages'] else []
                }
                for stage in results
            }
    
    def get_active_batches(self) -> List[Dict]:
        """Get currently running batches."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT batch_id, started_at, total_files, successful_files, failed_files, skipped_files
                FROM batches
                WHERE status = 'running'
                ORDER BY started_at DESC
            """)
            return [dict(row) for row in cursor.fetchall()]
