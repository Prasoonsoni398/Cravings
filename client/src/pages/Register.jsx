import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registerbg from "../assets/images/foodTable.webp";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      fullName,
      email,
      phone,
      gender,
      password,
      confirmPassword,
      agree,
    });
  };

  return (
    <section className="relative h-[91vh] w-full overflow-hidden">
      {/* Background */}
      <img
        src={registerbg}
        alt="Food Table"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Register Card */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
        <div className="card w-[480px] bg-base-100 shadow-2xl">
          <div className="card-body p-8">

            <h2 className="text-center text-4xl font-bold text-primary">
              Create Account
            </h2>

            <p className="text-center text-secondary">
              Join us and start your food journey.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              {/* Full Name */}
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              {/* Email */}
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Phone */}
              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* Gender */}
              <select
                className="select select-bordered w-full"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              {/* Password */}
              <div className="input input-bordered flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="input input-bordered flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="grow"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer justify-start gap-2 items-center">
                <input
                  type="checkbox"
                  className=" checkbox-primary"
                  checked={agree}
                  onChange={(e) =>
                    setAgree(e.target.checked)
                  }
                />

                <span className="label-text mb-0.5">
                  I agree to the
                  <span className="text-primary font-medium">
                    Terms & Conditions
                  </span>
                </span>
              </label>

              {/* Register Button */}
              <button
                className="btn  btn-primary w-full"
                type="submit"
              >
                Register
              </button>

              <div className="divider"></div>

              <p className="text-center text-secondary">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Login here
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;