# Crew Handover Tracker

Crew Handover Tracker is a full-stack application I built to improve how information gets passed between crews.

The current handover process relies heavily on a whiteboard. That works for quick notes, but it also means information can be erased, missed, or become difficult to track over time. I wanted to build something that could keep that information in one place and make it easier for everyone on the crew to see what is going on.

The application lets personnel create handovers, add updates, acknowledge information, track status, receive notifications, and look back at closed handovers.

# Features

The main features I added are:

- Select a personnel profile to start a session
- View active and closed handovers
- Create new handovers
- Edit existing handovers
- Close and delete handovers
- Filter handovers by priority, category, and status
- Direct a handover to specific personnel
- Add an optional due date
- Add updates to a handover
- View the update history
- Acknowledge handovers
- See who has acknowledged a handover
- Color-coded priority, status, and category indicators
- Live polling for new information
- Persistent notifications
- Mark notifications as read
- Clear read notifications
- View handover analytics

# Planning and Design

Before I started building the application, I planned out the database and the general flow of the application.

I used an ERD to plan the database relationships, a decision tree to work through the user flow, and some proof-of-concept wireframes to figure out the basic layout.

## Entity Relationship Diagram

The ERD helped me plan how personnel, handovers, updates, acknowledgments, and the other application data would relate to each other.

![Crew Handover Tracker ERD](docs/erd.png)

## Decision Tree and Wireframe

I used the decision tree to work through how a user would move through the application and what actions they would be able to take.

![Decision Tree and Wireframe](docs/decision-tree-wireframe.png)

## Proof of Concept Wireframes

These were the original wireframes I used before building the React interface.

![Proof of Concept Wireframes](docs/proof-of-concept-wireframes.png)

# Tech Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- Vitest
- React Testing Library

## Backend

- Node.js
- Express
- Knex.js
- PostgreSQL
- Jest
- SuperTest

# Database

I used PostgreSQL for the database and Knex.js for queries, migrations, and seed data.

The main data being stored includes:

- Personnel
- Handovers
- Updates
- Acknowledgments
- Notifications

# Project Structure

I split the frontend into components, hooks, styles, and tests so that `App.jsx` would not have to handle everything itself.

The backend is separated into routes, migrations, seeds, and tests.

```text
crew-handover-tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── tests/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── docs/
│   ├── decision-tree-wireframe.png
│   ├── erd.png
│   └── proof-of-concept-wireframes.png
│
├── server/
│   ├── migrations/
│   ├── routes/
│   ├── seeds/
│   ├── tests/
│   ├── app.js
│   ├── knexfile.js
│   └── package.json
│
└── README.md
```

# Handover Categories

I separated handovers into categories based on the types of information I would normally expect to see during a crew handover.

The available categories are:

- Mission Issue
- Mission Note
- System Status
- Personnel Note
- Training
- Priority Task
- General

# Priority Levels

Each handover can have one of three priorities:

- High
- Normal
- Low

I added color coding to the cards so that the priority is easy to identify without having to read through every handover.

# Handover Status

Handovers can be:

- Open
- In Progress
- Closed

I also added a separate color indicator for status.

Closing a handover does not remove it. Closed handovers can still be viewed by changing the status filter, which keeps older information available if someone needs to go back and look at it.

# Updates and Acknowledgments

Personnel can add updates to an existing handover instead of having to create a new handover every time something changes.

Those updates stay attached to the handover so there is a history of what happened.

Personnel can also acknowledge a handover. The application keeps track of who acknowledged it and displays those personnel on the handover.

# Notifications

I added a persistent notification system so important changes are less likely to be missed.

Notifications are created when:

- A new high-priority handover is created
- A handover is directed to a specific person
- Someone adds an update to a handover directed to the user
- Someone adds an update to a handover the user has acknowledged

I also added some checks to prevent unnecessary notifications.

For example, if someone is both the person a handover is directed to and has acknowledged that handover, they only receive one notification when an update is added.

The person adding the update also does not get a notification for their own update.

Notifications are stored in the database instead of disappearing immediately. Users can mark them as read, mark all of them as read, and clear the notifications they have already read.

# Live Updates

I wanted the application to work when multiple people had it open at the same time.

The frontend periodically checks the server for new information. This allows another user's changes to appear without requiring everyone to manually refresh the page.

# Analytics

I added an analytics page as a stretch feature to give a quick overview of what is currently stored in the handover system.

The analytics page shows:

- Total handovers
- Open handovers
- In-progress handovers
- Closed handovers
- High-priority handovers
- Normal-priority handovers
- Low-priority handovers
- Handovers by category
- Total updates
- Total acknowledgments

# API Endpoints

## Personnel

```text
GET /api/personnel
GET /api/personnel/:id
```

## Handovers

```text
GET    /api/handovers
GET    /api/handovers/:id
POST   /api/handovers
PATCH  /api/handovers/:id
DELETE /api/handovers/:id
```

Handovers can also be filtered by priority, category, and status.

## Updates

```text
GET    /api/updates
GET    /api/updates/:id
POST   /api/updates
PATCH  /api/updates/:id
DELETE /api/updates/:id
```

When a new update is created, the server also checks whether anyone needs to receive a notification for that update.

## Acknowledgments

The acknowledgment routes are used to record who has acknowledged a handover and retrieve that information when viewing the handover.

## Notifications

The notification routes handle:

- Getting notifications for a user
- Creating persistent notifications
- Marking a notification as read
- Marking all notifications as read
- Clearing read notifications

## Analytics

```text
GET /api/analytics
```

This endpoint gathers the data used by the analytics page.

# Running the Project

## Requirements

You will need:

- Node.js
- npm
- PostgreSQL

# Server Setup

Go into the server directory:

```bash
cd server
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file with the PostgreSQL connection information needed by the application.

Run the migrations:

```bash
npx knex migrate:latest
```

Seed the database:

```bash
npx knex seed:run
```

Start the server:

```bash
npm start
```

The API runs on:

```text
http://localhost:8080
```

# Client Setup

Open another terminal and go into the client directory:

```bash
cd client
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Then open the local URL Vite displays in the terminal.

# Testing

I added automated tests to both the frontend and backend.

## Server Tests

From the `server` directory:

```bash
npm test
```

The server tests use Jest and SuperTest to test the API routes and responses.

## Client Tests

From the `client` directory:

```bash
npm test -- --run
```

The frontend tests use Vitest and React Testing Library to test components and user interactions.

# Application Flow

A normal flow through the application would look something like this:

1. Select your personnel profile.
2. Look through the current active handovers.
3. Filter the board if you are looking for something specific.
4. Create a handover.
5. Give it a category and priority.
6. Direct it to someone if needed.
7. Add a due date if it has one.
8. Other personnel can view and acknowledge it.
9. Add updates when something changes.
10. Personnel who need to know about those changes receive notifications.
11. Move the handover through Open, In Progress, and Closed as work continues.
12. Use the Closed filter if you need to look at something that was already completed.
13. Use the analytics page to get a quick overview of the handover data.

# Purpose

The main reason I chose this project was because it solves a problem I actually see at work.

A lot of our crew handover information is currently kept on a whiteboard. That can include mission issues, mission notes, system outages, things someone on the next crew needs to know, upcoming classes, and other high-priority tasks.

A whiteboard is quick and easy to use, but it is temporary. Once something gets erased, that history is gone, and it can also be difficult to tell who has actually seen an important piece of information.

The goal of Crew Handover Tracker was to take that same basic handover process and make it persistent. I wanted personnel to be able to see what needs attention, see what has changed, acknowledge information, and still be able to go back to older handovers when needed.