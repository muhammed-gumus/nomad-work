# Nomad Work

![Nomad Work Logo](https://github.com/muhammed-gumus/nomad-work/assets/86381278/0b801181-ad81-4622-ade8-71c7e00d4530)

Nomad Work is an innovative platform designed to help remote workers find the most suitable places to work, such as cafes, restaurants, and libraries. The platform gathers essential information about these locations from Google and combines it with user reviews submitted by Nomad Work users. One of the standout features of Nomad Work is its AI model, which objectively analyzes user reviews to provide accurate and unbiased information about the locations of interest.

## Features

### Location Listings
Nomad Work provides comprehensive lists of cafes, restaurants, and libraries, making it easy for users to find potential workspaces.

### Integrated Information
The platform displays relevant information about each location sourced from Google, ensuring users have access to accurate and up-to-date data.

### User Reviews
Users can share their experiences and opinions about the places they visit, contributing to a community-driven platform.

### AI Analysis
An advanced AI model evaluates user reviews to present objective assessments, helping users make informed decisions based on real experiences.

## Purpose and Importance

### Purpose
The primary goal of Nomad Work is to enable remote workers to quickly and easily find suitable workspaces. As remote work becomes more common, there is a growing demand for comfortable and efficient work environments outside the home. Nomad Work aims to meet this demand by:

- **Simplifying Workspace Search:** Providing lists of cafes, restaurants, and libraries to help users quickly find the best places to work.
- **Offering Objective Information:** Using AI to analyze user reviews and provide unbiased information about each location.
- **Ensuring Up-to-Date Data:** Integrating information from Google to keep users informed with the latest data.
- **Encouraging Community Participation:** Allowing users to share their experiences and create a knowledge-sharing platform.

### Importance
Nomad Work addresses a significant need arising from the growth of remote work culture. Its importance is highlighted by several key factors:

- **Productivity and Comfort:** Helping remote workers find productive and comfortable work environments enhances their job performance and satisfaction.
- **Time Savings:** Speeding up the process of finding the right workspace saves users time, allowing them to focus more on their work.
- **Objective Evaluation:** Providing unbiased evaluations of locations helps users make better-informed decisions.
- **Community Support:** Facilitating user reviews and feedback fosters a supportive community and valuable information sharing.

## Project Structure

The Nomad Work project is structured into several key components:

- **Frontend:** Built with Next.js, TypeScript, and Tailwind CSS, the frontend handles user interaction and display.
- **Backend:** Implemented with FastAPI and MongoDB, the backend manages data storage, user authentication, and AI-based review analysis.
- **AI Model:** Utilizes libraries such as Scikit-learn and NLTK for natural language processing and machine learning to analyze user reviews.

## Pages

### Home
The homepage manages the layout and user authentication. It checks for JWT tokens and usernames in localStorage to verify user identity, displaying appropriate modals based on authentication status.

### About
This page introduces the Nomad Work team, their mission, vision, and provides brief biographies of team members along with their contact information.

### Discover
The Discover page lists different categories of locations (cafes, restaurants, libraries) and allows users to sort and filter these locations based on various criteria.

### Detail
The Detail page provides in-depth information about a specific location, including user reviews and a form for submitting new reviews. It also displays the location on a map.

### Contact
This page provides contact details and a form for users to send messages to the Nomad Work team. It includes the company's address, phone number, and email.

### Register
The registration page allows new users to create accounts by submitting their personal information and credentials.

### Login
The login page enables users to sign in to their accounts using their username and password. It handles user authentication and redirects authenticated users to the homepage.

## Technologies Used

- **Next.js:** For building the frontend application.
- **TypeScript:** Ensuring type safety and improved code quality.
- **Tailwind CSS:** For styling the application.
- **FastAPI:** For creating the backend API.
- **MongoDB:** For database management.
- **Scikit-learn & NLTK:** For natural language processing and machine learning.
- **Google Maps API:** For integrating map data and location information.

## Getting Started

### Prerequisites
- Node.js
- Python
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/muhammed-gumus/nomad-work.git
    ```

2. Navigate to the project directory:
    ```sh
    cd nomad-work
    ```

3. Install the frontend dependencies:
    ```sh
    npm install
    ```

4. Create a `requirements.txt` file in the `backend` directory with the following content:

    ```plaintext
    fastapi
    uvicorn
    pymongo
    python-dotenv
    passlib
    python-jose
    smtplib
    email
    deep-translator
    scikit-learn
    pandas
    nltk
    ```

5. Install the backend dependencies:
    ```sh
    cd backend
    pip install -r requirements.txt
    ```

### Running the Project

1. Start the frontend development server:
    ```sh
    npm run dev
    ```

2. Start the backend server:
    ```sh
    cd backend
    python -m uvicorn main:app --reload
    ```

### Environment Variables
Ensure you have a `.env` file in the root of the project with the following environment variables:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGO_URI=your_mongo_db_uri
GMAIL_SENDER_EMAIL=your_gmail_sender_email
GMAIL_SENDER_PASSWORD=your_gmail_sender_password
SECRET_KEY=your_jwt_secret_key
