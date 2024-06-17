import React from "react";
import "./Spinner.css";

function Spinner() {
    return (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center opacity-70">
           <div className="loader"></div>
        </div>
    )
}

export default Spinner;
