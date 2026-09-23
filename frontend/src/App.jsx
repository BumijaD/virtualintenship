import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://virtualintenship-production.up.railway.app";

function App() {
  const [role, setRole] = useState("student");
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [companyApplicationMessage, setCompanyApplicationMessage] =
    useState("");

  // =====================================================
  // STUDENT ACCOUNT / SIGNUP
  // =====================================================

  const [studentId, setStudentId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");

  // COMPANY ACCOUNT / SIGNUP
  const [companySignupName, setCompanySignupName] = useState("");
  const [companySignupEmail, setCompanySignupEmail] = useState("");
  const [companySignupPassword, setCompanySignupPassword] = useState("");
  const [companySignupConfirmPassword, setCompanySignupConfirmPassword] = useState("");
  const [companySignupError, setCompanySignupError] = useState("");
  const [companySignupLoading, setCompanySignupLoading] = useState(false);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    setLoggedIn(false);
    setPage("dashboard");
    setEmail("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setLoginError("");
    setRegistrationMessage("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupError("");
    setSignupLoading(false);
    setCompanySignupName("");
    setCompanySignupEmail("");
    setCompanySignupPassword("");
    setCompanySignupConfirmPassword("");
    setCompanySignupError("");
    setCompanySignupLoading(false);
    setStudentId(null);
    setCompanyId(null);
    setCompanyName("");
    setApplicationMessage("");
    setCompanyApplicationMessage("");
    setSelectedInternship(null);
  };

  // =====================================================
  // INTERNSHIPS
  // =====================================================

  const [internships, setInternships] = useState([]);
  const [internshipsLoading, setInternshipsLoading] = useState(false);
  const [internshipsError, setInternshipsError] = useState("");

  useEffect(() => {
    const loadInternships = async () => {
      setInternshipsLoading(true);
      setInternshipsError("");

      try {
        const response = await fetch(API_URL + "/internships");

        if (!response.ok) {
          throw new Error("Failed to load internships");
        }

        const data = await response.json();

        const internshipList = Array.isArray(data) ? data : [];

        setInternships(
          internshipList.map((internship) => ({
            ...internship,
            company:
              internship.company ||
              "Company " + internship.company_id,
            duration: internship.duration || "Not specified",
          }))
        );
      } catch (error) {
        console.error("Internship loading error:", error);
        setInternshipsError("Cannot load internships from backend.");
      } finally {
        setInternshipsLoading(false);
      }
    };

    loadInternships();
  }, []);

  // =====================================================
  // STUDENT APPLICATIONS
  // =====================================================

  const [applications, setApplications] = useState([
    {
      application_id: 2,
      internship: "Python Developer Intern",
      company: "ABC Technologies",
      date: "12 August 2026",
      status: "Applied",
    },
    {
      application_id: 3,
      internship: "Cybersecurity Intern",
      company: "Secure Tech",
      date: "10 August 2026",
      status: "Shortlisted",
    },
  ]);

  // =====================================================
  // COMPANY INTERNSHIPS
  // =====================================================

  const [companyInternships, setCompanyInternships] = useState([
    {
      title: "Frontend Developer Intern",
      location: "Chennai",
      duration: "3 Months",
      applicants: 8,
    },
    {
      title: "Python Developer Intern",
      location: "Remote",
      duration: "6 Months",
      applicants: 12,
    },
    {
      title: "Java Developer Intern",
      location: "Bangalore",
      duration: "4 Months",
      applicants: 15,
    },
    {
      title: "Cybersecurity Intern",
      location: "Chennai",
      duration: "3 Months",
      applicants: 10,
    },
    {
      title: "Data Science Intern",
      location: "Hyderabad",
      duration: "6 Months",
      applicants: 7,
    },
    {
      title: "Cloud Computing Intern",
      location: "Remote",
      duration: "5 Months",
      applicants: 9,
    },
  ]);

  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  const submitApplication = async () => {
    setApplicationMessage("");

    if (!selectedInternship) {
      setApplicationMessage("Please select an internship.");
      return;
    }

    try {
      const response = await fetch(
        API_URL + "/applications?student_id=" +
          studentId +
          "&internship_id=" +
          selectedInternship.internship_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setApplicationMessage(
          "Application submitted successfully!"
        );

        let result = {};
        try {
          result = await response.json();
        } catch (error) {
          result = {};
        }

        const today = new Date();

        const newApplication = {
          application_id:
            result.application_id ||
            result.id ||
            Date.now(),
          internship: selectedInternship.title,
          company: selectedInternship.company,
          date: today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          status: "Applied",
        };

        setApplications((previousApplications) => [
          ...previousApplications,
          newApplication,
        ]);

        setTimeout(() => {
          setPage("applications");
          setApplicationMessage("");
        }, 1000);
      } else {
        const errorText = await response.text();

        console.log("Application error:", errorText);

        setApplicationMessage(
          "Application could not be submitted."
        );
      }
    } catch (error) {
      console.error(
        "Backend connection error:",
        error
      );

      setApplicationMessage(
        "Cannot connect to backend."
      );
    }
  };

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateApplicationStatus = async (
    applicationId,
    status,
    studentName
  ) => {
    setCompanyApplicationMessage("");

    if (!applicationId) {
      alert("Application ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/applications/${applicationId}?status=${encodeURIComponent(
          status
        )}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let result = {};
      try {
        result = await response.json();
      } catch (error) {
        result = {};
      }

      if (
        response.ok &&
        result.message ===
          "Application status updated successfully"
      ) {
        setApplications((previousApplications) =>
          previousApplications.map((application) =>
            application.application_id === applicationId
              ? { ...application, status: status }
              : application
          )
        );

        setCompanyApplicationMessage(
          `${studentName}'s application is now ${status}.`
        );

        alert(
          `${studentName}'s application ${status.toLowerCase()} successfully!`
        );
      } else {
        console.error(
          "Application status update error:",
          result
        );

        alert(
          result.message ||
            "Application status could not be updated."
        );
      }
    } catch (error) {
      console.error(
        "Backend connection error:",
        error
      );

      alert("Cannot connect to backend.");
    }
  };

  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  if (
    loggedIn &&
    role === "admin" &&
    page === "dashboard"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <h2>Welcome, Admin 🛡️</h2>

          <p>
            Manage students, companies, internships and
            applications.
          </p>

          <div className="dashboard-cards">

            <div className="card">
              <h3>Manage Students</h3>

              <p>
                View registered students.
              </p>

              <button
                onClick={() =>
                  setPage("admin-students")
                }
              >
                View Students
              </button>
            </div>

            <div className="card">
              <h3>Manage Companies</h3>

              <p>
                View registered companies.
              </p>

              <button
                onClick={() =>
                  setPage("admin-companies")
                }
              >
                View Companies
              </button>
            </div>

            <div className="card">
              <h3>Manage Internships</h3>

              <p>
                Monitor internship postings.
              </p>

              <button
                onClick={() =>
                  setPage("admin-internships")
                }
              >
                View Internships
              </button>
            </div>

            <div className="card">
              <h3>Manage Applications</h3>

              <p>
                Monitor student applications.
              </p>

              <button
                onClick={() =>
                  setPage("admin-applications")
                }
              >
                View Applications
              </button>
            </div>

            <div className="card">
              <h3>Admin Activity</h3>

              <p>
                View recent platform activities.
              </p>

              <button
                onClick={() =>
                  setPage("admin-activity")
                }
              >
                View Activity
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ADMIN STUDENTS
  // =====================================================

  if (
    loggedIn &&
    role === "admin" &&
    page === "admin-students"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>Manage Students</h2>

          <div className="admin-table">

            <div className="table-row table-header">
              <span>ID</span>
              <span>Name</span>
              <span>Email</span>
              <span>Status</span>
            </div>

            <div className="table-row">
              <span>1</span>
              <span>Bumija</span>
              <span>bumijanavya@gmail.com</span>
              <span className="active-status">
                Active
              </span>
            </div>

            <div className="table-row">
              <span>2</span>
              <span>Navya</span>
              <span>navya2026@gmail.com</span>
              <span className="active-status">
                Active
              </span>
            </div>

            <div className="table-row">
              <span>33</span>
              <span>Dharma</span>
              <span>
                dharmatest20260812@gmail.com
              </span>
              <span className="active-status">
                Active
              </span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ADMIN COMPANIES
  // =====================================================

  if (
    loggedIn &&
    role === "admin" &&
    page === "admin-companies"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>Manage Companies</h2>

          <div className="admin-table">

            <div className="table-row table-header">
              <span>ID</span>
              <span>Company</span>
              <span>Email</span>
              <span>Status</span>
            </div>

            <div className="table-row">
              <span>1</span>
              <span>ABC Technologies</span>
              <span>abc@gmail.com</span>
              <span className="active-status">
                Active
              </span>
            </div>

            <div className="table-row">
              <span>2</span>
              <span>XYZ Solutions</span>
              <span>xyz@gmail.com</span>
              <span className="active-status">
                Active
              </span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ADMIN INTERNSHIPS
  // =====================================================

  if (
    loggedIn &&
    role === "admin" &&
    page === "admin-internships"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>Manage Internships</h2>

          <div className="dashboard-cards">

            {internships.map((internship) => (
              <div
                className="card"
                key={internship.internship_id}
              >

                <h3>{internship.title}</h3>

                <p>
                  <strong>Company:</strong>{" "}
                  {internship.company}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {internship.location}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {internship.duration}
                </p>

                <button
                  onClick={() =>
                    alert("Internship approved!")
                  }
                >
                  Approve
                </button>

              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ADMIN APPLICATIONS
  // =====================================================

  if (
    loggedIn &&
    role === "admin" &&
    page === "admin-applications"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>Manage Applications</h2>

          <div className="application-list">

            <div className="application-card">

              <div>
                <h3>Bumija</h3>

                <p>
                  <strong>Internship:</strong>{" "}
                  Python Developer Intern
                </p>

                <p>
                  <strong>Company:</strong>{" "}
                  ABC Technologies
                </p>
              </div>

              <span className="status applied">
                Applied
              </span>

            </div>

            <div className="application-card">

              <div>
                <h3>Navya</h3>

                <p>
                  <strong>Internship:</strong>{" "}
                  Cybersecurity Intern
                </p>

                <p>
                  <strong>Company:</strong>{" "}
                  Secure Tech
                </p>
              </div>

              <span className="status shortlisted">
                Shortlisted
              </span>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ADMIN ACTIVITY
  // =====================================================

  if (
    loggedIn &&
    role === "admin" &&
    page === "admin-activity"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>Admin Activity</h2>

          <div className="activity-list">

            <div className="activity-item">
              <strong>
                New Student Registered
              </strong>

              <span>
                Bumija registered on the platform.
              </span>
            </div>

            <div className="activity-item">
              <strong>
                New Company Registered
              </strong>

              <span>
                ABC Technologies joined the platform.
              </span>
            </div>

            <div className="activity-item">
              <strong>
                Internship Posted
              </strong>

              <span>
                Python Developer internship was posted.
              </span>
            </div>

            <div className="activity-item">
              <strong>
                Application Submitted
              </strong>

              <span>
                A student submitted an internship application.
              </span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // COMPANY POST INTERNSHIP
  // =====================================================

  if (
    loggedIn &&
    role === "company" &&
    page === "post"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="form-container">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>Post New Internship</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const formData = new FormData(form);

              const title = formData.get("title");
              const companyName = formData.get("companyName");
              const location = formData.get("location");
              const duration = formData.get("duration");
              const skills = formData.get("skills");
              const description = formData.get("description");
              const stipendText = formData.get("stipend");
              const lastDate = formData.get("lastDate");

              const stipend = Number(stipendText);

              if (!title || !companyName || !location || !duration || !skills || !description || !stipendText || !lastDate) {
                alert("Please fill all fields.");
                return;
              }

              if (Number.isNaN(stipend)) {
                alert("Please enter a valid stipend amount.");
                return;
              }

              try {
                const query = new URLSearchParams({
                  company_id: String(companyId || 1),
                  admin_id: "1",
                  title: String(title),
                  description: String(description),
                  location: String(location),
                  stipend: String(stipend),
                  duration: String(duration),
                  last_date: String(lastDate),
                });

                const response = await fetch(
                  API_URL + "/internships?" + query.toString(),
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                    },
                  }
                );

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(
                    data.detail ||
                      data.message ||
                      "Failed to post internship"
                  );
                }

                alert("Internship posted successfully!");

                setCompanyInternships([
                  ...companyInternships,
                  {
                    internship_id: data.internship_id,
                    title: String(title),
                    company: String(companyName),
                    location: String(location),
                    duration: String(duration),
                    skills: String(skills),
                    description: String(description),
                    stipend: stipend,
                    last_date: String(lastDate),
                    applicants: 0,
                  },
                ]);

                form.reset();
                setPage("company-internships");
              } catch (error) {
                console.error("Post internship error:", error);
                alert(
                  "Failed to post internship. Please check the backend connection."
                );
              }
            }}
          >
            <input
              type="text"
              name="title"
              placeholder="Internship Title"
              required
            />

            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration"
              required
            />

            <input
              type="text"
              name="skills"
              placeholder="Required Skills"
              required
            />

            <textarea
              name="description"
              rows="5"
              placeholder="Internship Description"
              required
            ></textarea>

            <input
              type="number"
              name="stipend"
              placeholder="Stipend"
              min="0"
              step="0.01"
              required
            />

            <input
              type="date"
              name="lastDate"
              required
            />

            <button
              className="submit-button"
              type="submit"
            >
              Post Internship
            </button>
          </form>

        </div>
      </div>
    );
  }

  // =====================================================
  // COMPANY APPLICATIONS
  // =====================================================

  if (
    loggedIn &&
    role === "company" &&
    page === "company-applications"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() =>
              setPage("company-internships")
            }
          >
            ← Back to My Internships
          </button>

          <h2>Applications</h2>

          <p>
            Students who applied for your internships.
          </p>

          {companyApplicationMessage && (
            <p
              style={{
                color: "green",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {companyApplicationMessage}
            </p>
          )}

          <div className="application-list">

            <div className="application-card">

              <div>
                <h3>Bumija</h3>

                <p>
                  <strong>Email:</strong>{" "}
                  dharmatest20260812@gmail.com
                </p>

                <p>
                  <strong>Internship:</strong>{" "}
                  Python Developer Intern
                </p>

                <p>
                  <strong>College:</strong>{" "}
                  Engineering College
                </p>

                <p>
                  <strong>Skills:</strong>{" "}
                  Python, Java, React, SQL
                </p>
              </div>

              <div className="application-actions">

                <button
                  className="shortlist-button"
                  onClick={() =>
                    updateApplicationStatus(
                      2,
                      "Shortlisted",
                      "Bumija"
                    )
                  }
                >
                  Shortlist
                </button>

                <button
                  className="reject-button"
                  onClick={() =>
                    updateApplicationStatus(
                      2,
                      "Rejected",
                      "Bumija"
                    )
                  }
                >
                  Reject
                </button>

              </div>

            </div>

            <div className="application-card">

              <div>
                <h3>Navya</h3>

                <p>
                  <strong>Email:</strong>{" "}
                  navya2026@gmail.com
                </p>

                <p>
                  <strong>Internship:</strong>{" "}
                  Web Development Intern
                </p>

                <p>
                  <strong>College:</strong>{" "}
                  ABC Engineering College
                </p>

                <p>
                  <strong>Skills:</strong>{" "}
                  HTML, CSS, JavaScript
                </p>
              </div>

              <div className="application-actions">

                <button
                  className="shortlist-button"
                  onClick={() =>
                    updateApplicationStatus(
                      3,
                      "Shortlisted",
                      "Navya"
                    )
                  }
                >
                  Shortlist
                </button>

                <button
                  className="reject-button"
                  onClick={() =>
                    updateApplicationStatus(
                      3,
                      "Rejected",
                      "Navya"
                    )
                  }
                >
                  Reject
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // COMPANY MY INTERNSHIPS
  // =====================================================

  if (
    loggedIn &&
    role === "company" &&
    page === "company-internships"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <h1>Virtual Internship Platform</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>My Posted Internships</h2>

          <p>
            Manage all your posted internship opportunities.
          </p>

          <div className="dashboard-cards">

            {companyInternships.map(
              (internship, index) => (
                <div
                  className="card"
                  key={index}
                >

                  <h3>{internship.title}</h3>

                  <p>
                    <strong>Location:</strong>{" "}
                    {internship.location}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {internship.duration}
                  </p>

                  <p>
                    <strong>Applicants:</strong>{" "}
                    {internship.applicants}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedInternship(
                        internship
                      );
                      setPage(
                        "company-applications"
                      );
                    }}
                  >
                    View Applications
                  </button>

                </div>
              )
            )}

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // COMPANY DASHBOARD
  // =====================================================

  if (
    loggedIn &&
    role === "company"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <h1>
            Virtual Internship Platform
          </h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <div className="dashboard-content">

          <h2>
            Welcome, {companyName || "Company"} 🏢
          </h2>

          <p>
            Manage your internship opportunities
            and student applications.
          </p>

          <div className="dashboard-cards">

            <div className="card">

              <h3>Post Internship</h3>

              <p>
                Create a new internship opportunity.
              </p>

              <button
                onClick={() => setPage("post")}
              >
                Post Internship
              </button>

            </div>

            <div className="card">

              <h3>My Internships</h3>

              <p>
                View and manage your posted internships.
              </p>

              <button
                onClick={() =>
                  setPage("company-internships")
                }
              >
                View Internships
              </button>

            </div>

            <div className="card">

              <h3>Applications</h3>

              <p>
                View students who applied.
              </p>

              <button
                onClick={() =>
                  setPage("company-applications")
                }
              >
                View Applications
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT PROFILE
  // =====================================================

  if (
    loggedIn &&
    role === "student" &&
    page === "profile"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <h1>
            Virtual Internship Platform
          </h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <div className="profile-container">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>My Profile</h2>

          <div className="profile-card">

            <div className="profile-avatar">
              👤
            </div>

            <h3>Bumija</h3>

            <p className="profile-role">
              Student
            </p>

            <div className="profile-details">

              <div className="profile-item">
                <strong>Email</strong>
                <span>
                  dharmatest20260812@gmail.com
                </span>
              </div>

              <div className="profile-item">
                <strong>Phone</strong>
                <span>9876543210</span>
              </div>

              <div className="profile-item">
                <strong>College</strong>
                <span>Engineering College</span>
              </div>

              <div className="profile-item">
                <strong>Department</strong>
                <span>Cybersecurity</span>
              </div>

              <div className="profile-item">
                <strong>Year</strong>
                <span>2nd Year</span>
              </div>

              <div className="profile-item">
                <strong>Skills</strong>
                <span>
                  Python, Java, React, SQL
                </span>
              </div>

              <div className="profile-item">
                <strong>Resume</strong>
                <span>Resume.pdf</span>
              </div>

            </div>

            <button
              className="edit-profile-button"
              onClick={() =>
                alert(
                  "Edit Profile feature will be added next."
                )
              }
            >
              Edit Profile
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT APPLICATIONS
  // =====================================================

  if (
    loggedIn &&
    role === "student" &&
    page === "applications"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <h1>
            Virtual Internship Platform
          </h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>My Applications</h2>

          <p>
            Track the status of your internship applications.
          </p>

          <div className="application-list">

            {applications.map(
              (application, index) => (
                <div
                  className="application-card"
                  key={index}
                >

                  <div>

                    <h3>
                      {application.internship}
                    </h3>

                    <p>
                      <strong>Company:</strong>{" "}
                      {application.company}
                    </p>

                    <p>
                      <strong>Applied Date:</strong>{" "}
                      {application.date}
                    </p>

                  </div>

                  <span
                    className={
                      "status " +
                      application.status.toLowerCase()
                    }
                  >
                    {application.status}
                  </span>

                </div>
              )
            )}

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT APPLICATION FORM
  // =====================================================

  if (
    loggedIn &&
    role === "student" &&
    page === "application"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <h1>
            Virtual Internship Platform
          </h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <div className="form-container">

          <button
            className="back-button"
            onClick={() => {
              setPage("internships");
              setApplicationMessage("");
            }}
          >
            ← Back to Internships
          </button>

          <h2>
            Internship Application
          </h2>

          <div className="selected-internship">

            <h3>
              {selectedInternship?.title}
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {selectedInternship?.company}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {selectedInternship?.location}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {selectedInternship?.duration}
            </p>

            <p>
              <strong>Internship ID:</strong>{" "}
              {selectedInternship?.internship_id}
            </p>

          </div>

          <input
            type="text"
            placeholder="Enter Full Name"
          />

          <input
            type="email"
            placeholder="Enter Email"
            defaultValue={
              "dharmatest20260812@gmail.com"
            }
          />

          <input
            type="tel"
            placeholder="Enter Phone Number"
          />

          <input
            type="text"
            placeholder="Enter College Name"
          />

          <input
            type="text"
            placeholder="Enter Course / Department"
          />

          <textarea
            rows="5"
            placeholder="Write a short cover letter"
          ></textarea>

          <label className="resume-label">
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
          />

          {applicationMessage && (
            <p
              style={{
                color:
                  applicationMessage.includes(
                    "successfully"
                  )
                    ? "green"
                    : "red",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              {applicationMessage}
            </p>
          )}

          <button
            className="submit-button"
            onClick={submitApplication}
          >
            Submit Application
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT INTERNSHIPS
  // =====================================================

  if (
    loggedIn &&
    role === "student" &&
    page === "internships"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <h1>
            Virtual Internship Platform
          </h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <div className="dashboard-content">

          <button
            className="back-button"
            onClick={() => setPage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <h2>
            Available Internships
          </h2>

          <p>
            Explore internship opportunities and
            apply for your preferred role.
          </p>

          {internshipsLoading && (
            <p>Loading internships...</p>
          )}

          {internshipsError && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              {internshipsError}
            </p>
          )}

          {!internshipsLoading &&
            !internshipsError &&
            internships.length === 0 && (
              <p>No internships are available.</p>
            )}

          <div className="dashboard-cards">

            {internships.map((internship) => (
              <div
                className="card"
                key={internship.internship_id}
              >

                <h3>
                  {internship.title}
                </h3>

                <p>
                  <strong>Company:</strong>{" "}
                  {internship.company}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {internship.location}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {internship.duration}
                </p>

                <button
                  onClick={() => {
                    setSelectedInternship(internship);
                    setApplicationMessage("");
                    setPage("application");
                  }}
                >
                  Apply Now
                </button>

              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT DASHBOARD
  // =====================================================

  if (
    loggedIn &&
    role === "student"
  ) {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <h1>
            Virtual Internship Platform
          </h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </header>

        <div className="dashboard-content">

          <h2>
            Welcome, Student 👋
          </h2>

          <p>
            Find internships and manage your applications.
          </p>

          <div className="dashboard-cards">

            <div className="card">

              <h3>
                Browse Internships
              </h3>

              <p>
                View available internship opportunities.
              </p>

              <button
                onClick={() =>
                  setPage("internships")
                }
              >
                View Internships
              </button>

            </div>

            <div className="card">

              <h3>
                My Applications
              </h3>

              <p>
                Check the status of your applications.
              </p>

              <button
                onClick={() =>
                  setPage("applications")
                }
              >
                View Applications
              </button>

            </div>

            <div className="card">

              <h3>
                My Profile
              </h3>

              <p>
                View and manage your student profile.
              </p>

              <button
                onClick={() =>
                  setPage("profile")
                }
              >
                View Profile
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STUDENT SIGNUP PAGE
  // =====================================================

  if (!loggedIn && role === "student" && page === "signup") {
    return (
      <div className="app">
        <div className="login-box">
          <h1>Virtual Internship Platform</h1>

          <h2>Student Sign Up</h2>

          <input
            type="text"
            placeholder="Enter Full Name"
            value={signupName}
            onChange={(e) => {
              setSignupName(e.target.value);
              setSignupError("");
            }}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={signupEmail}
            onChange={(e) => {
              setSignupEmail(e.target.value);
              setSignupError("");
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={signupPassword}
            onChange={(e) => {
              setSignupPassword(e.target.value);
              setSignupError("");
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirmPassword}
            onChange={(e) => {
              setSignupConfirmPassword(e.target.value);
              setSignupError("");
            }}
          />

          <button
            type="button"
            className="login-button"
            disabled={signupLoading}
            onClick={async () => {
              setSignupError("");

              const name = signupName.trim();
              const newEmail = signupEmail.trim();
              const newPassword = signupPassword;
              const confirmPasswordValue = signupConfirmPassword;

              if (!name || !newEmail || !newPassword || !confirmPasswordValue) {
                setSignupError("Please fill all fields");
                return;
              }

              if (!newEmail.includes("@")) {
                setSignupError("Please enter a valid email");
                return;
              }

              if (newPassword !== confirmPasswordValue) {
                setSignupError("Passwords do not match");
                return;
              }

              setSignupLoading(true);

              try {
                const response = await fetch(
                  API_URL + "/students/register",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({
                      name: name,
                      email: newEmail,
                      password: newPassword,
                    }),
                  }
                );

                let data = {};

                try {
                  data = await response.json();
                } catch (error) {
                  data = {};
                }

                if (
                  response.ok &&
                  data.student_id &&
                  (
                    data.message === "Registration successful" ||
                    data.message === "Student registered successfully"
                  )
                ) {
                  setEmail(newEmail);
                  setPassword("");
                  setSignupName("");
                  setSignupEmail("");
                  setSignupPassword("");
                  setSignupConfirmPassword("");
                  setSignupError("");
                  setRegistrationMessage(
                    "Registration successful! Please login with your email and password."
                  );
                  setPage("dashboard");
                } else {
                  setSignupError(
                    data.detail ||
                      data.message ||
                      "Registration failed"
                  );
                }
              } catch (error) {
                console.error(
                  "Student registration connection error:",
                  error
                );
                setSignupError("Cannot connect to backend");
              } finally {
                setSignupLoading(false);
              }
            }}
          >
            {signupLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => {
              setPage("dashboard");
              setSignupError("");
              setSignupName("");
              setSignupEmail("");
              setSignupPassword("");
              setSignupConfirmPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#244394",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            ← Back to Student Login
          </button>

          {signupError && (
            <p
              style={{
                color: "red",
                marginTop: "12px",
                fontWeight: "bold",
              }}
            >
              {signupError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // COMPANY SIGNUP PAGE
  // =====================================================

  if (!loggedIn && role === "company" && page === "company-signup") {
    return (
      <div className="app">
        <div className="login-box">
          <h1>Virtual Internship Platform</h1>

          <h2>Company Sign Up</h2>

          <input
            type="text"
            placeholder="Enter Company Name"
            value={companySignupName}
            onChange={(e) => {
              setCompanySignupName(e.target.value);
              setCompanySignupError("");
            }}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={companySignupEmail}
            onChange={(e) => {
              setCompanySignupEmail(e.target.value);
              setCompanySignupError("");
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={companySignupPassword}
            onChange={(e) => {
              setCompanySignupPassword(e.target.value);
              setCompanySignupError("");
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={companySignupConfirmPassword}
            onChange={(e) => {
              setCompanySignupConfirmPassword(e.target.value);
              setCompanySignupError("");
            }}
          />

          <button
            type="button"
            className="login-button"
            disabled={companySignupLoading}
            onClick={async () => {
              setCompanySignupError("");

              const name = companySignupName.trim();
              const newEmail = companySignupEmail.trim();
              const newPassword = companySignupPassword;
              const confirmPasswordValue = companySignupConfirmPassword;

              if (!name || !newEmail || !newPassword || !confirmPasswordValue) {
                setCompanySignupError("Please fill all fields");
                return;
              }

              if (!newEmail.includes("@")) {
                setCompanySignupError("Please enter a valid email");
                return;
              }

              if (newPassword !== confirmPasswordValue) {
                setCompanySignupError("Passwords do not match");
                return;
              }

              setCompanySignupLoading(true);

              try {
                const response = await fetch(
                  API_URL + "/companies/register",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({
                      company_name: name,
                      email: newEmail,
                      password: newPassword,
                    }),
                  }
                );

                let data = {};
                try {
                  data = await response.json();
                } catch (error) {
                  data = {};
                }

                if (
                  response.ok &&
                  data.company_id &&
                  data.message === "Company registered successfully"
                ) {
                  setEmail(newEmail);
                  setPassword("");
                  setCompanySignupName("");
                  setCompanySignupEmail("");
                  setCompanySignupPassword("");
                  setCompanySignupConfirmPassword("");
                  setCompanySignupError("");
                  setRegistrationMessage(
                    "Company registration successful! Please login with your email and password."
                  );
                  setPage("dashboard");
                } else {
                  setCompanySignupError(
                    data.detail ||
                    data.message ||
                    "Company registration failed"
                  );
                }
              } catch (error) {
                console.error("Company registration connection error:", error);
                setCompanySignupError("Cannot connect to backend");
              } finally {
                setCompanySignupLoading(false);
              }
            }}
          >
            {companySignupLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => {
              setPage("dashboard");
              setCompanySignupError("");
              setCompanySignupName("");
              setCompanySignupEmail("");
              setCompanySignupPassword("");
              setCompanySignupConfirmPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#244394",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            ← Back to Company Login
          </button>

          {companySignupError && (
            <p
              style={{
                color: "red",
                marginTop: "12px",
                fontWeight: "bold",
              }}
            >
              {companySignupError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // FORGOT PASSWORD PAGE
  // =====================================================

  if (!loggedIn && page === "forgot-password") {
    return (
      <div className="app">
        <div className="login-box">

          <h1>Virtual Internship Platform</h1>

          <h2>
            {role === "student" && "Student Forgot Password"}
            {role === "company" && "Company Forgot Password"}
            {role === "admin" && "Admin Forgot Password"}
          </h2>

          <input
            type="email"
            placeholder="Enter Registered Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError("");
            }}
          />

          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setLoginError("");
            }}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setLoginError("");
            }}
          />

          <button
            className="login-button"
            onClick={async () => {
              setLoginError("");

              if (!email || !newPassword || !confirmPassword) {
                setLoginError("Please fill all fields");
                return;
              }

              if (newPassword !== confirmPassword) {
                setLoginError("Passwords do not match");
                return;
              }

              try {
                let resetEndpoint = "";

                if (role === "student") {
                  resetEndpoint =
                    API_URL + "/students/forgot-password";
                } else if (role === "company") {
                  resetEndpoint =
                    API_URL + "/companies/forgot-password";
                } else {
                  resetEndpoint =
                    API_URL + "/admins/forgot-password";
                }

                const response = await fetch(
                  resetEndpoint +
                    "?email=" +
                    encodeURIComponent(email) +
                    "&new_password=" +
                    encodeURIComponent(newPassword),
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                    },
                  }
                );

                const data = await response.json();

                if (
                  response.ok &&
                  data.message === "Password reset successfully"
                ) {
                  alert(
                    `${role === "student" ? "Student" : role === "company" ? "Company" : "Admin"} password reset successfully!`
                  );

                  setPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setLoginError("");
                  setPage("dashboard");
                } else {
                  setLoginError(
                    data.message || "Unable to reset password"
                  );
                }
              } catch (error) {
                console.error(
                  "Password reset connection error:",
                  error
                );

                setLoginError("Cannot connect to backend");
              }
            }}
          >
            Reset Password
          </button>

          <button
            type="button"
            onClick={() => {
              setPage("dashboard");
              setLoginError("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#244394",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: "bold"
            }}
          >
            ← Back to Login
          </button>

          {loginError && (
            <p
              style={{
                color: "red",
                marginTop: "12px",
                fontWeight: "bold",
              }}
            >
              {loginError}
            </p>
          )}

        </div>
      </div>
    );
  }

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  return (
    <div className="app">

      <div className="login-box">

        <h1>
          Virtual Internship Platform
        </h1>

        <div className="role-buttons">

          <button
            className={
              role === "student"
                ? "active-role"
                : ""
            }
            onClick={() => {
              setRole("student");
              setLoggedIn(false);
              setPage("dashboard");
              setEmail("");
              setPassword("");
              setShowPassword(false);
              setLoginError("");
              setRegistrationMessage("");
              setStudentId(null);
              setCompanyId(null);
              setCompanyName("");
            }}
          >
            Student
          </button>

          <button
            className={
              role === "company"
                ? "active-role"
                : ""
            }
            onClick={() => {
              setRole("company");
              setLoggedIn(false);
              setPage("dashboard");
              setEmail("");
              setPassword("");
              setShowPassword(false);
              setLoginError("");
              setRegistrationMessage("");
              setStudentId(null);
              setCompanyId(null);
              setCompanyName("");
            }}
          >
            Company
          </button>

          <button
            className={
              role === "admin"
                ? "active-role"
                : ""
            }
            onClick={() => {
              setRole("admin");
              setLoggedIn(false);
              setPage("dashboard");
              setEmail("");
              setPassword("");
              setShowPassword(false);
              setLoginError("");
              setRegistrationMessage("");
              setStudentId(null);
              setCompanyId(null);
              setCompanyName("");
            }}
          >
            Admin
          </button>

        </div>

        <h2>
          {role === "student" &&
            "Student Login"}

          {role === "company" &&
            "Company Login"}

          {role === "admin" &&
            "Admin Login"}
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLoginError("");
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "15px"
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError("");
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              paddingRight: "75px"
            }}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#244394",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "5px",
              margin: 0
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setPage("forgot-password");
            setLoginError("");
            setRegistrationMessage("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#244394",
            cursor: "pointer",
            marginTop: "10px",
            marginBottom: "10px",
            fontWeight: "bold",
            fontSize: "15px"
          }}
        >
          Forgot Password?
        </button>

        {role === "student" && (
          <button
            type="button"
            onClick={() => {
              setPage("signup");
              setLoginError("");
              setRegistrationMessage("");
              setSignupName("");
              setSignupEmail("");
              setSignupPassword("");
              setSignupConfirmPassword("");
              setSignupError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#244394",
              cursor: "pointer",
              marginTop: "5px",
              marginBottom: "15px",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            New Student? Sign Up
          </button>
        )}

        {role === "company" && (
          <button
            type="button"
            onClick={() => {
              setPage("company-signup");
              setLoginError("");
              setRegistrationMessage("");
              setCompanySignupError("");
              setCompanySignupName("");
              setCompanySignupEmail("");
              setCompanySignupPassword("");
              setCompanySignupConfirmPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#244394",
              cursor: "pointer",
              marginTop: "10px",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "15px"
            }}
          >
            New Company? Sign Up
          </button>
        )}

        <button
          className="login-button"
          onClick={async () => {

            setLoginError("");

            if (!email.trim() || !password) {
              setLoginError(
                "Please enter email and password"
              );
              return;
            }

            // ADMIN LOGIN
            if (role === "admin") {

              if (
                email.trim() === "admin@gmail.com" &&
                password === "admin123"
              ) {
                setLoggedIn(true);
                setPage("dashboard");
                setLoginError("");
              } else {
                setLoginError(
                  "Invalid admin email or password"
                );
              }

              return;
            }

            // COMPANY LOGIN
            if (role === "company") {
              try {
                const response = await fetch(
                  API_URL + "/companies/login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({
                      email: email.trim(),
                      password: password,
                    }),
                  }
                );

                let data = {};
                try {
                  data = await response.json();
                } catch (error) {
                  data = {};
                }

                if (
                  response.ok &&
                  data.message === "Company login successful" &&
                  data.company_id
                ) {
                  setCompanyId(data.company_id);
                  setCompanyName(data.company_name || "Company");
                  setLoggedIn(true);
                  setPage("dashboard");
                  setLoginError("");
                  setRegistrationMessage("");
                } else {
                  setLoginError(
                    data.detail ||
                    data.message ||
                    "Invalid company email or password"
                  );
                }
              } catch (error) {
                console.error("Company login connection error:", error);
                setLoginError("Cannot connect to backend");
              }

              return;
            }

            // STUDENT LOGIN
            if (role === "student") {

              try {

                const response = await fetch(
                  API_URL + "/students/login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: email.trim(),
                      password: password,
                    }),
                  }
                );

                let data = {};

                try {
                  data = await response.json();
                } catch (error) {
                  data = {};
                }

                if (
                  response.ok &&
                  data.message === "Login successful" &&
                  data.student_id
                ) {
                  setStudentId(data.student_id);
                  setLoggedIn(true);
                  setPage("dashboard");
                  setLoginError("");
                  setRegistrationMessage("");
                } else {
                  setLoginError(
                    data.detail ||
                    data.message ||
                    "Invalid student email or password"
                  );
                }

              } catch (error) {

                console.error(
                  "Student login connection error:",
                  error
                );

                setLoginError(
                  "Cannot connect to backend"
                );
              }
            }
          }}
        >
          Login
        </button>

        {registrationMessage && (
          <p
            style={{
              color: "green",
              marginTop: "12px",
              fontWeight: "bold",
            }}
          >
            {registrationMessage}
          </p>
        )}

        {loginError && (
          <p
            style={{
              color: "red",
              marginTop: "12px",
              fontWeight: "bold",
            }}
          >
            {loginError}
          </p>
        )}

      </div>
    </div>
  );
}

export default App;