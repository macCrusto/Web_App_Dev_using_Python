# Web Application Development with Python

Welcome to the **Web Application Development with Python** learning repository. This project is structured as a hands-on resource to master backend engineering, database integration, and modern architectural principles using Python's leading web frameworks: **Flask** and **Django**.

Rather than just building a simple application, this repository serves as an educational blueprint for designing modular backend systems, understanding resource lifecycles, and implementing robust security measures.

---

## Core Learning Pillars

### 1. Flask vs. Django: Architectural Philosophies
A central theme of this repository is understanding the trade-offs between Python's two main web paradigms:

| Metric | Flask (Micro-framework) | Django (Batteries-Included) |
| :--- | :--- | :--- |
| **Philosophy** | Minimalist, unopinionated, highly customizable. | Opinionated, structured, promotes rapid development. |
| **Routing** | Explicit route registration via decoraters or blueprints. | Centralized routing via `urls.py`. |
| **ORM / Database** | Manual integration (e.g., PyMySQL, SQLAlchemy). | Built-in robust Django ORM. |
| **Admin Panel** | Requires third-party packages or custom builds. | Native, automatically generated admin dashboard. |
| **Use Case** | Lightweight microservices, custom architectures, learning core components. | Large-scale monolithic applications, enterprise systems. |

---

### 2. Backend Architectural Decisions & API Endpoint Design

Building robust APIs requires thinking about scalability, error resilience, and standardized HTTP communication. This project applies several best-practice patterns:

#### Modular Blueprint Architecture (Flask)
Instead of placing all logic in a single file, routes are separated into logical modules using Flask **Blueprints** (see [auth.py](file:///c:/Users/HP/Documents/class/Web_App_Dev_using_Python/auth/auth.py)). This mirrors the Django modular app structure (`app.register_blueprint(auth_bp, url_prefix="/api/auth")`).

#### RESTful Principles & API Design
Our endpoint layouts prioritize REST standards:
* **Endpoint Structure**: Grouped under `/api/` with resource naming (e.g., POST `/api/auth/register`).
* **HTTP Methods**: Strict usage of proper HTTP verbs (e.g., `POST` for creation, `GET` for retrieval).
* **Consistent Response Payloads**: Every endpoint returns JSON payloads containing explicit `success` flags and descriptive messages:
  ```json
  {
    "success": false,
    "message": "Email already exists"
  }
  ```

#### Standardized HTTP Status Codes
Proper status codes inform the client of the transaction status without parsing messages:
* `201 Created`: Successfully created a resource (e.g., registration).
* `400 Bad Request`: Validation errors or missing parameters.
* `409 Conflict`: Business logic conflicts (e.g., duplicate email constraint).
* `500 Internal Server Error`: Server errors (wrapped in database try-except blocks).

---

### 3. Database Lifecycle & Resource Management
Direct database communication without a heavy ORM provides deep insights into how databases function under the hood:
* **Raw SQL Queries**: Direct query execution via PyMySQL allows learning SQL statement structures and transaction management.
* **Strict Connection Lifecycle**: Connections and cursors are created on demand and explicitly closed in `finally` blocks (see [db.py](file:///c:/Users/HP/Documents/class/Web_App_Dev_using_Python/db.py) and [auth.py](file:///c:/Users/HP/Documents/class/Web_App_Dev_using_Python/auth/auth.py)). This prevents thread starvation and database connection leaks:
  ```python
  try:
      conn = get_connection()
      cursor = conn.cursor()
      # Execute query...
  except Exception as e:
      # Handle exception...
  finally:
      if cursor: cursor.close()
      if conn: conn.close()
  ```

---

### 4. Backend Security Best Practices
Security should be baked in from day one, not bolted on as an afterthought:
* **One-Way Password Hashing**: Passwords are never stored in plain text. We utilize standard blowfish-based salting and hashing via `Bcrypt` (configured in [extension.py](file:///c:/Users/HP/Documents/class/Web_App_Dev_using_Python/extension.py) and generated in [auth.py](file:///c:/Users/HP/Documents/class/Web_App_Dev_using_Python/auth/auth.py)).
* **Input Validation**: Sanitizing input parameters and validating structures (e.g., email syntax validation via `email-validator`) before execution prevents injection vectors and database pollution.

---

## Repository Structure

```directory
├── auth/
│   ├── auth.py         # Authentication Blueprint routes (register, etc.)
│   └── routes.py       # Cryptography/hashing script/extension configuration
├── templates/          # Frontend templates (if template rendering is utilized)
├── app.py              # Main Flask entrypoint & configuration setup
├── config.py           # Environment variables configuration management
├── db.py               # Database connection helper utilizing PyMySQL
├── extension.py        # Extensions setup (Flask-Bcrypt instantiation)
├── overview-of-oop.txt # Theoretical concepts on Object-Oriented Programming
└── requirements.txt    # List of all the libraries and dependencies needed
```

---

## Setup and Running Locally

To run this backend repository on your system, follow the steps below:

### 1. Prerequisites
Ensure you have the following installed:
* Python 3.8+
* MySQL Server (locally or hosted)

### 2. Environment Variables Configuration
Create a `.env` file in the root directory (using `.env.example` as a template) and add the following:
```env
MY_SECRET_KEY=your_secret_key_here
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name
```

### 3. Installation
1. **Initialize a virtual environment:**
   ```bash
   python -m venv venv
   ```
2. **Activate the virtual environment:**
   * **Windows (PowerShell):** `venv\Scripts\Activate.ps1`
   * **macOS/Linux:** `source venv/bin/activate`
3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### 4. Run the Dev Server
Launch the Flask development server using:
```bash
python app.py
```
The server will boot up in debug mode and run locally at `http://127.0.0.1:5000/`.
