## To start a project:

Navigate to a desired directory and make a new directory for your project:

```shell
cd ~/<your-projects-directory>
mkdir <first-project-name>
```

Change into your new directory and create a Git repository with a `.gitignore` file:

```shell
cd <first-project-name>
echo ".DS_Store" > .gitignore
git init
```

The `.gitignore` configures Git to ignore certain files. 

Add and commit your `.gitignore` file:

```shell
git add .DS_Store
git commit -m "Initial commit with .gitignore"
```

Now create a new repository on Github and use this repository's SSH URL to add a remote to Git:

```shell
git remote add github git@github.com/<your-github-username>/<your-project-ssh-link>.git
```

Create a `README.md`:

```shell
touch README.md
git add README.md
git commit -m "Add README.md"
```

Next, create your folder structure:

```shell
.
├── README.md
├── css
├── img
└── js

3 directories, 1 file
```

Create an `index.html` file. Add any frameworks you want to include into your `css` or `js` folders.

#### Remember these resources exist:  
[Getting Started with Bootstrap](http://getbootstrap.com/getting-started/)  
[LoremPixel](http://lorempixel.com/)  
[Meet the Ipsums](http://meettheipsums.com/)  


The Commandments:
1. Thou Shalt Commit Frequently And Write Meaningful Commit Messages
2. Thou Shalt Push Frequently
3. Thou Shalt Make A Branch For Each Story
4. Thou Shalt Only Work On A Single Story At A Time
5. Thou Shalt Merge Branches Only After A Review
6. Thou Shalt Only Do Work In A Feature Branch
7. Thou Shalt Only Do Work In A Feature Branch That Is Related To The Feature
8. Thou Shalt Not Use WrapBootstrap.com Or Other Prewritten Code Instead Of Creating Your Own
9. Thou Shalt Push Thyself, But Not Beat Thyself Up
10. Thou Shalt Keep Thine README.md Up To Date