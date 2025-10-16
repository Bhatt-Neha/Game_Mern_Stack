"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../utils/api";
import { IRegisterForm } from "../types/userTypes";

export default function RegisterPage() {
    const router = useRouter();

    type FieldName = keyof IRegisterForm;
    const fields: FieldName[] = ["firstName", "lastName", "birthdate", "phoneNumber", "email", "password", "profilePicture"];

    const [form, setForm] = useState<IRegisterForm>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        birthdate: "",
        password: "",
        profilePicture: "",
    });

    // Store errors from backend
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error on on change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend validation
        const newErrors: { [key: string]: string } = {};
        for (const key in form) {
            const field = key as keyof IRegisterForm;
            if (!form[field]) newErrors[field] = "This field is required";
        }

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        try {
            const data = await registerUser(form);

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                alert("Registration Successful")
                router.push("/login");
            } else if (data.errors) {
                // Backend validation errors
                const backendErrors: { [key: string]: string } = {};
                data.errors.forEach((err: any) => {
                    backendErrors[err.path] = err.msg;
                });
                setErrors(backendErrors);
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2 style={{ marginBottom: '10px' }}>Register</h2>
            <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <div key={field} style={{ marginBottom: 12 }}>
                        <input
                            type={
                                field === "password"
                                    ? "password"
                                    : field === "birthdate"
                                        ? "date"
                                        : "text"
                            }
                            name={field}
                            placeholder={
                                field === "profilePicture"
                                    ? "Profile Picture(Enter only URL)" // placeholder URL for profile picture
                                    : field.replace(/^\w/, (c) => c.toUpperCase())
                            } value={form[field]}
                            onChange={handleChange}
                            style={{ display: "block", padding: 8, width: "100%" }}
                        />
                        {errors[field] && (
                            <span style={{ color: "red", fontSize: 12 }}>{errors[field]}</span>
                        )}
                    </div>
                ))}
                <button type="submit" style={{ padding: "8px 16px", marginTop: 10 }}>
                    Register
                </button>
            </form>
        </div>
    );
}
