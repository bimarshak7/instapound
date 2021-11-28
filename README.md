# InstaPound
## Instagram clone using Flask and ReactJs.
### Features 
* Registration and login (with user profile including DP, bio and so on)
* Create, Edit, Delete and Like/Unlike Posts (with or without images)
* Add, Delete and Like/Unlike Comments (no threaded comment)
* Change Password, delete account and edit profile(can edit all details except username)
* Add/Delete Friends (Auto request approval for now :) )
* Post/Comment created time (eg: 1d, 1w, 16mins)
* Feed (Posts of friends only)
* Search for users.
***
### Major Framework/modules
* Flask (for API)
*  ReactJs, React-Redux (frontend/state management)
* PyJWT (Authentication using JSON Web Token)
* UUID (generate uniques IDs)
* SQLAlchemy/ Flask-SQLAlchemy (ORM to handle Database)
* SQLlite database 
*  Werkzeug (hashing passwords, secure uploaded filenames)
* Babel and WebPack (Compile react app for frontend)
***
### Setup
1. Clone the project  
```$ git clone https://github.com/bimarshak7/instapound.git```  
3. Install required modules for backend flask app using  
```$ pip install -r requirements.txt```  
3. Install node_modules required using these commands  
 ```$ cd static/front```  
    ```$ npm install```  
4. Create database (only once)  
```$ python``` (activate python shell)   
```>>> from models import *```  
```>>> from main import db```  
```>>> db.create_all()```  

5. Create secret key and store in env variable.   
```$ export secret_KEY='YOUR_SECRET_KEY'```
6. Then start flask server.  
 ```$ cd ../..```(return to root working directory)  
```python app.py```   
The app will be live on ```127.0.0.1:5000/```   
7. To rebuild frontend, use ```npm run dev```from ```static/front``` folder after making any changes in frontend.

5. Then start flask server.  
 ```$ cd ../..```(return to root working directory)  
```python app.py```   
The app will be live on ```127.0.0.1:5000/```   
6. To rebuild frontend, use ```npm run dev```from ```static/front``` folder after making any changes in frontend.
