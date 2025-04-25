# 🩸 Blood Bank Management System (MERN Stack)

This is a web-based Blood Bank Management System built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The system streamlines the process of blood donation and request management by offering separate modules for **Admin**, **Donor**, and **Patient** roles.

---

## 🔑 Features

### 👤 Admin Module
- Create Admin account using setup command.
- Dashboard includes:
  - Total units of each blood group available.
  - Number of Donors.
  - Number of Blood Requests.
  - Number of Approved Requests.
  - Total Blood Units in Stock.
- **Donor Management:**
  - View, Update, Delete Donor records.
- **Patient Management:**
  - View, Update, Delete Patient records.
- **Donation Request Handling:**
  - View all donation requests.
  - Approve/Reject requests based on donor's disease.
  - Approved donations increase stock of respective blood group.
  - Rejected donations do not affect stock.
- **Blood Request Handling:**
  - View all blood requests from Donors/Patients.
  - Approve/Reject requests.
  - Approved requests reduce stock of respective blood group.
  - Rejected requests do not affect stock.
- View **Request History**.
- Manually update the unit of any specific blood group.

---

### 🧑‍💉 Donor Module
- Can register by providing basic personal details.
- Post login functionalities:
  - Can donate blood (requires Admin approval).
  - Can request blood.
  - View donation request status (Pending, Approved, Rejected).
  - View blood request history with status.
  - Dashboard shows:
    - Number of Requests Made.
    - Number Approved, Pending, Rejected.

> ✅ Donor can both donate and request blood.

---

### 🧑‍⚕️ Patient Module
- Can register and login without admin approval.
- Post login functionalities:
  - Request specific blood group and units.
  - View blood request history with status (Pending, Approved, Rejected).
  - Dashboard shows:
    - Number of Requests Made.
    - Number Approved, Pending, Rejected.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Bootstrap, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Other Tools:** Axios, JWT Auth, Mongoose

---

## 📦 Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blood-bank-management-system.git
   cd blood-bank-management-system
