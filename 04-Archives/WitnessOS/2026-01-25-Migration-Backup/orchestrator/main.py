#!/usr/bin/env python3
"""
Vault Intake Orchestrator - Main CLI Entry Point

Usage:
    python main.py inventory [--output PATH]
    python main.py process [--batch-size N] [--dry-run]
    python main.py verify [--check-type TYPE]
    python main.py status [--detail-level LEVEL]
"""

import argparse
import sys
from pathlib import Path
from datetime import datetime

# Add orchestrator to path
sys.path.insert(0, str(Path(__file__).parent))

from core.orchestrator import VaultOrchestrator


def main():
    parser = argparse.ArgumentParser(description='Vault Intake Orchestrator')
    subparsers = parser.add_subparsers(dest='command', help='Command to run')

    # Inventory command
    inventory_parser = subparsers.add_parser('inventory', help='Generate inventory report')
    inventory_parser.add_argument('--output', type=Path, help='Output path for report')

    # Process command
    process_parser = subparsers.add_parser('process', help='Process files')
    process_parser.add_argument('--batch-size', type=int, help='Number of files to process')
    process_parser.add_argument('--dry-run', action='store_true', help='Simulate without changes')
    process_parser.add_argument('--file-types', nargs='+', help='File types to process')
    process_parser.add_argument('--source', type=str, help='Source folder')

    # Scan command
    scan_parser = subparsers.add_parser('scan', help='Scan for files and update inventory')
    scan_parser.add_argument('--source', type=str, help='Source folder to scan')
    scan_parser.add_argument('--force', action='store_true', help='Force re-scan of existing files')

    # Verify command
    verify_parser = subparsers.add_parser('verify', help='Verify vault integrity')
    verify_parser.add_argument('--check-type', default='all',
                              choices=['duplicates', 'broken_links', 'missing_metadata', 'all'],
                              help='Type of verification check')

    # Status command
    status_parser = subparsers.add_parser('status', help='Get processing status')
    status_parser.add_argument('--detail-level', default='summary',
                              choices=['summary', 'detailed', 'errors_only'],
                              help='Detail level')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    # Initialize orchestrator
    config_path = Path(__file__).parent / 'config.yaml'
    
    # Initialize UI
    try:
        from ui import VaultCLI
        cli = VaultCLI()
        cli.print_banner()
    except ImportError:
        # Fallback if rich is not working correctly
        class VaultCLI:
            def __init__(self): self.console = type('Console', (), {'print': print})()
            def print_banner(self): pass
            def print_batch_start(self, *args): print("Starting batch...")
            def print_stage_complete(self, s, d): print(f"Stage {s}: {d}")
            def print_error(self, m): print(f"Error: {m}")
            def create_status_table(self, stats): return f"Stats: {stats}"
        cli = VaultCLI()
        
    orchestrator = VaultOrchestrator(config_path)

    # Execute command
    try:
        if args.command == 'inventory':
            stats = orchestrator.generate_inventory(args.output)
            
            # Create rich table if available
            try:
                from rich.table import Table
                from rich import box
                
                table = Table(title="Inventory Report", box=box.ROUNDED)
                table.add_column("Category", style="cyan")
                table.add_column("Count", style="green", justify="right")
                
                files = stats.get('files', {})
                table.add_row("Total Files", str(files.get('total_files', 0)))
                table.add_row("Completed", str(files.get('completed', 0)))
                table.add_row("Pending", str(files.get('pending', 0)))
                table.add_row("Failed", f"[red]{files.get('failed', 0)}[/red]")
                
                cli.console.print(table)
            except ImportError:
                print(f"\n📊 Inventory Statistics:")
                print(f"   Total Files: {stats['files']['total_files']}")
                print(f"   Completed: {stats['files']['completed']}")

        elif args.command == 'process':
            cli.print_batch_start(
                f"BATCH-{datetime.now().strftime('%H%M%S')}",
                args.batch_size or 50,
                args.dry_run
            )

            # Use rich progress if available
            try:
                from rich.progress import Progress, SpinnerColumn, TextColumn
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    transient=True
                ) as progress:
                    task = progress.add_task("[cyan]Processing batch...", total=None)
                    
                    results = orchestrator.process_batch(
                        batch_size=args.batch_size,
                        file_types=args.file_types,
                        source_folder=args.source,
                        dry_run=args.dry_run
                    )
            except ImportError:
                results = orchestrator.process_batch(
                    batch_size=args.batch_size,
                    file_types=args.file_types,
                    source_folder=args.source,
                    dry_run=args.dry_run
                )

            # Final summary
            cli.console.print("\n[bold green]✅ Batch Processing Complete![/bold green]")
            
            try:
                from rich.table import Table
                from rich import box
                
                summary_table = Table(box=box.DOUBLE_EDGE, show_header=True)
                summary_table.add_column("Result", style="cyan")
                summary_table.add_column("Count", style="white", justify="right")
                
                summary_table.add_row("Successful", f"[green]{results.get('successful', 0)}[/green]")
                summary_table.add_row("Failed", f"[red]{results.get('failed', 0)}[/red]")
                summary_table.add_row("Skipped", f"[yellow]{results.get('skipped', 0)}[/yellow]")
                summary_table.add_row("Total", str(results.get('total_files', 0)))
                
                cli.console.print(summary_table)
            except ImportError:
                print(f"Successful: {results.get('successful')}")
                print(f"Failed: {results.get('failed')}")

        elif args.command == 'scan':
            cli.console.print(f"\n[bold cyan]🔍 Scanning directory for files...[/bold cyan]")
            
            # Use rich progress if available
            try:
                from rich.progress import Progress, SpinnerColumn, TextColumn
                with Progress(
                    SpinnerColumn(),
                    TextColumn("[progress.description]{task.description}"),
                    transient=True
                ) as progress:
                    task = progress.add_task("[cyan]Scanning file system...", total=None)
                    count = orchestrator.scan_files(args.source, args.force)
            except ImportError:
                count = orchestrator.scan_files(args.source, args.force)
                
            cli.console.print(f"\n[bold green]✅ Scan Complete![/bold green]")
            cli.console.print(f"Files in Inventory: [white]{count}[/white]")

        elif args.command == 'verify':
            cli.console.print(f"\n[bold yellow]🔍 Running verification: {args.check_type}[/bold yellow]")
            results = orchestrator.verify(args.check_type)
            cli.console.print(f"   Issues found: [red]{len(results['issues'])}[/red]")

        elif args.command == 'status':
            stats = orchestrator.get_status(args.detail_level)
            
            # Print Main Status Table
            cli.console.print("\n")
            status_table = cli.create_status_table(stats['statistics'])
            cli.console.print(status_table)
            
            # Print Pipeline Funnel
            if 'pipeline_stats' in stats:
                cli.console.print("\n")
                funnel_table = cli.create_pipeline_funnel(stats['pipeline_stats'])
                cli.console.print(funnel_table)
            
            cli.console.print("\n")
            
            # Get rotation stats from manager if accessible
            try:
                if 'analysis' in orchestrator.stages:
                    analysis_stage = orchestrator.stages['analysis']
                    if hasattr(analysis_stage, 'rotation_manager'):
                        rot_stats = analysis_stage.rotation_manager.get_statistics()
                        rot_table = cli.create_model_table(rot_stats)
                        cli.console.print(rot_table)
            except Exception:
                pass 

        return 0

    except Exception as e:
        if 'cli' in locals():
            cli.print_error(str(e))
        else:
            print(f"\n❌ Error: {str(e)}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
