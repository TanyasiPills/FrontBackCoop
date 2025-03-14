import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export function AddData()
{
    const [formData, setFormData] = useState({
        name: "", //string
        date: "", //dateTime
        time: 0, //int
        canceled: false//bool
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try { 
            const formattedData = {
                ...formData,
                date: new Date(formData.date).toISOString(),
              };

            console.log("Sending data:", formattedData);
            const response = await fetch("http://localhost:3000/concert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || response.statusText;
                
                if (errorData.errors) {
                    const detailedErrors = errorData.errors.map((err: any) => `${err.field}: ${err.message}`).join(", ");
                    throw new Error(`${errorMessage} - Details: ${detailedErrors}`);
                }
    
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(data);

            setSuccessMessage("");
            setErrorMessage("");
        } catch (error: any) {
            console.error("Adding failed:", error);
        setErrorMessage(error.message || "Adding the concert failed. Please try again.");
        setSuccessMessage("");
        }
    };

    return (
        <div className="container my-4 d-flex flex-column justify-content-start" style={{ minHeight: '100vh', minWidth: '70vw' }}>
            <h1 className="mb-4">Add Concert:</h1>
    
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
    
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
    
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
    
                <div className="mb-3">
                    <label htmlFor="time" className="form-label">
                        Time(in minutes)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>
    
                <button type="submit" className="btn btn-primary">
                    Add
                </button>
            </form>
        </div>
    );    
}