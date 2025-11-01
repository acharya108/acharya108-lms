import os

project_path = 'D:/backend-lms'
folders = [f for f in os.listdir(project_path) if os.path.isdir(os.path.join(project_path, f))]

with open('D:/backend-lms/folders_list.txt', 'w') as file:
    for folder in folders:
        file.write(folder + '\n')

print("Folder list saved to D:/backend-lms/folders_list.txt")
