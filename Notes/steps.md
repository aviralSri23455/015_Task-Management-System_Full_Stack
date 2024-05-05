#  Task Management System

# Python Virtual Environment Setup before starting project 

##  step 1: Create a Virtual Environment
To create a virtual environment in Python, navigate to your project directory and run the following command. Replace `venv` with the desired name for your virtual environment.

```bash
cd path/to/your/project
python -m venv venv

```

## Step 2: Activate the Virtual Environment

- Windows

- For Windows, activate the virtual environment using the following command:

>- **venv\Scripts\activate**

- Unix-Based Systems (Linux/macOS)

>-**source venv/bin/activate**



- Project structure.
- Backend setup with Flask.
- Frontend setup with React.
- Connecting backend and frontend.
- Running and testing the project.

```
my_project/
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ └── ...
├── frontend/
│ ├── package.json
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── components/
│ │ │ ├── TaskList.js
│ │ │ ├── TaskForm.js
│ │ │ └── ...
│ └── ...
├── .gitignore
└── README.md


```


## Backend Setup with Flask
To set up the backend with Flask, follow these steps:

### Step 1: Initialize Flask Project
1. Create a `backend/` directory within your project.
2. Inside `backend/`, create a file called `app.py`.

### Step 2: Set Up Flask and MongoDB
1. Ensure Python is installed on your system.
2. Install Flask, Flask-CORS, MongoDB driver, and Celery:
   ```bash
   pip install flask flask-cors pymongo celery


3. Connect to a MongoDB instance and set up Flask with basic routes.



### Step 3: Create app.py

- Here's a simple Flask setup for CRUD operations with MongoDB:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import logging
from datetime import datetime, timedelta
from celery import Celery
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Set up logging
app.logger.setLevel(logging.DEBUG)

# Connect to MongoDB
client = MongoClient('localhost', 27017)  # Default MongoDB port
db = client['task_management']  # Database name
tasks_collection = db['tasks']  # Collection name

# Basic CRUD operations with MongoDB

# Create a Celery instance with Redis as the broker
def make_celery(app):
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    celery = Celery(app.import_name, backend=redis_url, broker=redis_url)
    celery.conf.update(app.config)
    return celery

# Initialize Celery
celery = make_celery(app)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)  # Start the Flask development server

```

### Step 4: Create requirements.txt

- I  have created  file in folder 

### Step 5 : Run the Flask App

- To test CRUD operations, you need to start the Flask app and make HTTP requests to your endpoints.

#### In your backend directory

- python app.py  # This will start the Flask server

### Once the server is running, you can use a tool like curl or Postman to test your CRUD operations:

- GET /tasks: Fetches all tasks.
- POST /tasks: Creates a new task. Include required data in the request body.
- PUT /tasks/<task_id>: Updates a task with the specified ID.
- DELETE /tasks/<task_id>: Deletes a task with the specified ID.
- PUT /tasks/<task_id>/complete: Marks a task as completed.


# Frontend Setup with React


### Step 1: Initialize React Project

- Create a frontend/ directory within your project.
- Use Create React App to initialize a new React project:

>- **npx create-react-app frontend**


### Step 2: Install Axios

- To install Axios in your React project, use the following command:


>- **npm install axios**


###  Step 3: Verify the Installation


```package.json

"dependencies": {
  "axios": "version_number"  /* Replace with the version installed */
}

```


### Step 4: Create App.js

- Edit the App.js file in frontend/src/ to include your React components

**App.js**

```javascript

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EditTaskForm from './components/EditTaskForm';
import './App.css';  // Include your CSS styles

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    // Fetch tasks from the backend
    axios.get('http://127.0.0.1:5000/tasks')  # Adjust the URL as needed
      .then((response) => {
        setTasks(response.data);  // Set tasks in state
      })
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Add other CRUD operations here...

  return (
    <div>
      <h1>Task Management System</h1>
      {/* Add your TaskForm, TaskList, and EditTaskForm components here */}
    </div>
  );
};

export default App;

```


### Step 5: Add Custom Components

- In frontend/src/components/, create your custom components like TaskList, TaskForm, and EditTaskForm.



### Step 6: Run the React App

- To run the React app, navigate to the frontend/ directory and start the React development server:

>- **cd frontend**
>- npm start















