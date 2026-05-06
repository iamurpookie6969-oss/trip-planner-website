import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">

        <hr className="my-6 border-border sm:mx-auto lg:my-8" />

        <span className="block text-sm text-muted-foreground sm:text-center">
          © 2024{" "}
          <Link to="/" className="hover:underline font-medium text-foreground">
            Trip Planner™
          </Link>
          . All Rights Reserved.
        </span>

      </div>
    </footer>
  );
};
