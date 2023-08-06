import React, { useState } from "react";
import Link from "next/link";
import TimerWithLocalStorage from "@/app/components/TimerWithLocalStorage";
import CategorySelectorWithLocalStorage from "@/app/components/CategorySelectorWithLocalStorage";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/worklogpage">Work Log</Link>
          </li>
        </ul>
      </nav>

      <CategorySelectorWithLocalStorage
        onCategoryChange={setSelectedCategory}
      />
      <TimerWithLocalStorage selectedCategory={selectedCategory} />
    </div>
  );
}

export default Home;
