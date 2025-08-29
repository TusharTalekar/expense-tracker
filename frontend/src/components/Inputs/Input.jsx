import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, placeholder, label, type, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className='text-[13px] text-slate-800'>{label}</label>

            <div className="input-box">
                <input
                    value={value}
                    onChange={(e) => onChange(e)}
                    placeholder={placeholder}
                    type={type === "password" ? showPassword ? 'text' : "password" : type}
                    autoComplete={type === 'password' ? 'new-password' : autoComplete}
                    className='w-full bg-transparent outline-none'
                />

                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='text-primary cursor-pointer'
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='text-slate-400 cursor-pointer'
                                onClick={() => toggleShowPassword()}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Input
