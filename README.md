# Student Club Website

This is the website I made for the COM1025 Web & Database Systems coursework.  
It's basically a simple system where university clubs can be viewed, added, edited, and deleted.  
It uses MySQL to store the club information and Node.js with EJS to display it.

---

## Features

- Shows a list of clubs from the database
- You can add new clubs using a form
- You can edit existing club info
- You can delete clubs if needed
- Uses MySQL to store all the club details
- EJS templates for the webpage layouts

---

## Database

There is one main table called `clubs`.

| Column | Meaning |
|-------|---------|
| `id` | Primary key (auto increment) |
| `club_name` | Name of the club |
| `description` | Description of the club |
| `category` | What type of club it is |

To set up the database, run the file:

