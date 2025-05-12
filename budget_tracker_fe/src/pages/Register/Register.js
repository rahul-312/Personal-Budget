import { useState } from "react";
import { API } from "../../api";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    gender: "",
    password: "",
    confirm_password: "",
    profile_picture: null,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or JPG)");
        setFormData({ ...formData, profile_picture: null });
        return;
      }

      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        setFormData({ ...formData, profile_picture: null });
        return;
      }

      setFormData({ ...formData, profile_picture: file });
      setError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError(["Passwords do not match."]);
      setMessage("");
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirm_password' && value !== null) {
        formPayload.append(key, value);
      }
    });

    try {
      const response = await fetch(API.REGISTER, {
        method: "POST",
        body: formPayload,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setError([]);
      } else {
        const errors = [];
        if (data) {
          for (const key in data) {
            if (Array.isArray(data[key])) {
              errors.push(...data[key]);
            } else if (typeof data[key] === 'string') {
              errors.push(data[key]);
            }
          }
        }
        setError(errors.length ? errors : ["Registration failed. Please try again."]);
        setMessage("");
      }
    } catch (err) {
      setError(["Something went wrong. Please try again."]);
      setMessage("");
    }
  };

  return (
    <div className="container-wrapper">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email (Gmail)"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
            />
            {formData.profile_picture && (
              <span className="file-name">
                {formData.profile_picture.name}
              </span>
            )}
          </div>

          <div className="form-row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>

        {error && <p className="error-msg">{Array.isArray(error) ? error.join(" ") : error}</p>}
        {message && <p className="success-msg">{message}</p>}

        <p className="login-link text-center">
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;