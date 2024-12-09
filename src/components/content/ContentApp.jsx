import React, { useEffect, useState } from "react";

const ContentApp = () => {
    const [settings, setSettings] = useState({
        theme: "light",
        borderRadius: "rounded",
    });
    const [blocks, setBlocks] = useState(["Block 1", "Block 2", "Block 3"]);

    // Apply theme and border radius to the body
    useEffect(() => {
        document.body.className = `${settings.theme} ${settings.borderRadius}`;
        document.body.style.background = "transparent";
    }, [settings.theme, settings.borderRadius]);

    // Mock a setting update
    useEffect(() => {
        console.log("Content script: Simulating settings update");
        setTimeout(() => {
            setSettings((prevSettings) => ({
                ...prevSettings,
                theme: prevSettings.theme === "light" ? "dark" : "light",
            }));
        }, 5000); // Switch theme every 5 seconds for testing
    }, []);

    return (
        <div>
            <h1>Content App</h1>
            <p>Current Theme: {settings.theme}</p>
            <p>Current Border Radius: {settings.borderRadius}</p>
            <div>
                {blocks.map((block, index) => (
                    <div key={index} className="block">
                        {block}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentApp;
