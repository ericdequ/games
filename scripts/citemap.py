import os

def list_files(start_path, ignore_folders=None):
    if ignore_folders is None:
        ignore_folders = []

    for root, dirs, files in os.walk(start_path):
        # Ignore specified folders
        dirs[:] = [d for d in dirs if d not in ignore_folders]

        level = root.replace(start_path, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f'{indent}{os.path.basename(root)}/')
        sub_indent = ' ' * 4 * (level + 1)

        for f in files:
            print(f'{sub_indent}{f}')


if __name__ == '__main__':
    print("Starting to list files")
    start_path = 'C:/dev/personal/Games/games/images'
    ignore_folders = []
    list_files(start_path, ignore_folders)
