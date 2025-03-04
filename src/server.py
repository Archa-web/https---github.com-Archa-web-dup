
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import re

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Database Configuration (Change these accordingly)
DB_USER = "root"  # Change to your MySQL username
DB_PASSWORD = "Vichu123"  # Change to your MySQL password
DB_HOST = "localhost"  # Change if using a remote server
DB_NAME = "gaming"  # Change to your database name

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://root:Vichu123@localhost/gaming"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize Database
db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    # Login Table Model (Now includes password)
class LoginTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Input Validation Functions
def is_valid_email(email):
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email)

def is_valid_password(password):
    return re.match(r'^(?=.*[A-Z])(?=.*[\W_]).{6,}$', password)

# ✅ User Registration Endpoint
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    full_name = data.get("fullName", "").strip()
    email = data.get("email", "").strip()
    username = data.get("username", "").strip()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    errors = {}

    if not full_name:
        errors["fullName"] = "Full Name is required"
    if not is_valid_email(email):
        errors["email"] = "Invalid email format"
    if not username:
        errors["username"] = "Username is required"
    if not is_valid_password(password):
        errors["password"] = "Password must be at least 6 characters, contain 1 uppercase letter, and 1 special character"
    if password != confirm_password:
        errors["confirmPassword"] = "Passwords do not match"

    if User.query.filter_by(email=email).first():
        errors["email"] = "Email already in use"
    if User.query.filter_by(username=username).first():
        errors["username"] = "Username already taken"

    if errors:
        return jsonify({"errors": errors}), 400

    password_hash = generate_password_hash(password)
    new_user = User(full_name=full_name, email=email, username=username, password_hash=password_hash)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registration successful! Redirecting to login..."}), 201

# ✅ User Login Endpoint (Rename function to avoid conflict)
@app.route("/login", methods=["POST"])
def user_login():
    data = request.json
    username_or_email = data.get("usernameOrEmail", "").strip()
    password = data.get("password", "")

    user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username/email or password"}), 401

    # Log successful login in LoginTable (stores hashed password)
    logged_user = LoginTable(username=user.username, password=user.password_hash)
    db.session.add(logged_user)
    db.session.commit()

    return jsonify({"message": "Login successful!", "username": user.username}), 200

# Initialize Database (Run this once)
with app.app_context():
    db.create_all()

# Run the App
if __name__ == "__main__":
    app.run(debug=True)