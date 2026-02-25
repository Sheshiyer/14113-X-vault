#!/usr/bin/env python3
"""
MCP Server for Vault Intake Orchestrator

Exposes 4 tools to Claude for vault management:
1. vault_query - Search and query vault contents
2. vault_process_batch - Process files from processing folder
3. vault_status - Get processing status and statistics
4. vault_verify - Verify vault integrity
"""

import asyncio
import logging
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime

# MCP SDK imports
try:
    from mcp.server.models import InitializationOptions
    from mcp.server import NotificationOptions, Server
    from mcp.server.stdio import stdio_server
    from mcp import types
except ImportError:
    print("ERROR: MCP SDK not installed. Run: pip install mcp")
    exit(1)

# Orchestrator imports
from core.orchestrator import VaultOrchestrator
from core.database import DatabaseManager
from utils.config_loader import load_config

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class VaultMCPServer:
    """MCP Server for Vault Intake Orchestrator"""
    
    def __init__(self, config_path: str = "config.yaml"):
        self.config = load_config(config_path)
        self.db = DatabaseManager(self.config)
        self.orchestrator = VaultOrchestrator(self.config)
        
        # Initialize MCP server
        self.server = Server("vault-intake-orchestrator")
        
        # Register handlers
        self._register_tools()
        self._register_resources()
        self._register_prompts()
        
        logger.info("Vault MCP Server initialized")
    
    def _register_tools(self):
        """Register MCP tools"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> list[types.Tool]:
            """List available tools"""
            return [
                types.Tool(
                    name="vault_query",
                    description="Search and query vault contents. Find files by tags, domains, MOCs, or content.",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query_type": {
                                "type": "string",
                                "enum": ["tag", "domain", "moc", "status", "recent"],
                                "description": "Type of query to perform"
                            },
                            "query_value": {
                                "type": "string",
                                "description": "Search value (e.g., tag name, domain, MOC name)"
                            },
                            "limit": {
                                "type": "integer",
                                "description": "Maximum number of results (default: 20)",
                                "default": 20
                            }
                        },
                        "required": ["query_type"]
                    }
                ),
                types.Tool(
                    name="vault_process_batch",
                    description="Process files from the processing folder. Extract, analyze, route, and integrate into PARA structure.",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "batch_size": {
                                "type": "integer",
                                "description": "Number of files to process (default: 10)",
                                "default": 10
                            },
                            "dry_run": {
                                "type": "boolean",
                                "description": "If true, simulate without making changes (default: false)",
                                "default": False
                            },
                            "stages": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "enum": ["discovery", "extraction", "analysis", "routing", "processing", "integration"]
                                },
                                "description": "Specific stages to run (default: all)"
                            }
                        }
                    }
                ),
                types.Tool(
                    name="vault_status",
                    description="Get vault processing status and statistics. See what files are in queue, processed, or failed.",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "detail_level": {
                                "type": "string",
                                "enum": ["summary", "detailed", "full"],
                                "description": "Level of detail to return (default: summary)",
                                "default": "summary"
                            },
                            "batch_id": {
                                "type": "integer",
                                "description": "Optional batch ID to get status for specific batch"
                            }
                        }
                    }
                ),
                types.Tool(
                    name="vault_verify",
                    description="Verify vault integrity. Check for broken links, missing MOCs, or inconsistencies.",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "check_type": {
                                "type": "string",
                                "enum": ["links", "mocs", "duplicates", "all"],
                                "description": "Type of verification to perform (default: all)",
                                "default": "all"
                            },
                            "fix": {
                                "type": "boolean",
                                "description": "If true, attempt to fix issues found (default: false)",
                                "default": False
                            }
                        }
                    }
                )
            ]
        
        @self.server.call_tool()
        async def handle_call_tool(
            name: str,
            arguments: Dict[str, Any] | None
        ) -> list[types.TextContent]:
            """Handle tool calls"""
            
            try:
                if name == "vault_query":
                    result = await self._handle_vault_query(arguments or {})
                elif name == "vault_process_batch":
                    result = await self._handle_process_batch(arguments or {})
                elif name == "vault_status":
                    result = await self._handle_vault_status(arguments or {})
                elif name == "vault_verify":
                    result = await self._handle_vault_verify(arguments or {})
                else:
                    raise ValueError(f"Unknown tool: {name}")
                
                return [types.TextContent(
                    type="text",
                    text=json.dumps(result, indent=2)
                )]
                
            except Exception as e:
                logger.error(f"Error handling tool {name}: {e}", exc_info=True)
                return [types.TextContent(
                    type="text",
                    text=json.dumps({
                        "error": str(e),
                        "tool": name
                    })
                )]
    
    def _register_resources(self):
        """Register MCP resources"""
        
        @self.server.list_resources()
        async def handle_list_resources() -> list[types.Resource]:
            """List available resources"""
            return [
                types.Resource(
                    uri="vault://config",
                    name="Vault Configuration",
                    description="Current vault configuration and settings",
                    mimeType="application/json"
                ),
                types.Resource(
                    uri="vault://stats",
                    name="Vault Statistics",
                    description="Overall vault processing statistics",
                    mimeType="application/json"
                ),
                types.Resource(
                    uri="vault://recent",
                    name="Recent Files",
                    description="Recently processed files",
                    mimeType="application/json"
                )
            ]
        
        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            """Read resource content"""
            
            if uri == "vault://config":
                return json.dumps(self.config, indent=2)
            
            elif uri == "vault://stats":
                stats = self._get_vault_stats()
                return json.dumps(stats, indent=2)
            
            elif uri == "vault://recent":
                recent = self._get_recent_files(limit=10)
                return json.dumps(recent, indent=2)
            
            else:
                raise ValueError(f"Unknown resource: {uri}")
    
    def _register_prompts(self):
        """Register MCP prompts"""
        
        @self.server.list_prompts()
        async def handle_list_prompts() -> list[types.Prompt]:
            """List available prompts"""
            return [
                types.Prompt(
                    name="process_new_files",
                    description="Process all new files in the processing folder",
                    arguments=[
                        types.PromptArgument(
                            name="dry_run",
                            description="Simulate without making changes",
                            required=False
                        )
                    ]
                ),
                types.Prompt(
                    name="find_by_topic",
                    description="Find all files related to a specific topic",
                    arguments=[
                        types.PromptArgument(
                            name="topic",
                            description="Topic to search for",
                            required=True
                        )
                    ]
                )
            ]
        
        @self.server.get_prompt()
        async def handle_get_prompt(
            name: str,
            arguments: Dict[str, str] | None
        ) -> types.GetPromptResult:
            """Get prompt content"""
            
            if name == "process_new_files":
                dry_run = arguments.get("dry_run", "false") == "true" if arguments else False
                
                return types.GetPromptResult(
                    description="Process all new files in the processing folder",
                    messages=[
                        types.PromptMessage(
                            role="user",
                            content=types.TextContent(
                                type="text",
                                text=f"Process all new files in the vault processing folder{' (dry run)' if dry_run else ''}. Use vault_process_batch with batch_size=50."
                            )
                        )
                    ]
                )
            
            elif name == "find_by_topic":
                topic = arguments.get("topic", "") if arguments else ""
                
                return types.GetPromptResult(
                    description=f"Find all files related to '{topic}'",
                    messages=[
                        types.PromptMessage(
                            role="user",
                            content=types.TextContent(
                                type="text",
                                text=f"Search the vault for all files related to '{topic}'. Use vault_query with query_type='tag' or 'domain' and query_value='{topic}'."
                            )
                        )
                    ]
                )
            
            else:
                raise ValueError(f"Unknown prompt: {name}")
    
    # Tool implementation methods
    
    async def _handle_vault_query(self, args: Dict[str, Any]) -> Dict:
        """Handle vault_query tool"""
        query_type = args.get("query_type", "recent")
        query_value = args.get("query_value", "")
        limit = args.get("limit", 20)
        
        logger.info(f"Vault query: type={query_type}, value={query_value}, limit={limit}")
        
        if query_type == "tag":
            results = self._query_by_tag(query_value, limit)
        elif query_type == "domain":
            results = self._query_by_domain(query_value, limit)
        elif query_type == "moc":
            results = self._query_by_moc(query_value, limit)
        elif query_type == "status":
            results = self._query_by_status(query_value, limit)
        elif query_type == "recent":
            results = self._get_recent_files(limit)
        else:
            raise ValueError(f"Invalid query_type: {query_type}")
        
        return {
            "query_type": query_type,
            "query_value": query_value,
            "count": len(results),
            "results": results
        }
    
    async def _handle_process_batch(self, args: Dict[str, Any]) -> Dict:
        """Handle vault_process_batch tool"""
        batch_size = args.get("batch_size", 10)
        dry_run = args.get("dry_run", False)
        stages = args.get("stages", None)
        
        logger.info(f"Processing batch: size={batch_size}, dry_run={dry_run}, stages={stages}")
        
        # Run orchestrator
        try:
            result = self.orchestrator.process_batch(
                batch_size=batch_size,
                dry_run=dry_run,
                stages=stages
            )
            
            return {
                "success": True,
                "batch_id": result.get("batch_id"),
                "files_processed": result.get("total_files", 0),
                "stats": result,
                "dry_run": dry_run
            }
            
        except Exception as e:
            logger.error(f"Error processing batch: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _handle_vault_status(self, args: Dict[str, Any]) -> Dict:
        """Handle vault_status tool"""
        detail_level = args.get("detail_level", "summary")
        batch_id = args.get("batch_id", None)
        
        logger.info(f"Getting vault status: detail={detail_level}, batch_id={batch_id}")
        
        status = {
            "timestamp": datetime.now().isoformat(),
            "vault_root": str(self.config['vault']['root']),
            "processing_folder": str(self.config['vault']['processing_folder'])
        }
        
        if batch_id:
            status['batch_status'] = self._get_batch_status(batch_id)
        else:
            status['overall_stats'] = self._get_vault_stats()
        
        if detail_level in ["detailed", "full"]:
            status['recent_files'] = self._get_recent_files(limit=10)
            status['pending_files'] = self._get_pending_files()
        
        if detail_level == "full":
            status['error_summary'] = self._get_error_summary()
        
        return status
    
    async def _handle_vault_verify(self, args: Dict[str, Any]) -> Dict:
        """Handle vault_verify tool"""
        check_type = args.get("check_type", "all")
        fix = args.get("fix", False)
        
        logger.info(f"Verifying vault: check={check_type}, fix={fix}")
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "check_type": check_type,
            "fix_attempted": fix,
            "checks": {}
        }
        
        if check_type in ["links", "all"]:
            results['checks']['links'] = self._verify_links(fix)
        
        if check_type in ["mocs", "all"]:
            results['checks']['mocs'] = self._verify_mocs(fix)
        
        if check_type in ["duplicates", "all"]:
            results['checks']['duplicates'] = self._verify_duplicates(fix)
        
        return results
    
    # Helper methods
    
    def _query_by_tag(self, tag: str, limit: int) -> List[Dict]:
        """Query files by tag"""
        query = """
            SELECT * FROM files 
            WHERE json_extract(metadata, '$.tags') LIKE ?
            ORDER BY processed_at DESC
            LIMIT ?
        """
        return self.db.execute(query, (f'%{tag}%', limit))
    
    def _query_by_domain(self, domain: str, limit: int) -> List[Dict]:
        """Query files by domain"""
        query = """
            SELECT * FROM files 
            WHERE json_extract(metadata, '$.domain') = ?
            ORDER BY processed_at DESC
            LIMIT ?
        """
        return self.db.execute(query, (domain, limit))
    
    def _query_by_moc(self, moc: str, limit: int) -> List[Dict]:
        """Query files by MOC"""
        query = """
            SELECT * FROM files 
            WHERE json_extract(metadata, '$.moc_links') LIKE ?
            ORDER BY processed_at DESC
            LIMIT ?
        """
        return self.db.execute(query, (f'%{moc}%', limit))
    
    def _query_by_status(self, status: str, limit: int) -> List[Dict]:
        """Query files by status"""
        query = """
            SELECT * FROM files 
            WHERE status = ?
            ORDER BY processed_at DESC
            LIMIT ?
        """
        return self.db.execute(query, (status, limit))
    
    def _get_recent_files(self, limit: int = 10) -> List[Dict]:
        """Get recently processed files"""
        query = """
            SELECT * FROM files 
            WHERE status = 'completed'
            ORDER BY processed_at DESC
            LIMIT ?
        """
        return self.db.execute(query, (limit,))
    
    def _get_vault_stats(self) -> Dict:
        """Get overall vault statistics"""
        stats_query = """
            SELECT 
                COUNT(*) as total_files,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                SUM(file_size) as total_size
            FROM files
        """
        result = self.db.execute(stats_query)
        return result[0] if result else {}
    
    def _get_batch_status(self, batch_id: int) -> Dict:
        """Get status for specific batch"""
        query = """
            SELECT * FROM batches WHERE id = ?
        """
        result = self.db.execute(query, (batch_id,))
        return result[0] if result else {}
    
    def _get_pending_files(self) -> List[Dict]:
        """Get files pending processing"""
        query = """
            SELECT * FROM files 
            WHERE status = 'pending'
            ORDER BY discovered_at ASC
        """
        return self.db.execute(query)
    
    def _get_error_summary(self) -> Dict:
        """Get summary of errors"""
        query = """
            SELECT 
                stage_name,
                COUNT(*) as error_count,
                GROUP_CONCAT(DISTINCT error_message) as error_messages
            FROM processing_stages
            WHERE status = 'failed'
            GROUP BY stage_name
        """
        results = self.db.execute(query)
        return {r['stage_name']: r for r in results} if results else {}
    
    def _verify_links(self, fix: bool) -> Dict:
        """Verify markdown links"""
        # Placeholder implementation
        return {
            "total_links": 0,
            "broken_links": 0,
            "fixed": 0 if fix else None
        }
    
    def _verify_mocs(self, fix: bool) -> Dict:
        """Verify MOC structure"""
        # Placeholder implementation
        return {
            "total_mocs": 0,
            "missing_mocs": 0,
            "fixed": 0 if fix else None
        }
    
    def _verify_duplicates(self, fix: bool) -> Dict:
        """Verify and remove duplicates"""
        query = """
            SELECT hash, COUNT(*) as count
            FROM files
            GROUP BY hash
            HAVING count > 1
        """
        duplicates = self.db.execute(query)
        
        return {
            "total_duplicates": len(duplicates) if duplicates else 0,
            "fixed": 0 if fix else None
        }
    
    async def run(self):
        """Run the MCP server"""
        logger.info("Starting Vault MCP Server...")
        
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="vault-intake-orchestrator",
                    server_version="1.0.0",
                    capabilities=self.server.get_capabilities(
                        notification_options=NotificationOptions(),
                        experimental_capabilities={}
                    )
                )
            )


async def main():
    """Main entry point"""
    import sys
    
    # Get config path from args or use default
    config_path = sys.argv[1] if len(sys.argv) > 1 else "config.yaml"
    
    server = VaultMCPServer(config_path)
    await server.run()


if __name__ == "__main__":
    asyncio.run(main())
