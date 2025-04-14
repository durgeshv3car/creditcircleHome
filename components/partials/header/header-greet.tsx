"use client";
import React from "react";

function HeaderGreet({ admin }) {
  const [greeting, setGreeting] = React.useState("Hello");

  React.useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }
  }, []);
  return (
    <div>
      {greeting}, {admin}
    </div>
  );
}

export default HeaderGreet;
