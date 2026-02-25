"""
Rich CLI Renderer for Vault Intake Orchestrator.
Provides beautiful terminal output with progress bars, tables, and live status.
"""

from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.panel import Panel
from rich.layout import Layout
from rich.live import Live
from rich.text import Text
from rich import box
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path
import time

console = Console()

class VaultCLI:
    """Handles rich terminal output for the orchestrator."""
    
    def __init__(self):
        self.console = console
        
    def print_banner(self):
        """Print the application banner."""
        banner_text = """
╔══════════════════════════════════════════════════════════════════╗
║   🧠 VAULT INTAKE ORCHESTRATOR v1.1.0                            ║
║   🤖 Intelligent Model Rotation Enabled                          ║
╚══════════════════════════════════════════════════════════════════╝
        """
        self.console.print(Panel(
            Text(banner_text, justify="center", style="bold cyan"),
            box=box.DOUBLE,
            border_style="blue",
            title="TWC Vault System",
            subtitle="Processing Pipeline"
        ))

    def create_status_table(self, stats: Dict[str, Any]) -> Table:
        """Create a status table from statistics."""
        table = Table(box=box.ROUNDED, title="System Status")
        
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="green")
        
        # File stats
        files = stats.get('files', {})
        total = files.get('total_files', 0)
        completed = files.get('completed', 0)
        pending = files.get('pending', 0)
        failed = files.get('failed', 0)
        skipped = files.get('skipped', 0)
        
        table.add_row("Total Files", str(total))
        table.add_row("Completed", f"[green]{completed}[/green]")
        table.add_row("Pending", f"[yellow]{pending}[/yellow]")
        table.add_row("Failed", f"[red]{failed}[/red]")
        if skipped > 0:
            table.add_row("Skipped", f"[dim]{skipped}[/dim]")
        
        # Batch stats
        batches = stats.get('batches', {})
        total_batches = batches.get('total_batches', 0)
        running_batches = batches.get('running_batches', 0)
        completed_batches = batches.get('completed_batches', 0)
        
        table.add_row("", "")  # Separator
        table.add_row("Total Batches", str(total_batches))
        table.add_row("Active Batches", f"[yellow]{running_batches}[/yellow]")
        table.add_row("Completed Batches", f"[green]{completed_batches}[/green]")
        
        # Duplicates
        duplicates = stats.get('duplicates', {})
        dup_count = duplicates.get('duplicate_count', 0)
        if dup_count > 0:
            table.add_row("", "")  # Separator
            table.add_row("Duplicates", f"[yellow]{dup_count}[/yellow]")
        
        return table
    
    def create_pipeline_funnel(self, pipeline_stats: List[Dict]) -> Table:
        """Create a table showing pipeline progress by stage."""
        table = Table(box=box.ROUNDED, title="🔄 Pipeline Progress")
        
        table.add_column("Stage", style="cyan")
        table.add_column("Files Processed", style="green", justify="right")
        table.add_column("Status", justify="center")
        
        # Default stages in order
        stages = [
            'discovery', 'extraction', 'analysis', 
            'routing', 'processing', 'integration'
        ]
        
        # Map actual data
        data_map = {item['stage_name']: item['file_count'] for item in pipeline_stats}
        
        prev_count = 0
        for i, stage in enumerate(stages):
            count = data_map.get(stage, 0)
            
            # Simple visual representation of flow
            display_name = f"{i+1}. {stage.title()}"
            
            table.add_row(
                display_name,
                str(count),
                "⏬" if i < len(stages)-1 else "🏁"
            )
            prev_count = count
            
        return table
    
    def create_pending_files_table(self, pending_files: List[Dict]) -> Optional[Table]:
        """Create a table showing pending files."""
        if not pending_files:
            return None
        
        table = Table(box=box.ROUNDED, title="📋 Pending Files", show_header=True)
        table.add_column("File Path", style="cyan", overflow="fold")
        table.add_column("Type", style="blue")
        table.add_column("Size", style="dim", justify="right")
        table.add_column("Discovered", style="dim")
        
        for file in pending_files[:20]:  # Limit to 20
            file_path = Path(file.get('file_path', ''))
            size = file.get('file_size', 0)
            size_str = f"{size / 1024:.1f} KB" if size else "N/A"
            discovered = file.get('discovered_at', '')
            if discovered:
                try:
                    dt = datetime.fromisoformat(discovered.replace('Z', '+00:00'))
                    discovered = dt.strftime('%Y-%m-%d %H:%M')
                except:
                    pass
            
            table.add_row(
                str(file_path.name),
                file.get('file_type', 'unknown'),
                size_str,
                discovered
            )
        
        if len(pending_files) > 20:
            table.add_row("", "", "", f"[dim]... and {len(pending_files) - 20} more[/dim]")
        
        return table
    
    def create_failed_files_table(self, failed_files: List[Dict]) -> Optional[Table]:
        """Create a table showing failed files."""
        if not failed_files:
            return None
        
        table = Table(box=box.ROUNDED, title="❌ Failed Files", show_header=True)
        table.add_column("File Path", style="red", overflow="fold")
        table.add_column("Error", style="yellow", overflow="fold", max_width=50)
        table.add_column("Failed At", style="dim")
        
        for file in failed_files[:20]:  # Limit to 20
            file_path = Path(file.get('file_path', ''))
            error = file.get('error_message', 'Unknown error')
            failed_at = file.get('processed_at', '')
            if failed_at:
                try:
                    dt = datetime.fromisoformat(failed_at.replace('Z', '+00:00'))
                    failed_at = dt.strftime('%Y-%m-%d %H:%M')
                except:
                    pass
            
            table.add_row(
                str(file_path.name),
                error[:100] + "..." if len(error) > 100 else error,
                failed_at
            )
        
        if len(failed_files) > 20:
            table.add_row("", "", f"[dim]... and {len(failed_files) - 20} more[/dim]")
        
        return table
    
    def create_error_summary_table(self, error_summary: Dict[str, Any]) -> Optional[Table]:
        """Create a table showing error summary by stage."""
        if not error_summary:
            return None
        
        table = Table(box=box.ROUNDED, title="⚠️ Error Summary by Stage", show_header=True)
        table.add_column("Stage", style="red")
        table.add_column("Error Count", style="yellow", justify="right")
        table.add_column("Sample Errors", style="dim", overflow="fold", max_width=60)
        
        for stage, data in error_summary.items():
            count = data.get('count', 0)
            messages = data.get('messages', [])
            sample = ', '.join(messages[:3]) if messages else 'No details'
            if len(messages) > 3:
                sample += f" ... ({len(messages) - 3} more)"
            
            table.add_row(stage, str(count), sample)
        
        return table
    
    def create_active_batches_table(self, active_batches: List[Dict]) -> Optional[Table]:
        """Create a table showing active batches."""
        if not active_batches:
            return None
        
        table = Table(box=box.ROUNDED, title="🔄 Active Batches", show_header=True)
        table.add_column("Batch ID", style="cyan")
        table.add_column("Started", style="dim")
        table.add_column("Total", style="white", justify="right")
        table.add_column("Success", style="green", justify="right")
        table.add_column("Failed", style="red", justify="right")
        table.add_column("Skipped", style="yellow", justify="right")
        
        for batch in active_batches:
            batch_id = batch.get('batch_id', 'unknown')
            started = batch.get('started_at', '')
            if started:
                try:
                    dt = datetime.fromisoformat(started.replace('Z', '+00:00'))
                    started = dt.strftime('%Y-%m-%d %H:%M')
                except:
                    pass
            
            table.add_row(
                batch_id[:20] + "..." if len(batch_id) > 20 else batch_id,
                started,
                str(batch.get('total_files', 0)),
                str(batch.get('successful_files', 0)),
                str(batch.get('failed_files', 0)),
                str(batch.get('skipped_files', 0))
            )
        
        return table

    def create_model_table(self, rotation_stats: Dict[str, Any]) -> Table:
        """Create a model rotation status table."""
        table = Table(box=box.ROUNDED, title="🤖 AI Model Status")
        
        table.add_column("Model", style="blue")
        table.add_column("Requests", style="white", justify="right")
        table.add_column("Success Rate", justify="right")
        table.add_column("Status", justify="center")
        
        usage = rotation_stats.get('model_usage', {})
        rates = rotation_stats.get('success_rates', {})
        
        for model, count in usage.items():
            rate_data = rates.get(model, {'rate': 1.0})
            rate = rate_data.get('rate', 0) * 100
            
            # Color code success rate
            rate_style = "green" if rate > 90 else "yellow" if rate > 70 else "red"
            
            # Determine status icon
            status = "🟢 Active"
            
            table.add_row(
                model.split(':')[0].split('/')[-1],  # Short name
                str(count),
                f"[{rate_style}]{rate:.1f}%[/{rate_style}]",
                status
            )
            
        return table

    def print_batch_start(self, batch_id: str, batch_size: int, dry_run: bool):
        """Print batch start information."""
        grid = Table.grid(expand=True)
        grid.add_column()
        grid.add_column(justify="right")
        
        grid.add_row(f"🚀 Starting Batch: [bold yellow]{batch_id}[/bold yellow]")
        grid.add_row(f"📦 Batch Size: {batch_size}")
        grid.add_row(f"🛡️ Dry Run: {'[green]Yes[/green]' if dry_run else '[red]No[/red]'}")
        
        self.console.print(Panel(grid, title="Batch Initialization", border_style="green"))

    def print_stage_complete(self, stage: str, details: str):
        """Print stage completion."""
        self.console.print(f"[bold green]✓ {stage}[/bold green]: {details}")

    def print_error(self, message: str):
        """Print error message."""
        self.console.print(f"[bold red]❌ Error:[/bold red] {message}")

    def create_progress_group(self):
        """Create a progress bar group."""
        return Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=self.console
        )
