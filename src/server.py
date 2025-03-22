from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import re
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# ==================== CONFIGURATION ====================
# MySQLdb config for game_addiction DB (Questions & Answers)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Vichu123'
app.config['MYSQL_DB'] = 'gaming'
mysql = MySQL(app)

# SQLAlchemy config for user management
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Vichu123@localhost/gaming"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# ==================== MODELS ====================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

class LoginTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)

# ==================== HELPERS ====================
def is_valid_email(email):
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email)

def is_valid_password(password):
    return re.match(r'^(?=.*[A-Z])(?=.*[\W_]).{6,}$', password)

# ==================== AUTH ROUTES ====================
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    full_name = data.get("fullName", "").strip()
    email = data.get("email", "").strip()
    username = data.get("username", "").strip()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    errors = {}
    if not full_name: errors["fullName"] = "Full Name is required"
    if not is_valid_email(email): errors["email"] = "Invalid email format"
    if not username: errors["username"] = "Username is required"
    if not is_valid_password(password):
        errors["password"] = "Password must be at least 6 characters, contain 1 uppercase letter, and 1 special character"
    if password != confirm_password: errors["confirmPassword"] = "Passwords do not match"
    if User.query.filter_by(email=email).first(): errors["email"] = "Email already in use"
    if User.query.filter_by(username=username).first(): errors["username"] = "Username already taken"

    if errors:
        return jsonify({"errors": errors}), 400

    password_hash = generate_password_hash(password)
    new_user = User(full_name=full_name, email=email, username=username, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registration successful! Redirecting to login..."}), 201

@app.route("/login", methods=["POST"])
def user_login():
    data = request.json
    username_or_email = data.get("usernameOrEmail", "").strip()
    password = data.get("password", "")

    user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username/email or password"}), 401

    logged_user = LoginTable(username=user.username, password=user.password_hash)
    db.session.add(logged_user)
    db.session.commit()

    return jsonify({"message": "Login successful!", "username": user.username}), 200

# ==================== GAME ADDICTION SURVEY ROUTES ====================
@app.route('/gaming/questions/<age_group>', methods=['GET'])
def get_questions(age_group):
    try:
        print(f"Fetching questions for age_group: {age_group}")
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, question_text FROM questions WHERE age_group = %s", (age_group,))
        questions = cur.fetchall()

        if not questions:
            cur.close()
            return jsonify({"error": "No questions found"}), 404

        formatted_questions = []
        for q in questions:
            cur.execute("SELECT id, answer_text, score FROM answers WHERE question_id = %s", (q[0],))
            answers = cur.fetchall()
            formatted_questions.append({
                "id": q[0],
                "question": q[1],
                "answers": [{"id": a[0], "text": a[1], "score": a[2]} for a in answers]
            })

        cur.close()
        return jsonify(formatted_questions), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/submit', methods=['POST'])
def submit_survey():
    try:
        data = request.get_json()
        responses = data.get('responses', [])

        if not responses:
            return jsonify({"error": "No responses provided"}), 400

        total_score = sum(response['score'] for response in responses)

        if total_score <= 15:
            level = 'Low Addiction'
        elif total_score <= 30:
            level = 'Moderate Addiction'
        elif total_score <= 45:
            level = 'High Addiction'
        else:
            level = 'Severe Addiction'

        return jsonify({"total_score": total_score, "level": level}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

    

# ==================== RUN APP ====================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)