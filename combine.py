import os
from pathlib import Path

# Configurable paths
SOURCE_DIR = Path("landlord")
OUTPUT_FILE = Path("combined.txt")

# Allowed extensions and excluded files
ALLOWED_EXTENSIONS = {".html", ".js"}
EXCLUDED_FILES = {"tailwind.js"}

def combine_files(source_dir, output_file):
    # Check if the source directory exists
    if not source_dir.exists():
        print(f"Error: Directory '{source_dir}' does not exist.")
        return

    count = 0

    # Open the output text file for writing
    with open(output_file, "w", encoding="utf-8") as outfile:
        # Recursively iterate through all items in the directory
        for file_path in sorted(source_dir.rglob("*")):
            # Check if it's a file with an allowed extension
            if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
                
                # Exclude tailwind.js (case-insensitive)
                if file_path.name.lower() in EXCLUDED_FILES:
                    print(f"Skipped:  {file_path.relative_to(source_dir)}")
                    continue

                relative_path = file_path.relative_to(source_dir)
                
                # Write header separator
                
                try:
                    # Read content
                    content = file_path.read_text(encoding="utf-8", errors="replace")
                    outfile.write(content)
                    count += 1
                    print(f"Appended: {relative_path}")
                except Exception as e:
                    print(f"Error reading {relative_path}: {e}")

    print(f"\nDone! Combined {count} file(s) into '{output_file}'.")

if __name__ == "__main__":
    combine_files(SOURCE_DIR, OUTPUT_FILE)