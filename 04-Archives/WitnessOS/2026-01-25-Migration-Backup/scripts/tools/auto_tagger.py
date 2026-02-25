import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from intelligent_tagger import load_taxonomy, analyze_and_tag

class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.md'):
            print(f'New Markdown file detected: {event.src_path}')
            taxonomy = load_taxonomy('/Users/magenarayan/twc-vault/_System/Tags/taxonomy.md')
            analyze_and_tag(event.src_path, taxonomy)

if __name__ == '__main__':
    path = '/Users/magenarayan/twc-vault/03-Resources'
    event_handler = NewFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()