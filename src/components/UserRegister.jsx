import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

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

  const stateOptions = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ];

 

  // Map state to corresponding district (city) options.
  const districtMapping = {
    Kerala: [
      "Trivandrum", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ],
    Karnataka: [
      "Bengaluru", "Mysuru", "Mangalore", "Hubli-Dharwad", "Belgaum", "Gulbarga", "Davangere"
    ],
    AndhraPradesh: [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
    ArunachalPradesh: [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"
  ],
  Assam: [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  Bihar: [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul"
  ],
  Chhattisgarh: [
    "Balod", "Baloda Bazar", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Jashpur", "Janjgir-Champa", "Korba", "Koriya", "Mahasamund", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Surajpur"
  ],
  Goa: [
    "North Goa", "South Goa"
  ],
  Gujarat: [
    "Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dangs", "Devbhoomi Dwarka", "Gandhinagar", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ],
  Haryana: [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Mewat", "Palwal", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  HimachalPradesh: [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kullu", "Lahaul-Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  Jharkhand: [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"
  ],
  MadhyaPradesh: [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Rewa", "Rajgarh", "Ratlam", "Raisen", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ],
  Maharashtra: [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  Manipur: [
    "Bishnupur", "Churachandpur", "Imphal East", "Imphal West", "Senapati", "Tamenglong", "Thoubal", "Ukhrul"
  ],
  Meghalaya: [
    "East Garo Hills", "East Khasi Hills", "Jaintia Hills", "Ri Bhoi", "South Garo Hills", "West Garo Hills", "West Khasi Hills"
  ],
  Mizoram: [
    "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit"
  ],
  Nagaland: [
    "Dimapur", "Kohima", "Mokokchung", "Mon", "Phek", "Tuensang", "Wokha", "Zunheboto"
  ],
  Odisha: [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh",
     "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
      "Kandhamal", "Kendrapara", "Kendujhar", "Malkangiri", "Mayurbhanj", "Nuapada", "Puri", 
      "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"  ],

    
  };

  const inputHandler = (event) => {
    const { name, value } = event.target;
    // When state changes, reset district
    if (name === "state") {
      setData({ ...data, state: value, district: "" });
    } else {
      setData({ ...data, [name]: value });
    }
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
    event.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3030/uregister", data);
      console.log("Response from server:", response.data);

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
          role: "user",
          dob: "",
          gender: "",
          address: "",
          district: "",
          state: "",
         
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
      <NavBar />
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
              <input type="password" className="form-control" name="password" value={data.password} onChange={inputHandler} />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            {/* Phone Number */}
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
                <option value="Client">client</option>
                <option value="Freelancer">freelancer</option>
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

            {/* District (Dynamic based on selected state) */}
            <div className="col-md-6">
              <label>District</label>
              <select className="form-control" name="district" value={data.district} onChange={inputHandler}>
                <option value="">Select District</option>
                {data.state && districtMapping[data.state] ? (
                  districtMapping[data.state].map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))
                ) : (
                  <option value="">Select a state first</option>
                )}
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
