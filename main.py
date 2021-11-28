from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__,template_folder='static/front')
app.config['SECRET_KEY'] = os.environ['secret_KEY']
app.config['UPLOAD_FOLDER'] = 'static/uploads'

DATABASE_URL = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres@localhost:5432/instapound"
db=SQLAlchemy(app)