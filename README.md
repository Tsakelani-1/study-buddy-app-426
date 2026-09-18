# Study Buddy Pro

Build a modern, responsive mobile-first web app called "Study Buddy".

Tagline:

"Study smarter. Stay organised. Reach your goals."

The app is designed for high-school and university students who struggle with organising study time, understanding difficult topics, staying focused and tracking their progress.

Create a clean, friendly and professional student dashboard.

The app should have these main sections:

1. Dashboard

- Welcome message

- Today's study goal

- Number of completed study sessions

- Upcoming study tasks

- Overall study progress

- Quick buttons to start studying and ask the AI Study Assistant

2. Study Planner

- Allow users to add study tasks

- Fields should include subject, topic, date, time and duration

- Allow users to mark tasks as completed

- Display upcoming and completed tasks

- Save tasks in browser local storage so they remain after refreshing the page

3. AI Study Assistant

- Provide a chat-style interface

- Allow students to type a question

- Include buttons for:

  "Explain simply"

  "Create practice questions"

  "Summarise this topic"

- For the first version, use demo/mock AI responses so the application works without an API key

- Clearly label this as Demo AI

- Make the responses educational and easy for students to understand

4. Focus Timer

- Include a 25-minute study timer

- Include a 5-minute break timer

- Start, pause and reset buttons

- Track completed focus sessions

- Update the student's study statistics when a session is completed

5. Progress Tracker

- Show completed study tasks

- Show completed focus sessions

- Show progress by subject

- Use simple progress bars or charts

- Include encouraging messages

6. Study Notes

- Allow students to create notes

- Each note should have a subject, title and content

- Allow notes to be edited and deleted

- Save notes using local storage

Design requirements:

- Mobile-first responsive design

- Also work well on desktop

- Clean student-friendly interface

- Easy navigation

- Use cards and clear buttons

- Include a sidebar on desktop and bottom navigation on mobile

- Use accessible text and good contrast

- Make the design look like a polished real-world startup product

- Include sample/demo data so the application looks useful when first opened

Technical requirements:

- Use React and TypeScript

- Use a clean component structure

- Store demo data using localStorage

- Do not require API keys or external secrets

- Make the application functional rather than just a visual mockup

- Include helpful empty states and validation

- Make sure there are no obvious console errors

The app should feel like a real student productivity application that could be demonstrated to investors.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://study-buddy-app-426.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3cdd9522-e19a-4194-acfb-eed86688dd64).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
