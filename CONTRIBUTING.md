# The Fantasy Cow Project

### Introduction:
Welcome to the Fantasy Cow Project!
This activity will guide you step-by-step through creating your first Pull Request (PR) — the same process developers use when contributing to real open-source projects.

Your goal is to add your own “fantasy cow” to a shared collection by submitting a Pull Request that contains a description file and an image of your creation.

By completing this exercise, you’ll learn how to fork a repository, create branches, make commits, and collaborate through PRs.

### Learning Goals:
By completing this activity, you will have learned how to:
1. Fork and clone a GitHub repository.
2. Create and switch between branches.
3. Add, commit, and push changes.
4. Open and manage a Pull Request.
5. Respond and edit your contribution based on automated feedback.

### Step 1: Fork the Repository
Open the GitHub page for the Fantasy Cow repository.
Click `Fork` in the top-right corner of the page.

GitHub will create a copy of the repository under your account (for example, `your-username/fantasy-cow`).

#### What is Forking?
Forking creates your own version of the project, allowing you to make changes safely before submitting them to the original project.

### Step 2: Clone Your Fork
You now need to download your forked version of the project to your computer.

Copy the clone URL from your forked repository.
Open your terminal and run:

```bash
git clone https://github.com/<your-username>/fantasy-cow.git
cd fantasy-cow
```
Replace `<your-username>` with your actual GitHub username.

### Step 3: Create a New Branch
Branches help you organize your work and keep different features separate.
Run this command to create and switch to a new branch:

```bash
git checkout -b add-my-cow
```

You can name your branch something descriptive, such as `add-luna-cow`.

### Step 4: Add Your Fantasy Cow Files
You will add two files to the repository:
A JSON file describing your cow.
An image file showing what your cow looks like.
Folder Structure:

```
fantasy-cow/
├── cows/
│   └── your-cow-name.json
└── images/
    └── your-cow-name.png
```

Example JSON file (cows/moonlight.json):

```JSON
{
  "name": "Moonlight",
  "breed": "Celestial",
  "image": "images/moonlight.png",
  "description": "A gentle cosmic cow that glows softly under starlight."
}
```

#### Checklist:
- The file must end in .json.
- The image file name must match the one in your JSON.
- Include all required fields: `name`, `breed`, and `image`.

### Step 5: Commit and Push Your Changes
Once your files are ready, save your changes and upload them to your fork.
1. Add your changes:

```bash
git add .
```
2. Commit your changes with a message:

```bash
git commit -m "Add my fantasy cow"
```

3. Push your branch to your fork:

```bash
git push origin add-my-cow
```

#### What do these commands do?
These commands save your edits to Git (`add` and `commit`) and upload them to your GitHub fork (`push`).

### Step 6: Open a Pull Request (PR)
A Pull Request lets you propose merging your changes into the main project.
1. Go to your fork on GitHub.
2. You should see a “Compare & pull request” button, click it.
3. Check that:
    - The base repository is `main-repo/fantasy-cow.`
    - The head repository is `your-username/fantasy-cow.`
4. Add a title and short description (for example, “Add Moonlight the Celestial Cow”).
5. Click Create Pull Request.

You have now proposed your changes to the main project!

### Step 7: Wait for the Validation Bot
When your PR is opened, a GitHub Action bot will automatically check your submission.

The bot validates the following:
- The PR is directed from your fork to the main repository.
- Your JSON file contains the correct fields and valid syntax.
- The image file path matches the one listed in your JSON.
- Files are in the correct folders.


You will receive automated feedback directly on your PR page, for example:

```
Everything looks great! Nice work on your first PR!
```

or

```
Your JSON file is missing the "breed" field.
```

If any changes are needed, edit your files, commit again, and push. The bot will automatically re-run and re-check your submission.

### Step 8: Merge and Celebrate
Once your PR passes validation and is approved, it will be merged into the main project.

Your fantasy cow will then become part of the official herd!

You’ve now successfully completed your first Pull Request, congratulations!

## Troubleshooting Guide (TODO)



