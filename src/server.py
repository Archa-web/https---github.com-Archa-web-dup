from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)
CORS(app)

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

# Input Validation Functions
def is_valid_email(email):
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email)

def is_valid_password(password):
    return re.match(r'^(?=.*[A-Z])(?=.*[\W_]).{6,}$', password)

@app.route('/register', methods=['POST'])
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

# Initialize Database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
