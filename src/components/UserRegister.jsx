import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
 // Assuming you have a NavBar component

const UserRegister = () => {
    const [data, setData] = useState({
        username: "",
        emailid: "",
        password: "",
        phone: "",
        role: "user", // Default role
        dob: "",
        gender: "",
        address: "",
        district: "",
        state: "",
        country: "",
        qualification: "",
        bio: "",
    });

    const [errors, setErrors] = useState({});

    const districtOptions = [
        "Trivandrum", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
    ];

    const stateOptions = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    ];

    const countryOptions = [
        "India", "United States", "United Kingdom", "Australia", "Canada", "Germany", "France", "Italy", "Japan", "China", "Russia", "Brazil", "South Africa",
    ];

    const inputHandler = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const validateFields = () => {
        const errors = {};

        if (!data.username) errors.username = "Username is required.";
        if (!data.emailid) {
            errors.emailid = "Email ID is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.emailid)) {
                errors.emailid = "Invalid email format.";
            }
        }

        if (!data.password) errors.password = "Password is required.";
        if (!data.phone) errors.phone = "Phone number is required.";
        if (!data.role) errors.role = "Role is required.";
        if (!data.dob) errors.dob = "Date of birth is required.";
        if (!data.gender) errors.gender = "Gender is required.";
        if (!data.address) errors.address = "Address is required.";
        if (!data.district) errors.district = "District is required.";
        if (!data.state) errors.state = "State is required.";
        if (!data.country) errors.country = "Country is required.";
        if (!data.qualification) errors.qualification = "Qualification is required.";
        if (!data.bio) errors.bio = "Short bio is required.";

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{5,}$/;
        if (!data.password) {
            errors.password = "Password is required.";
        } else if (!passwordRegex.test(data.password)) {
            errors.password = "Password must be 5+ characters with an uppercase, lowercase, number, and special character.";
        }

        return errors;
    };

    const submitForm = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3030/uregister", data);
            console.log("Response from server:", response.data); // Log the server response

            if (response.data.status === "success") {
                alert("Registration successful!");
                if (response.data.userId) {
                  sessionStorage.setItem("userId", response.data.userId);
              }
                setData({
                    username: "",
                    emailid: "",
                    password: "",
                    phone: "",
                    role: "user", // Reset to default role
                    dob: "",
                    gender: "",
                    address: "",
                    district: "",
                    state: "",
                    country: "",
                    qualification: "",
                    bio: "",
                });
                setErrors({});
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred during registration.");
        }
    };

    return (
        <div>
           <NavBar/>
            <div className="container mt-4">
                <h1 className="text-center">Sign Up</h1>
                <form onSubmit={submitForm}>
                    <div className="row g-3">
                        {/* Username */}
                        <div className="col-md-6">
                            <label>Username</label>
                            <input type="text" className="form-control" name="username" value={data.username} onChange={inputHandler} />
                            {errors.username && <small className="text-danger">{errors.username}</small>}
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <label>Email ID</label>
                            <input type="email" className="form-control" name="emailid" value={data.emailid} onChange={inputHandler} />
                            {errors.emailid && <small className="text-danger">{errors.emailid}</small>}
                        </div>

                        {/* Password */}
                        <div className="col-md-6">
                            <label>Password</label>
                            <input type="password" className="form-control" name='password' value={data.password} onChange={inputHandler} />
                            {errors.password && <small className="text-danger">{errors.password}</small>}
                        </div>

                        {/* Phone */}
                        <div className="col-md-6">
                            <label>Phone Number</label>
                            <input type="text" className="form-control" name="phone" value={data.phone} onChange={inputHandler} />
                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                        </div>

                        {/* Role */}
                        <div className="col-md-6">
                            <label>Role</label>
                            <select className="form-control" name="role" value={data.role} onChange={inputHandler}>
                                <option value="">Select Role</option>
                                <option value="Client">Client</option>
                                <option value="Freelancer">Freelancer</option>
                                <option value="Admin">Admin</option>
                            </select>
                            {errors.role && <small className="text-danger">{errors.role}</small>}
                        </div>

                        {/* Gender */}
                        <div className="col-md-6">
                            <label>Gender</label>
                            <select className="form-control" name="gender" value={data.gender} onChange={inputHandler}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <small className="text-danger">{errors.gender}</small>}
                        </div>

                        {/* DOB */}
                        <div className="col-md-6">
                            <label>Date of Birth</label>
                            <input type="date" className="form-control" name="dob" value={data.dob} onChange={inputHandler} />
                            {errors.dob && <small className="text-danger">{errors.dob}</small>}
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                            <label>Address</label>
                            <textarea className="form-control" name="address" value={data.address} onChange={inputHandler}></textarea>
                            {errors.address && <small className="text-danger">{errors.address}</small>}
                        </div>

                        {/* District */}
                        <div className="col-md-6">
                            <label>District</label>
                            <select className="form-control" name="district" value={data.district} onChange={inputHandler}>
                                <option value="">Select District</option>
                                {districtOptions.map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {errors.district && <small className="text-danger">{errors.district}</small>}
                        </div>

                        {/* State */}
                        <div className="col-md-6">
                            <label>State</label>
                            <select className="form-control" name="state" value={data.state} onChange={inputHandler}>
                                <option value="">Select State</option>
                                {stateOptions.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            {errors.state && <small className="text-danger">{errors.state}</small>}
                        </div>

                        {/* Country */}
                        <div className="col-md-6">
                            <label>Country</label>
                            <select className="form-control" name="country" value={data.country} onChange={inputHandler}>
                                <option value="">Select Country</option>
                                {countryOptions.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            {errors.country && <small className="text-danger">{errors.country}</small>}
                        </div>

                        {/* Qualification */}
                        <div className="col-md-6">
                            <label>Qualification</label>
                            <input type="text" className="form-control" name="qualification" value={data.qualification} onChange={inputHandler} />
                            {errors.qualification && <small className="text-danger">{errors.qualification}</small>}
                        </div>

                        {/* Bio */}
                        <div className="col-md-6">
                            <label>Short Bio</label>
                            <textarea className="form-control" name="bio" value={data.bio} onChange={inputHandler}></textarea>
                            {errors.bio && <small className="text-danger">{errors.bio}</small>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserRegister;