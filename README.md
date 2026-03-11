# Project Name

This is a Test Assessment provided by Carrier Assure.

It was proposed to create an application showing a dashboard with scores per carrier. It should also include:

> An API to upload and access data;
> The database.

The current project was developed by Luan Labigalini.


# Table of Contents

- [Architecture](#architecture)
- [Trade-offs](#trade-offs)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Score Generation Business Logic](#score-generation-business-logic)
- [Future Improvements](#future-improvements)

---


# Architecture


The system follows a **layered architecture** composed of:

- **API Layer**
  - Handles HTTP requests
  - Input validation
  - Response formatting
  - Contains the business logic and validations


- **Data Layer**
  - Handles database communication
  - Responsible for persistence and queries
  - It should be carried a historic per document


- **WEB Layer**
  - Contains the dashboard for each record
  - Present and classify the score for each record
  - Allow a superficial analysis for each score



---

# Architecture Decisions


## Choice of Framework

- Next.JS and MongoDB were a requirement for the assessment;

- For the backend, Python and FastAPI were chosen due to a better familiarity with it.


---

# Trade-offs


### Simplicity vs Flexibility

The project prioritizes simplicity and readability to make the system easy to understand during evaluation. Instead of creating a separated collection containing just the carrier history, it was built a single collection to easier manangement.

Future iterations could introduce:

- Separate the collections in order to create better insights

---

### Performance vs Development Speed

Some optimizations were intentionally avoided to keep the implementation clear and maintainable.

For example, the verification for a hash change was kept being analyzed record by record, instead of a single query for unchanged records. It enabled, for example, tests on hash changes.

---

### Validation Strategy

Validation is performed at the API layer to fail fast and prevent invalid data from reaching business logic.

---

# Tech Stack

List technologies used in the project.

Example:

- Backend:  `Python`
- Framework: `FastAPI`
- Database: `MongoDB`
- Containerization: `Docker` + `Docker Compose`
- Testing: `Jest` / `Pytest`
- Frontend: `Next.JS`

---

# Project Structure

- `api` is the folder containing the backend and API logic;
- `web` is the folder containing the frontend;
- `.github` is the folder containing the CI actions.

# Getting Started

## Prerequisites

Make sure you have installed:

- Docker
- Docker Compose
- Node.js or Python (optional if using Docker)
- And each dependency (npm install for /web and pip install -r requirements.txt for /api)

---

# Environment Variables

Create a `.env` file in the project root and on each project.

An example can be found on the root directory.

# Running the project

- For the api, just run the `main.py` file;
- For the frontend, just run `npm run dev` on the web directory.

# API Documentation

After running the project, you can find it on: http://localhost:5000/api/docs



# Score Generation Business Logic

The score was built according to the section 2.2 of thhe Test Assessment. 

To generate the score, a simple sum was made for all the factors. All of them were normalized between 0 and 100.

# Future improvements

- Authentication;
- Interactive Dashboards;
- Better filters for selecting a carrier.
