from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__,template_folder='static/front')
app.config['SECRET_KEY'] = 'secret'
app.config['UPLOAD_FOLDER'] = 'static/uploads'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instapound.db'
db=SQLAlchemy(app)