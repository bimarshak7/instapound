from main import app
from routes import auth, posts, friends, comments

if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0')