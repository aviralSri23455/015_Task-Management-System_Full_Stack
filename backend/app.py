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

# Function to convert ObjectId to string for JSON serialization
def convert_task(task):
    task['_id'] = str(task['_id'])  # Convert ObjectId to string
    return task

# Create a Celery instance with Redis as the broker
def make_celery(app):
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    celery = Celery(app.import_name, backend=redis_url, broker=redis_url)
    celery.conf.update(app.config)
    return celery

# Initialize Celery
celery = make_celery(app)

# Get all tasks (Read)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        tasks = list(tasks_collection.find())  # Retrieve all tasks from MongoDB
        tasks = list(map(convert_task, tasks))  # Convert ObjectId to string
        return jsonify(tasks)  # Return tasks as JSON
    except Exception as e:
        app.logger.error(f"Error getting tasks: {e}")
        return jsonify({'error': 'Failed to fetch tasks'}), 500

# Create a new task (Create)
@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json  # Get JSON data from the request
        
        # Validate required fields
        required_fields = ['sr_no', 'name', 'task', 'deadline']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f"'{field}' is required"}), 400
        
        # Set pending by default and set the pending date
        data['pending'] = True
        data['pending_date'] = str(datetime.now().date())
        data['completion_date'] = None
        
        # Assignment and progress tracking
        data['assigned_to'] = data.get('assigned_to', None)
        data['progress'] = data.get('progress', 0)
        data['subtasks'] = data.get('subtasks', [])

        # Set reminder date (example: one day before the deadline)
        reminder_date = datetime.strptime(data['deadline'], "%Y-%m-%d"). date() - timedelta(days=1)
        data['reminder_date'] = str(reminder_date)

        # Insert into MongoDB
        result = tasks_collection.insert_one(data)
        
        new_task = convert_task(data)
        
        return jsonify({
            '_id': str(result.inserted_id),
            'message': 'Task created',
            **new_task
        }), 201
    except Exception as e:
        app.logger.error(f"Error creating task: {e}")
        return jsonify({'error': 'Failed to create task'}), 500

# Update a task (Update)
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json  # Get JSON data from the request
        
        # Ensure '_id' is not in the data to be updated
        if '_id' in data:
            del data['_id']
        
        # Update the task in MongoDB
        update_result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': data}
        )
        
        if update_result.matched_count == 0:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({'message': 'Task updated'})
    except Exception as e:
        app.logger.error(f"Error updating task: {e}")
        return jsonify({'error': 'Failed to update task'}), 500

# Delete a task (Delete)
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        delete_result = tasks_collection.delete_one(
            {'_id': ObjectId(task_id)}
        )
        
        if delete_result.deleted_count == 0:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({'message': 'Task deleted'})
    except Exception as e:
        app.logger.error(f"Error deleting task: {e}")
        return jsonify({'error': 'Failed to delete task'}), 500

# Complete a task (Mark it as completed)
@app.route('/tasks/<task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    try:
        update_result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': {
                'pending': False,
                'completion_date': str(datetime.now().date())
            }}
        )
        
        if update_result.matched_count == 0:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({'message': 'Task marked as completed'})
    except Exception as e:
        app.logger.error(f"Error completing task: {e}")
        return jsonify({'error': 'Failed to complete task'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)  # Start the Flask development server
