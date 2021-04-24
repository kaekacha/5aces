from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/5aces")

# Create render template app
@app.route("/")
def home():
    return render_template("index.html")

# Route to render index.html template using data from Mongo
@app.route("/data")
def ggdata():

    # Find one record of data from the mongo database
    # This creates a python copy of the collection in the db
    gg_data = [data for data in mongo.db["grad&garden_data"].find({}, {"_id": False})]
    # print(gg_data)
    
    # Return template and data
    return jsonify(gg_data[:10])

if __name__ == "__main__":
    app.run(debug=True)
