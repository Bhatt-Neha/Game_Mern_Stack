"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../utils/api";

export interface ILoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {

    const router = useRouter();
    const [form, setForm] = useState<ILoginForm>({ email: "", password: "" });

    type FieldName = keyof ILoginForm;
    const fields: FieldName[] = ["email", "password"];

    // store field errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Frontend validation
        const newErrors: { [key: string]: string } = {};
        if (!form.email) newErrors.email = "Email is required";
        if (!form.password) newErrors.password = "Password is required";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const data = await loginUser(form);

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/game");
            } else if (data.errors) {
                // backend validation errors
                const backendErrors: { [key: string]: string } = {};
                data.errors.forEach((err: any) => {
                    backendErrors[err.path] = err.msg;
                });
                setErrors(backendErrors);
            } else if (data.message) {
                setErrors({ email: data.message, password: data.message });
            }
        } catch (err) {
            console.error(err);
            setErrors({ email: "Server error", password: "Server error" });
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2 style={{ marginBottom: '10px' }}>Login</h2>
            <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <div key={field} style={{ marginBottom: 12 }}>
                        <input
                            type={field === "password" ? "password" : "text"}
                            name={field}
                            placeholder={field.toUpperCase()}
                            value={form[field]}
                            onChange={handleChange}
                            style={{ display: "block", padding: 8, width: "100%" }}
                        />
                        {errors[field] && (
                            <span style={{ color: "red", fontSize: 12 }}>{errors[field]}</span>
                        )}
                    </div>
                ))}
                <button type="submit" style={{ padding: "8px 16px" }}>
                    Login
                </button>
            </form>
        </div>
    );
}
