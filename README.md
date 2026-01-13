# 💈 Glamour Salon Management System 💅

A comprehensive and modern **Salon/Barber Shop Management System** developed as a full-stack application to streamline appointment booking, staff management, and administrative oversight.

<img width="1351" height="597" alt="1" src="https://github.com/user-attachments/assets/3618dc47-b0b1-4304-badd-7fd0db86b0e9" />

**Database Requirements: Create Database: `salon_management` and Import `salon_db.sql`**

## ✨ Key Features

This system is divided into two main parts: a **Public Booking Portal** for customers and a secure **Admin Dashboard** for management.

### 👤 Customer Features (Public Portal)
* **Easy Appointment Booking:** Users can quickly book a service with a preferred staff member on an available date and time.
* **Staff and Service Check:** Customers can view the list of available services, their prices, and details about the salon staff.
* **Booking Status Check:** Customers can easily check the status of their appointment (whether it's **Approved (Confirmed)**, **Rejected/Cancelled**, or **Pending**) by providing their email or phone number.

### 👑 Admin Features (Management Dashboard)
* **Dashboard Overview:** View today's schedule, total customers, monthly revenue, and pending bookings at a glance.
* **Booking Management:** Full control over all appointments.
    * **Status Control:** Change booking status to **Pending**, **Confirmed (Accepted)**, or **Rejected/Cancelled** with a single click.
    * **Editing:** Add or edit existing booking details (Customer, Staff, Date, Time, Status).
* **Customer Database:** Maintain a record of all clients.
* **Service and Staff Management:** Easily add, edit, or delete services and staff members.
* **Reporting & Data Export:**
    * **Generate Reports** based on date ranges (Revenue, Bookings, New Customers).
    * **Export Data** (e.g., XLS format) for external analysis.
* **Secure Login:** Separate login for admin access.

---
<img width="1285" height="618" alt="2" src="https://github.com/user-attachments/assets/d1a52d45-a519-496e-9c90-bf75cc07b782" />
<img width="1175" height="615" alt="3" src="https://github.com/user-attachments/assets/d32be5c0-204a-41b3-a565-a80f611a9459" />


## 💻 Technology Stack

This project is built using the foundational web development stack for speed and reliability.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **HTML5** & **CSS3** | Structure and modern responsive design. |
| **Interactivity** | **JavaScript** (jQuery) | Handling dynamic content loading, status updates, and form submissions. |
| **Backend/API** | **PHP** | Handling all server-side logic, routing, and database interactions (CRUD operations). |
| **Database** | **MySQL** / **MariaDB** | Structured storage for bookings, customers, services, and staff data. |

---
<img width="1162" height="519" alt="4" src="https://github.com/user-attachments/assets/00f1ebfa-350c-44be-9ab8-a07302aae0e7" />
<img width="1153" height="616" alt="5" src="https://github.com/user-attachments/assets/f907dcca-42ac-47e7-bf68-261a65598b4d" />

## ⚙️ Installation and Setup

To run this project locally, you need a local server environment like **XAMPP**.

### Prerequisites

1.  **XAMPP** (or WAMP/MAMP) installed.
2.  **Git** installed (for cloning this repository).

### Step 1: Clone the Repository

Open your terminal or Git Bash and clone the repository into your XAMPP's web directory (`htdocs`):

```bash
cd C:\xampp\htdocs
git clone [https://github.com/tayyab38201/Salon-Software.git](https://github.com/tayyab38201/Salon-Software.git) salon
